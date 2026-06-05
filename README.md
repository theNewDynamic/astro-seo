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

## Data Requirements

The package works with flexible entry shapes — you don't need all fields. Here's what matters:

### For basic SEO (all content types)
```ts
{
  title?: string          // Page title
  description?: string    // Meta description
  image?: string          // OG image URL or object
  url?: string            // Canonical URL
}
```

If these are missing, the package falls back to `defaults` config.

### For structured data (events, articles, etc.)
Rich structured data requires content-type-specific fields:

**Events** need:
```ts
{
  timeStart: string      // ISO date (e.g., "2025-06-15T10:00:00Z")
  timeEnd?: string       // ISO date
  venue?: object          // Venue details
}
```

**Articles** need:
```ts
{
  _updatedAt?: string     // ISO date for modified time
  authors?: Array<{ name: string; url?: string }>
}
```

**Organizations** need:
```ts
{
  // Set via defaults or transformEntry
}
```

### Mapping your data

If your content model uses different field names, use `transformEntry` to map:

```ts
// seo.config.ts
export default {
  defaults: { image: '/og-image.png' },
  transformEntry: (entry) => {
    // For events
    if (entry._type === 'event') {
      return {
        title: entry.name,                    // Map 'name' → 'title'
        description: entry.summary,           // Map 'summary' → 'description'
        timeStart: entry.startDate,          // Map 'startDate' → 'timeStart'
        timeEnd: entry.endDate,              // Map 'endDate' → 'timeEnd'
        image: entry.poster,                  // Map 'poster' → 'image'
      }
    }
    // For articles
    if (entry._type === 'article') {
      return {
        title: entry.headline,
        description: entry.excerpt,
        authors: entry.contributors?.map(c => ({ name: c.name, url: c.bio_url })),
      }
    }
    return {}
  }
}
```

The package merges `transformEntry` output with your entry data, so you only need to override fields that differ.

### Per-entry SEO overrides

Any entry can include a `seo` object to override resolved SEO values at the entry level — useful for custom titles, canonical URLs, or marking a page private:

```ts
{
  title: 'My Event',
  // ...
  seo: {
    title: 'Custom page title',       // overrides resolved title
    description: 'Custom description',
    image: { src: '/custom-og.png' },
    canonical: 'https://example.com/canonical-url',
    private: true,                    // exclude from search engines
  }
}
```

These values take precedence over both entry fields and `defaults`.

## Configuration

See `ARCHITECTURE.md` for detailed configuration options, API reference, and architecture notes.

## License

MIT
