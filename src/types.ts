export interface DefaultsConfig {
  url?: string
  image: string | Record<string, unknown>
  title?: string
  description?: string
  twitterHandle?: string
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
  timeStart?: string
  timeEnd?: string
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

export interface ExtendedTags {
  meta?: Record<string, unknown>[]
  link?: Record<string, unknown>[]
}

/**
 * `defaults` can be computed: a function, sync or async, is called once, on the first
 * `getData` call, instead of when the config module loads. Use it for values fetched
 * from a CMS: a top-level `await` in `seo.config.ts` runs at module load, where
 * Cloudflare Workers forbid network requests.
 */
export type DefaultsInput = DefaultsConfig | (() => DefaultsConfig | Promise<DefaultsConfig>)

export interface SeoUserConfig {
  defaults?: DefaultsInput
  resolveImage?: (image: Record<string, unknown>, opts?: ImageOptions) => string | Promise<string>
  transformEntry?: (entry: SeoEntry) => Partial<SeoData>
  extend?: (entry: SeoEntry, data: SeoData) => ExtendedTags
  isProd?: () => boolean
}

/**
 * Request context passed alongside the entry. `pathname` (typically
 * `Astro.url.pathname`) is used as the page URL when `entry.url` is not set.
 */
export interface SeoContext {
  pathname?: string
}

export interface SeoUtils {
  getData: (entry: SeoEntry, context?: SeoContext) => Promise<SeoData>
  getMetasData: (entry: SeoEntry, context?: SeoContext) => Promise<Record<string, unknown>>
  getStructuredData: (entry: SeoEntry, context?: SeoContext) => Promise<Record<string, unknown>>
}

export interface TndSeoOptions {
  configPath?: string
}
