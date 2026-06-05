# @thenewdynamic/astro-seo

An Astro integration for SEO meta tags and structured data. Wraps `astro-seo` internally and provides a simple, configuration-driven API.

## Features

- **Automatic SEO tags** — generates meta tags for Open Graph, Twitter, and more
- **JSON-LD structured data** — schema.org support for events, organizations, articles, and more
- **Virtual module configuration** — centralized setup via `seo.config.ts`
- **Flexible image resolution** — customize how images are transformed for meta tags
- **Per-entry transforms** — override SEO fields by content type

## Installation

```bash
npm install @thenewdynamic/astro-seo
```

## Quick Setup

**`astro.config.mjs`**
```js
import tndSeo from '@thenewdynamic/astro-seo'

export default defineConfig({
  site: 'https://example.com',
  integrations: [tndSeo()]
})
```

**`seo.config.ts`** (in your project root)
```ts
import type { SeoUserConfig } from '@thenewdynamic/astro-seo'

export default {
  defaults: {
    image: '/og-image.png', // Required — default OG image
    title: 'My Site',
    description: 'A brief site description',
  },
  // Optional — customize image resolution (e.g., Sanity)
  resolveImage: (image) => `https://cdn.example.com/${image.src}`,
  // Optional — override SEO fields per content type
  transformEntry: (entry) => ({ /* ... */ }),
  // Optional — detect production mode (defaults to import.meta.env.PROD)
  isProd: () => process.env.NODE_ENV === 'production',
} satisfies SeoUserConfig
```

**In your layout**
```astro
import SEO from '@thenewdynamic/astro-seo/SEO.astro'

<SEO entry={entry} />
```

## Configuration

See `ARCHITECTURE.md` for detailed configuration options, API reference, and architecture notes.

## License

MIT
