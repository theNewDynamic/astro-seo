import type { DefaultsConfig, SeoUserConfig, SeoUtils } from '../types.js'
import { makeGetData } from './getData.js'
import { makeGetMetasData } from './getMetasData.js'
import { makeGetStructuredData } from './getStructuredData.js'

const MISSING_IMAGE =
  '@thenewdynamic/astro-seo: `defaults.image` is required. Set a default OG image in your `seo.config.ts` (e.g., `image: "/og-image.png"` or a Sanity image object).'

export const assertDefaults = (defaults: DefaultsConfig | undefined): DefaultsConfig => {
  if (!defaults?.image) throw new Error(MISSING_IMAGE)
  return defaults
}

export const createSeoUtils = (config: SeoUserConfig): SeoUtils => {
  // Computed defaults are checked when they resolve, on the first getData call.
  if (typeof config?.defaults !== 'function') assertDefaults(config?.defaults)
  const getData = makeGetData(config)
  const getMetasData = makeGetMetasData(getData, config.extend)
  const getStructuredData = makeGetStructuredData(getData)
  return { getData, getMetasData, getStructuredData }
}
