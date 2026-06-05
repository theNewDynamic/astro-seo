import type { SeoEntry } from '../types.js'
import type { makeGetData } from './getData.js'

export const makeGetMetasData =
  (getData: ReturnType<typeof makeGetData>) =>
  (entry: SeoEntry): Record<string, unknown> => {
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
    } = getData(entry)

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
        ...(type === 'article'
          ? {
              publishedTime,
              modifiedTime,
              authors: authors.map((a) => a.name),
            }
          : {}),
      },
      twitter: {
        description,
        card: twitterCard,
        site: twitterHandle ? '@' + twitterHandle : undefined,
        creator: twitterCreatorHandle ? '@' + twitterCreatorHandle : undefined,
      },
    }
  }
