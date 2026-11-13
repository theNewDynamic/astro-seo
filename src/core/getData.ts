import type { SeoUserConfig, SeoEntry, SeoData, SeoContext, DefaultsConfig } from '../types.js'
import { escapeString, makeAbsUrl, isHome, getExcerpt } from '../utils.js'

// Resolves `defaults` once and reuses it. A rejected promise isn't kept, so a failed fetch is retried.
const makeGetDefaults = (config: SeoUserConfig) => {
  let pending: Promise<DefaultsConfig> | undefined
  return (): Promise<DefaultsConfig> => {
    const { defaults } = config
    if (typeof defaults !== 'function') return Promise.resolve(defaults ?? ({} as DefaultsConfig))
    pending ??= Promise.resolve()
      .then(defaults)
      .then((resolved) => {
        if (!resolved?.image) {
          throw new Error('@thenewdynamic/astro-seo: `defaults.image` is required, and the `defaults` function returned none.')
        }
        return resolved
      })
      .catch((error) => {
        pending = undefined
        throw error
      })
    return pending
  }
}

export const makeGetData = (config: SeoUserConfig = {}) => {
  const getDefaults = makeGetDefaults(config)
  return async (entry: SeoEntry, context: SeoContext = {}): Promise<SeoData> => {
    const { resolveImage, transformEntry, isProd } = config
    const defaults = await getDefaults()
    const urlInput = defaults.url
    const baseURL = typeof urlInput === 'string' ? urlInput : (urlInput as any)?.toString?.()
    const absUrl = baseURL ? makeAbsUrl(baseURL) : undefined

    const {
      title: defaultsTitle,
      description: defaultsDescription,
      image: defaultsImage,
      twitterHandle: defaultsTwitterHandle
    } = defaults

    let {
      title = 'Website',
      type = 'website',
      _type,
      _updatedAt,
      timeStart,
      timeEnd,
      venue,
      date,
      url,
      description,
      descriptionText,
      locale = 'en_US',
      image,
      authors = [],
      bodyText,
      translation,
      twitterCard = 'summary_large_image',
      twitterHandle = defaultsTwitterHandle,
      twitterCreatorHandle = defaultsTwitterHandle,
    } = entry

    const seo = entry.seo || {}
    const {
      title: seoTitle,
      description: seoDescription,
      image: seoImage,
      canonical: seoCanonical,
      private: seoPrivate = false,
    } = seo

    type = _type === 'post' ? 'article' : 'website'
    // URL: entry.url > request pathname
    const path = url ?? context.pathname
    url = path && absUrl ? absUrl(path) || undefined : undefined

    const isPrivate = seoPrivate || !(isProd?.() ?? true)
    const canonical = seoCanonical || url

    // Title: seo > entry > defaults > "Website"
    title = seoTitle
      ? seoTitle
      : title !== 'Website'
      ? escapeString(title as string)
      : defaultsTitle || 'Website'

    // Description: seo > entry text > defaults > ""
    description = seoDescription
      ? seoDescription
      : descriptionText
      ? escapeString(descriptionText)
      : description && typeof description === 'string'
      ? escapeString(description)
      : bodyText
      ? getExcerpt(bodyText, 300)
      : defaultsDescription || ''

    let ogTitle = title

    if (defaultsTitle && !isHome(entry)) {
      title = `${title} | ${defaultsTitle}`
    } else if (isHome(entry)) {
      // seo.title still wins on the home page — only fall back to the site
      // default (not the entry's own raw title) when there's no override.
      title = seoTitle || defaultsTitle || title
      ogTitle = title
    }

    const resolvedDefaultsImage = defaultsImage
    image = seoImage || image || resolvedDefaultsImage

    let imageAlt = ''

    if (image && typeof image !== 'string') {
      const img = image as Record<string, unknown>
      imageAlt = img.altText as string ?? ''
      image = resolveImage
        ? await resolveImage(img, { width: 1000 })
        : (img.src ?? img.url ?? '') as string
    } else if (image && typeof image === 'string' && absUrl) {
      image = absUrl(image) || undefined
    }

    const languageAlternates = translation
      ? [{ href: translation.url, hrefLang: translation.lang }]
      : undefined
    const localeAlternate = translation ? [translation.lang] : undefined

    let output: SeoData = {
      _type,
      title,
      publishedTime: date,
      modifiedTime: _updatedAt,
      authors: authors?.length
        ? authors.map((a) => ({ name: a.title ?? a.name ?? '', url: a.url && absUrl ? absUrl(a.url) : false }))
        : [],
      description,
      canonical,
      noindex: isPrivate,
      nofollow: isPrivate,
      charset: 'UTF-8',
      ogTitle,
      type,
      image: image as string | undefined,
      imageAlt,
      url,
      locale: locale as string,
      localeAlternate,
      languageAlternates,
      siteTitle: defaultsTitle || '',
      twitterCard: twitterCard as string,
      twitterHandle: twitterHandle as string | undefined,
      twitterCreatorHandle: twitterHandle as string | undefined,
      venue,
      timeStart,
      timeEnd,
    }

    if (transformEntry) {
      output = { ...output, ...transformEntry(entry) }
    }

    return output
  }
}
