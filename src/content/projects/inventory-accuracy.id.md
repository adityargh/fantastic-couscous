---
lang: id
slug: inventory-accuracy
title: "Membuat situs dry goods menghitung stok harian, bukan bulanan"
description: "Mengubah penghitungan stok di situs dry goods Cibitung dari peristiwa akhir bulan menjadi rutinitas harian yang memunculkan selisih saat penyebabnya masih terlacak."
headline: "6 bulan membangun ulang cara satu situs menghitung stok"
period: Sep 2025 – Feb 2026
role: "Dry Inventory Supervisor · ASTRO, Cibitung"
tags: [Pengendalian Inventori, Operasional Gudang, Perbaikan Proses]
order: 1
featured: true
measured:
  - Akurasi stok terhadap catatan sistem
  - Cakupan cycle count yang tercapai per hari
  - Jarak waktu dari selisih ditemukan sampai penyebab teridentifikasi
  - Volume penyesuaian, dipilah menurut penyebab
---

## Konteks

Dry goods adalah kategori paling tidak dramatis di gudang quick commerce, sekaligus yang paling mudah salah tanpa ketahuan. Tidak ada yang membusuk, tidak ada alarm, dan satu unit yang nyasar ke rak lain akan duduk di sana tampak baik-baik saja selama berminggu-minggu. Saya mengambil alih pengendalian inventori sebuah situs di Cibitung pada masa build-out — fase ketika volume, jumlah orang, dan tata letak semuanya masih bergerak, dan justru di fase itulah disiplin inventori biasanya ditunda sampai "keadaan tenang".

## Masalah

Model penghitungannya model yang lazim: stock take besar di akhir bulan, ditambah pemeriksaan dadakan bila ada yang jelas-jelas tidak cocok. Model itu punya cacat struktural yang tidak ada hubungannya dengan kerja keras. Ketika hitungan akhir bulan menemukan selisih, bukti yang bisa menjelaskannya sudah lenyap. Dokumen penerimaan, orang yang menyimpannya, shift tempat kejadian, palet asalnya — semuanya sudah dingin empat minggu. Jadi selisih itu disesuaikan, bukan dijelaskan, dan penyebab yang sama menghasilkan selisih yang sama bulan berikutnya.

Biaya sesungguhnya tidak pernah terletak pada penyesuaiannya. Biayanya adalah operasi terus membayar kesalahan yang sama berulang kali karena tidak pernah belajar penyebabnya.

## Pendekatan

Saya tidak mulai dengan menghitung lebih banyak. Saya mulai dengan bertanya: hitungan ini sebenarnya ingin *menghasilkan* apa. Kalau jawabannya "angka penutup yang benar", hitungan bulanan sudah memadai. Kalau jawabannya "penjelasan", maka hitungan harus terjadi selagi jejaknya masih hangat — artinya harian, kecil, dan terarah; bukan bulanan dan menyeluruh.

Saya memilih cycle counting ketimbang sistem yang lebih berat karena alasan biaya yang sederhana: tidak butuh perangkat lunak baru, tidak butuh belanja modal, tidak butuh tambahan orang. Ia mengubah satu peristiwa besar yang mengganggu menjadi rutinitas kecil yang tetap. Konsekuensi yang saya terima: ia menuntut konsistensi — cycle count yang dilewati adalah cycle count yang berbohong kepada Anda, sebab lubang cakupan terlihat persis sama seperti akurasi.

Saya sengaja tidak menambah lapisan verifikasi kedua saat putaway. Pemeriksaan tambahan adalah biaya yang dibayar pada setiap unit, selamanya. Menemukan penyebabnya sekali lalu menghapusnya cukup dibayar sekali.

## Tindakan

Rutinitas dibangun dalam tiga bagian. Pertama, penugasan hitungan harian yang ukurannya muat di dalam shift normal, bukan ditumpuk di atasnya — kalau rutinitas hanya jalan di hari sepi, ia tidak jalan. Kedua, jalur penanganan selisih yang mewajibkan kode penyebab, bukan sekadar koreksi jumlah: tidak ada penyesuaian yang boleh diposting sebagai angka telanjang. Ketiga, aturan eskalasi yang mengirim apa pun di atas ambang tertentu naik pada hari yang sama, bukan masuk antrean.

Gesekannya ada di tempat yang sudah bisa ditebak. Hitungan yang menghasilkan pekerjaan rumah adalah hitungan yang dihindari orang, jadi kode penyebabnya harus pendek, sedikit, dan diambil dari apa yang benar-benar terjadi di lantai itu — bukan dari templat generik. Saya menyusunnya dari temuan minggu-minggu pertama, bukan memutuskannya di depan.

## Hasil

Situs bergeser dari postur rekonsiliasi bulanan menjadi postur kendali harian. Selisih mulai muncul di dalam shift yang menghasilkannya, sehingga penyebabnya bisa ditarik ke batch penerimaan, lokasi, atau langkah tertentu — bukan diserap sebagai angka. Penyesuaian berhenti menjadi akhir percakapan dan berubah menjadi awalnya.

*Angka detailnya milik perusahaan, jadi yang saya uraikan adalah mekanisme dan indikatornya, bukan data internal. Dalam percakapan langsung saya bisa menelusuri bagaimana indikator itu didefinisikan dan dibaca.*

## Pelajaran

Versi pertama daftar kode penyebab saya rancang berlebihan. Pilihannya terlalu banyak, sehingga orang memilih yang paling dekat alih-alih yang paling tepat, dan datanya justru lebih buruk daripada tanpa kode sama sekali. Memangkasnya langsung memperbaiki kualitas data — pelajaran yang kini saya terapkan sejak awal: himpunan kategori yang tidak bisa dipakai dengan benar oleh orang yang lelah di ujung shift bukanlah himpunan kategori, melainkan harapan.

Saya juga akan memulai pelacakan cakupan lebih cepat. Di periode awal saya memantau akurasi tanpa memantau seberapa luas situs yang benar-benar tersentuh hitungan, padahal dua angka itu harus dibaca bersama — kalau tidak, angka pertama akan menyanjung Anda.
