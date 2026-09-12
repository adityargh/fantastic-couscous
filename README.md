# Portfolio & Resume Website

Resume digital bilingual (EN/ID) berupa situs statis. Dibangun untuk ringan, mudah diakses, dan berbiaya nol.

| | |
| :--- | :--- |
| **Status** | MVP berjalan · konten masih placeholder (`draft: true`) |
| **Stack** | Astro 5 · TypeScript · CSS tulis tangan · **satu dependensi runtime** |
| **Hosting** | Cloudflare Pages (free tier) |
| **Bahasa** | English (default) + Bahasa Indonesia |
| **Biaya** | Rp 0 / bulan |
| **Berat beranda** | **5,5 KB gzip** · nol berkas CSS/JS terpisah · nol permintaan pihak ketiga |

---

## Mulai

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # astro check + build  ->  dist/
pnpm preview    # pratinjau hasil build
pnpm pdf        # opsional: hasilkan dist/cv/*.pdf (butuh Chromium)
```

## Langkah berikutnya — satu blocker

**Isi `src/data.json`, lalu set `"draft": false`.**

Semua konten saat ini adalah placeholder yang ditandai `PLACEHOLDER`. Selama `draft: true`, setiap halaman otomatis `noindex` dan menampilkan banner peringatan, sehingga konten tiruan tidak mungkin terindeks karena kelalaian.

Panduan pengisiannya ada di [`docs/01-content-brief.md`](docs/01-content-brief.md). Studi kasus ditulis terpisah sebagai Markdown di `src/content/projects/`.

## Struktur

```
src/
├── data.json            ← SUMBER KEBENARAN TUNGGAL (kedua bahasa berdampingan)
├── site.ts              ← skema Zod + validasi + i18n + helper rute
├── styles.css           ← seluruh styling: token, terang/gelap, cetak
├── Layout.astro         ← head, meta, JSON-LD, header, footer, toggle tema
├── CaseStudy.astro      ← badan halaman studi kasus (dipakai 2 rute)
├── content.config.ts    ← skema studi kasus
├── content/projects/    ← <slug>.<lang>.md
└── pages/
    ├── [...lang]/       ← index, about, projects/index, contact, cv  (EN + ID)
    ├── projects/[slug]  ← studi kasus EN
    ├── id/projects/[slug] ← studi kasus ID
    ├── resume.json.ts   ← ekspor JSON Resume
    ├── sitemap.xml.ts   ← sitemap + hreflang
    └── 404.astro
```

Satu berkas `[...lang]/*.astro` melayani kedua bahasa. Rute studi kasus terpaksa eksplisit per bahasa karena rest parameter tidak boleh diikuti parameter dinamis lain — lihat ADR-009.

## Aturan yang ditegakkan mesin

Build **gagal**, bukan sekadar memperingatkan, bila:

| Aturan | Tempat penegakan |
| :--- | :--- |
| Setiap bullet pencapaian memuat angka terukur | skema Zod di `src/site.ts` |
| Setiap impact highlight memuat angka | skema Zod |
| Tidak ada persentase pada skill (skill bar = sinyal palsu) | `.strict()` menolak field tak dikenal |
| Tidak ada nomor telepon / alamat / tanggal lahir | `.strict()` — tidak ada field-nya sama sekali |
| Frontmatter studi kasus lengkap dan valid | `src/content.config.ts` |
| Halaman kunci benar-benar ter-generate | `.github/workflows/ci.yml` |

## Deploy — Cloudflare Pages

| Setelan | Nilai |
| :--- | :--- |
| Build command | `pnpm build` |
| Output directory | `dist` |
| Production branch | `main` |
| Node version | dari `.nvmrc` (22) |

Setelah domain final diketahui, perbarui `site` di `astro.config.mjs`, URL sitemap di `public/robots.txt`, dan URL cadangan di `src/Layout.astro`.

## Form kontak

Isi `contact.web3formsKey` di `src/data.json` dengan access key dari [web3forms.com](https://web3forms.com) (gratis, 250 kiriman/bulan). Selama kosong, halaman kontak menampilkan pemberitahuan dan tautan alternatif, bukan form yang rusak. Anti-spam memakai honeypot yang benar-benar ditegakkan Web3Forms.

## Dokumentasi

| Dokumen | Isi |
| :--- | :--- |
| [PORTFOLIO_WEBSITE_PLAN.md](PORTFOLIO_WEBSITE_PLAN.md) | Rencana utama: KPI, persona, roadmap, model biaya, risk register |
| [docs/01-content-brief.md](docs/01-content-brief.md) | Template konten yang harus diisi |
| [docs/02-technical-spec.md](docs/02-technical-spec.md) | Spesifikasi teknis awal (ADR-009 mengubah sebagian) |
| [docs/03-launch-checklist.md](docs/03-launch-checklist.md) | 8 gate, smoke test, runbook insiden |
| [docs/04-decision-records.md](docs/04-decision-records.md) | ADR-001…009 |
| [CLAUDE.md](CLAUDE.md) | Alur git & otomasi untuk sesi Claude Code |

## Belum dikerjakan (di luar MVP)

Playwright + axe-core + Lighthouse CI (Sprint 6) · studi kasus ketiga · OG image · `_redirects` · Cloudflare Web Analytics.
