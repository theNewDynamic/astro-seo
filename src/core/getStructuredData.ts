import type { SeoEntry } from '../types.js'
import type { makeGetData } from './getData.js'
import { parseBase, parseEvent } from './sd.js'

export const makeGetStructuredData =
  (getData: ReturnType<typeof makeGetData>) =>
  async (entry: SeoEntry): Promise<Record<string, unknown>> => {
    const data = await getData(entry)
    let output = parseBase(data)

    if (data._type === 'event') {
      output = { ...output, ...parseEvent(data) }
    }

    return output
  }
