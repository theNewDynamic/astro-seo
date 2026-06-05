# @thenewdynamic/astro-seo

An Astro integration that provides SEO meta tags and structured data for Astro projects. It wraps [`astro-seo`](https://github.com/jonasmerlin/astro-seo) internally so consuming projects don't install it directly.

## How it works

The integration registers a Vite virtual module (`virtual:tnd/seo`) that exposes three pre-configured utilities: `getData`, `getMetasData`, `getStructuredData`. These are configured at startup from a `seo.config.ts` file in the consuming project's root.

The `<SEO>` component (exported at `@thenewdynamic/astro-seo/SEO.astro`) imports from the virtual module and renders both the meta tags and the JSON-LD structured data script in one shot.

## Key architecture decisions

**Why a virtual module instead of a factory function**
The virtual module lets any component import from `virtual:tnd/seo` without needing to set up a wrapper file. Configuration is wired once in `astro.config.mjs` and available everywhere.

**Why a separate `seo.config.ts` and not inline in `astro.config.mjs`**
`astro.config.mjs` is evaluated before Vite starts, so `astro:env/server` virtual modules and path aliases (e.g. `@util/*`, `@data/*`) are unavailable there. `seo.config.ts` is loaded inside the Vite module graph at dev/build time, where everything resolves correctly.

**Default `resolveImage` behaviour**
When no `resolveImage` is provided in the config, image objects are resolved by reading their `src` or `url` string property. This covers the standard markdown/MDX frontmatter image shape. Sanity projects override this with their own `getImageURL`.

**`flattenEntry` utility**
Exported from the package root. Spreads `entry.data` onto the entry root, for Astro content collection entries where frontmatter lives under `.data`. Opt-in — not applied automatically.

**`transformEntry` config option**
Returns a partial `SeoData` object that is merged (with precedence) over the computed output. Use it to override SEO fields per entry `_type`.

## Package structure

```
src/
  index.ts               # integration default export + flattenEntry + type exports
  types.ts               # all TypeScript interfaces (SeoEntry, SeoData, SeoUserConfig…)
  utils.ts               # escapeString, makeAbsUrl, isHome, getExcerpt, flattenEntry
  components/
    SEO.astro            # exported component — renders meta tags + JSON-LD
  core/
    index.ts             # createSeoUtils factory
    getData.ts           # core SEO data resolver
    getMetasData.ts      # formats data for astro-seo's <SEO> props
    getStructuredData.ts # formats data for schema.org JSON-LD
    sd.ts                # parseBase, parseEvent, parseVenue structured data builders
```

## Consuming project setup

**`astro.config.mjs`**
```js
import tndSeo from '@thenewdynamic/astro-seo'
export default defineConfig({
  integrations: [tndSeo()]
})
```

**`seo.config.ts`** (project root, read automatically)
```ts
import type { SeoUserConfig } from '@thenewdynamic/astro-seo'
import { getImageURL } from './src/util/sanity/image'
import site from './src/data/site'

export default {
  site,
  resolveImage: (image, opts) => getImageURL(image, opts),
  transformEntry: (entry) => {
    return {}
  },
} satisfies SeoUserConfig
```

**In a layout**
```astro
import SEO from '@thenewdynamic/astro-seo/SEO.astro'
---
<SEO entry={entry} />
```

**For markdown/content collections**
```astro
import SEO from '@thenewdynamic/astro-seo/SEO.astro'
import { flattenEntry } from '@thenewdynamic/astro-seo'
---
<SEO entry={flattenEntry(entry)} />
```

## TODO

- **Build step**: the package currently ships TypeScript source. A `tsup` or `tsc` build targeting `dist/` is needed before publishing to npm. Update `package.json` exports to point at `dist/`.
- **npm publish config**: add `"files": ["dist", "src/components"]` and a `prepublishOnly` build script to `package.json`.
- **Virtual module ID**: currently `virtual:tnd/seo` — consider renaming to `virtual:thenewdynamic/seo` for consistency with the scope.
- **Tests**: no tests yet. The core functions (`getData`, `getMetasData`, `getStructuredData`) are pure and straightforward to unit test.
- **TypeScript strictness**: `SeoEntry` uses a loose index signature (`[key: string]: unknown`) to accommodate both Sanity and markdown shapes. Worth tightening once the real-world usage is clearer.
