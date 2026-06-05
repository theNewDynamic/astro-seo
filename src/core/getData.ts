import type { SeoUserConfig, SeoEntry, SeoData } from '../types.js'
import { escapeString, makeAbsUrl, isHome, getExcerpt } from '../utils.js'

export const makeGetData = (config: SeoUserConfig = {}) => (entry: SeoEntry): SeoData => {
  const { resolveImage, transformEntry } = config
  const urlInput = config.defaults?.url
  const baseURL = typeof urlInput === 'string' ? urlInput : (urlInput as any)?.toString?.()
  const absUrl = baseURL ? makeAbsUrl(baseURL) : undefined

  const {
    title: defaultsTitle,
    description: defaultsDescription,
    image: defaultsImage,
    seo: { twitterHandle: defaultsTwitterHandle } = {},
    prod,
  } = config.defaults ?? {}

  let {
    title = 'Website',
    type = 'website',
    _type,
    _updatedAt,
    time_start,
    time_end,
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
  url = url && absUrl ? absUrl(url) || undefined : undefined

  const isPrivate = seoPrivate || !(prod?.() ?? true)
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
    title = defaultsTitle || title
    ogTitle = title
  }

  const resolvedDefaultsImage = defaultsImage
  image = seoImage || image || resolvedDefaultsImage

  let imageAlt = ''

  if (image && typeof image !== 'string') {
    const img = image as Record<string, unknown>
    imageAlt = img.altText as string ?? ''
    image = resolveImage
      ? resolveImage(img, { width: 1000 })
      : (img.src ?? img.url ?? '') as string
  } else if (image && typeof image === 'string' && baseURL) {
    image = baseURL + image
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
    twitterCreatorHandle: twitterCreatorHandle as string | undefined,
    venue,
    timeStart: time_start,
    timeEnd: time_end,
  }

  if (transformEntry) {
    output = { ...output, ...transformEntry(entry) }
  }

  return output
}
