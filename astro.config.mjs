// @ts-check
import { defineConfig } from 'astro/config';

// Sengaja TANPA integrasi apa pun. Sitemap, i18n, dan styling ditangani
// sendiri dengan kode yang jauh lebih kecil daripada paket setara.
// Lihat ADR-009 di docs/04-decision-records.md.
/**
 * URL produksi. Utamakan variabel lingkungan SITE_URL agar pindah domain
 * cukup mengubah satu setelan di dasbor Cloudflare — nol suntingan kode
 * (ADR-012). Literal di bawah hanya cadangan untuk build lokal.
 *
 * Nilai ini merembes ke canonical, hreflang, sitemap, robots.txt, JSON-LD,
 * og:image, dan resume.json. Kalau salah, semuanya salah sekaligus.
 */
const SITE = process.env.SITE_URL ?? 'https://aditya-fauzi.pages.dev';

export default defineConfig({
  site: SITE,
  output: 'static',
  compressHTML: true,
  prefetch: false,
  build: {
    // CSS disisipkan ke dalam HTML. Menghapus satu round-trip render-blocking
    // di jalur kritis — penghematan terbesar untuk LCP di jaringan seluler.
    inlineStylesheets: 'always',
  },
  devToolbar: { enabled: false },
});
