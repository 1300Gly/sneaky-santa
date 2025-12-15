# SEO and Internationalization (i18n)

## Current Implementation

The application uses **client-side only translation** with Svelte stores. Translations are loaded from JSON files and applied reactively when the language changes.

## SEO Considerations

### Is Client-Side i18n Bad for SEO?

**Short answer:** It can be, but for a game like this, it's usually acceptable.

### The Problem

1. **Search engines may not execute JavaScript**: Some crawlers (especially older ones) may not fully execute JavaScript, so they might only see the default language content.

2. **No language-specific URLs**: All languages share the same URL (`/rules`, `/game`), which makes it harder for search engines to distinguish between language versions.

3. **No hreflang tags**: Search engines don't know which language version to show to users in different regions.

### The Good News

1. **Modern search engines (Google, Bing) DO execute JavaScript**: They can see the translated content after JavaScript runs.

2. **This is a game, not a content site**: SEO is typically less critical for interactive games compared to content-heavy websites.

3. **Client-side translation is fast**: No server round-trips needed for language switching.

## Recommendations for Better SEO (Optional)

If you want to improve SEO in the future, consider:

### Option 1: Server-Side Rendering (SSR) with Astro

Since you're using Astro, you could:

1. **Use Astro's SSR mode** to render pages server-side
2. **Detect language from URL or headers** (e.g., `/en/rules`, `/nl/rules`)
3. **Render the correct language on the server** before sending to the client
4. **Add hreflang tags** to help search engines understand language versions

Example:
```astro
---
// src/pages/[lang]/rules.astro
const lang = Astro.params.lang || 'en';
const translations = await import(`../lib/i18n/locales/${lang}.json`);
---

<html lang={lang}>
  <head>
    <link rel="alternate" hreflang="en" href="/en/rules" />
    <link rel="alternate" hreflang="nl" href="/nl/rules" />
  </head>
  <body>
    <h1>{translations.rules.title}</h1>
  </body>
</html>
```

### Option 2: Static Site Generation (SSG) with Multiple Builds

Generate separate static builds for each language:

1. Build once for English → `/en/`
2. Build once for Dutch → `/nl/`
3. Each language gets its own static HTML files
4. Add hreflang tags between language versions

### Option 3: Keep Current Approach (Recommended for Now)

For a game application, the current client-side approach is:
- ✅ Simple to maintain
- ✅ Fast language switching
- ✅ Works well for user experience
- ⚠️ Less optimal for SEO, but acceptable for this use case

## Current SEO Status

**What works:**
- Modern search engines can see translated content
- Meta tags in `MainLayout.astro` are set (though not language-specific)
- Content is accessible and crawlable

**What could be improved:**
- Language-specific URLs (`/en/rules` vs `/nl/rules`)
- hreflang tags for language versions
- Language-specific meta tags
- Server-side rendering of translated content

## Conclusion

For a Christmas dice game, **client-side i18n is perfectly fine**. The user experience is more important than SEO for this type of application. If you later want to improve SEO, you can implement SSR with language-specific URLs, but it's not necessary for the current use case.

