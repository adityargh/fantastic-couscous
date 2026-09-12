# 03 — Launch Checklist & Runbook Operasional

> Buka dokumen ini sejak **Sprint 5**, bukan Sprint 7. Checklist yang baru dibaca di hari peluncuran selalu menemukan pekerjaan yang seharusnya selesai tiga minggu sebelumnya.

Setiap butir bersifat **biner**: selesai atau tidak. Tidak ada "hampir".

---

## Gate A — Konten *(kunci di akhir Sprint 4)*

- [ ] Nol placeholder, `TBD`, *lorem ipsum*, atau kurung siku kosong di seluruh situs
- [ ] Setiap bullet pengalaman memuat angka terukur *(ditegakkan skema Zod — tapi verifikasi manual sekali)*
- [ ] Ketiga studi kasus lengkap 6 bagian dengan tabel sebelum/sesudah terisi
- [ ] Positioning statement identik di: hero situs, meta description, bio LinkedIn, ringkasan CV PDF
- [ ] Nol typo — dibaca oleh **orang kedua**, bukan hanya Anda *(Anda buta terhadap teks sendiri)*
- [ ] Versi ID terbaca natural, bukan hasil terjemahan mesin
- [ ] **Review kerahasiaan**: tidak ada angka rahasia perusahaan, nama klien tanpa izin, atau data internal
- [ ] Tidak ada nomor telepon, alamat rumah, tanggal lahir, atau NIK di mana pun — termasuk di dalam PDF
- [ ] Tanggal & jabatan konsisten antara website, PDF, dan LinkedIn *(inkonsistensi adalah red flag bagi recruiter)*

## Gate B — Fungsional

- [ ] Setiap tautan internal mengarah ke halaman nyata (dikonfirmasi lychee, nol 404)
- [ ] Setiap tautan eksternal terbuka dengan benar dan pakai `rel="noopener"`
- [ ] Pengalih bahasa mempertahankan halaman saat ini di seluruh 8 kombinasi rute
- [ ] Kedua PDF CV dapat diunduh dan mengembalikan HTTP 200
- [ ] Isi PDF **identik** dengan konten web *(dibangkitkan otomatis — verifikasi sekali secara manual)*
- [ ] Form kontak benar-benar mengirim → email uji **diterima** di inbox Anda
- [ ] Halaman sukses & galat form tampil dan punya jalur kembali
- [ ] Honeypot bekerja: submit terisi kolom `botcheck` harus ditolak
- [ ] Turnstile tampil dan lolos verifikasi
- [ ] Toggle tema berfungsi; pilihan bertahan setelah reload; **tanpa flash** saat muat
- [ ] Halaman 404 kustom tampil untuk URL acak, dengan tautan kembali ke beranda
- [ ] `/resume.json` mengembalikan JSON valid
- [ ] **Uji tanpa JavaScript** (`about:config` → `javascript.enabled=false`): seluruh konten tetap terbaca, navigasi tetap berfungsi

## Gate C — Performa *(divalidasi CI, konfirmasi di produksi)*

- [ ] Lighthouse mobile ≥ 95 pada keempat kategori — diuji di **URL produksi**, bukan localhost
- [ ] LCP < 1,8 s pada throttling Slow 4G
- [ ] CLS < 0,1 di semua halaman *(cek khusus: gambar dan pemuatan font)*
- [ ] Berat beranda < 300 KB transfer
- [ ] Seluruh gambar punya `width`/`height` eksplisit dan disajikan sebagai AVIF/WebP
- [ ] Font di-*preload*; tanpa lonjakan FOIT/FOUT yang terlihat
- [ ] Nol permintaan render-blocking selain CSS kritis + skrip tema

## Gate D — Aksesibilitas

- [ ] Nol violation axe-core pada 5 halaman × 2 tema × 2 bahasa
- [ ] Navigasi keyboard penuh: `Tab` melewati seluruh elemen interaktif dengan urutan logis
- [ ] Indikator fokus terlihat jelas pada **setiap** elemen interaktif, di kedua tema
- [ ] Skip-to-content link adalah elemen fokus pertama dan benar-benar melompat
- [ ] Diuji dengan screen reader nyata *(VoiceOver di macOS/iOS, atau NVDA di Windows)* pada beranda + form
- [ ] Seluruh gambar bermakna punya `alt` deskriptif; dekoratif `alt=""`
- [ ] Rasio kontras lolos AA di kedua tema *(verifikasi manual pada teks di atas latar berwarna)*
- [ ] `prefers-reduced-motion` dihormati
- [ ] Galat form diumumkan ke screen reader, bukan hanya diwarnai merah
- [ ] Zoom 200% tidak merusak tata letak dan tidak memunculkan scroll horizontal

## Gate E — SEO & Kemampuan Ditemukan

- [ ] Title & meta description unik pada **setiap** halaman, dalam batas panjang
- [ ] `hreflang` EN/ID/x-default saling merujuk dengan benar di seluruh halaman
- [ ] Canonical absolut dan self-referencing
- [ ] JSON-LD `Person` lolos [Rich Results Test](https://search.google.com/test/rich-results) tanpa galat
- [ ] OG image ter-generate; unfurl **diuji nyata** di WhatsApp, LinkedIn, dan Slack
- [ ] `sitemap-index.xml` dapat diakses dan memuat seluruh halaman kanonik
- [ ] `robots.txt` mengizinkan crawling dan menunjuk sitemap; `/print/*` diblokir
- [ ] Rute `/print/*` mengembalikan `noindex`
- [ ] Situs terdaftar di **Google Search Console** dan **Bing Webmaster Tools**; sitemap dikirim
- [ ] Diminta pengindeksan manual untuk beranda

## Gate F — Keamanan & Privasi

- [ ] Skor **A atau lebih** di [securityheaders.com](https://securityheaders.com)
- [ ] CSP aktif tanpa galat di konsol browser
- [ ] HTTPS dipaksa; HTTP me-redirect; HSTS aktif
- [ ] Nol secret atau kredensial di riwayat git *(`git log -p | grep -iE "api[_-]?key|secret|password|token"`)*
- [ ] Verifikasi domain aktif di dasbor Web3Forms
- [ ] Analitik terkonfirmasi tanpa cookie *(cek tab Application → Cookies harus kosong)*
- [ ] Tidak ada skrip pihak ketiga selain Turnstile dan Cloudflare Analytics
- [ ] Branch protection aktif di `main`; CI wajib hijau sebelum merge

## Gate G — Lintas Perangkat *(perangkat fisik, bukan hanya emulator)*

- [ ] iPhone Safari — Android Chrome — Desktop Chrome/Firefox/Safari/Edge
- [ ] Viewport 360 px: nol scroll horizontal
- [ ] Viewport 1440 px+: konten tidak melebar berlebihan *(lebar baca dibatasi)*
- [ ] Landscape di ponsel tidak merusak tata letak
- [ ] Cetak dari browser menghasilkan dokumen rapi *(bukan hanya pipeline PDF)*

## Gate H — Distribusi *(hari peluncuran)*

- [ ] URL ditambahkan ke profil LinkedIn (bidang Website + seksi Featured)
- [ ] URL ditambahkan ke tanda tangan email
- [ ] URL ditambahkan ke README profil GitHub
- [ ] URL dicantumkan di header CV PDF
- [ ] Satu post LinkedIn mengumumkan situs *(sertakan satu metrik konkret, bukan sekadar "website baru saya!")*
- [ ] Tag `v1.0.0` dibuat di git
- [ ] Uptime monitor aktif (UptimeRobot, interval 5 menit)
- [ ] Review kuartalan terjadwal di kalender

---

## Uji Asap Pasca-Launch *(H+1)*

| # | Uji | Lulus bila |
| :-- | :--- | :--- |
| 1 | Buka URL produksi di jaringan seluler, bukan WiFi | Termuat < 3 detik |
| 2 | Kirim form kontak dari perangkat lain | Email diterima < 2 menit |
| 3 | Unduh kedua PDF di ponsel | Terbuka benar, teks dapat diseleksi |
| 4 | Kirim URL lewat WhatsApp | Pratinjau tampil dengan gambar & judul benar |
| 5 | `site:domain-anda.pages.dev` di Google | Halaman mulai muncul dalam 7 hari |
| 6 | Buka dasbor analitik | Kunjungan Anda sendiri tercatat |

---

## Runbook Operasional

### Irama rutin

| Frekuensi | Aktivitas | Effort |
| :--- | :--- | ---: |
| Otomatis | Deploy saat push ke `main` | 0 |
| Mingguan | Link check + `pnpm audit` *(GitHub Actions)* | 0 |
| Bulanan | Merge PR Dependabot setelah CI hijau | 10 mnt |
| **Kuartalan** | Review konten + cek KPI + uji form + cek kuota free tier | **60 mnt** |
| Tahunan | Audit positioning; evaluasi domain kustom | 3 jam |

### Agenda Review Kuartalan *(60 menit, terikat waktu)*

1. **(15 mnt)** Metrik — bandingkan analitik terhadap KPI §1.3 rencana utama. Catat satu kesimpulan.
2. **(20 mnt)** Konten — peran baru? metrik baru? sertifikasi baru? Studi kasus mana yang sudah basi?
3. **(10 mnt)** Uji fungsi — kirim form kontak, unduh kedua PDF, klik 5 tautan acak.
4. **(10 mnt)** Higiene — merge PR Dependabot, cek kuota free tier (Pages, Web3Forms, Actions).
5. **(5 mnt)** Putuskan **satu** perbaikan untuk kuartal berikutnya. Satu, bukan lima.

> **Aturan anti-fiddling:** kalau seluruh KPI tercapai, tindakan yang benar adalah **tidak melakukan apa-apa**. Mendesain ulang situs yang berfungsi baik adalah biaya tanpa hasil.

### Runbook Insiden

| Gejala | Diagnosis | Tindakan |
| :--- | :--- | :--- |
| Situs tidak dapat diakses | Cek `cloudflarestatus.com` | Insiden penyedia → tunggu. Jika > 30 mnt → jalankan workflow `mirror-pages.yml` secara manual |
| Deploy gagal | Baca log build Cloudflare | Reproduksi lokal `pnpm build` → perbaiki → push. **Produksi tetap menyajikan build terakhir yang sukses — tanpa downtime** |
| Konten baru tidak muncul | Build sukses tapi halaman lama | Purge cache di dasbor Cloudflare; cek header `Cache-Control` |
| Form tidak mengirim email | Cek dasbor Web3Forms: kuota & verifikasi domain | Kuota habis → tunggu reset atau pindah penyedia. Darurat → ganti dengan tautan `mailto:` |
| Spam membanjir | Turnstile terlewati | Naikkan mode Turnstile ke "Managed"; tambahkan rate limit |
| Lighthouse CI gagal setelah perubahan sepele | Biasanya gambar tanpa dimensi atau font baru | Buka laporan LHCI (tautan ada di log CI) → lihat audit yang gagal |
| Trafik pencarian turun | Search Console → Coverage + Performance | Verifikasi canonical & `hreflang` utuh; cek penalti manual |
| PDF berbeda dari web | Job PDF gagal diam-diam | Step assertion di CI seharusnya menangkap ini — jika tidak, perkuat assertion-nya |

### Prosedur Pemulihan

| Skenario | Prosedur | RTO |
| :--- | :--- | :--- |
| Deploy buruk masuk produksi | Dasbor Cloudflare Pages → deployment sebelumnya → **Rollback** | < 2 menit |
| Repo terhapus/rusak | Clone dari mirror lokal; konten seluruhnya markdown/JSON di git | < 30 menit |
| Cloudflare Pages down permanen | Jalankan `mirror-pages.yml` → live di `*.github.io` | < 1 jam |
| Penyedia form tutup | Ganti `action` form ke Formspree, atau Pages Functions + Resend | < 1 jam |
| Kehilangan akses akun | Repo GitHub adalah sumber kebenaran; hosting dapat diciptakan ulang dari nol | < 2 jam |

> **Yang membuat semua ini murah:** tidak ada state di mana pun kecuali git. Tidak ada database, tidak ada berkas terunggah, tidak ada sesi pengguna. Setiap komponen dapat dibangun ulang dari repositori dalam hitungan menit. Itulah keuntungan arsitektural utama dari memilih situs statis (ADR-001).
