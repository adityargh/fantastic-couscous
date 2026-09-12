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
