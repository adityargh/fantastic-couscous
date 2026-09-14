---
lang: id
slug: quality-system
title: "Dari inspeksi di lini menjadi sistem kualitas yang benar-benar dipakai"
description: "Tiga tahun dan tiga peran memindahkan kualitas dari yang diperiksa segelintir orang menjadi standar tertulis yang dipakai seluruh situs, konsisten lintas shift."
headline: "3 peran, 3 tahun, 1 standar yang dipakai semua orang"
period: Sep 2022 – Okt 2025
role: "QA Staff → QA Team Leader → Quality Management Officer · ASTRO"
tags: [Sistem Kualitas, Perbaikan Proses, Manajemen Operasional]
order: 2
featured: true
measured:
  - Temuan ketidaksesuaian menurut kategori
  - Waktu penutupan satu tindakan korektif
  - Temuan berulang antar siklus audit
  - Konsistensi hasil inspeksi antar shift
---

## Konteks

Saya masuk ke operasi ini sebagai QA staff dan meninggalkan fungsi kualitas tiga tahun kemudian sebagai officer-nya. Jenjang itu penting bagi cerita ini, karena bentuk masalahnya berubah di setiap langkah, dan begitu pula solusinya. Di lini, kualitas adalah sepasang mata. Di tingkat tim, ia adalah sehimpunan kesepakatan. Di tingkat situs, ia adalah dokumen yang berumur lebih panjang daripada penulisnya.

Operasi tumbuh cepat sepanjang periode itu — dan pertumbuhan adalah kondisi spesifik ketika kualitas yang informal diam-diam berhenti bekerja.

## Masalah

Saat saya mulai, mutu inspeksi bergantung pada siapa yang memeriksa. Dua orang yang sama-sama kompeten, shift yang sama, produk yang sama, bisa sampai pada kesimpulan berbeda — bukan karena ceroboh, melainkan karena standarnya hidup di kepala masing-masing, bukan di atas kertas. Itu masih tertahankan pada skala kecil, ketika semua orang dilatih orang yang sama dan pergeserannya lambat. Pada skala besar ia gagal, dengan cara yang sangat khas: gagal tanpa suara. Tidak ada alarm untuk "standar kita sudah melenceng". Anda baru tahu belakangan, lewat keluhan pelanggan atau temuan audit — saat pergeseran itu sudah berjalan berbulan-bulan.

Masalah kedua memperparahnya. Tindakan korektif diterbitkan lalu tidak benar-benar ditutup — dicatat selesai ketika gejalanya hilang, bukan ketika penyebabnya hilang. Maka temuan yang sama terus muncul kembali dengan topi yang sedikit berbeda, dan setiap kemunculan diperlakukan sebagai insiden baru, bukan sebagai bukti bahwa perbaikan sebelumnya tidak bekerja.

## Pendekatan

Ada dua pilihan. Pertama, memperbanyak inspeksi: tambah pemeriksaan, tambah pemeriksa, tangkap lebih banyak. Kedua, standardisasi: kurangi variasi pada cara pemeriksaan itu sendiri dilakukan. Saya memperjuangkan yang kedua, dan alasannya biaya. Inspeksi tambahan tumbuh linier terhadap volume — setiap satuan pertumbuhan menuntut satuan pemeriksaan yang sebanding, selamanya. Standardisasi dibayar sekali lalu bertahan, dan ia membuat inspeksi yang sudah Anda lakukan jadi lebih bernilai karena hasilnya menjadi sebanding.

Saya juga memilih tertulis-dan-terkendali, bukan tertulis-dan-disebar. Standar yang ada di lima folder tim akan menjadi lima standar dalam satu kuartal. Satu rujukan terkendali, dengan cara mengubah yang jelas, adalah satu-satunya bentuk "tertulis" yang selamat bersentuhan dengan operasi yang sibuk.

Batasan yang saya hadapi: tidak ada yang mendapat jam tambahan untuk membaca dokumentasi. Jadi standarnya harus cukup pendek untuk dipakai di titik kerja, bukan manual tebal yang ditandatangani lalu diabaikan.

## Tindakan

Sebagai team leader saya fokus pada kesepakatannya: satu standar inspeksi tertulis, kategori defect yang terdefinisi, dan jalur pelatihan agar anggota QA baru dikalibrasi terhadap dokumen, bukan terhadap siapa pun yang melatihnya. Kalibrasi adalah bagian yang paling sering dilewati — standar tertulis pun tetap melenceng bila tidak pernah diuji apakah dua pemeriksa yang membacanya sampai pada kesimpulan yang sama.

Sebagai quality management officer, cakupannya melebar ke tata kelola: memelihara satu set dokumen terkendali, menyiapkan audit internal sebagai keadaan biasa alih-alih sebagai peristiwa, dan mengubah cara tindakan korektif ditutup. Temuan tidak lagi boleh ditutup atas dasar gejala. Ia butuh penyebab yang dinyatakan dan perubahan yang membuat penyebab itu lebih kecil kemungkinannya, dan ia tetap terbuka sampai perubahan itu ada.

Bagian tersulitnya bukan hal teknis. Memperketat aturan penutupan membuat daftar temuan terbuka justru memanjang sebelum memendek, dan itu terlihat seperti kemunduran bagi siapa pun yang membaca daftar tersebut sebagai papan skor. Itu perlu dijelaskan lebih dari sekali.

## Hasil

Kualitas berhenti menjadi fungsi yang dipanggul segelintir orang dan menjadi sistem yang dijalankan situs: satu rujukan, dilatihkan, diaudit sebagai rutinitas, dengan tindakan korektif yang ditutup atas penyebab, bukan gejala. Temuan berulang baru terlihat ketika sistemnya memang memperlakukannya sebagai pengulangan — nilainya bukan hanya memperbaiki, melainkan menjadi mampu melihatnya sama sekali.

*Angka internal tetap milik perusahaan. Yang bisa saya paparkan adalah rancangan sistemnya dan indikator yang menjadi kemudinya.*

## Pelajaran

Saya terlalu lambat memisahkan "kesiapan audit" dari "penampilan saat audit". Di tahun pertama saya menyiapkan audit, yang menghasilkan ledakan kerja beres-beres menjelang tiap audit. Menyiapkan audit adalah biaya tanpa hasil operasional; berada permanen dalam keadaan di mana audit berlangsung membosankan itu lebih murah dan menghasilkan operasi yang lebih baik. Pergeseran itu akan saya lakukan jauh lebih awal.

Pelajaran lainnya soal tempo. Saya mendorong aturan penutupan tindakan korektif lebih cepat daripada kapasitas tim menyerapnya, dan minggu-minggu pertama menghasilkan resistensi yang sebenarnya bisa saya hindari dengan pentahapan. Standar yang diadopsi perlahan mengalahkan standar yang dipaksakan cepat lalu diakali.
