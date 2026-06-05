import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import type { AstroIntegration } from 'astro'
import type { Plugin } from 'vite'
import type { TndSeoOptions } from './types.js'

const VIRTUAL_MODULE_ID = 'virtual:tnd/seo'
const RESOLVED_ID = '\0' + VIRTUAL_MODULE_ID

const VIRTUAL_MODULE_TYPES = `
declare module 'virtual:tnd/seo' {
  import type { SeoEntry, SeoData } from '@thenewdynamic/astro-seo'
  export const getData: (entry: SeoEntry) => SeoData
  export const getMetasData: (entry: SeoEntry) => Record<string, unknown>
  export const getStructuredData: (entry: SeoEntry) => Record<string, unknown>
}
`

export default function tndSeo(options: TndSeoOptions = {}): AstroIntegration {
  let configFilePath: string
  let coreModulePath: string
  let astroSite: string | undefined

  return {
    name: '@thenewdynamic/astro-seo',
    hooks: {
      'astro:config:setup': ({ config, updateConfig }) => {
        astroSite = config.site?.toString()
        const root = fileURLToPath(config.root)
        const userConfigPath = options.configPath ?? './seo.config'
        configFilePath = resolve(root, userConfigPath)
        coreModulePath = fileURLToPath(new URL('./core/index.js', import.meta.url))

        const plugin: Plugin = {
          name: 'vite-plugin-tnd-seo',
          resolveId(id) {
            if (id === VIRTUAL_MODULE_ID) return RESOLVED_ID
          },
          load(id) {
            if (id !== RESOLVED_ID) return
            return [
              `import userConfig from '${configFilePath}'`,
              `import { createSeoUtils } from '${coreModulePath}'`,
              `const astroSite = ${astroSite ? `'${astroSite}'` : 'undefined'}`,
              `const config = userConfig || {}`,
              `config.defaults = config.defaults || {}`,
              `if (astroSite && !config.defaults.url) config.defaults.url = astroSite`,
              `export const { getData, getMetasData, getStructuredData } = createSeoUtils(config)`,
            ].join('\n')
          },
        }

        updateConfig({ vite: { plugins: [plugin] } })
      },
      'astro:config:done': ({ injectTypes }) => {
        injectTypes({ filename: 'virtual-tnd-seo.d.ts', content: VIRTUAL_MODULE_TYPES })
      },
    },
  }
}

export type { SeoUserConfig, SeoEntry, SeoData, SeoUtils, TndSeoOptions } from './types.js'
export { flattenEntry } from './utils.js'
