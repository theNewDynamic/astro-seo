import type { SeoData } from '../types.js'

export const parseBase = (data: SeoData): Record<string, unknown> => {
  const { description, ogTitle, type, publishedTime, modifiedTime, image, authors, url } = data

  return {
    '@context': 'https://schema.org',
    '@type': type,
    headline: ogTitle,
    url,
    image: [image],
    description,
    ...(authors?.length ? {
      author: authors.map(({ name, url }) => ({
        '@type': 'Person',
        name,
        url,
      }))
    } : {}),
    ...(type === 'article' ? {
      datePublished: publishedTime,
      dateModified: modifiedTime,
    } : {}),
  }
}

export const parseVenue = (data: Record<string, unknown>): Record<string, unknown> => {
  const { title, address_1: address, city, country, state, zip } = data as Record<string, string>
  return {
    '@type': 'Place',
    name: title,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address,
      addressLocality: city,
      postalCode: zip,
      addressRegion: state,
      addressCountry: country,
    },
  }
}

export const parseEvent = (data: SeoData): Record<string, unknown> => {
  const { timeStart, timeEnd, venue } = data
  return {
    '@type': 'Event',
    startDate: timeStart,
    endDate: timeEnd,
    ...(venue ? { location: parseVenue(venue as Record<string, unknown>) } : {}),
  }
}
