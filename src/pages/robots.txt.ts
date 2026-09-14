import type { APIRoute } from 'astro';
import { DRAFT, FALLBACK_SITE } from '../site';

/**
 * robots.txt dibangkitkan, bukan statis, agar URL sitemap mengikuti `site` di
 * astro.config.mjs — satu sumber kebenaran untuk domain (ADR-010). Selama
 * draft:true seluruh perayapan ditolak, sejalan dengan meta robots noindex.
 */
export const GET: APIRoute = ({ site }) => {
  const base = site ?? FALLBACK_SITE;
  const body = DRAFT
    ? `User-agent: *\nDisallow: /\n`
    : `User-agent: *\nAllow: /\nDisallow: /contact/success\nDisallow: /contact/error\n\nSitemap: ${new URL('/sitemap.xml', base).href}\n`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
