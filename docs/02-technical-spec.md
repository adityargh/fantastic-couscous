# 02 — Spesifikasi Teknis

Dokumen implementasi untuk Sprint 1–6. Setiap potongan kode di sini adalah **kontrak**, bukan saran: jika implementasi menyimpang, catat alasannya sebagai ADR baru di [`04-decision-records.md`](04-decision-records.md).

---

## 1. Stack & Versi

| Lapisan | Teknologi | Versi | Catatan |
| :--- | :--- | :--- | :--- |
| Framework | Astro | `^5` | `output: 'static'` |
| Bahasa | TypeScript | `^5.6` | `strict: true`, tanpa `any` implisit |
| Styling | Tailwind CSS | `^4` | via `@tailwindcss/vite`, konfigurasi CSS-first |
| Package manager | pnpm | `^9` | Paling hemat disk & tercepat di CI |
| Runtime build | Node.js | `22 LTS` | Dikunci lewat `.nvmrc` + `engines` |
| Konten | Astro Content Collections + Zod | bawaan | Validasi saat build |
| Gambar | `astro:assets` (Sharp) | bawaan | AVIF + WebP otomatis |
| Sitemap | `@astrojs/sitemap` | terbaru | Sadar i18n |
| OG image | `astro-og-canvas` | terbaru | Dibangkitkan saat build |
| PDF | Playwright Chromium | terbaru | Hanya `devDependency`, jalan di CI |
| Pengujian | Playwright + `@axe-core/playwright` | terbaru | Smoke + a11y |
| Gerbang performa | Lighthouse CI | terbaru | Assertion budget |
| Lint | ESLint (flat config) + Prettier + `astro check` | terbaru | — |

**Prinsip dependensi:** setiap paket baru harus lolos tiga pertanyaan — (1) apakah menghemat > 2 jam kerja? (2) apakah masih dirawat aktif (rilis ≤ 6 bulan)? (3) apakah menambah < 10 KB ke bundel klien? Jika ada satu "tidak", tulis sendiri.

---

## 2. Struktur Repositori

```
fantastic-couscous/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                 # lint → typecheck → build → test → lighthouse
│   │   ├── scheduled.yml          # link check + audit mingguan
│   │   └── mirror-pages.yml       # deploy darurat ke GitHub Pages (manual)
│   └── dependabot.yml
├── docs/                          # 01–04 (dokumen perencanaan)
├── public/
│   ├── cv/                        # PDF hasil generate — TIDAK di-commit
│   ├── fonts/                     # 1 file WOFF2 subset latin
│   ├── favicon.svg
│   ├── robots.txt
│   ├── _headers                   # header keamanan Cloudflare
│   └── _redirects                 # redirect 301 URL lama
├── src/
│   ├── components/
│   │   ├── layout/                # Header, Footer, SkipLink, ThemeToggle, LangSwitcher
│   │   ├── sections/              # Hero, ImpactHighlights, Timeline, Skills, FeaturedCases, CTA
│   │   └── ui/                    # MetricCard, Badge, Button, CaseStudyCard, Prose
│   ├── content/
│   │   ├── config.ts              # ⭐ SKEMA ZOD — sumber kebenaran
│   │   ├── profile/               # profile.en.json, profile.id.json
│   │   ├── experience/            # experience.en.json, experience.id.json
│   │   ├── skills/                # skills.en.json, skills.id.json
│   │   ├── education/             # education.en.json, education.id.json
│   │   └── projects/
│   │       ├── en/<slug>.md
│   │       └── id/<slug>.md
│   ├── i18n/
│   │   ├── ui.ts                  # string antarmuka EN/ID
│   │   └── utils.ts               # getLangFromUrl, useTranslations, localizePath
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   ├── CaseStudyLayout.astro
│   │   └── PrintLayout.astro      # khusus rendering PDF
│   ├── pages/
│   │   ├── index.astro            ├── about.astro       ├── contact.astro
│   │   ├── projects/index.astro   ├── projects/[slug].astro
│   │   ├── id/index.astro         ├── id/tentang.astro  ├── id/kontak.astro
│   │   ├── id/proyek/index.astro  ├── id/proyek/[slug].astro
│   │   ├── print/cv-[lang].astro  # noindex, sumber PDF
│   │   ├── resume.json.ts         # endpoint ekspor JSON Resume
│   │   └── 404.astro
│   ├── styles/
│   │   └── global.css             # token desain + base Tailwind
│   └── consts.ts                  # SITE_URL, nama, kanal sosial
├── scripts/
│   └── generate-pdf.mjs           # Playwright → PDF
├── tests/
│   ├── smoke.spec.ts
│   └── a11y.spec.ts
├── astro.config.mjs
├── lighthouserc.json
├── .nvmrc                         # 22
└── package.json
```

**Aturan:** `public/cv/*.pdf` **tidak di-commit** — berkas biner hasil generate di git akan menggembungkan repo selamanya. Dibangkitkan saat build, disajikan dari output deploy.

---

## 3. Model Konten — Sumber Kebenaran Tunggal

`src/content/config.ts` menentukan bentuk seluruh konten. **Konten tidak valid = build gagal**, jadi produksi tidak mungkin menampilkan data rusak.

```ts
import { defineCollection, z } from 'astro:content';

const LOCALES = ['en', 'id'] as const;

const profile = defineCollection({
  type: 'data',
  schema: z.object({
    locale: z.enum(LOCALES),
    name: z.string().min(1),
    headline: z.string().min(1).max(80),
    positioning: z.string().min(20).max(200),
    location: z.string(),
    availability: z.enum(['open', 'consulting', 'not-looking']),
    yearsOfExperience: z.number().int().positive(),
    // Ditegakkan: 3–4 highlight, setiap value HARUS memuat angka.
    highlights: z.array(z.object({
      value: z.string().regex(/\d/, 'Impact highlight wajib memuat angka'),
      label: z.string().max(40),
      context: z.string().max(120),
    })).min(3).max(4),
    social: z.array(z.object({
      platform: z.enum(['linkedin', 'github', 'email', 'other']),
      url: z.string().url(),
      label: z.string(),
    })),
    // Gerbang privasi: nomor telepon & alamat sengaja TIDAK ada di skema (§6.4 rencana utama).
  }),
});

const experience = defineCollection({
  type: 'data',
  schema: z.object({
    locale: z.enum(LOCALES),
    roles: z.array(z.object({
      title: z.string(),
      company: z.string(),
      industry: z.string().optional(),
      location: z.string(),
      startDate: z.string().regex(/^\d{4}-\d{2}$/),
      endDate: z.union([z.string().regex(/^\d{4}-\d{2}$/), z.literal('present')]),
      type: z.enum(['full-time', 'contract', 'consulting', 'internship']),
      scope: z.string().optional(),
      summary: z.string().max(200),
      // Setiap bullet pencapaian WAJIB berangka — aturan konten ditegakkan mesin.
      achievements: z.array(
        z.string().min(20).regex(/\d/, 'Bullet pencapaian wajib memuat angka terukur')
      ).min(1).max(6),
      tools: z.array(z.string()).default([]),
    })).min(1),
  }),
});

const projects = defineCollection({
  type: 'content', // Markdown — badan tulisan = seksi studi kasus
  schema: ({ image }) => z.object({
    locale: z.enum(LOCALES),
    title: z.string().max(80),
    slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug: huruf kecil dan tanda hubung saja'),
    description: z.string().min(100).max(160), // dipakai sebagai meta description
    headlineMetric: z.string().regex(/\d/),
    period: z.string(),
    role: z.string(),
    tags: z.array(z.string()).min(2).max(4),
    featured: z.boolean().default(false),
    order: z.number().int().default(99),
    cover: image().optional(),
    metrics: z.array(z.object({
      name: z.string(), before: z.string(), after: z.string(),
      delta: z.string(), window: z.string(),
    })).min(1),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
  }),
});

const skills = defineCollection({
  type: 'data',
  schema: z.object({
    locale: z.enum(LOCALES),
    groups: z.array(z.object({
      domain: z.string(),
      items: z.array(z.object({
        name: z.string(),
        // Sengaja TIDAK ADA field persentase — skill bar adalah sinyal palsu.
        level: z.enum(['expert', 'proficient', 'familiar']),
      })).min(1),
    })).min(1),
  }),
});

const education = defineCollection({
  type: 'data',
  schema: z.object({
    locale: z.enum(LOCALES),
    items: z.array(z.object({
      kind: z.enum(['degree', 'certification', 'award']),
      name: z.string(),
      institution: z.string(),
      year: z.string(),
      credentialUrl: z.string().url().optional(),
    })),
  }),
});

export const collections = { profile, experience, projects, skills, education };
```

**Mengapa skema ini penting:** dua aturan konten terpenting dari brief — *"setiap bullet wajib berangka"* dan *"tanpa persentase skill"* — dikodekan sebagai constraint mesin, bukan pengingat di dokumen. Standar yang bergantung pada ingatan manusia akan luruh; standar yang menggagalkan build tidak.

### Ekspor JSON Resume (`src/pages/resume.json.ts`)

Data yang sama diekspor ke [skema JSON Resume](https://jsonresume.org/schema/) agar bisa dibaca alat pihak ketiga dan sebagai jaminan portabilitas (mitigasi risiko R7).

```ts
import type { APIRoute } from 'astro';
import { getEntry } from 'astro:content';

export const GET: APIRoute = async () => {
  const profile = await getEntry('profile', 'profile.en');
  const exp = await getEntry('experience', 'experience.en');
  const body = {
    $schema: 'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
    basics: {
      name: profile.data.name,
      label: profile.data.headline,
      summary: profile.data.positioning,
      location: { city: profile.data.location },
      profiles: profile.data.social.map((s) => ({
        network: s.platform, url: s.url, username: s.label,
      })),
    },
    work: exp.data.roles.map((r) => ({
      name: r.company, position: r.title,
      startDate: r.startDate, endDate: r.endDate === 'present' ? undefined : r.endDate,
      summary: r.summary, highlights: r.achievements,
    })),
  };
  return new Response(JSON.stringify(body, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
```

---

## 4. Sistem Desain — Diturunkan dari `DESIGN_SYSTEM.md`

Token warna diambil dari sistem desain yang sudah ada di repositori ini, dengan **tiga adaptasi wajib** karena konteksnya berbeda (aplikasi ops padat data → situs portofolio yang dibaca santai):

| Adaptasi | Alasan |
| :--- | :--- |
| Ukuran teks dasar 14 px → **17 px**, line-height 1,5 → **1,65** | Aplikasi gudang butuh kepadatan data; halaman portofolio butuh kenyamanan baca. Lebar baca dibatasi 68 karakter |
| Spasi lebih lapang (skala 4 pt tetap, tapi seksi pakai `xxl`+) | Ruang putih menandakan kualitas pada konteks pemasaran diri |
| **Info Cyan `#00BFFF` diganti `#0B6E99` untuk teks** | Cyan asli hanya mencapai ± 2,1:1 di atas putih — **gagal WCAG AA**. Warna asli tetap boleh dipakai sebagai aksen non-teks |

```css
/* src/styles/global.css */
@import 'tailwindcss';

@theme {
  /* Warna merek — dari DESIGN_SYSTEM.md §2.1 */
  --color-brand:       #0052CC;   /* Ops Blue */
  --color-brand-dark:  #003E99;
  --color-brand-tint:  #DEEBFF;

  /* Netral — DESIGN_SYSTEM.md §2.2 */
  --color-ink:         #172B4D;   /* Slate 900 */
  --color-ink-muted:   #42526E;   /* Slate 700 */
  --color-ink-subtle:  #6B778C;   /* Slate 500 */
  --color-line:        #DFE1E6;   /* Slate 200 */
  --color-surface-alt: #F4F5F7;   /* Slate 50  */
  --color-surface:     #FFFFFF;

  /* Semantik — DESIGN_SYSTEM.md §2.3, info disesuaikan agar lolos AA */
  --color-success:     #00875A;
  --color-warning:     #FFAB00;
  --color-danger:      #DE350B;
  --color-info:        #0B6E99;

  /* Tipografi — skala portofolio */
  --font-sans: 'Inter var', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace;
  --text-base: 1.0625rem;   /* 17px */
  --leading-base: 1.65;

  /* Spasi — grid 4 pt dari DESIGN_SYSTEM.md §5.1 */
  --spacing-xs: 4px;  --spacing-sm: 8px;  --spacing-md: 16px;
  --spacing-lg: 24px; --spacing-xl: 32px; --spacing-xxl: 48px;
}

/* Dark mode — dipetakan ulang perannya, bukan sekadar dibalik.
   Biru dicerahkan agar tetap ≥ 4,5:1 di atas latar gelap. */
:root[data-theme='dark'] {
  --color-brand:       #85B8FF;
  --color-brand-dark:  #A6C8FF;
  --color-brand-tint:  #0C2952;
  --color-ink:         #EAEEF5;
  --color-ink-muted:   #B6C2D4;
  --color-ink-subtle:  #8C99AD;
  --color-line:        #2A3549;
  --color-surface-alt: #131A26;
  --color-surface:     #0B1017;
  --color-success:     #4BCE97;
  --color-warning:     #F5CD47;
  --color-danger:      #FF8F73;
  --color-info:        #6FC6EE;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Strategi tema (wajib — mencegah flash):** skrip inline blocking kecil di `<head>` membaca `localStorage` lalu menyetel `data-theme` **sebelum** paint pertama. Ini satu-satunya JavaScript render-blocking yang diizinkan, dan besarnya < 300 byte.

```html
<script is:inline>
  const t = localStorage.getItem('theme')
    ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.dataset.theme = t;
</script>
```

**Strategi font:** teks UI memakai font sistem (0 byte, 0 permintaan). Satu WOFF2 variabel subset-latin di-*self-host* hanya untuk heading, dengan `font-display: swap` dan `<link rel="preload">`. Tidak menggunakan Google Fonts dari CDN — menambah koneksi pihak ketiga, memperlambat LCP, dan menimbulkan pertanyaan privasi.

---

## 5. Konfigurasi Astro & i18n

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://aditya-fauzi.pages.dev', // ganti bila pindah domain
  output: 'static',
  trailingSlash: 'never',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'id'],
    routing: { prefixDefaultLocale: false }, // /about  dan  /id/tentang
  },
  build: { inlineStylesheets: 'auto', format: 'file' },
  vite: { plugins: [tailwind()] },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en-US', id: 'id-ID' } },
      filter: (page) => !page.includes('/print/'), // rute cetak jangan diindeks
    }),
  ],
});
```

```ts
// src/i18n/utils.ts
import { ui, defaultLang, type Lang } from './ui';

export function getLangFromUrl(url: URL): Lang {
  const [, seg] = url.pathname.split('/');
  return seg in ui ? (seg as Lang) : defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

/** Peta rute: menjaga pengguna tetap di halaman yang sama saat berganti bahasa. */
const ROUTE_MAP: Record<string, { en: string; id: string }> = {
  home:     { en: '/',          id: '/id' },
  about:    { en: '/about',     id: '/id/tentang' },
  projects: { en: '/projects',  id: '/id/proyek' },
  contact:  { en: '/contact',   id: '/id/kontak' },
};

export function localizePath(routeKey: keyof typeof ROUTE_MAP, lang: Lang) {
  return ROUTE_MAP[routeKey][lang];
}

/** Padanan URL saat ini di bahasa lain — dipakai pengalih bahasa & hreflang. */
export function getAlternatePath(pathname: string, target: Lang): string {
  const entry = Object.values(ROUTE_MAP).find(
    (r) => r.en === pathname || r.id === pathname,
  );
  if (entry) return entry[target];

  // Halaman studi kasus: slug identik di kedua bahasa (lihat §4.3 rencana utama)
  const m = pathname.match(/^\/(?:id\/proyek|projects)\/(.+)$/);
  if (m) return target === 'en' ? `/projects/${m[1]}` : `/id/proyek/${m[1]}`;

  return target === 'en' ? '/' : '/id';
}
```

**Tag `hreflang` di `BaseLayout.astro`:**

```astro
---
const lang = getLangFromUrl(Astro.url);
const alt  = getAlternatePath(Astro.url.pathname, lang === 'en' ? 'id' : 'en');
const canonical = new URL(Astro.url.pathname, Astro.site);
---
<link rel="canonical" href={canonical} />
<link rel="alternate" hreflang="en" href={new URL(lang === 'en' ? Astro.url.pathname : alt, Astro.site)} />
<link rel="alternate" hreflang="id" href={new URL(lang === 'id' ? Astro.url.pathname : alt, Astro.site)} />
<link rel="alternate" hreflang="x-default" href={new URL(lang === 'en' ? Astro.url.pathname : alt, Astro.site)} />
```

---

## 6. Pipeline PDF CV (ADR-005)

Menghilangkan *drift* web↔PDF secara struktural: keduanya lahir dari data yang sama, di build yang sama.

**Rute cetak** `src/pages/print/cv-[lang].astro` memakai `PrintLayout.astro`: tanpa navigasi, tanpa footer, tanpa toggle tema, `<meta name="robots" content="noindex, nofollow">`, dan CSS cetak khusus.

```css
/* CSS khusus cetak — A4, satu kolom, ramah ATS */
@page { size: A4; margin: 14mm 15mm; }

@media print {
  :root { --color-ink: #000; --color-surface: #fff; }
  html { font-size: 10.5pt; }
  a::after { content: ' (' attr(href) ')'; font-size: 8.5pt; color: #444; }
  a[href^='#']::after, a[href^='mailto']::after { content: ''; }
  .page-break { break-before: page; }
  h2, h3 { break-after: avoid-page; }
  li, .role { break-inside: avoid-page; }
}
```

```js
// scripts/generate-pdf.mjs — dijalankan setelah `astro build`, sebelum deploy
import { chromium } from 'playwright';
import { createServer } from 'http-server';
import { mkdir } from 'node:fs/promises';

const PORT = 4321;
const server = createServer({ root: './dist' });
server.listen(PORT);

await mkdir('./dist/cv', { recursive: true });
const browser = await chromium.launch();

for (const lang of ['en', 'id']) {
  const page = await browser.newPage();
  await page.goto(`http://localhost:${PORT}/print/cv-${lang}`, { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  await page.pdf({
    path: `./dist/cv/aditya-fauzi-${lang}.pdf`,
    format: 'A4',
    printBackground: false,      // hemat tinta & ukuran berkas
    margin: { top: '14mm', bottom: '14mm', left: '15mm', right: '15mm' },
    tagged: true,                // PDF ter-tag → aksesibel & lebih mudah diurai ATS
  });
  await page.close();
}

await browser.close();
server.close();
```

**Aturan keramahan ATS (R8):**
- Satu kolom. Tanpa tabel untuk tata letak. Tanpa teks di dalam gambar. Tanpa ikon di jalur teks.
- Heading semantik nyata (`h1`/`h2`), bukan `div` bergaya tebal.
- Nama berkas deskriptif: `aditya-fauzi-en.pdf`, bukan `cv.pdf`.
- Maksimum 2 halaman A4. Jika lebih, potong peran lama — bukan perkecil font.
- **Verifikasi wajib sebelum launch:** buka PDF, `Ctrl+A` lalu salin ke editor teks polos. Jika urutannya kacau atau ada teks hilang, ATS juga akan gagal membacanya.

---

## 7. Form Kontak (ADR-006)

Tiga lapis anti-spam, tanpa backend, tanpa penyimpanan data pribadi di pihak kita.

```astro
<form action="https://api.web3forms.com/submit" method="POST" class="space-y-lg">
  <input type="hidden" name="access_key" value={WEB3FORMS_KEY} />
  <input type="hidden" name="subject" value="Kontak baru dari website portfolio" />
  <input type="hidden" name="redirect" value={`${SITE_URL}/contact/success`} />

  <!-- Lapis 1: honeypot. Disembunyikan dari manusia & screen reader, terlihat oleh bot. -->
  <div class="absolute left-[-9999px]" aria-hidden="true">
    <label>Jangan isi kolom ini <input type="text" name="botcheck" tabindex="-1" autocomplete="off" /></label>
  </div>

  <!-- Lapis 2: time-trap. Bot mengirim dalam < 3 detik; manusia tidak. -->
  <input type="hidden" name="_t" id="form-ts" />

  <div>
    <label for="name" class="block font-semibold">Nama <span aria-hidden="true">*</span></label>
    <input id="name" name="name" type="text" required autocomplete="name"
           aria-describedby="name-err" class="w-full min-h-[44px] ..." />
    <p id="name-err" role="alert" class="text-danger text-sm"></p>
  </div>

  <div>
    <label for="email" class="block font-semibold">Email <span aria-hidden="true">*</span></label>
    <input id="email" name="email" type="email" required autocomplete="email"
           aria-describedby="email-err" class="w-full min-h-[44px] ..." />
    <p id="email-err" role="alert" class="text-danger text-sm"></p>
  </div>

  <div>
    <label for="message" class="block font-semibold">Pesan <span aria-hidden="true">*</span></label>
    <textarea id="message" name="message" rows="6" required minlength="20"
              aria-describedby="message-help"></textarea>
    <p id="message-help" class="text-ink-subtle text-sm">Minimal 20 karakter.</p>
  </div>

  <!-- Lapis 3: Cloudflare Turnstile (gratis, tanpa CAPTCHA gambar) -->
  <div class="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} data-theme="auto"></div>

  <button type="submit" class="min-h-[48px] bg-brand text-white font-semibold px-xl rounded">
    Kirim pesan
  </button>
</form>
```

**Catatan:**
- `access_key` Web3Forms memang kunci **publik** dan aman berada di HTML. Aktifkan *domain verification* di dasbor agar kunci tidak bisa dipakai dari situs lain.
- Validasi native HTML5 sebagai baseline; JavaScript hanya memperkaya pesan galat. **Form tetap berfungsi penuh tanpa JavaScript** — Turnstile menurun menjadi tantangan non-interaktif.
- Halaman `/contact/success` dan `/contact/error` memberi umpan balik jelas dan tautan kembali.
- Tanpa database milik kita → tidak ada kewajiban penyimpanan/pemrosesan data pribadi di bawah UU PDP.

---

## 8. Header Keamanan (`public/_headers`)

```
/*
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
  X-Frame-Options: DENY
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://api.web3forms.com https://cloudflareinsights.com; frame-src https://challenges.cloudflare.com; form-action https://api.web3forms.com; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; upgrade-insecure-requests

/cv/*
  Cache-Control: public, max-age=3600, must-revalidate

/_astro/*
  Cache-Control: public, max-age=31536000, immutable
```

> `'unsafe-inline'` pada `script-src` diperlukan oleh skrip tema inline (§4). Bila ingin menghapusnya, ganti dengan hash CSP yang dihitung saat build. Prioritas rendah untuk situs statis tanpa masukan pengguna.

**Verifikasi:** target skor **A atau lebih** di [securityheaders.com](https://securityheaders.com) sebagai gerbang launch.

---

## 9. CI/CD

```yaml
# .github/workflows/ci.yml
name: CI
on:
  push: { branches: [main] }
  pull_request: { branches: [main] }

# Hemat biaya & kuota: batalkan run yang sudah tertimpa push baru.
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  quality:
    runs-on: ubuntu-latest
    timeout-minutes: 12
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version-file: '.nvmrc', cache: 'pnpm' }

      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm exec astro check          # typecheck + validasi skema konten
      - run: pnpm build                     # gagal bila ada konten melanggar skema Zod

      - name: Install Chromium
        run: pnpm exec playwright install --with-deps chromium

      - run: pnpm exec playwright test      # smoke + axe-core
      - run: node scripts/generate-pdf.mjs

      - name: Pastikan PDF benar-benar terbentuk
        run: |
          test -s dist/cv/aditya-fauzi-en.pdf || { echo "::error::PDF EN tidak terbentuk"; exit 1; }
          test -s dist/cv/aditya-fauzi-id.pdf || { echo "::error::PDF ID tidak terbentuk"; exit 1; }

      - name: Lighthouse CI (gerbang performance budget)
        run: pnpm exec lhci autorun
```

```json
// lighthouserc.json — angka di sini ADALAH kontrak §6.1 rencana utama
{
  "ci": {
    "collect": {
      "staticDistDir": "./dist",
      "url": ["/", "/about", "/projects", "/projects/PLACEHOLDER_SLUG", "/id"],
      "numberOfRuns": 3,
      "settings": { "preset": "desktop", "emulatedFormFactor": "mobile" }
    },
    "assert": {
      "assertions": {
        "categories:performance":   ["error", { "minScore": 0.95 }],
        "categories:accessibility": ["error", { "minScore": 1.00 }],
        "categories:best-practices":["error", { "minScore": 0.95 }],
        "categories:seo":           ["error", { "minScore": 1.00 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 1800 }],
        "cumulative-layout-shift":  ["error", { "maxNumericValue": 0.1  }],
        "total-byte-weight":        ["error", { "maxNumericValue": 307200 }],
        "resource-summary:script:size": ["error", { "maxNumericValue": 25600 }],
        "resource-summary:stylesheet:size": ["error", { "maxNumericValue": 30720 }]
      }
    },
    "upload": { "target": "temporary-public-storage" }
  }
}
```

```yaml
# .github/workflows/scheduled.yml — higiene mingguan, ± 2 menit runner
name: Weekly hygiene
on:
  schedule: [{ cron: '0 1 * * 1' }]   # Senin 08:00 WIB
  workflow_dispatch:

jobs:
  hygiene:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Cek tautan rusak
        uses: lycheeverse/lychee-action@v2
        with: { args: '--no-progress --max-concurrency 4 https://aditya-fauzi.pages.dev' }
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - run: pnpm install --frozen-lockfile && pnpm audit --audit-level=high
```

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule: { interval: monthly }
    open-pull-requests-limit: 5
    groups:
      minor-and-patch:
        update-types: [minor, patch]   # 1 PR, bukan 20 — hemat waktu review
  - package-ecosystem: github-actions
    directory: /
    schedule: { interval: monthly }
```

**Deployment:** Cloudflare Pages terhubung langsung ke repositori GitHub.
- Build command: `pnpm build && node scripts/generate-pdf.mjs`
- Output directory: `dist`
- Production branch: `main` · Preview: setiap PR mendapat URL unik
- Variabel lingkungan: `NODE_VERSION=22`

---

## 10. Strategi Pengujian

| Lapis | Cakupan | Alat | Kapan berjalan |
| :--- | :--- | :--- | :--- |
| Validasi skema | Seluruh konten sesuai kontrak Zod | `astro check` + build | Setiap commit |
| Tipe | Nol galat TypeScript | `astro check` | Setiap commit |
| Smoke | Halaman memuat, nav berfungsi, pengalih bahasa menjaga path, `/cv/*.pdf` → 200, form ter-submit | Playwright | Setiap commit |
| Aksesibilitas | Nol violation axe pada 5 halaman × 2 tema × 2 bahasa | `@axe-core/playwright` | Setiap commit |
| Performa | Budget §6.1 | Lighthouse CI | Setiap commit |
| Tautan | Nol tautan internal/eksternal rusak | lychee | Mingguan |
| Manual | Perangkat nyata, screen reader, cetak PDF | Manusia | Sebelum launch, lalu kuartalan |

```ts
// tests/a11y.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PAGES = ['/', '/about', '/projects', '/contact', '/id'];
const THEMES = ['light', 'dark'] as const;

for (const path of PAGES) {
  for (const theme of THEMES) {
    test(`a11y: ${path} [${theme}]`, async ({ page }) => {
      await page.goto(path);
      await page.evaluate((t) => { document.documentElement.dataset.theme = t; }, theme);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(results.violations).toEqual([]);
    });
  }
}
```

**Yang sengaja TIDAK diuji:** unit test untuk komponen presentasional. Pada situs statis tanpa logika bisnis, biaya perawatannya melebihi manfaatnya — pengujian smoke + a11y + budget sudah menangkap semua regresi yang berarti. Ini keputusan cost-efficiency yang disengaja, bukan kelalaian.

---

## 11. Perintah `package.json`

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "pdf": "node scripts/generate-pdf.mjs",
    "lint": "eslint . && prettier --check .",
    "fix": "eslint . --fix && prettier --write .",
    "test": "playwright test",
    "lhci": "lhci autorun",
    "verify": "pnpm lint && pnpm build && pnpm test && pnpm lhci"
  },
  "engines": { "node": ">=22" },
  "packageManager": "pnpm@9"
}
```

> `pnpm verify` menjalankan gerbang CI yang sama secara lokal. **Jalankan ini sebelum push** — satu push tervalidasi lebih murah daripada tiga siklus CI merah.
