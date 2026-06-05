import type { SeoEntry } from '../types.js'
import type { makeGetData } from './getData.js'
import { parseBase, parseEvent } from './sd.js'

export const makeGetStructuredData =
  (getData: ReturnType<typeof makeGetData>) =>
  (entry: SeoEntry): Record<string, unknown> => {
    const data = getData(entry)
    let output = parseBase(data)

    if (data._type === 'event') {
      output = { ...output, ...parseEvent(data) }
    }

    return output
  }
