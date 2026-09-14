// @ts-check
import { defineConfig } from 'astro/config';

// Sengaja TANPA integrasi apa pun. Sitemap, i18n, dan styling ditangani
// sendiri dengan kode yang jauh lebih kecil daripada paket setara.
// Lihat ADR-009 di docs/04-decision-records.md.
export default defineConfig({
  site: 'https://aditya-fauzi.pages.dev',
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
