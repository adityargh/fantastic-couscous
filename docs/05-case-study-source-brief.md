# 05 — Brief pengumpulan data studi kasus

> **Untuk apa dokumen ini.** Katalog studi kasus sengaja dikosongkan pada 15 Sep 2026
> (ADR-014). Dokumen ini menjelaskan **persis** apa yang dibutuhkan untuk mengisinya
> ulang dengan benar, dan menyediakan prompt siap-tempel untuk sesi Claude Code yang
> punya akses ke repositori aslinya.

---

## 1. Kenapa harus dikumpulkan dari luar repositori ini

Keenam sistemnya ada di organisasi GitHub **`FIT-Developers-Team`**, bukan di akun
`adityargh`. Sesi cloud yang mengerjakan situs portofolio ini **tidak bisa** menjangkaunya:

| Jalur | Hasil |
| :--- | :--- |
| `add_repo` | Ditolak — *cross-tier adds not supported*; sesi sudah terikat ke owner `adityargh` |
| `git clone` anonim | Keenam repositori privat |
| GitHub MCP | Dibatasi ke `adityargh/fantastic-couscous` |
| `list_repos` | Koneksi GitHub workspace tidak menjangkau org `FIT-Developers-Team` |

Sesi-sesi yang dulu mengerjakan repositori itu berjalan lewat **Claude Code CLI di
mesin lokal** (`environment_kind: bridge`) dengan checkout di disk. Karena itu
pengumpulan datanya dikerjakan di sana, bukan di sini.

## 2. Yang sudah diketahui — jangan dikumpulkan ulang

Diangkat dari indeks sesi Claude Code milik pemilik. Ini **petunjuk**, bukan fakta
terverifikasi; perlakukan sebagai titik awal penelusuran.

| Repositori | Sinyal dari judul sesi |
| :--- | :--- |
| `antrian-inbound-frozen` | Supabase (branch `codex/supabase-backend`), PGlite + Postgres `LISTEN/NOTIFY` lewat socket, Apache Superset (datasource 454, slice 25350), edge function di `.tools/check`, inbound PO, sistem vendor, time study, inbound D2A |
| `occupancy-monitoring-alert` | Location explorer, konfigurasi Capacity qty & CBM, recent movements per WH |
| `relabel-productivity` | Apache Superset (UI/UX + data), sistem metrik & infrastruktur |
| `outbound-operations-tower` | Audit dan optimisasi proyek (Agu–Sep 2026) |
| `ex-analysis-system` | Tidak muncul di indeks sesi — perlu ditelusuri dari nol |
| **AVAS** (Astro Validation Absence System) | Tidak muncul di indeks sesi — perlu ditelusuri dari nol |

## 3. Yang dibutuhkan per proyek

Setiap field di bawah memetakan langsung ke skema di [`src/content.config.ts`](../src/content.config.ts).
Build **gagal** bila ada yang tidak memenuhi batasannya — jadi patuhi panjangnya.

| Field | Batasan | Isinya apa |
| :--- | :--- | :--- |
| `slug` | huruf kecil + tanda hubung | Sama dengan nama repositori |
| `title` | 10–90 karakter | Kalimat yang menyatakan **keputusan**, bukan nama fitur |
| `description` | **70–165 karakter** | Ringkasan satu kalimat; ini juga meta description Google |
| `headline` | **wajib memuat angka** | Hasil paling ringkas. Angka boleh struktural (mis. "3 peran pengguna") bila angka hasil rahasia |
| `period` | bebas | Rentang pengerjaan nyata, mis. `Agu 2026 – sekarang` |
| `role` | bebas | Peran Anda di proyek itu, bukan jabatan di perusahaan |
| `system` | 3–32 karakter | Jenis sistemnya sebagai kata benda pendek, mis. `Queue management` |
| `tags` | 2–4 item | Domain, bukan teknologi |
| `measured` | 2–5 item | Indikator yang dikemudikan sehari-hari |
| `shots` | **tepat 4** | Lihat §4 |
| `reconstructed` | wajib `true`/`false` | `false` hanya bila tangkapannya benar-benar dari sistem asli |
| `metrics` | opsional | Tabel sebelum/sesudah. **Biarkan kosong** kalau angkanya rahasia |

Selain itu, prosa 6 bagian: **Konteks → Masalah → Pendekatan → Tindakan → Hasil → Pelajaran**.
Bagian *Pendekatan* harus memuat setidaknya satu **alternatif yang ditolak beserta
alasannya**, dan *Pelajaran* harus memuat setidaknya satu **kesalahan nyata** dan
koreksinya. Tanpa keduanya, tulisannya berubah jadi brosur.

## 4. Tangkapan layar — 4 per proyek

Repositorinya milik organisasi Anda, jadi **tangkapan asli lebih baik daripada
rekonstruksi**, selama datanya aman:

1. Jalankan aplikasinya secara lokal dengan **data seed/dummy**, bukan data produksi.
2. Ambil 4 layar yang menjelaskan **alur kerjanya**, bukan 4 layar tercantik.
3. Ukuran seragam **1280×800** (situs menuntut rasio 16:10 dan memakai `width`/`height` tetap).
4. Simpan ke `public/shots/<slug>/0N-nama-kebab.png`.
5. Setel `reconstructed: false` **hanya** bila benar-benar dari aplikasi asli.

Kalau data produksi tidak bisa dihindari, jangan ambil tangkapannya — bangun ulang
tata letaknya dengan data contoh dan setel `reconstructed: true`. Pipeline Chromium
nol-dependensi untuk itu ada di riwayat git pada commit `a5c9e40`
(`scripts/shots.mjs`, `scripts/lib/ui.mjs`, `scripts/lib/shell.mjs`).

## 5. Aturan yang tidak boleh dilanggar

- **Jangan mengarang angka hasil.** Kalau tidak diukur, jangan menulis bahwa ia diukur.
- **Jangan menerbitkan data internal**: nama pemasok, nama karyawan, volume nyata, nilai kontrak.
- Angka rahasia boleh disamarkan jadi bentuk aman: persentase relatif, indeks (`1,8×`),
  rentang berselang, atau skala tanpa identitas. Lihat aturan lengkapnya di
  [`01-content-brief.md`](01-content-brief.md) §Aturan 2.
- Kalau ragu — **hapus**. Studi kasus yang lebih pendek tapi benar mengalahkan studi
  kasus yang lengkap tapi karangan. Itulah pelajaran dari ADR-014.

## 6. Prompt siap-tempel

Jalankan di sesi Claude Code yang punya checkout repositori terkait, **satu repositori
per sesi**, lalu tempelkan hasilnya kembali ke sesi portofolio.

```text
Baca repositori ini secara menyeluruh dan tulis ringkasan teknis untuk dijadikan
studi kasus portofolio. JANGAN mengarang apa pun — kalau sesuatu tidak ada di kode,
commit, issue, atau dokumentasi, tulis "tidak diketahui".

Keluarkan dalam bentuk ini:

1. APA INI
   - Satu kalimat: sistem ini melakukan apa, untuk siapa.
   - Siapa penggunanya sehari-hari (peran, bukan nama orang).
   - Rentang waktu pengerjaan menurut riwayat git (commit pertama sampai terakhir).

2. MASALAH YANG DIPECAHKAN
   - Keadaan sebelum sistem ini ada, sejauh yang bisa disimpulkan dari README,
     commit awal, issue, atau komentar kode.
   - Biaya nyata dari keadaan itu.

3. ARSITEKTUR
   - Stack: bahasa, framework, database, layanan pihak ketiga.
   - Keputusan teknis yang tidak biasa DAN alasannya (cari di ADR, README, komentar,
     pesan commit). Sebutkan alternatif yang ditolak bila tercatat.
   - Integrasi keluar (mis. dashboard, WMS, sistem lain).

4. LAYAR UTAMA
   - Daftar rute/halaman dari kode routing.
   - Untuk 4 layar terpenting: namanya, apa yang ditampilkan, keputusan apa yang
     diambil pengguna di layar itu. Sebutkan jalur berkas komponennya.

5. YANG DIUKUR
   - Metrik/indikator yang benar-benar dihitung sistem ini (cari query, view, job,
     definisi chart). Sebut nama tekniknya, bukan tebakan.

6. MASALAH NYATA YANG PERNAH DIPERBAIKI
   - 2–3 bug atau keputusan ulang yang paling substansial, dari riwayat commit
     atau issue. Sertakan sebab dan perbaikannya.

7. DATA SENSITIF
   - Daftar apa pun di repositori ini yang TIDAK boleh muncul di portofolio publik:
     nama pemasok, nama karyawan, volume nyata, endpoint internal, kredensial.

Ringkas tapi spesifik. Sertakan jalur berkas untuk setiap klaim supaya bisa diperiksa.
```

## 7. Setelah datanya terkumpul

1. Tempelkan hasil keenam ringkasan ke sesi portofolio.
2. Studi kasus ditulis EN + ID (**ditulis ulang, bukan diterjemahkan** — aturan 4 di `01-content-brief.md`).
3. Taruh tangkapan di `public/shots/<slug>/`.
4. `pnpm build && node scripts/check-shots.mjs dist` harus lulus.
5. `pnpm pdf` bila `src/data.json` ikut berubah — CI menolak PDF yang basi.
