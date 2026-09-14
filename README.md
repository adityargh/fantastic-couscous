# Portfolio & Resume Website — Aditya Fauzi

Resume digital bilingual (EN/ID) berupa situs statis. Ringan, mudah diakses, berbiaya nol.

| | |
| :--- | :--- |
| **Status** | **Live** · `draft: false` · disetujui pemilik 14 Sep 2026 |
| **Stack** | Astro 5 · TypeScript · CSS tulis tangan · **satu dependensi runtime** |
| **Hosting** | Cloudflare Workers Static Assets (free tier) — lihat ADR-012 |
| **Bahasa** | English (default) + Bahasa Indonesia |
| **Biaya** | Rp 0 / bulan |
| **Halaman** | 21 · **beranda 10,6 KB gzip** · nol berkas CSS/JS terpisah · nol permintaan pihak ketiga |

---

## Mulai

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # astro check + build  ->  dist/
pnpm preview    # pratinjau hasil build
pnpm og         # opsional: bangkitkan ulang public/og/*.png (butuh Chromium sistem)
pnpm pdf        # bangkitkan public/cv/*.pdf (butuh Chromium sistem, nol dep npm)
```

## Status konten

Fakta di situs ini — jabatan, perusahaan, tanggal, lokasi, pendidikan — berasal dari ekspor
profil LinkedIn dan sudah terverifikasi. Kalimat pencapaian ditulis dari *cakupan jabatan*,
bukan dari angka hasil yang dilaporkan pemilik; pemilik menyetujui publikasinya pada
14 Sep 2026. Daftar penyempurnaan yang masih terbuka ada di field `_verify` dalam
`src/data.json` — itu backlog, bukan blocker.

Untuk menarik situs dari indeks sewaktu-waktu: set `"draft": true`. Seluruh halaman akan
kembali `noindex` dan `robots.txt` menolak seluruh perayapan.

## Struktur

```
src/
├── data.json            ← SUMBER KEBENARAN TUNGGAL (kedua bahasa berdampingan)
├── site.ts              ← skema Zod + validasi + i18n + helper rute & durasi
├── styles.css           ← seluruh styling: token, terang/gelap, cetak
├── Layout.astro         ← head, meta, OG, JSON-LD, header, footer, toggle tema
├── CaseStudy.astro      ← badan halaman studi kasus (dipakai 2 rute)
├── ContactState.astro   ← badan halaman sukses/galat form (dipakai 2 rute)
├── content.config.ts    ← skema studi kasus
├── content/projects/    ← <slug>.<lang>.md
└── pages/
    ├── [...lang]/       ← index, about, projects, contact, cv  (EN + ID)
    │   └── contact/     ← success, error  (noindex)
    ├── projects/[slug]  ← studi kasus EN
    ├── id/projects/[slug] ← studi kasus ID
    ├── resume.json.ts   ← ekspor JSON Resume
    ├── sitemap.xml.ts   ← sitemap + hreflang
    ├── robots.txt.ts    ← dibangkitkan, mengikuti `site` dan flag draft
    └── 404.astro
scripts/
├── og.mjs               ← OG image via Chromium sistem, nol dependensi npm
└── pdf.mjs              ← CV PDF 1 halaman, juga nol dependensi npm
```

Satu berkas `[...lang]/*.astro` melayani kedua bahasa. Rute studi kasus terpaksa eksplisit per
bahasa karena rest parameter tidak boleh diikuti parameter dinamis lain — lihat ADR-009.

## Aturan yang ditegakkan mesin

Build **gagal**, bukan sekadar memperingatkan, bila:

| Aturan | Tempat penegakan |
| :--- | :--- |
| Setiap bullet pencapaian memuat angka terukur | skema Zod di `src/site.ts` |
| Setiap angka rekam jejak memuat digit | skema Zod |
| Tidak ada persentase pada skill (skill bar = sinyal palsu) | `.strict()` menolak field tak dikenal |
| Tidak ada nomor telepon / alamat / tanggal lahir | `.strict()` — tidak ada field-nya sama sekali |
| Studi kasus menyebut indikator yang diukur (2–5) | `src/content.config.ts` |
| Deskripsi studi kasus ≤ 165 karakter | `src/content.config.ts` |
| Seluruh 26 halaman & aset benar-benar ter-generate | `.github/workflows/ci.yml` |
| Jumlah halaman EN = jumlah halaman ID | `.github/workflows/ci.yml` |
| Nol placeholder, nol tautan internal rusak | `.github/workflows/ci.yml` |
| PDF CV tidak basi terhadap `src/data.json` | `.github/workflows/ci.yml` + `cv.manifest.json` |
| CV tetap 1–2 halaman | `.github/workflows/ci.yml` |
| Nol nomor telepon / alamat rumah di keluaran | `.github/workflows/ci.yml` |

## Desain

Sistem desain **"Control Room"** — lihat ADR-010. Premisnya: profil ini milik orang yang bekerja
dengan presisi, angka, dan standar tertulis, jadi antarmukanya terasa seperti panel instrumen.

- **Rel karier**: lima peran di ASTRO sebagai satu jalur bersimpul, tanggal di gutter kiri pada layar lebar
- **Meter skill ordinal 3 langkah**, bukan bar persentase (presisi semu)
- **Angka tabular** di seluruh situs — digit tidak bergoyang antar baris
- **Toggle tema 3 status**: ikut sistem → terang → gelap
- Nol web font, nol gambar di jalur kritis, kisi hero murni CSS

**Terverifikasi otomatis, bukan diklaim:**
- Nol overflow horizontal — 10 halaman × 6 lebar (320–1024 px)
- Nol kegagalan WCAG AA — 8 halaman × 2 tema (kontras, urutan heading, nama aksesibel, target sentuh)
- CV PDF 1 halaman A4, teks dapat diseleksi (ramah ATS)

## Deploy — Cloudflare Workers (Static Assets)

Rencana awal memakai Cloudflare Pages (ADR-002); Cloudflare mengarahkan repositori
baru ke Workers, jadi ADR-012 mengikuti ke sana. Konfigurasinya ada di
[`wrangler.jsonc`](wrangler.jsonc) — tanpa `main`, karena situs ini 100% statis.

| Setelan | Nilai |
| :--- | :--- |
| Build command | `pnpm install --frozen-lockfile && pnpm build` |
| Deploy command | `npx wrangler deploy` (produksi) |
| Node version | dari `.nvmrc` (22) |
| Nama Worker | **harus sama persis** dengan `name` di `wrangler.jsonc` |
| `SITE_URL` | URL produksi final — setel sebagai variabel lingkungan build |

**Ganti domain = satu variabel lingkungan, nol suntingan kode.** Setel `SITE_URL` di
setelan build Cloudflare; canonical, hreflang, sitemap, `robots.txt`, JSON-LD, `og:image`,
dan `resume.json` semuanya mengikuti. Literal di `astro.config.mjs` hanya cadangan build lokal.

Catatan: `fantastic-couscous.pages.dev` sudah dimiliki pihak lain (diperiksa 14 Sep 2026),
jadi nama itu tidak tersedia.

## Kontak

Email publik (`contact.email`) adalah kanal utama — lihat ADR-011, yang membalik keputusan
privasi awal atas permintaan pemilik. Mengosongkan field itu menghapusnya dari seluruh
permukaan secara otomatis. Nomor telepon dan alamat rumah tetap **tidak punya field** di skema.

## Form kontak

Isi `contact.web3formsKey` di `src/data.json` dengan access key dari [web3forms.com](https://web3forms.com)
(gratis, 250 kiriman/bulan). Selama kosong, halaman kontak menampilkan pemberitahuan dan tautan
alternatif, bukan form yang rusak. Anti-spam memakai honeypot yang benar-benar ditegakkan
Web3Forms. Halaman `/contact/success` dan `/contact/error` sudah ada dan ber-`noindex`.

## Dokumentasi

| Dokumen | Isi |
| :--- | :--- |
| [PORTFOLIO_WEBSITE_PLAN.md](PORTFOLIO_WEBSITE_PLAN.md) | Rencana utama: KPI, persona, roadmap, model biaya, risk register |
| [docs/01-content-brief.md](docs/01-content-brief.md) | Template konten (sudah terisi — simpan sebagai rujukan saat memperbarui) |
| [docs/02-technical-spec.md](docs/02-technical-spec.md) | Spesifikasi teknis awal (ADR-009 & ADR-010 mengubah sebagian) |
| [docs/03-launch-checklist.md](docs/03-launch-checklist.md) | 8 gate, smoke test, runbook insiden |
| [docs/04-decision-records.md](docs/04-decision-records.md) | ADR-001…010 |
| [CLAUDE.md](CLAUDE.md) | Alur git & otomasi untuk sesi Claude Code |

## Belum dikerjakan (di luar lingkup saat ini)

Lighthouse CI · Cloudflare Web Analytics (butuh pelonggaran CSP) · `_redirects` ·
Dependabot & workflow higiene mingguan · tabel sebelum/sesudah pada studi kasus
(menunggu angka dari pemilik).

*Audit aksesibilitas dan overflow sudah berjalan sebagai harness tanpa dependensi; yang belum
adalah menjadikannya langkah CI yang memblokir merge.*
