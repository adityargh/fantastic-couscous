# 04 — Architecture Decision Records

Setiap keputusan mencatat **konteks**, **opsi yang ditolak**, dan **konsekuensi** — termasuk yang negatif. ADR yang hanya memuat alasan positif adalah pembenaran, bukan rekaman keputusan.

Format: `Status · Tanggal · Keputusan · Konteks · Alternatif · Konsekuensi`

---

## ADR-001 — Astro sebagai framework

**Status:** Diterima · 12 Sep 2026

**Keputusan:** Astro 5 dengan `output: 'static'`.

**Konteks:** Situs portofolio ini 95% konten, 5% interaktivitas (toggle tema, pengalih bahasa, validasi form). Persona utama membaca di mobile dalam 20–40 detik, sehingga LCP adalah metrik teknis paling menentukan. Anggaran hosting Rp 0.

**Alternatif yang ditolak:**

| Opsi | Alasan penolakan |
| :--- | :--- |
| **Next.js** | Mengirim runtime React (± 90 KB) untuk situs yang hampir tidak butuh interaktivitas. Bisa dioptimasi ke performa serupa, tapi butuh usaha aktif — sementara Astro memberikannya sebagai default. Kompleksitasnya baru terbayar bila ada backend/auth, yang secara eksplisit di luar ruang lingkup |
| **Hugo / Eleventy** | Performa setara atau lebih baik, tapi ekosistem komponen lebih lemah dan DX kurang nyaman untuk komponen bertipe |
| **Framer / Webflow** | Biaya berulang bertentangan dengan tujuan Rp 0; konten terkunci di platform (tanpa jalan keluar); tidak memungkinkan single source of truth untuk pipeline PDF |
| **HTML + CSS murni** | Tidak dapat diskalakan ke konten bilingual + studi kasus tanpa duplikasi masif. Biaya pemeliharaan meledak |

**Konsekuensi:**
- ✅ Nol JavaScript terkirim secara default → target LCP tercapai tanpa perjuangan
- ✅ Islands architecture tersedia bila interaktivitas dibutuhkan nanti
- ✅ Content Collections + Zod memberi validasi konten saat build
- ⚠️ Ekosistem lebih kecil dari Next.js — beberapa integrasi khusus mungkin perlu ditulis sendiri
- ⚠️ Astro merilis mayor kira-kira tahunan; upgrade perlu dianggarkan ± 2 jam/tahun

---

## ADR-002 — Cloudflare Pages sebagai hosting, GitHub Pages sebagai mirror

**Status:** Diterima · 12 Sep 2026

**Keputusan:** Cloudflare Pages untuk produksi. Workflow mirror GitHub Pages disiapkan tapi dijalankan manual, hanya untuk pemulihan bencana.

**Konteks:** Anggaran Rp 0 mutlak. Tanpa domain kustom. Butuh preview deployment per-PR agar quality gate bermakna.

**Alternatif yang ditolak:**

| Opsi | Alasan penolakan |
| :--- | :--- |
| **GitHub Pages (primary)** | Tanpa preview deployment per-PR → gerbang Lighthouse CI kehilangan sebagian nilainya; batas soft bandwidth 100 GB/bulan; tanpa analitik bawaan; URL `user.github.io/repo` menyertakan nama repositori yang tidak profesional |
| **Vercel** | Free tier baik, tapi syarat penggunaan komersialnya lebih ketat dan riwayat perubahan free tier-nya lebih sering |
| **Netlify** | Bandwidth free tier 100 GB/bulan dan build 300 menit/bulan — lebih ketat dari Cloudflare |

**Konsekuensi:**
- ✅ Bandwidth tak terbatas; jaringan edge global (latensi rendah di Indonesia)
- ✅ Preview deployment otomatis per-PR
- ✅ Cloudflare Web Analytics & Turnstile gratis di ekosistem yang sama
- ✅ Rollback satu klik ke deployment mana pun
- ⚠️ Ketergantungan pada satu vendor untuk hosting + analitik + anti-spam. Dimitigasi: situs statis murni, seluruhnya dapat dipindahkan dalam < 1 jam
- ⚠️ URL `*.pages.dev` kurang berwibawa dibanding domain kustom — lihat upgrade trigger §8.3

---

## ADR-003 — i18n bawaan Astro, `en` default tanpa prefiks

**Status:** Diterima · 12 Sep 2026

**Keputusan:** Routing i18n bawaan Astro. `en` di root (`/about`), `id` dengan prefiks (`/id/tentang`). Tanpa redirect otomatis berbasis bahasa.

**Konteks:** Audiens mencakup recruiter lokal Indonesia dan perusahaan multinasional/remote. Inggris adalah bahasa default industri untuk peluang bergaji tertinggi; Indonesia menambah jangkauan lokal.

**Alternatif yang ditolak:**

| Opsi | Alasan penolakan |
| :--- | :--- |
| **Subdomain** (`id.domain`) | Memecah otoritas domain untuk SEO; butuh konfigurasi DNS yang tidak tersedia di `*.pages.dev` |
| **Redirect otomatis via `Accept-Language`** | Merusak crawling mesin pencari; membuat frustrasi pengguna bilingual; membuat URL yang dibagikan tidak deterministik. **Anti-pattern.** Diganti banner saran yang bisa ditutup |
| **Prefiks pada kedua bahasa** (`/en/`, `/id/`) | Lebih konsisten, tapi mengorbankan URL root yang bersih untuk bahasa utama |
| **Pustaka i18n pihak ketiga** | Dependensi tambahan untuk kebutuhan yang sudah ditutupi fitur bawaan |

**Konsekuensi:**
- ✅ URL bersih untuk audiens utama; nol dependensi tambahan
- ✅ URL dapat dibagikan secara deterministik — apa yang dibagikan adalah apa yang dilihat penerima
- ⚠️ Seluruh konten harus ditulis dua kali; setiap penambahan konten berbiaya ± 1,3×
- ⚠️ Slug studi kasus dipaksa identik di kedua bahasa demi kesederhanaan pemetaan `hreflang` — slug ID jadi berbahasa Inggris. Trade-off yang diterima

---

## ADR-004 — Content Collections + Zod sebagai sumber kebenaran tunggal

**Status:** Diterima · 12 Sep 2026

**Keputusan:** Seluruh data resume disimpan di `src/content/` dengan skema Zod. Web, PDF, JSON-LD, dan ekspor JSON Resume semuanya diturunkan dari sumber ini.

**Konteks:** Penyebab utama pembusukan pada website portofolio adalah **drift** — konten web bilang X, PDF bilang Y, LinkedIn bilang Z. Setiap salinan yang dikelola manual adalah sumber ketidakkonsistenan permanen.

**Alternatif yang ditolak:**

| Opsi | Alasan penolakan |
| :--- | :--- |
| **Konten langsung di komponen `.astro`** | Tidak tervalidasi; tidak dapat digunakan ulang untuk PDF/JSON-LD; menggabungkan konten dengan presentasi |
| **CMS headless** (Sanity/Contentful/Decap) | Overhead besar untuk konten yang berubah ± 2×/tahun; menambah vendor, risiko free-tier, dan waktu muat |
| **JSON Resume sebagai format primer** | Skemanya kaku dan tidak mengakomodasi field khusus (highlight metrik, tabel sebelum/sesudah). Tetap kami ekspor sebagai format turunan untuk interoperabilitas |
| **Markdown tanpa skema** | Tanpa validasi; typo di frontmatter menghasilkan halaman rusak di produksi, bukan build gagal |

**Konsekuensi:**
- ✅ Satu tempat untuk diperbarui; seluruh keluaran ikut berubah bersamaan
- ✅ **Aturan konten ditegakkan mesin** — skema menolak bullet tanpa angka dan tidak menyediakan field persentase skill. Standar yang tidak bergantung pada disiplin manusia
- ✅ Autocomplete bertipe saat menulis komponen
- ⚠️ Perubahan skema mengharuskan migrasi seluruh berkas konten
- ⚠️ Mengedit JSON lebih tidak nyaman daripada UI CMS — dapat diterima pada frekuensi pembaruan ± 2×/tahun

---

## ADR-005 — PDF CV dibangkitkan saat build via Playwright

**Status:** Diterima · 12 Sep 2026

**Keputusan:** Rute cetak khusus (`/print/cv-[lang]`, `noindex`) dirender ke PDF oleh Playwright dalam pipeline build. PDF tidak di-commit ke git.

**Konteks:** Recruiter tetap membutuhkan berkas untuk diunggah ke ATS. CV PDF yang dikelola terpisah **dijamin** akan kedaluwarsa — bukan kemungkinan, melainkan kepastian.

**Alternatif yang ditolak:**

| Opsi | Alasan penolakan |
| :--- | :--- |
| **PDF manual dari Word/Canva, lalu diunggah** | Dijamin terjadi drift; menambah langkah manual pada setiap pembaruan; ini justru masalah yang ingin diselesaikan |
| **Print stylesheet + "Print to PDF" oleh pengguna** | Bergantung pada tindakan pengguna; hasil berbeda antar browser; recruiter tidak akan melakukannya. *(Print stylesheet tetap dibuat — sebagai lapisan tambahan, bukan pengganti)* |
| **Pustaka PDF sisi klien** (jsPDF/pdfmake) | Mengirim ratusan KB JavaScript ke setiap pengunjung demi fitur yang dipakai < 15% |
| **Layanan PDF pihak ketiga** | Biaya berulang; ketergantungan eksternal pada jalur kritis |

**Konsekuensi:**
- ✅ Drift menjadi **mustahil secara struktural** — bukan dicegah oleh disiplin, tapi oleh arsitektur
- ✅ Kedua bahasa selalu sinkron
- ✅ PDF ter-*tag* → aksesibel dan lebih mudah diurai ATS
- ⚠️ Build memerlukan Chromium (± 40 detik lebih lama di CI). Dapat diterima pada kuota Actions tak terbatas untuk repo publik
- ⚠️ Tata letak PDF butuh CSS cetak khusus dan penanganan page-break — ± 2 jam kerja sekali di Sprint 4
- ⚠️ Kesetiaan pada ATS harus diverifikasi manual sekali sebelum launch (Gate B)

---

## ADR-006 — Web3Forms + honeypot + Turnstile untuk form kontak

**Status:** Diterima · 12 Sep 2026

**Keputusan:** Form mengirim langsung ke Web3Forms, yang meneruskannya ke email. Tiga lapis anti-spam. Tidak ada backend milik kita.

**Konteks:** Butuh form kontak pada situs statis, tanpa biaya, tanpa server, dan tanpa menimbulkan kewajiban penyimpanan data pribadi.

**Alternatif yang ditolak:**

| Opsi | Alasan penolakan |
| :--- | :--- |
| **Tautan `mailto:` saja** | Rusak bagi pengguna webmail; mengekspos email ke scraper; konversi rendah. *(Tetap disiapkan sebagai fallback darurat)* |
| **Formspree** | Free tier hanya 50 submission/bulan vs 250 di Web3Forms |
| **Cloudflare Pages Functions + Resend** | Lebih terkontrol, tapi menambah kode serverless untuk dirawat. Dicatat sebagai jalur migrasi bila kuota terlampaui |
| **Google Forms tertanam** | Merusak konsistensi visual; iframe berat; terasa tidak profesional |

**Konsekuensi:**
- ✅ Nol backend, nol biaya, nol data pribadi yang kita simpan → tidak ada kewajiban penyimpanan di bawah UU PDP
- ✅ Turnstile jauh lebih ramah aksesibilitas daripada CAPTCHA berbasis gambar
- ⚠️ Ketergantungan pihak ketiga pada jalur konversi utama — dipantau di review kuartalan
- ⚠️ Batas 250/bulan; jika terlampaui, jalur migrasi sudah didokumentasikan (§8.3 rencana utama)

---

## ADR-007 — Cloudflare Web Analytics

**Status:** Diterima · 12 Sep 2026

**Keputusan:** Cloudflare Web Analytics. Tanpa Google Analytics.

**Konteks:** Perlu memverifikasi KPI §1.3 (unduhan CV, konversi kontak, waktu di halaman) tanpa biaya dan tanpa merusak performa atau privasi.

**Alternatif yang ditolak:**

| Opsi | Alasan penolakan |
| :--- | :--- |
| **Google Analytics 4** | Gratis tapi berbiaya: ± 45 KB JavaScript, memakai cookie (memicu kewajiban banner konsen), UI kompleks untuk kebutuhan sederhana, dan menaruh data pengunjung di ekosistem periklanan |
| **Plausible / Fathom** | Produk sangat baik, tapi ± Rp 140.000/bulan — melanggar batasan Rp 0 |
| **Umami self-hosted** | Gratis secara lisensi, tapi butuh database + hosting → biaya tersembunyi dan pemeliharaan |
| **Tanpa analitik sama sekali** | O4 (menghasilkan inbound) tidak akan dapat diverifikasi |

**Konsekuensi:**
- ✅ Tanpa cookie → **tidak perlu banner konsen** → nol friksi bagi pengunjung
- ✅ Overhead skrip dapat diabaikan; tidak mengganggu budget performa
- ✅ Gratis tanpa batas kunjungan
- ⚠️ Metrik lebih dangkal dari GA4 (tanpa funnel, tanpa kohor). **Dinilai memadai** — keputusan yang akan diambil dari data ini hanya berupa "perbaiki copy" atau "perluas distribusi", dan itu tidak menuntut analitik mendalam

---

## ADR-008 — Token desain diturunkan dari `DESIGN_SYSTEM.md`

**Status:** Diterima · 12 Sep 2026

**Keputusan:** Menggunakan kembali palet warna, skala spasi 4 pt, dan pilihan tipografi dari `DESIGN_SYSTEM.md` yang sudah ada di repositori ini, dengan tiga adaptasi yang didokumentasikan.

**Konteks:** Repositori sudah memuat sistem desain matang untuk aplikasi operasional gudang. Membuat bahasa visual baru dari nol berarti biaya desain tanpa manfaat yang jelas.

**Adaptasi yang diterapkan:**

| Perubahan | Alasan |
| :--- | :--- |
| Ukuran teks dasar 14 px → 17 px; line-height 1,5 → 1,65 | Aplikasi gudang dioptimasi untuk kepadatan data; halaman portofolio untuk kenyamanan baca |
| Spasi antar-seksi diperbesar (`xxl`+) | Ruang putih menandakan kualitas pada konteks pemasaran diri |
| **Info Cyan `#00BFFF` → `#0B6E99` untuk teks** | Nilai asli hanya ± 2,1:1 di atas putih — **gagal WCAG AA**. Ini cacat aksesibilitas nyata pada sistem desain asal, dan layak diperbaiki di hulu |
| Ditambahkan palet dark mode | Sistem asal hanya menyebut dark mode sebagai rencana; di sini dipetakan penuh dengan biru yang dicerahkan agar tetap ≥ 4,5:1 |

**Alternatif yang ditolak:**

| Opsi | Alasan penolakan |
| :--- | :--- |
| Sistem desain baru dari nol | Biaya ± 6 jam tanpa manfaat yang dapat dibuktikan |
| Tema Tailwind default | Generik; tidak memberi identitas yang membedakan |
| Membeli template UI premium | Melanggar batasan Rp 0; menambah CSS yang tidak terpakai |

**Konsekuensi:**
- ✅ Nol biaya desain; identitas visual konsisten lintas aset
- ✅ Menunjukkan systems thinking kepada pembaca — situsnya sendiri menjadi bukti pendekatan kerja
- ✅ Cacat kontras ditemukan dan diperbaiki di hilir; harus dilaporkan balik ke `DESIGN_SYSTEM.md`
- ⚠️ Palet asal dirancang untuk UI padat data; membutuhkan disiplin agar tidak terasa seperti dashboard admin — dimitigasi lewat spasi yang lebih lapang dan skala tipografi yang lebih besar

---

## ADR-009 — Kompaksi MVP: nol integrasi, nol dependensi runtime

**Status:** Diterima · 12 Sep 2026 · Menggantikan sebagian ADR-003, ADR-005 dan ADR-008

**Keputusan:** MVP dibangun dengan satu dependensi runtime (`astro`), tanpa integrasi Astro, tanpa framework CSS, tanpa web font, dan tanpa gambar.

**Konteks:** Pemilik repositori meminta MVP dengan pola pikir hemat direktori/berkas dan hemat energi, sehingga menghasilkan situs yang ringan, mudah diakses, dan fleksibel. Spesifikasi teknis awal (`docs/02-technical-spec.md`) merancang struktur yang lebih konvensional — Tailwind, `@astrojs/sitemap`, `src/components/{layout,sections,ui}`, `src/i18n/`, `src/content/` untuk seluruh data. Untuk situs berisi 15 halaman, struktur itu menambah berkas tanpa menambah kejelasan.

**Perubahan yang diterapkan:**

| # | Keputusan | Menggantikan | Alasan |
| :-- | :--- | :--- | :--- |
| 1 | Tailwind dihapus; satu berkas `src/styles.css` ditulis tangan | ADR-008 (bagian Tailwind; turunan token tetap berlaku) | Menghapus satu dependensi dan satu build step. Keluarannya lebih kecil daripada Tailwind yang sudah ter-purge |
| 2 | Nol integrasi Astro; `sitemap.xml` ditulis tangan (±30 baris) | — | Lebih kecil daripada `@astrojs/sitemap`, dan memberi kendali penuh atas `hreflang` |
| 3 | Rute `[...lang]` melayani kedua bahasa dari satu berkas; ID memakai slug Inggris (`/id/about`, bukan `/id/tentang`) | ADR-003 (bagian slug terjemahan) | Memangkas jumlah berkas halaman setengahnya dan menyederhanakan pemetaan `hreflang` |
| 4 | Seluruh data resume di satu `src/data.json` berisi kedua bahasa berdampingan, divalidasi Zod di `src/site.ts` | ADR-004 (bentuk penyimpanan; prinsipnya tetap) | Prinsip sumber kebenaran tunggal dan validasi saat build dipertahankan tanpa pohon `src/content/`. Bahasa yang berdampingan justru **menurunkan** risiko drift terjemahan |
| 5 | Nol web font — hanya font sistem | Spesifikasi teknis §4 (1 berkas WOFF2) | Menghemat ±60 KB dan satu permintaan jaringan pada setiap kunjungan pertama |
| 6 | Nol gambar — monogram inisial dari CSS, favicon SVG 230 byte | — | Foto profil bersifat opsional dan dapat ditambahkan nanti; baseline-nya nol byte gambar |
| 7 | CSS disisipkan ke dalam HTML (`inlineStylesheets: 'always'`) | — | Menghapus satu round-trip render-blocking. Hasilnya satu halaman = satu permintaan HTTP |
| 8 | CV: rute cetak `/cv` dari data yang sama; Playwright tidak lagi berjalan di setiap build | ADR-005 (bagian "setiap build") | Jaminan anti-drift tetap utuh karena `/cv` dibangkitkan dari sumber data yang sama. Menghapus unduhan Chromium ±130 MB dari pipeline. `pnpm pdf` tetap tersedia bila ingin berkas `.pdf` yang dihosting |
| 9 | Flag `draft` di `data.json` memaksa `noindex` dan memunculkan banner | — | Konten placeholder tidak akan pernah terindeks karena kelalaian |
| 10 | Turnstile dilepas; anti-spam mengandalkan honeypot yang benar-benar ditegakkan Web3Forms | ADR-006 (bagian Turnstile) | Menghapus skrip pihak ketiga, mengencangkan CSP, dan menghilangkan hambatan aksesibilitas. Turnstile dapat ditambahkan bila spam benar-benar muncul |

**Dua jebakan yang ditemukan saat implementasi — dicatat agar tidak terulang:**

1. **Rest parameter tidak boleh diikuti parameter dinamis lain.** `[...lang]/projects/[slug].astro` ter-build tanpa galat tetapi **diam-diam membuang seluruh halaman ID**. Rute studi kasus karena itu ditulis eksplisit per bahasa (`projects/[slug].astro` dan `id/projects/[slug].astro`), keduanya pembungkus tipis di atas `src/CaseStudy.astro`.
2. **`generateId` bawaan glob loader memotong nama berkas pada titik PERTAMA.** `cycle-time.en.md` dan `cycle-time.id.md` menghasilkan id yang sama, sehingga entri kedua tertimpa tanpa peringatan. Diperbaiki dengan `generateId` eksplisit di `src/content.config.ts`.

**Konsekuensi:**
- ✅ Beranda **5,5 KB gzip**, nol berkas CSS/JS terpisah, nol permintaan pihak ketiga — satu halaman = satu permintaan HTTP
- ✅ Nol scroll horizontal terverifikasi pada 320/360/390/768 px di seluruh halaman
- ✅ `/cv` mencetak satu halaman A4 dengan teks nyata yang dapat diseleksi (ramah ATS)
- ✅ Permukaan dependensi sangat kecil: satu paket runtime, sehingga audit keamanan dan upgrade jadi murah
- ⚠️ CSS ditulis tangan berarti tidak ada jaring pengaman utilitas; penambahan komponen menuntut disiplin agar `styles.css` tidak membengkak
- ⚠️ CSS yang di-inline terkirim ulang pada setiap halaman. Trade-off yang diterima karena mayoritas pengunjung hanya membuka satu-dua halaman; tinjau ulang bila situs tumbuh melewati ±10 halaman konten
- ⚠️ Slug ID berbahasa Inggris sedikit kurang natural bagi pembaca Indonesia
- ⚠️ **Ditunda ke luar MVP:** rangkaian uji Playwright + axe-core + Lighthouse CI (Sprint 6), studi kasus ketiga, OG image, dan `_redirects`. CI saat ini menjalankan `astro check` + build + verifikasi keberadaan halaman kunci

---

## ADR-010 — Konten nyata, model metrik jujur, dan revamp UI/UX

**Status:** Diterima · 14 Sep 2026 · Melengkapi ADR-008 dan ADR-009

**Keputusan:** Situs diisi dengan konten nyata dari ekspor profil LinkedIn pemilik (khusus masa kerja di ASTRO), model data diubah agar bisa jujur tentang angka yang belum terverifikasi, dan seluruh antarmuka dirancang ulang.

**Konteks:** MVP sebelumnya seluruhnya placeholder. Pemilik menyediakan ekspor PDF profil LinkedIn sebagai modal konten, meminta hanya pengalaman ASTRO yang diambil, dan meminta revamp menyeluruh UI/UX serta desain interaksinya.

### 1. Sumber konten dan batas kejujuran

Yang **terverifikasi** dari ekspor LinkedIn dan dipakai apa adanya: nama, jabatan, perusahaan, tanggal mulai/selesai tiap peran, lokasi, pendidikan, dan top skills. Lima peran di ASTRO (Sep 2022 – sekarang, 4 tahun 1 bulan) dipakai; delapan perusahaan lain sengaja tidak ditampilkan atas permintaan pemilik.

Yang **tidak ada** di sumber: angka hasil (persentase perbaikan, penghematan, throughput). Angka semacam itu **tidak dikarang**. Konsekuensinya pada model data:

| Aturan lama | Aturan baru | Alasan |
| :--- | :--- | :--- |
| Bullet pencapaian wajib memuat angka | Tetap — tetapi angkanya diambil dari fakta struktural yang bisa diverifikasi (durasi, jumlah peran, jumlah lokasi) | Aturannya sehat; yang salah adalah memaksanya dipenuhi dengan angka karangan |
| Seksi "Impact in numbers" | Diganti "Track record in numbers" / "Rekam jejak dalam angka" | Label lama menjanjikan dampak; isinya rekam jejak. Menyesuaikan label lebih jujur daripada menyesuaikan isi |
| `metrics` studi kasus wajib | `metrics` menjadi **opsional**; ditambah `measured` yang **wajib** (2–5 indikator) | Menyebut indikator yang Anda kemudikan adalah sinyal kompetensi operasional yang nyata, dan tidak menuntut angka yang mungkin rahasia perusahaan. Tabel sebelum/sesudah muncul otomatis begitu angkanya diisi |
| Banner draft: "konten masih placeholder" | "angka menunggu verifikasi pemilik" | Tidak ada lagi placeholder; yang tersisa adalah verifikasi |

Daftar hal yang menunggu verifikasi pemilik tercatat di `_verify` dalam `src/data.json`.

### 2. Perubahan skema

| # | Perubahan | Alasan |
| :-- | :--- | :--- |
| 1 | `headline` tetap dibatasi 80 karakter dan diisi **jabatan nyata**; pilar keahlian pindah ke `disciplines[]` | Headline LinkedIn pemilik (103 karakter, lima pilar dipisah pipa) akan membuat `<title>` sepanjang 120 karakter dan terpotong Google. Pilar itu kini tampil sebagai chip di hero dan `keywords` di JSON Resume — seluruh isinya tetap terbaca |
| 2 | `skills[].note` opsional | Satu kalimat prinsip per domain memberi suara pada daftar yang biasanya datar |
| 3 | `education[].period` opsional | Rentang tahun lebih informatif daripada tahun lulus saja |
| 4 | Helper `tenures()`, `monthsBetween()`, `durationLabel()` | Lima peran di satu perusahaan adalah sinyal karier terkuat di profil ini. Mengelompokkannya jadi satu jalur menuntut perhitungan durasi — dihitung dari tanggal, tidak pernah diketik manual, sehingga tidak bisa basi |

### 3. Revamp UI/UX — "Control Room"

Premisnya: profil ini milik orang yang bekerja dengan presisi, angka, dan standar tertulis. Antarmukanya harus terasa seperti panel instrumen, bukan brosur agensi.

| Elemen | Keputusan | Alasan desain interaksi |
| :--- | :--- | :--- |
| **Rel karier** | Lima peran ditampilkan sebagai satu rel vertikal bersimpul di bawah satu blok perusahaan, bukan lima kartu terpisah. Pada ≥920 px tanggal pindah ke gutter kiri | Kenaikan jenjang terbaca sebagai satu jalur dalam sekali pandang. Kolom tanggal yang sejajar bisa dipindai sendiri tanpa membaca isinya |
| **Meter tingkat skill** | Tiga titik ordinal, bukan bar persentase | Bar persentase adalah presisi semu — "SQL 78%" tidak berarti apa pun. Tiga langkah jujur soal kekasarannya. Tingkat juga diumumkan ke screen reader sebagai teks |
| **Angka tabular** | `font-variant-numeric: tabular-nums` pada seluruh angka | Situs tentang pengukuran tidak boleh punya digit yang bergoyang antar baris |
| **Toggle tema 3 status** | Ikut sistem → terang → gelap | Biner memaksa pengguna memilih; "ikut sistem" adalah default yang benar dan harus bisa dikembalikan |
| **Latar kisi hero** | Dua gradien CSS bertopeng radial | Nol byte gambar, memberi tekstur "cetak biru" yang sesuai domain |
| **Halaman hasil form** | `/contact/success` dan `/contact/error`, keduanya `noindex` | Form tanpa halaman hasil membuat pengirim menebak-nebak apakah pesannya sampai |
| **Daftar isi studi kasus** | Sticky pada ≥1000 px, dibangkitkan dari heading | Studi kasus 700–900 kata butuh orientasi; dibangkitkan otomatis agar tidak pernah tidak sinkron |

### 4. OG image di-commit, bukan dibangkitkan saat build

Dibangkitkan lewat `scripts/og.mjs` memakai Chromium sistem **tanpa satu pun dependensi npm**, lalu hasilnya di-commit (dua PNG, ±58 KB). Kartunya hanya berubah saat nama, jabatan, atau positioning berubah — beberapa kali seumur situs. Memasang Chromium ±130 MB pada setiap deploy demi berkas yang nyaris tak pernah berubah adalah biaya tanpa hasil.

Skrip ini mengukur sendiri kompensasi bingkai jendela Chrome headless (`--window-size` bukan ukuran viewport; selisihnya 87 px di lingkungan CI ini) dan memotong baris bawah PNG-nya. Memangkas baris TERAKHIR tidak menuntut penyaringan ulang, sehingga pemotongnya muat dalam ±40 baris `node:zlib`.

### 5. Penjaga CI diperkuat

ADR-009 mencatat jebakan nyata: rute yang salah bentuk membuang **seluruh** halaman bahasa Indonesia tanpa galat. Penjaga CI saat itu tidak menutupnya — daftar assertion-nya melewatkan seluruh halaman studi kasus dan rute ID untuk `projects` dan `contact`. Kini CI memeriksa 26 berkas secara eksplisit, **plus** paritas jumlah halaman EN vs ID, nol placeholder, dan nol tautan internal rusak. Paritas adalah invarian struktural: ia menangkap halaman baru yang lupa dibuatkan pasangannya, tanpa perlu daftar diperbarui tiap kali.

### 6. URL produksi disatukan

Sebelumnya tersebar di 6 tempat. Kini: `site` di `astro.config.mjs` sebagai sumber kebenaran, `FALLBACK_SITE` di `src/site.ts` sebagai satu-satunya cadangan, dan `robots.txt` **dibangkitkan** (bukan statis) sehingga URL sitemap-nya ikut otomatis. Ganti domain = 2 suntingan, bukan 6.

**Konsekuensi:**
- ✅ Nol placeholder; seluruh fakta dapat ditelusuri ke ekspor LinkedIn
- ✅ Nol overflow horizontal terverifikasi otomatis pada 8 halaman × 6 lebar (320–1024 px)
- ✅ Data privat (alamat, nomor telepon, email pribadi) tidak pernah masuk repositori — skema `.strict()` tidak menyediakan field-nya
- ✅ OG image nyata, `summary_large_image`, unfurl tidak lagi polos
- ⚠️ Beranda naik dari 5,5 KB → **10,6 KB gzip**. Penyebabnya CSS sistem desain yang di-inline plus konten nyata yang jauh lebih banyak (5 peran berikut bullet, 5 domain skill, 3 kartu studi kasus). Masih 3,5% dari budget 300 KB
- ⚠️ Studi kasus belum punya tabel sebelum/sesudah sampai pemilik memberi angka yang boleh dipublikasikan
- ⚠️ `draft: true` dipertahankan: konten ditulis dari catatan karier pemilik dan harus dibaca ulang olehnya sebelum diindeks

---

## ADR-011 — Email publik, CV satu halaman, dan pengerasan aksesibilitas

**Status:** Diterima · 14 Sep 2026 · Membalik sebagian docs/01 §H · Melengkapi ADR-005/009/010

### 1. Email ditampilkan publik — membalik keputusan awal

Rencana awal (`docs/01-content-brief.md` §H, rencana utama §6.4) menetapkan email **tidak** tampil publik; kontak hanya lewat form. Pemilik membalik keputusan itu secara eksplisit.

| | |
| :--- | :--- |
| **Alasan** | Form kontak bergantung pada penyedia pihak ketiga yang kuncinya belum disetel. Email langsung bekerja hari ini, tanpa perantara, tanpa kuota, dan tanpa titik gagal |
| **Biaya yang diterima** | Alamat dalam `mailto:` terbuka dapat dipanen bot. Filter spam modern menanggung sebagian besar bebannya; ini pertukaran sadar, bukan kelalaian |
| **Ruang lingkup** | Email saja. Nomor telepon, alamat rumah, dan tanggal lahir tetap TIDAK punya field di skema — `.strict()` akan menggagalkan build bila ada yang mencoba menambahkannya |
| **Cara membalik** | Kosongkan `contact.email` di `src/data.json`. Seluruh permukaan (halaman kontak, footer, CV, JSON-LD, resume.json) menghilangkannya secara otomatis |

CI kini punya penjaga eksplisit: nol nomor telepon dan nol pola alamat rumah di `dist/`, dengan email sengaja dikecualikan.

### 2. CV PDF: 3 halaman → 1 halaman

Versi sebelumnya mewarisi ritme layar ke kertas — leading 1,65; gutter tanggal 150 px; jarak antar-seksi 48 px; lebar baca dibatasi 66ch sehingga separuh kanan kertas kosong. Hasilnya 3 halaman untuk karier 4 tahun.

Blok `@media print` ditulis ulang sepenuhnya: basis 9,4pt/1,34, gutter tanggal 92pt, jarak seksi 10pt, dan seluruh batas lebar baca dilepas. Di kertas, **kepadatan adalah keterbacaan** — recruiter memindai, bukan membaca. Aturan `break-inside: avoid` menjaga tidak ada peran terpotong antar-halaman bila konten bertambah.

### 3. Pipeline PDF: nol dependensi npm, hasil di-commit, anti-drift lewat manifest

| Keputusan | Menggantikan | Alasan |
| :--- | :--- | :--- |
| Chromium sistem via `--print-to-pdf` | Playwright (ADR-005) | Menghapus dependensi ±130 MB. Pola yang sama dengan `scripts/og.mjs` |
| Render dari `file://`, bukan server HTTP lokal | server sementara | CSS sudah ter-inline, jadi hasilnya identik. Server lokal membuat Chrome menggantung >60 detik karena ia merutekan `localhost` lewat `http_proxy` dari environment; `--no-proxy-server` kini juga dipasang |
| PDF di-commit ke `public/cv/` | `.gitignore` | Dua berkas ±82 KB yang berubah beberapa kali seumur situs. Cloudflare Pages tidak menyediakan Chromium saat build, jadi membangkitkannya di sana bukan pilihan |
| `cv.manifest.json` menyimpan sidik jari `src/data.json` | — | Mengembalikan jaminan anti-drift yang hilang saat PDF berhenti dibangkitkan tiap build. CI menolak PDF yang isinya tidak lagi cocok dengan sumber data, dan menolak CV di luar batas 1–2 halaman |

Catatan: manifest sengaja hanya menyidik `src/data.json`. Perubahan tata letak murni (CSS) tidak memaksa regenerasi — yang berbahaya adalah PDF yang **isinya** berbeda dari web, bukan yang jaraknya bergeser beberapa poin.

### 4. Aksesibilitas: audit otomatis menemukan 124 kegagalan kontras

Audit ditulis sendiri (nol dependensi) dan dijalankan pada 8 halaman × 2 tema, memeriksa rasio kontras terhitung, urutan heading, nama aksesibel, target sentuh, dan atribut `alt`.

**Temuan:** 124 kegagalan WCAG AA, **seluruhnya di tema terang**, dan semuanya berpangkal pada satu token: `--ink-3: #6b7c93` menghasilkan 3,93:1 di atas `--ground` dan 4,26:1 di atas `--surface` — keduanya di bawah ambang 4,5:1. Token itu dipakai pada hampir semua teks sekunder: eyebrow, tanggal, lokasi peran, catatan domain, konteks kartu angka, dan heading footer.

| Perbaikan | Nilai | Hasil |
| :--- | :--- | :--- |
| `--ink-3` | `#6b7c93` → `#5c6a7e` | 4,56:1 pada latar terang tergelap; 5,50:1 pada putih |
| `--warn` | `#a16207` → `#9d5f07` | 4,63:1 pada `--warn-tint` (sebelumnya 4,42:1) |
| Heading footer | `h3` → `h2` | Menghapus lompatan h1→h3 di halaman pendek |
| Judul kartu di halaman daftar | `h3` → `h2` | Halaman itu tidak punya `h2` induk |

Audit ulang: **nol temuan.**

**Dua jebakan alat ukur — dicatat agar tidak terulang:**

1. **`color-mix()` dikomputasi sebagai `color(srgb 0.95 …)`, skala 0–1, bukan 0–255.** Parser yang membacanya sebagai 0–255 menganggap setiap latar di dalam header sticky hitam pekat, dan melahirkan puluhan kegagalan palsu. Alat ukur yang salah lebih berbahaya daripada tidak mengukur: ia mengarahkan perbaikan ke tempat yang benar-benar tidak bermasalah.
2. **Mengubah `data-theme` setelah halaman dimuat tidak memicu style recalc di Chrome headless bervirtual-time.** Sebagian nilai terbaca tema terang, sebagian tema gelap, dan hasilnya mustahil (tombol primer dilaporkan 1,17:1). Tema harus ditanam di HTML **sebelum** dimuat — sama seperti harness screenshot.

### 5. Perbaikan interaksi lain

- Halaman kontak: email jadi kanal utama dengan tombol **salin alamat**, yang hanya muncul bila `navigator.clipboard` benar-benar ada — tombol mati lebih buruk daripada tidak ada tombol. Status salin diumumkan lewat `role="status"`
- Tombol **Unduh PDF** di halaman CV bekerja tanpa JavaScript; tombol **Simpan sebagai PDF** (yang memanggil `window.print()`) baru muncul bila JS hidup
- Judul form disederhanakan; kartu email dan kartu form berdampingan pada layar lebar, menumpuk di ponsel

**Konsekuensi:**
- ✅ CV 1 halaman A4, teks nyata dan dapat diseleksi (ramah ATS), EN dan ID
- ✅ Nol kegagalan WCAG AA pada 8 halaman × 2 tema
- ✅ Nol overflow horizontal pada 10 halaman × 6 lebar (320–1024 px)
- ✅ Nol dependensi npm bertambah — `astro` tetap satu-satunya dependensi runtime
- ⚠️ Email publik dapat dipanen bot; pertukaran yang diterima secara sadar
- ⚠️ PDF harus dibangkitkan ulang (`pnpm build && pnpm pdf`) setiap kali `src/data.json` berubah; CI akan menolak bila lupa

---

## ADR-012 — Cloudflare Workers Static Assets, bukan Pages

**Status:** Diterima · 14 Sep 2026 · Menggantikan ADR-002 (bagian platform)

**Keputusan:** Situs di-deploy sebagai Worker beraset statis (`wrangler.jsonc` + `assets.directory`), bukan proyek Cloudflare Pages.

**Konteks:** ADR-002 memilih Cloudflare Pages. Ketika repositori benar-benar dihubungkan, Cloudflare mengarahkannya ke Workers dan menjalankan `npx wrangler versions upload` sebagai perintah deploy. Build **berhasil** (21 halaman, `astro check` 0/0/0) lalu deploy gagal:

```
✘ [ERROR] Missing entry-point to Worker script or to assets directory
```

Perintah itu menuntut berkas konfigurasi; repositori tidak punya. Kegagalan ini terjadi dua kali berturut-turut sebelum akar masalahnya ditemukan.

**Mengapa mengikuti, bukan melawan:** Pages kini berstatus pemeliharaan di Cloudflare dan Workers Static Assets adalah jalur yang dikembangkan. Memaksa kembali ke Pages berarti memilih platform yang menyusut demi menghindari satu berkas konfigurasi.

**Yang dipasang — `wrangler.jsonc`:**

| Field | Nilai | Alasan |
| :--- | :--- | :--- |
| *(tanpa `main`)* | — | Situs 100% statis. Worker-nya hanya menyajikan aset; nol baris kode server, sehingga permukaan serangan dan biaya CPU tetap nol |
| `name` | `aditya-fauzi` | **Harus sama persis dengan nama Worker di dasbor.** Kalau berbeda, wrangler akan men-deploy ke Worker lain |
| `assets.directory` | `./dist` | Keluaran build Astro |
| `assets.html_handling` | `auto-trailing-slash` | Menyajikan `dist/about/index.html` di `/about` dan mengalihkan `/about/` ke `/about` — cocok dengan canonical situs ini (tanpa garis miring akhir), jadi perayap tidak menemui rantai redirect |
| `assets.not_found_handling` | `404-page` | URL tak dikenal menyajikan 404 kustom, bukan 404 telanjang |

`public/_headers` tetap berlaku: Workers Static Assets membacanya dari direktori aset, sehingga CSP, HSTS, dan aturan cache ikut terbawa tanpa perubahan.

Divalidasi dengan wrangler asli sebelum dikirim: `wrangler deploy --dry-run` membaca 51 entri dari `./dist` tanpa galat (31 berkas + 20 varian rute `index.html` dari `auto-trailing-slash`).

**URL produksi kini dari variabel lingkungan**

Konsekuensi pindah platform: domain default bukan lagi `*.pages.dev`, melainkan `<worker>.<subdomain>.workers.dev` — dan subdomain akun itu tidak dapat diketahui dari repositori.

Karena satu nilai ini merembes ke canonical, hreflang, sitemap, `robots.txt`, JSON-LD, `og:image`, dan `resume.json` — salah satu berarti salah semua — `site` di `astro.config.mjs` kini membaca `process.env.SITE_URL` lebih dulu, dengan literal sebagai cadangan build lokal. Pindah domain menjadi **satu setelan di dasbor, nol suntingan kode**.

Diverifikasi: `SITE_URL=https://contoh.workers.dev pnpm build` mengubah canonical, sitemap, robots, dan og:image sekaligus.

**Satu dependensi types-only ditambahkan:** `@types/node`. `astro check` mengetik-periksa `astro.config.mjs` (berkas itu ber-`// @ts-check`) dan menolak `process` tanpa tipenya. Alternatifnya adalah melepas `@ts-check` dari berkas konfigurasi — menukar keamanan tipe dengan penghematan yang tidak nyata. `dependencies` tetap **satu** (`astro`); tidak ada tambahan pada keluaran yang dikirim ke pengguna.

**Penjaga CI baru:** memastikan `assets.directory` di `wrangler.jsonc` menunjuk direktori yang benar-benar ada dan berisi `index.html` setelah build. Salah ketik di sana lolos build dan baru muncul saat deploy — jauh dari tempat kesalahannya dibuat.

**Konsekuensi:**
- ✅ Deploy tidak lagi gagal karena konfigurasi yang hilang
- ✅ Pindah domain = 1 variabel lingkungan, bukan suntingan kode
- ✅ `_headers`, `404.html`, dan aturan trailing-slash tetap berlaku seperti di Pages
- ⚠️ `name` di `wrangler.jsonc` harus dijaga sinkron dengan nama Worker di dasbor
- ⚠️ Rollback kini lewat riwayat versi Worker, bukan tombol Rollback Pages — runbook §Prosedur Pemulihan perlu dibaca ulang saat Worker pertama benar-benar hidup

---

## Template ADR Baru

Salin blok ini setiap kali membuat keputusan arsitektural yang signifikan. Perubahan ruang lingkup **harus** melewati sini, bukan diputuskan diam-diam di tengah implementasi.

```markdown
## ADR-XXX — [Judul keputusan]

**Status:** Diusulkan | Diterima | Digantikan oleh ADR-YYY · [Tanggal]

**Keputusan:** [Satu kalimat: apa yang diputuskan]

**Konteks:** [Situasi yang menuntut keputusan ini. Batasan apa yang berlaku?]

**Alternatif yang ditolak:**
| Opsi | Alasan penolakan |
| :--- | :--- |
| [...] | [...] |

**Konsekuensi:**
- ✅ [Hasil positif]
- ⚠️ [Hasil negatif atau trade-off — WAJIB diisi. ADR tanpa konsekuensi negatif adalah pembenaran, bukan keputusan]
```
