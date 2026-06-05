import type { SeoUserConfig, SeoUtils } from '../types.js'
import { makeGetData } from './getData.js'
import { makeGetMetasData } from './getMetasData.js'
import { makeGetStructuredData } from './getStructuredData.js'

export const createSeoUtils = (config: SeoUserConfig): SeoUtils => {
  const getData = makeGetData(config)
  const getMetasData = makeGetMetasData(getData)
  const getStructuredData = makeGetStructuredData(getData)
  return { getData, getMetasData, getStructuredData }
}
