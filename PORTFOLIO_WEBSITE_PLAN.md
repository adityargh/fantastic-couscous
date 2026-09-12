# Rencana Pembangunan Website Portfolio & Resume

| Atribut | Nilai |
| :--- | :--- |
| **Versi dokumen** | 1.0 |
| **Tanggal** | 12 September 2026 |
| **Owner** | Aditya Fauzi |
| **Status** | Approved for execution |
| **Stack** | Astro 5 + Tailwind CSS 4 (static output) |
| **Hosting** | Cloudflare Pages (free tier) |
| **Bahasa** | Bilingual — English (default) + Bahasa Indonesia |
| **Anggaran** | Rp 0 / bulan (100% free tier) |
| **Target go-live** | Sprint 7 — 8 sprint × 1 minggu (± 56 jam kerja, ± 67 jam dengan buffer) |

**Dokumen turunan:**
- [`docs/01-content-brief.md`](docs/01-content-brief.md) — brief & template konten yang harus Anda isi
- [`docs/02-technical-spec.md`](docs/02-technical-spec.md) — spesifikasi teknis, skema data, konfigurasi, CI/CD
- [`docs/03-launch-checklist.md`](docs/03-launch-checklist.md) — QA gate, go-live checklist, runbook operasional
- [`docs/04-decision-records.md`](docs/04-decision-records.md) — Architecture Decision Records (ADR-001 s/d ADR-008)

---

## 0. Ringkasan Eksekutif

Dokumen ini adalah rencana pembangunan end-to-end sebuah website portfolio yang berfungsi sebagai **resume digital utama** — bukan sekadar CV yang dipindah ke HTML, melainkan aset karier yang bekerja 24/7: dapat ditemukan lewat Google, dibaca dalam 30 detik oleh recruiter di HP, dan dibuktikan dengan studi kasus berbasis metrik.

**Prinsip yang mengikat seluruh rencana ini:**

1. **Single source of truth.** Satu berkas data terstruktur (`src/content/`) menghasilkan halaman web, PDF CV, JSON-LD untuk Google, dan ekspor JSON Resume. Tidak ada konten yang diketik dua kali — itulah sumber utama biaya pemeliharaan pada website pribadi.
2. **Cost efficiency nyata, bukan semu.** Biaya kas Rp 0/bulan permanen. Biaya sesungguhnya adalah **waktu Anda**, maka rencana ini mengoptimalkan jam kerja: total ± 56 jam sekali bangun, lalu ± 1 jam/kuartal untuk pemeliharaan.
3. **Quality gate otomatis.** Performa, aksesibilitas, tautan rusak, dan validitas konten diperiksa mesin di setiap Pull Request. Standar tidak boleh bergantung pada disiplin manual.
4. **Reuse sebelum build.** Sistem visual diturunkan dari [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) yang sudah ada di repositori ini — nol biaya desain baru, sekaligus menunjukkan konsistensi systems thinking kepada pembaca.
5. **Scope discipline.** Blog sengaja dikeluarkan dari v1. Fitur yang dibangun tapi tidak dirawat adalah liabilitas, bukan aset.

**Risiko terbesar proyek ini bukan teknis, melainkan konten.** 80% website portfolio gagal bukan karena kodenya, tapi karena pemiliknya tidak pernah menyelesaikan tulisan studi kasusnya. Karena itu Sprint 0 dikhususkan untuk konten, dan Sprint 1–6 tidak boleh dimulai sebelum Sprint 0 lulus Definition of Done.

---

## 1. Tujuan & Metrik Keberhasilan

### 1.1 Problem Statement

CV PDF bersifat pasif: hanya terlihat saat dilamar, dibatasi 1–2 halaman, tidak bisa menampilkan proses berpikir, tidak terindeks mesin pencari, dan tidak memberi sinyal apa pun ketika dibaca. Untuk profil **Operations Excellence** — yang nilainya terletak pada *bagaimana* sebuah proses dianalisis, diperbaiki, dan diukur — format satu halaman secara struktural tidak mampu menyampaikan nilai tersebut.

### 1.2 Objectives (OKR)

| # | Objective | Key Result | Target |
| :-- | :--- | :--- | :--- |
| O1 | Menjadi **rujukan profesional tunggal** yang dapat dibagikan | Satu URL menggantikan kebutuhan kirim CV manual di ≥ 80% interaksi | Sprint 7 |
| O2 | Membuktikan dampak kerja secara **kuantitatif** | ≥ 3 studi kasus lengkap dengan metrik sebelum–sesudah | Sprint 4 |
| O3 | **Ditemukan** saat nama dicari | Peringkat #1 Google untuk `"Aditya Fauzi" operations` dalam 90 hari pasca-launch | Launch + 90 hari |
| O4 | Menghasilkan **inbound** yang relevan | ≥ 5 kontak masuk berkualitas / kuartal | Launch + 90 hari |
| O5 | Operasional **nol biaya, rendah effort** | Rp 0/bulan; ≤ 1 jam pemeliharaan/kuartal | Selamanya |

### 1.3 KPI & Ambang Batas

| Kategori | Metrik | Target (wajib) | Aspirasi |
| :--- | :--- | :--- | :--- |
| Performa | Lighthouse Performance (mobile) | ≥ 95 | 100 |
| Performa | LCP (mobile, Slow 4G) | < 1,8 s | < 1,2 s |
| Performa | INP | < 200 ms | < 100 ms |
| Performa | CLS | < 0,1 | 0 |
| Performa | Berat halaman beranda (transfer) | < 300 KB | < 150 KB |
| Aksesibilitas | Lighthouse A11y + axe-core | 100 / 0 violation | — |
| Aksesibilitas | Standar | WCAG 2.2 Level AA | — |
| SEO | Lighthouse SEO | 100 | — |
| SEO | Halaman terindeks | 100% halaman kanonik | — |
| Engagement | Waktu baca median beranda | > 45 detik | > 60 detik |
| Engagement | Rasio unduh CV / pengunjung | > 8% | > 15% |
| Engagement | Konversi form kontak | > 1,5% | > 3% |
| Delivery | Durasi build | < 60 detik | < 30 detik |
| Delivery | Lead time commit → produksi | < 5 menit | < 3 menit |
| Biaya | Biaya kas bulanan | Rp 0 | Rp 0 |

### 1.4 Definition of Success

Website dinyatakan berhasil jika, 90 hari setelah launch, **ketiga** kondisi berikut terpenuhi:
1. Semua KPI wajib pada tabel 1.3 tercapai dan terverifikasi otomatis di CI;
2. Anda menggunakan URL tersebut sebagai jawaban standar atas permintaan "boleh minta CV-nya?";
3. Total biaya kas yang dikeluarkan tetap Rp 0 dan tidak ada pekerjaan pemeliharaan tak terjadwal.

---

## 2. Audiens & Perilaku Pengguna

### 2.1 Persona

| Persona | Siapa | Waktu baca | Yang dicari | Perangkat |
| :--- | :--- | :--- | :--- | :--- |
| **P1 — Recruiter / Talent Acquisition** | Screening awal, non-teknis, memproses puluhan kandidat/hari | **20–40 detik** | Jabatan saat ini, total pengalaman, industri, lokasi, ekspektasi peran, tombol unduh CV | 70% mobile |
| **P2 — Hiring Manager (Ops/SCM Lead)** | Calon atasan langsung, sangat teknis di domainnya | **3–8 menit** | Bukti dampak, metrik, skala operasi yang pernah ditangani, cara berpikir | 60% desktop |
| **P3 — Peer / Klien / Kolaborator** | Mencari partner konsultasi atau referensi | **1–3 menit** | Spesialisasi, portofolio, cara menghubungi | Campuran |
| **P4 — Mesin (Googlebot, LinkedIn, WhatsApp)** | Crawler & unfurler | **< 1 detik** | HTML semantik, JSON-LD, meta OG, sitemap | — |

### 2.2 User Journey P1 (jalur kritis)

```
LinkedIn / tanda tangan email
        │
        ▼
Beranda (mobile, 3G) ──► Harus terjawab dalam 1 layar tanpa scroll:
        │                 "Siapa dia + apa keahliannya + apa buktinya"
        │
        ├──► Klik "Download CV" ................. (target: >8%) ──► KONVERSI
        ├──► Scroll ke Impact Highlights ........ (angka besar, 5 detik)
        ├──► Buka 1 studi kasus ................. (target: >25%)
        └──► Klik kontak / LinkedIn ............. (target: >1,5%) ──► KONVERSI
```

### 2.3 Implikasi Desain (konsekuensi langsung dari 2.1–2.2)

| Temuan | Konsekuensi desain — **wajib** |
| :--- | :--- |
| P1 hanya punya 20–40 detik | Hero harus memuat nama, jabatan, spesialisasi, lokasi, dan 3 metrik unggulan **tanpa scroll** di viewport 390×844 |
| P1 mayoritas mobile 3G/4G | Zero-JS by default; tidak ada hero image berat; font system-first dengan `font-display: swap` |
| P2 mencari bukti, bukan klaim | Setiap poin pengalaman ditulis format **XYZ**: *"Accomplished [X] as measured by [Y] by doing [Z]"* |
| P1 & P2 masuk dari sumber berbeda | Navigasi datar (maksimum 1 klik dari beranda ke informasi apa pun) |
| P4 tidak menjalankan JavaScript penuh | Seluruh konten harus ada di HTML hasil build, bukan dirender klien |
| Recruiter tetap butuh berkas | PDF CV harus selalu identik dengan konten web (dibangkitkan otomatis, lihat ADR-005) |

---

## 3. Ruang Lingkup

### 3.1 In Scope — v1.0

| # | Item | Justifikasi |
| :-- | :--- | :--- |
| S1 | Beranda one-page (Hero, Impact Highlights, Experience timeline, Skills, Featured case studies, CTA) | Sesuai perilaku scan P1 — navigasi antar halaman menaikkan bounce |
| S2 | Halaman `/about` (narasi panjang, pendekatan kerja, sertifikasi, pendidikan) | Kebutuhan P2 & P3 |
| S3 | Indeks studi kasus + halaman detail per studi kasus | Pembeda utama terhadap CV biasa |
| S4 | **Download CV (PDF)** — dibangkitkan otomatis dari data yang sama, EN & ID | Fitur v1 yang Anda pilih |
| S5 | **Form kontak** tanpa backend + proteksi spam | Fitur v1 yang Anda pilih |
| S6 | **Bilingual EN/ID** dengan routing i18n dan `hreflang` | Pilihan Anda; memperluas jangkauan MNC & lokal |
| S7 | Dark mode (mengikuti preferensi sistem + toggle manual) | Biaya implementasi ± 1 jam, ekspektasi standar 2026 |
| S8 | SEO teknis lengkap: JSON-LD `Person`, sitemap, robots, canonical, OG image otomatis | Prasyarat O3 |
| S9 | Aksesibilitas WCAG 2.2 AA terverifikasi otomatis | Standar profesional; juga sinyal kualitas ke P2 |
| S10 | Analitik privasi-friendly tanpa cookie | Prasyarat O4 tanpa memicu kewajiban banner konsen |
| S11 | CI/CD dengan quality gate (lint, typecheck, a11y, Lighthouse, link check) | Menjaga standar tanpa disiplin manual |
| S12 | Halaman 404 kustom | Higienis |

### 3.2 Out of Scope — v1.0 (dan kapan ditinjau ulang)

| Item | Alasan dikeluarkan | Trigger peninjauan |
| :--- | :--- | :--- |
| **Blog / artikel** | Menuntut komitmen menulis rutin; blog terbengkalai (post terakhir 2 tahun lalu) **mengurangi** kredibilitas | Jika Anda sudah punya ≥ 3 draf artikel selesai |
| CMS (Sanity/Contentful/Decap) | Konten berubah ± 2×/tahun; overhead CMS tidak sebanding | Jika frekuensi update > 1×/bulan |
| Domain kustom | Anda memilih gratis 100% | Jika mulai melamar peran senior/eksekutif — lihat §8.3 |
| Komentar, newsletter, testimonial dinamis | Nilai rendah, biaya moderasi & privasi tinggi | Tidak direncanakan |
| Animasi berat / WebGL | Konflik langsung dengan performance budget | Tidak direncanakan |
| Autentikasi / area privat | Tidak ada kebutuhan | Jika perlu berbagi dokumen rahasia dengan klien |
| Testimonial dari atasan | Butuh koordinasi eksternal, memblokir launch | v1.1 (tambah tanpa rilis besar) |

### 3.3 Backlog v2 (terurut nilai/effort)

1. Testimonial / rekomendasi (kutipan pendek + foto + jabatan) — *effort rendah, nilai tinggi*
2. Halaman `/now` (sedang mengerjakan apa) — *sinyal aktif, effort sangat rendah*
3. Metrik "uses/toolkit" — tools operasional yang dikuasai
4. Blog dengan RSS (hanya jika trigger §3.2 terpenuhi)
5. Domain kustom + email profesional
6. Mode "recruiter" — halaman ringkas satu layar khusus untuk ditempel di lamaran

---

## 4. Arsitektur Informasi

### 4.1 Sitemap

```
/                          EN — Beranda (one-page)
├── /about                 EN — Narasi, pendekatan, pendidikan, sertifikasi
├── /projects              EN — Indeks studi kasus
│   └── /projects/[slug]   EN — Detail studi kasus
├── /contact               EN — Form kontak + kanal alternatif
│
/id/                       ID — Beranda
├── /id/tentang            ID — About
├── /id/proyek             ID — Indeks studi kasus
│   └── /id/proyek/[slug]  ID — Detail studi kasus
├── /id/kontak             ID — Kontak
│
/cv/aditya-fauzi-en.pdf    Aset dibangkitkan saat build
/cv/aditya-fauzi-id.pdf    Aset dibangkitkan saat build
/resume.json               Ekspor JSON Resume (interoperabilitas)
/og/*.png                  OG image dibangkitkan saat build
/sitemap-index.xml         Otomatis
/robots.txt                Statis
/404                       Halaman tidak ditemukan
```

**Kedalaman maksimum: 2 level.** Setiap halaman dapat dijangkau ≤ 1 klik dari beranda.

### 4.2 Struktur Beranda (urutan final, tidak boleh diubah tanpa alasan data)

| # | Seksi | Isi | Tujuan |
| :-- | :--- | :--- | :--- |
| 1 | **Hero** | Nama, jabatan, 1 kalimat positioning, lokasi, status ketersediaan, 2 CTA (Lihat studi kasus / Unduh CV) | Menjawab P1 dalam 5 detik |
| 2 | **Impact Highlights** | 3–4 angka besar (mis. *"Rp 2,1 M biaya operasional dipangkas"*, *"OTIF 87% → 96%"*) + satu baris konteks | Bukti sebelum klaim |
| 3 | **Experience** | Timeline; per peran: 3–5 bullet format XYZ, stack/tools, rentang waktu | Inti resume |
| 4 | **Core Capabilities** | Dikelompokkan per domain (Process Excellence, Supply Chain, Data & Analytics, Tools), **tanpa** bar persentase | Skill bar adalah sinyal palsu — hindari |
| 5 | **Featured Case Studies** | 3 kartu: judul, satu metrik hasil, tautan detail | Mengarahkan P2 lebih dalam |
| 6 | **Contact CTA** | Ajakan + tautan ke `/contact` + LinkedIn | Konversi |

### 4.3 Aturan URL & i18n

- **Default locale = `en` tanpa prefiks** (`/about`), **`id` dengan prefiks** (`/id/tentang`) — lihat ADR-003.
- Tidak ada redirect otomatis berbasis `Accept-Language`. Sebagai gantinya: **banner saran bahasa** yang bisa ditutup (preferensi disimpan di `localStorage`). Redirect paksa merusak crawling dan membuat pengguna bilingual frustrasi.
- Setiap halaman memuat `<link rel="alternate" hreflang="en|id|x-default">` yang saling merujuk.
- Pengalih bahasa **mempertahankan halaman yang sedang dibuka** (`/projects/abc` ⇄ `/id/proyek/abc`), tidak melempar ke beranda.
- Slug studi kasus **identik** di kedua bahasa agar pemetaan `hreflang` sederhana dan tautan lama tidak rusak.
- URL bersifat permanen. Slug yang sudah dipublikasikan hanya boleh berubah dengan redirect 301 di `_redirects`.

---

## 5. Ringkasan Keputusan Arsitektur

Rasional lengkap, alternatif yang ditolak, dan konsekuensinya ada di [`docs/04-decision-records.md`](docs/04-decision-records.md).

| ADR | Keputusan | Inti alasan |
| :--- | :--- | :--- |
| **ADR-001** | **Astro 5**, output `static` | Zero-JS by default → target LCP tercapai tanpa perjuangan; islands tersedia bila perlu interaktivitas |
| **ADR-002** | **Cloudflare Pages** (primary), GitHub Pages (mirror cadangan) | Bandwidth tak terbatas, preview per-PR, analitik gratis tanpa cookie, build gratis |
| **ADR-003** | i18n bawaan Astro; `en` default tanpa prefiks | Nol dependensi tambahan; SEO bersih |
| **ADR-004** | **Astro Content Collections + Zod** sebagai sumber kebenaran | Konten tervalidasi saat build; konten salah = build gagal, bukan halaman rusak di produksi |
| **ADR-005** | PDF CV **dibangkitkan saat build** dengan Playwright dari rute cetak khusus | Menghilangkan drift web↔PDF secara struktural, bukan lewat disiplin |
| **ADR-006** | **Web3Forms** untuk form kontak + honeypot + Cloudflare Turnstile | Gratis, tanpa backend, tanpa menyimpan data pribadi di pihak kita |
| **ADR-007** | **Cloudflare Web Analytics** | Tanpa cookie → tidak perlu banner konsen (UU PDP/GDPR); gratis |
| **ADR-008** | **Tailwind CSS 4** dengan token diturunkan dari `DESIGN_SYSTEM.md` | Reuse aset yang ada; konsistensi merek; nol biaya desain |

---

## 6. Standar Kualitas (Non-Functional Requirements)

### 6.1 Performance Budget — *ditegakkan CI, bukan imbauan*

| Sumber daya | Budget beranda | Budget halaman studi kasus | Penegakan |
| :--- | :--- | :--- | :--- |
| Total transfer | ≤ 300 KB | ≤ 450 KB | Lighthouse CI `resource-summary` |
| JavaScript | ≤ 25 KB | ≤ 25 KB | Lighthouse CI |
| CSS | ≤ 30 KB | ≤ 30 KB | Lighthouse CI |
| Font | ≤ 60 KB (maks. 2 file WOFF2, subset latin) | sama | Review manual + budget |
| Gambar | ≤ 150 KB (AVIF/WebP, `<Image />` Astro) | ≤ 300 KB | Lighthouse CI |
| Permintaan HTTP | ≤ 15 | ≤ 20 | Lighthouse CI |
| LCP / INP / CLS | < 1,8 s / < 200 ms / < 0,1 | sama | Lighthouse CI (gagal → PR diblokir) |

### 6.2 Aksesibilitas — WCAG 2.2 Level AA

Wajib, diperiksa otomatis (axe-core via Playwright) **dan** manual sekali sebelum launch:
- Rasio kontras ≥ 4,5:1 teks normal, ≥ 3:1 teks besar & komponen UI — di **kedua** tema.
- Seluruh fungsi dapat dioperasikan dengan keyboard; urutan fokus logis; `:focus-visible` terlihat jelas (bukan `outline: none`).
- Landmark semantik (`header`, `nav`, `main`, `footer`), hierarki heading tanpa lompatan level.
- Skip-to-content link sebagai elemen fokus pertama.
- Seluruh gambar bermakna punya `alt` deskriptif; gambar dekoratif `alt=""`.
- Form: `<label>` eksplisit, pesan galat terkait via `aria-describedby`, galat diumumkan ke screen reader (`role="alert"`), bukan hanya diwarnai merah.
- `prefers-reduced-motion` dihormati untuk seluruh transisi.
- Target sentuh ≥ 24×24 px (WCAG 2.2 SC 2.5.8); praktik kami ≥ 44×44 px.
- Halaman tetap berfungsi penuh tanpa JavaScript (kecuali toggle tema & Turnstile).

### 6.3 SEO Teknis

| Item | Spesifikasi |
| :--- | :--- |
| Title | `{Nama} — {Jabatan}` (beranda); `{Judul Halaman} — {Nama}` (lainnya); ≤ 60 karakter |
| Meta description | Unik per halaman, 140–160 karakter, ditulis manual (bukan auto-excerpt) |
| Canonical | Absolut, self-referencing, di setiap halaman |
| `hreflang` | `en`, `id`, `x-default` saling merujuk |
| Structured data | JSON-LD `Person` (beranda), `BreadcrumbList`, `CreativeWork`/`Article` (studi kasus) — validasi via Rich Results Test |
| OG / Twitter | OG image 1200×630 dibangkitkan saat build per halaman (`astro-og-canvas`) |
| Sitemap | `@astrojs/sitemap`, otomatis, termasuk varian i18n |
| robots.txt | Izinkan semua; tunjuk ke sitemap; blokir rute cetak `/print/*` |
| Perilaku | Tanpa konten dirender klien; tanpa redirect berbasis bahasa; URL stabil |

### 6.4 Keamanan & Privasi

| Kontrol | Implementasi |
| :--- | :--- |
| Header keamanan | `_headers` Cloudflare: CSP ketat, `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (nonaktifkan kamera/mikrofon/geolokasi) |
| HTTPS | Otomatis & wajib (Cloudflare), HSTS aktif |
| Data pribadi | **Jangan publikasikan** nomor telepon, alamat rumah, tanggal lahir, NIK, atau foto KTP. Kota + provinsi sudah cukup |
| Email | Tidak ditulis sebagai teks polos; kontak lewat form. Alternatif: alias email khusus |
| Form | Data dikirim langsung ke penyedia → inbox Anda; **tidak ada database milik kita** → tidak ada kewajiban penyimpanan data di bawah UU PDP |
| Anti-spam | Honeypot + `time-trap` + Cloudflare Turnstile (gratis) |
| Analitik | Tanpa cookie, tanpa fingerprinting, tanpa PII → **tidak butuh cookie banner** |
| Rahasia | Tidak ada secret di repo. Access key Web3Forms memang bersifat publik (`public key`) — verifikasi domain diaktifkan di dasbor penyedia |
| Rantai pasok | Dependabot mingguan; versi dependensi dikunci lewat lockfile; `pnpm audit` di CI |
| Repositori | Branch protection di `main`; wajib lulus CI sebelum merge |

### 6.5 Dukungan Browser

Dua versi terakhir Chrome, Edge, Firefox, Safari (desktop & iOS) + Samsung Internet. Tanpa polyfill IE/legacy. Progressive enhancement: tanpa JS, konten tetap terbaca 100%.

---

## 7. Roadmap Eksekusi

**Asumsi kapasitas:** ± 7 jam/minggu (di luar jam kerja), dibantu Claude Code untuk implementasi. Satu sprint = satu minggu kalender.
**Aturan mutlak:** sebuah sprint tidak boleh ditutup sebelum seluruh butir Definition of Done-nya terpenuhi. Utang di sprint awal berbunga paling mahal.

---

### Sprint 0 — Konten & Positioning `± 9 jam` 🔴 *Jalur kritis*

> Ini sprint terpenting dan yang paling sering dilewati orang. **Tidak boleh menulis satu baris kode pun sebelum sprint ini DONE.** Membangun UI tanpa konten final selalu berakhir dengan membangun ulang UI.

| # | Tugas | Output | Est. |
| :-- | :--- | :--- | :--- |
| 0.1 | Tentukan positioning statement (1 kalimat: untuk siapa, masalah apa, bukti apa) | Paragraf final | 1 j |
| 0.2 | Inventarisasi seluruh riwayat kerja & susun ulang tiap bullet ke format **XYZ** | Draf `experience` | 3 j |
| 0.3 | Kumpulkan **angka nyata**: penghematan biaya, % efisiensi, SLA, volume, ukuran tim, cakupan | Tabel metrik | 2 j |
| 0.4 | Pilih & tulis 3 studi kasus (Context → Problem → Approach → Action → Result → Learning) | 3 draf | 2 j |
| 0.5 | Siapkan aset: foto profil profesional, logo perusahaan (jika boleh dipakai) | Folder aset | 0,5 j |
| 0.6 | Terjemahkan ke bahasa kedua (tulis ulang, **jangan** terjemahan harfiah) | Draf ID + EN | 0,5 j |

**Definition of Done:** seluruh template di [`docs/01-content-brief.md`](docs/01-content-brief.md) terisi penuh; setiap bullet pengalaman memuat minimal satu angka; tidak ada placeholder `TBD` yang tersisa; angka-angka rahasia sudah disamarkan secara aman (lihat §9 R6).

---

### Sprint 1 — Fondasi & Pipeline `± 6 jam`

| # | Tugas | Est. |
| :-- | :--- | :--- |
| 1.1 | Inisialisasi proyek Astro 5 + TypeScript (mode `strict`) + Tailwind 4 + pnpm | 1 j |
| 1.2 | Terjemahkan token `DESIGN_SYSTEM.md` → CSS custom properties + tema Tailwind (light & dark) | 1,5 j |
| 1.3 | Perbaiki `.gitignore`, tambah `.editorconfig`, ESLint, Prettier, `astro check` | 0,5 j |
| 1.4 | Layout dasar: `BaseLayout`, header, footer, skip-link, toggle tema | 1,5 j |
| 1.5 | Hubungkan repo ke Cloudflare Pages; deploy "hello world" ke produksi | 0,5 j |
| 1.6 | Workflow GitHub Actions: install (cache) → lint → typecheck → build | 1 j |

**DoD:** `pnpm build` bersih; situs kosong sudah live di `*.pages.dev`; PR memicu CI **dan** preview deployment; toggle tema berfungsi dan menghormati `prefers-color-scheme`.

---

### Sprint 2 — Model Konten & Beranda `± 8 jam`

| # | Tugas | Est. |
| :-- | :--- | :--- |
| 2.1 | Definisikan skema Zod untuk `profile`, `experience`, `education`, `skills`, `projects` (lihat spesifikasi teknis §3) | 1,5 j |
| 2.2 | Migrasikan konten Sprint 0 ke content collections (EN + ID) | 1,5 j |
| 2.3 | Bangun komponen: `Hero`, `MetricCard`, `TimelineItem`, `SkillGroup`, `CaseStudyCard`, `CTASection` | 3 j |
| 2.4 | Rakit beranda sesuai urutan §4.2; responsif 360 px → 1440 px | 1,5 j |
| 2.5 | Halaman 404 | 0,5 j |

**DoD:** beranda lengkap dengan konten asli; build gagal bila ada field konten yang tidak valid; nol horizontal scroll di 360 px; Lighthouse mobile ≥ 95 di keempat kategori.

---

### Sprint 3 — Studi Kasus & Halaman About `± 7 jam`

| # | Tugas | Est. |
| :-- | :--- | :--- |
| 3.1 | Rute dinamis `/projects/[slug]` + layout studi kasus | 2 j |
| 3.2 | Halaman indeks `/projects` dengan filter berbasis tag (CSS-only, tanpa JS) | 1,5 j |
| 3.3 | Halaman `/about` | 1,5 j |
| 3.4 | Optimasi gambar (`<Image />`, AVIF/WebP, `width`/`height` eksplisit, lazy load) | 1 j |
| 3.5 | JSON-LD `Person`, `BreadcrumbList`, `CreativeWork` | 1 j |

**DoD:** 3 studi kasus live; nol CLS dari gambar; Rich Results Test lolos tanpa galat.

---

### Sprint 4 — i18n & Generator PDF CV `± 8 jam`

| # | Tugas | Est. |
| :-- | :--- | :--- |
| 4.1 | Aktifkan i18n Astro; util `useTranslations`; duplikasi rute ke `/id/*` | 2 j |
| 4.2 | Pengalih bahasa yang mempertahankan path + banner saran bahasa yang bisa ditutup | 1,5 j |
| 4.3 | Tag `hreflang` + canonical per-locale | 0,5 j |
| 4.4 | Rute cetak `/print/cv-[lang]` dengan CSS khusus cetak (A4, margin, page-break, tanpa nav) | 2 j |
| 4.5 | Skrip Playwright: render rute cetak → PDF → simpan ke `public/cv/`; jalankan di CI | 1,5 j |
| 4.6 | Ekspor `resume.json` (skema JSON Resume) dari sumber data yang sama | 0,5 j |

**DoD:** kedua bahasa lengkap dan saling tertaut benar; PDF EN & ID dibangkitkan otomatis di setiap build, ≤ 2 halaman A4, teks dapat diseleksi (bukan gambar), lolos pembacaan ATS dasar.

---

### Sprint 5 — Kontak, Analitik & Pengerasan `± 7 jam`

| # | Tugas | Est. |
| :-- | :--- | :--- |
| 5.1 | Form kontak: markup aksesibel, validasi native, honeypot, time-trap | 2 j |
| 5.2 | Integrasi Web3Forms + Cloudflare Turnstile; halaman sukses/gagal; uji end-to-end nyata | 1,5 j |
| 5.3 | Pasang Cloudflare Web Analytics + definisikan event konversi | 0,5 j |
| 5.4 | `_headers` (CSP, HSTS, dll.), `robots.txt`, `_redirects` | 1 j |
| 5.5 | Generator OG image saat build | 1 j |
| 5.6 | Sitemap + kirim ke Google Search Console & Bing Webmaster Tools | 1 j |

**DoD:** email uji benar-benar diterima; CSP aktif tanpa galat konsol; header keamanan skor A di securityheaders.com; sitemap terkirim.

---

### Sprint 6 — Quality Gate & Pengujian `± 6 jam`

| # | Tugas | Est. |
| :-- | :--- | :--- |
| 6.1 | Playwright: smoke test (navigasi, pengalih bahasa, tautan PDF 200, submit form ter-mock) | 2 j |
| 6.2 | axe-core terintegrasi Playwright pada 5 halaman kunci × 2 tema × 2 bahasa | 1,5 j |
| 6.3 | Lighthouse CI dengan assertion budget — PR gagal bila melanggar | 1,5 j |
| 6.4 | Link checker (lychee) + workflow terjadwal mingguan | 0,5 j |
| 6.5 | Aktifkan Dependabot; pasang branch protection di `main` | 0,5 j |

**DoD:** PR yang melanggar budget performa, memunculkan violation a11y, atau membawa tautan rusak **tidak bisa** di-merge. Gate berjalan otomatis tanpa intervensi.

---

### Sprint 7 — Launch `± 5 jam`

| # | Tugas | Est. |
| :-- | :--- | :--- |
| 7.1 | Tuntaskan seluruh butir [`docs/03-launch-checklist.md`](docs/03-launch-checklist.md) | 2 j |
| 7.2 | Uji lintas browser & perangkat nyata (Android + iOS) | 1 j |
| 7.3 | Proofread dua bahasa (gunakan pembaca kedua — Anda buta terhadap teks sendiri) | 1 j |
| 7.4 | Sebarkan: LinkedIn (bidang website + satu post), tanda tangan email, GitHub profil, CV PDF | 0,5 j |
| 7.5 | Tandai `v1.0.0`; aktifkan Routine review kuartalan | 0,5 j |

**DoD:** seluruh KPI wajib §1.3 terverifikasi di produksi; unfurl WhatsApp/LinkedIn tampil benar; URL sudah tersebar di seluruh kanal.

---

### Ringkasan Timeline

| Sprint | Fokus | Jam | Kumulatif |
| :--- | :--- | ---: | ---: |
| 0 | Konten & positioning | 9 | 9 |
| 1 | Fondasi & pipeline | 6 | 15 |
| 2 | Model konten & beranda | 8 | 23 |
| 3 | Studi kasus & about | 7 | 30 |
| 4 | i18n & PDF CV | 8 | 38 |
| 5 | Kontak, analitik, pengerasan | 7 | 45 |
| 6 | Quality gate | 6 | 51 |
| 7 | Launch | 5 | **56** |

> **Buffer:** angka di atas adalah estimasi *effort*, bukan janji kalender. Tambahkan buffer 20% (± 67 jam) untuk realisme. Jika waktu mepet, **jangan** potong Sprint 0 atau 6 — potong Sprint 3 menjadi 2 studi kasus dan tunda i18n ID ke v1.1 (arsitektur i18n tetap dipasang sejak awal agar tidak perlu refactor).

---

## 8. Model Biaya & Cost Efficiency

### 8.1 Biaya Kas — Rp 0 / bulan, permanen

| Komponen | Layanan | Batas free tier | Estimasi pemakaian | Biaya |
| :--- | :--- | :--- | :--- | ---: |
| Hosting & CDN | Cloudflare Pages | Bandwidth **tak terbatas**, 500 build/bulan | ± 30 build/bulan | **Rp 0** |
| Domain | `*.pages.dev` | — | 1 subdomain | **Rp 0** |
| SSL/TLS | Cloudflare | Otomatis | — | **Rp 0** |
| CI/CD | GitHub Actions | **Tak terbatas** untuk repo publik | ± 200 menit/bulan | **Rp 0** |
| Version control | GitHub | Repo publik tak terbatas | 1 repo | **Rp 0** |
| Form kontak | Web3Forms | 250 submission/bulan | < 20/bulan | **Rp 0** |
| Anti-spam | Cloudflare Turnstile | 1 juta verifikasi/bulan | < 100/bulan | **Rp 0** |
| Analitik | Cloudflare Web Analytics | Tak terbatas | — | **Rp 0** |
| Font | Sistem + 1 WOFF2 self-hosted | — | — | **Rp 0** |
| Monitoring uptime | UptimeRobot free | 50 monitor, interval 5 menit | 1 monitor | **Rp 0** |
| Search Console | Google + Bing | — | — | **Rp 0** |
| | | | **TOTAL** | **Rp 0 / bulan** |

### 8.2 Biaya Sesungguhnya — Waktu

| Fase | Jam | Nilai pada Rp 150.000/jam |
| :--- | ---: | ---: |
| Pembangunan awal (Sprint 0–7 + buffer) | ± 67 | ± Rp 10.050.000 |
| Pemeliharaan rutin (1 jam × 4 kuartal) | 4 / tahun | ± Rp 600.000 / tahun |
| Pembaruan konten besar (1× / tahun) | 3 / tahun | ± Rp 450.000 / tahun |

**Implikasi utama:** biaya nyata proyek ini 100% adalah waktu. Maka setiap keputusan dalam rencana ini dipilih untuk menekan **biaya pemeliharaan**, bukan biaya pembangunan — karena pemeliharaan berulang selamanya sedangkan pembangunan hanya sekali. Inilah alasan spesifik di balik: single source of truth (ADR-004), PDF otomatis (ADR-005), quality gate otomatis (Sprint 6), dan penolakan blog di v1.

### 8.3 Upgrade Trigger — kapan berhenti gratis

Naikkan biaya **hanya** jika salah satu kondisi terpenuhi. Jangan upgrade karena "rasanya lebih bagus".

| Trigger | Aksi | Biaya |
| :--- | :--- | ---: |
| Mulai melamar peran Manager/Head/Director | Beli domain kustom `.com` | ± Rp 180.000/tahun |
| Punya domain, ingin email profesional | Cloudflare Email Routing (forwarding) | **Rp 0** |
| Submission form > 250/bulan | Naik tier Web3Forms **atau** pindah ke Cloudflare Pages Functions + Resend | Rp 0 (Resend 3.000 email/bulan gratis) |
| Butuh A/B testing atau analitik mendalam | Evaluasi Plausible/Umami **hanya** bila keputusan nyata bergantung padanya | ± Rp 140.000/bulan |
| Repo harus privat (klausul kerahasiaan klien) | GitHub Actions jadi berbayar di atas 2.000 menit/bulan | Pantau, kemungkinan tetap Rp 0 |

### 8.4 Guardrail Free Tier (agar tidak "kaget tagihan")

1. Repositori **publik** → menit GitHub Actions tak terbatas. Jika suatu saat diprivatkan, tambahkan `concurrency.cancel-in-progress` (sudah ada dalam spesifikasi) dan batasi Lighthouse CI hanya pada PR ke `main`.
2. Batasi build Cloudflare Pages: jangan deploy setiap commit di branch kerja — hanya PR dan `main`.
3. Tidak ada layanan berbayar yang pernah dihubungkan ke kartu kredit. Semua penyedia di tabel §8.1 gratis tanpa kartu.
4. Uptime monitor memantau ketersediaan situs, bukan kuota. Kuota dicek manual saat review kuartalan (§10.1).

---

## 9. Risk Register

Skala: **P** = probabilitas, **D** = dampak (1 rendah – 5 tinggi). Skor = P × D.

| ID | Risiko | P | D | Skor | Mitigasi | Pemilik |
| :--- | :--- | :-: | :-: | :-: | :--- | :--- |
| **R1** | **Konten tidak pernah selesai** — proyek mangkrak di 70% | 4 | 5 | **20** | Sprint 0 dipisah & jadi prasyarat mutlak; template terstruktur di `docs/01-content-brief.md`; timebox 9 jam; "cukup baik lalu iterasi" > "sempurna tapi tak rilis" | Aditya |
| **R2** | **Scope creep** — tergoda menambah blog, animasi, 3D | 4 | 3 | **12** | Out-of-scope dikunci di §3.2 dengan trigger eksplisit; backlog v2 jadi tempat parkir ide | Aditya |
| **R3** | **Konten basi** — tidak diperbarui setelah pindah kerja | 4 | 3 | **12** | Routine review kuartalan otomatis (§10.1); banner "terakhir diperbarui" di footer memberi tekanan sosial | Aditya |
| **R4** | **Spam pada form kontak** | 3 | 2 | 6 | Honeypot + time-trap + Turnstile; verifikasi domain di Web3Forms | Sistem |
| **R5** | **Regresi performa** dari perubahan berikutnya | 3 | 3 | 9 | Lighthouse CI memblokir merge; budget eksplisit §6.1 | CI |
| **R6** | **Membocorkan data rahasia perusahaan** dalam studi kasus | 2 | 5 | **10** | Gunakan persentase & indeks relatif, bukan angka absolut rahasia; hindari nama klien tanpa izin; review sebelum publikasi; bila ragu — hapus | Aditya |
| **R7** | Penyedia pihak ketiga mengubah/menutup free tier | 2 | 3 | 6 | Semua vendor mudah diganti: form (Formspree/Pages Functions), analitik (Umami), hosting (GitHub Pages mirror). Tidak ada lock-in — konten tetap markdown di repo | Aditya |
| **R8** | **Penurunan skor ATS** karena PDF hasil generate | 2 | 4 | 8 | PDF pakai teks nyata (bukan gambar), heading semantik, satu kolom, tanpa tabel/ikon di jalur teks; uji dengan parser ATS gratis sebelum launch | Aditya |
| **R9** | Terjemahan ID berkualitas rendah / terasa kaku | 3 | 2 | 6 | Tulis ulang secara natural, bukan terjemahan harfiah; proofread penutur asli | Aditya |
| **R10** | Data pribadi berlebih terekspos publik | 2 | 4 | 8 | Aturan §6.4 — tanpa nomor telepon/alamat/tanggal lahir; kontak hanya lewat form | Aditya |

**Tiga risiko teratas semuanya bersifat perilaku, bukan teknis.** Rencana ini mengatasinya dengan struktur (gerbang sprint, ruang lingkup terkunci, otomasi terjadwal) — bukan dengan mengandalkan motivasi.

---

## 10. Operating Model Pasca-Launch

### 10.1 Irama Pemeliharaan

| Frekuensi | Aktivitas | Effort | Otomasi |
| :--- | :--- | ---: | :--- |
| Otomatis | Deploy saat push ke `main` | 0 | Cloudflare Pages |
| Mingguan | Link check + `pnpm audit` | 0 | GitHub Actions terjadwal |
| Bulanan | Merge PR Dependabot (setelah CI hijau) | 10 mnt | Dependabot |
| **Kuartalan** | Review konten: metrik baru, peran baru, sertifikasi baru; cek angka analitik vs KPI §1.3; verifikasi form masih mengirim email; cek kuota free tier | **60 mnt** | Pengingat terjadwal |
| Tahunan | Audit posisi: apakah positioning masih relevan? Perlu domain kustom? Perlu studi kasus baru? | 3 jam | Kalender |

### 10.2 Runbook Insiden

| Gejala | Kemungkinan penyebab | Tindakan |
| :--- | :--- | :--- |
| Situs tidak dapat diakses | Insiden Cloudflare | Cek `cloudflarestatus.com`. Jika > 30 menit, aktifkan mirror GitHub Pages (workflow sudah disiapkan, tinggal dijalankan manual) |
| Deploy gagal | Build error | Buka log Cloudflare Pages → reproduksi lokal `pnpm build` → perbaiki → push. Produksi tetap menyajikan deploy terakhir yang berhasil (tanpa downtime) |
| Form tidak mengirim email | Kuota habis / perubahan penyedia | Cek dasbor Web3Forms. Solusi sementara: ganti form dengan tautan `mailto:` (1 baris perubahan) |
| Peringkat Google turun | Perubahan algoritma / konten | Cek Search Console → Coverage & Performance. Verifikasi canonical dan `hreflang` masih benar |
| PDF kedaluwarsa vs web | Pipeline build putus | PDF dibangkitkan setiap build — jika beda, berarti job PDF gagal diam-diam. Tambahkan step assertion yang memeriksa timestamp berkas |
| Spam form membanjir | Turnstile terlewati | Naikkan level Turnstile ke "Managed"; tambah rate limit di dasbor Web3Forms |

### 10.3 Review Metrik

Setiap kuartal, bandingkan realisasi vs target §1.3 dan ambil **satu** keputusan:
- KPI tercapai → tidak ada tindakan. Jangan mengutak-atik sistem yang sehat.
- Traffic ada tapi konversi rendah → masalah CTA/konten, perbaiki copy — jangan desain ulang.
- Traffic tidak ada → masalah distribusi, bukan website. Sebarkan URL lebih luas.
- Semua stagnan 2 kuartal berturut-turut → tinjau ulang positioning (§1), bukan teknologinya.

---

## 11. Peran & Tanggung Jawab

| Peran | Pengemban | Tanggung jawab |
| :--- | :--- | :--- |
| Product Owner | Aditya | Prioritas, penerimaan hasil, keputusan go/no-go |
| Content Author | Aditya | Sprint 0, seluruh copy, akurasi metrik, proofread |
| Engineer | Claude Code + Aditya | Implementasi, pengujian, CI/CD |
| Reviewer (a11y & performa) | CI otomatis | Menegakkan §6.1 & §6.2 |
| Proofreader | Pihak ketiga (rekan/teman) | Sprint 7.3 — mata kedua wajib |

---

## 12. Langkah Berikutnya

1. Buka [`docs/01-content-brief.md`](docs/01-content-brief.md) dan isi Sprint 0. **Ini satu-satunya blocker saat ini.**
2. Setelah brief terisi, mulai Sprint 1 dengan mengikuti [`docs/02-technical-spec.md`](docs/02-technical-spec.md).
3. Jaga agar [`docs/03-launch-checklist.md`](docs/03-launch-checklist.md) tetap terbuka sejak Sprint 5 — jangan tunggu Sprint 7 untuk membacanya.

---

*Dokumen ini adalah kontrak kerja dengan diri sendiri. Perubahan ruang lingkup harus dicatat sebagai ADR baru di `docs/04-decision-records.md`, bukan diputuskan diam-diam di tengah implementasi.*
