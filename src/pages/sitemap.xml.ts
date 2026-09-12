import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { HTML_LANG, LOCALES, PAGES, DEFAULT_LANG, hrefFor } from '../site';

/**
 * Sitemap ditulis tangan (±30 baris) alih-alih memasang @astrojs/sitemap.
 * Lebih kecil, tanpa dependensi, dan memberi kendali penuh atas hreflang.
 */
const xml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL('https://fantastic-couscous.pages.dev');
  const slugs = [...new Set((await getCollection('projects')).map((e) => e.data.slug))];
  const routes = [...PAGES, ...slugs.map((s) => `/projects/${s}`)];

  const urls = routes
    .flatMap((route) =>
      LOCALES.map((lang) => {
        const loc = new URL(hrefFor(lang, route), base).href;
        const alts = [...LOCALES, DEFAULT_LANG]
          .map((l, i) =>
            `    <xhtml:link rel="alternate" hreflang="${i === LOCALES.length ? 'x-default' : HTML_LANG[l]}" href="${xml(new URL(hrefFor(l, route), base).href)}"/>`,
          )
          .join('\n');
        return `  <url>\n    <loc>${xml(loc)}</loc>\n${alts}\n  </url>`;
      }),
    )
    .join('\n');

  const doc = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;

  return new Response(doc, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
