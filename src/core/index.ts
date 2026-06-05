import type { SeoUserConfig, SeoUtils } from '../types.js'
import { makeGetData } from './getData.js'
import { makeGetMetasData } from './getMetasData.js'
import { makeGetStructuredData } from './getStructuredData.js'

export const createSeoUtils = (config: SeoUserConfig): SeoUtils => {
  if (!config?.defaults?.image) {
    throw new Error(
      '@thenewdynamic/astro-seo: `defaults.image` is required. Set a default OG image in your `seo.config.ts` (e.g., `image: "/og-image.png"` or a Sanity image object).'
    )
  }
  const getData = makeGetData(config)
  const getMetasData = makeGetMetasData(getData)
  const getStructuredData = makeGetStructuredData(getData)
  return { getData, getMetasData, getStructuredData }
}
