export interface DefaultsConfig {
  url?: string
  image: string | Record<string, unknown>
  title?: string
  description?: string
  seo?: {
    title?: string
    twitterHandle?: string
  }
}

export interface ImageOptions {
  width?: number
  height?: number
  [key: string]: unknown
}

export interface SeoEntry {
  _type?: string
  title?: string
  type?: string
  _updatedAt?: string
  time_start?: string
  time_end?: string
  venue?: unknown
  date?: string
  url?: string
  description?: string | unknown[]
  descriptionText?: string
  locale?: string
  image?: string | Record<string, unknown>
  authors?: Array<{ title?: string; name?: string; url?: string }>
  bodyText?: string
  translation?: { url: string; lang: string }
  twitterCard?: string
  twitterHandle?: string
  twitterCreatorHandle?: string
  home?: boolean
  seo?: {
    title?: string
    description?: string
    image?: Record<string, unknown>
    canonical?: string
    private?: boolean
  }
  [key: string]: unknown
}

export interface SeoData {
  _type?: string
  title: string
  publishedTime?: string
  modifiedTime?: string
  authors: Array<{ name: string; url: string | false }>
  description?: string
  canonical?: string | false
  noindex: boolean
  nofollow: boolean
  charset: string
  ogTitle: string
  type: string
  image?: string | false
  imageAlt: string
  url?: string | false
  locale: string
  localeAlternate?: string[]
  languageAlternates?: Array<{ href: string; hrefLang: string }>
  siteTitle: string
  twitterCard: string
  twitterHandle?: string
  twitterCreatorHandle?: string
  venue?: unknown
  timeStart?: string
  timeEnd?: string
}

export interface SeoUserConfig {
  defaults?: DefaultsConfig
  resolveImage?: (image: Record<string, unknown>, opts?: ImageOptions) => string
  transformEntry?: (entry: SeoEntry) => Partial<SeoData>
  isProd?: () => boolean
}

export interface SeoUtils {
  getData: (entry: SeoEntry) => SeoData
  getMetasData: (entry: SeoEntry) => Record<string, unknown>
  getStructuredData: (entry: SeoEntry) => Record<string, unknown>
}

export interface TndSeoOptions {
  configPath?: string
}
