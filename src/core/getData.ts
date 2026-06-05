import type { SeoUserConfig, SeoEntry, SeoData } from '../types.js'
import { escapeString, makeAbsUrl, isHome, getExcerpt } from '../utils.js'

export const makeGetData = (config: SeoUserConfig) => (entry: SeoEntry): SeoData => {
  const { site, resolveImage, transformEntry } = config
  const { url: baseURL } = site
  const absUrl = makeAbsUrl(baseURL)

  const {
    title: siteTitle,
    description: siteDescription,
    image: siteImage,
    seo: { twitterHandle: siteTwitterHandle } = {},
    prod,
  } = site

  let {
    title = 'Missing',
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
    twitterHandle = siteTwitterHandle,
    twitterCreatorHandle = siteTwitterHandle,
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
  url = url ? absUrl(url) || undefined : undefined

  const isPrivate = seoPrivate || !(prod?.() ?? true)
  const canonical = seoCanonical || url

  title = seoTitle
    ? seoTitle
    : title
    ? escapeString(title as string)
    : siteTitle ?? 'Missing'

  description = seoDescription
    ? seoDescription
    : descriptionText
    ? escapeString(descriptionText)
    : description && typeof description === 'string'
    ? escapeString(description)
    : bodyText
    ? getExcerpt(bodyText, 300)
    : siteDescription

  let ogTitle = title

  if (siteTitle && !isHome(entry)) {
    title = `${title} | ${siteTitle}`
  } else if (isHome(entry)) {
    title = site.title
    ogTitle = site.title
  }

  const resolvedSiteImage = siteImage
  image = seoImage || image || resolvedSiteImage

  let imageAlt = ''

  if (image && typeof image !== 'string') {
    const img = image as Record<string, unknown>
    imageAlt = img.altText as string ?? ''
    image = resolveImage
      ? resolveImage(img, { width: 1000 })
      : (img.src ?? img.url ?? '') as string
  } else if (image && typeof image === 'string') {
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
      ? authors.map((a) => ({ name: a.title ?? a.name ?? '', url: a.url ? absUrl(a.url) : false }))
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
    siteTitle: siteTitle ?? '',
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
