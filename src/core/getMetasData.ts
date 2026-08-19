import type { SeoEntry, SeoUserConfig } from '../types.js'
import type { makeGetData } from './getData.js'

export const makeGetMetasData =
  (getData: ReturnType<typeof makeGetData>, extend?: SeoUserConfig['extend']) =>
  async (entry: SeoEntry): Promise<Record<string, unknown>> => {
    const data = await getData(entry)
    const {
      title,
      description,
      canonical,
      noindex,
      nofollow,
      charset,
      ogTitle,
      type,
      authors,
      publishedTime,
      modifiedTime,
      image,
      imageAlt,
      url,
      locale,
      localeAlternate,
      languageAlternates,
      siteTitle,
      twitterCard,
      twitterHandle,
      twitterCreatorHandle,
    } = data

    const article =
      type === 'article'
        ? { publishedTime, modifiedTime, authors: authors.map((a) => a.name) }
        : undefined
    return {
      title,
      description,
      canonical,
      noindex,
      nofollow,
      charset,
      languageAlternates,
      openGraph: {
        basic: {
          title: ogTitle,
          type,
          image,
          url,
        },
        optional: {
          locale,
          localeAlternate,
          description,
          siteName: siteTitle,
        },
        image: {
          alt: imageAlt,
        },
        article,
      },
      twitter: {
        title,
        description,
        card: twitterCard,
        site: twitterHandle ? '@' + twitterHandle : undefined,
        creator: twitterCreatorHandle ? '@' + twitterCreatorHandle : undefined,
        image,
        imageAlt,
      },
      extend: extend?.(entry, data),
    }
  }
