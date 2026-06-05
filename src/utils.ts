export const escapeString = (string: string): string => {
  if (/[*_"]/.test(string)) {
    return string.replace('"', '&quot;').replace(/[*_]/g, '')
  }
  return string
}

export const makeAbsUrl = (baseURL: string) => (url: string): string | false => {
  if (typeof url === 'undefined') return false
  const separator = url.charAt(0) !== '/' ? '/' : ''
  return baseURL + separator + url
}

export const isHome = (entry: Record<string, unknown>): boolean => {
  return typeof entry.home !== 'undefined' && !!entry.home
}

export const getExcerpt = (string: string, length = 300): string => {
  if (string && string.length > length) {
    return string.substring(0, length) + '...'
  }
  return string
}

export const flattenEntry = (
  entry: Record<string, unknown> & { data?: Record<string, unknown> }
): Record<string, unknown> => ({
  ...entry,
  ...entry.data,
})
