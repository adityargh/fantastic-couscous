---
lang: id
slug: avas
title: "AVAS — memvalidasi ketidakhadiran selagi shift-nya masih bisa ditambal"
description: "Memindahkan eksepsi kehadiran dari rekonsiliasi akhir bulan ke alur validasi hari yang sama, agar keputusan cakupan shift berpijak pada data yang sudah pasti."
headline: "1 alur hari-sama menggantikan 1 rekonsiliasi akhir bulan"
period: Mei 2026 – sekarang
role: "Warehouse Operations Analyst Supervisor · ASTRO, Jakarta"
system: Validasi kehadiran
tags: [Manajemen Operasional, Ketenagakerjaan, Perbaikan Proses]
order: 6
featured: false
reconstructed: true
measured:
  - Porsi catatan ketidakhadiran yang tervalidasi di shift yang sama
  - Umur tumpukan catatan yang belum tervalidasi
  - Tingkat ketidakhadiran per shift dan per fungsi
  - Selisih cakupan terhadap headcount rencana, per shift
shots:
  - file: 01-submission-queue.png
    title: Antrian pengajuan
    alt: "Antrian pengajuan ketidakhadiran berisi rujukan karyawan, shift, kategori seperti sakit atau cuti tahunan, waktu pengajuan, dan status validasi."
    caption: "Satu antrian menggantikan sekumpulan pesan obrolan. Nilainya bukan pada daftarnya — melainkan pada setiap kasus kini punya status yang bisa dilihat orang."
  - file: 02-validation-detail.png
    title: Rincian validasi
    alt: "Panel rincian satu pengajuan berisi kategori, tanggal, dokumen pendukung terlampir, catatan validator, serta tombol setujui atau kembalikan."
    caption: "Validasi menuntut bukti berada di sebelah keputusan. Memisahkan keduanya ke dua sistem adalah cara antrian diam-diam berubah menjadi tumpukan."
  - file: 03-coverage-impact.png
    title: Dampak cakupan
    alt: "Kisi shift yang membandingkan headcount rencana dengan yang tersedia per fungsi, dengan kekurangan disorot dan ketidakhadiran penyebabnya di sebelahnya."
    caption: "Inilah alasan ini sistem operasional, bukan formulir SDM. Ketidakhadiran penting karena shift yang ditinggalkannya kurang orang, bukan karena catatannya."
  - file: 04-monthly-recap.png
    title: Rekap bulanan
    alt: "Tabel ringkas ketidakhadiran menurut kategori dan shift selama sebulan, dengan pemisahan tervalidasi dan tertunda, serta pembanding periode sebelumnya."
    caption: "Rekap kini menjadi pembacaan atas keputusan yang sudah diambil, bukan saat keputusan itu baru diambil. Pembalikan itulah keseluruhan proyek ini."
---

## Konteks

Kehadiran terdengar seperti urusan administrasi sampai Anda menjalankan shift. Setelah itu ia menjadi kendala yang menentukan apakah rencana hari ini sanggup bertahan bertemu harinya. Satu shift gudang adalah jumlah pekerjaan yang tetap berhadapan dengan jumlah orang yang berubah-ubah, dan ketidakhadiran adalah sebagian besar perubahan itu.

AVAS — Astro Validation Absence System — lahir dari peran analitik untuk hub Jakarta, dengan alasan yang sederhana: saya terus membutuhkan data headcount yang andal untuk menjelaskan angka operasional, dan data itu terus tidak andal sampai beberapa pekan setelah kejadiannya.

## Masalah

Ketidakhadiran memang dicatat, tapi divalidasi terlambat. Pengajuan datang lewat kanal apa pun yang kebetulan ada — pesan, telepon, catatan yang dititipkan saat serah terima — lalu direkonsiliasi di akhir bulan. Itu melahirkan dua masalah berbeda, satu operasional dan satu analitis.

Masalah operasionalnya: keputusan cakupan diambil di atas data yang belum pasti. Shift lead yang hendak membagi ulang pekerjaan perlu tahu siapa yang benar-benar tidak hadir dan apakah ketidakhadiran itu terkonfirmasi, dan ia membutuhkannya di awal shift, bukan tiga pekan kemudian. Tanpa itu, satu ketidakhadiran ditangani dua kali: sekali sebagai tebakan pada harinya, sekali lagi sebagai koreksi di akhir bulan.

Masalah analitisnya lebih buruk, karena ia mencemari semua hal lain. Setiap angka produktivitas, throughput, atau biaya per unit punya headcount di bawahnya. Kalau headcount bersifat sementara selama tiga pekan, maka setiap angka operasional yang dihitung darinya pun sementara — dan angka yang direvisi setelah orang terlanjur bertindak atasnya akan berhenti dipercaya, dan itu jauh lebih sulit diperbaiki daripada sekadar kekeliruan.

Ada biaya ketiga yang mudah terlewat: sengketa. Menyusun ulang ketidakhadiran berumur sebulan dari ingatan dan riwayat pesan itu lambat, tidak nyaman, dan menghasilkan keputusan yang tak diyakini siapa pun. Hampir seluruh biaya itu lenyap bila catatannya selesai dalam sehari sejak kejadiannya.

## Pendekatan

Prinsip desainnya: memindahkan validasi ke titik saat buktinya masih tersedia dan keputusannya masih berarti — shift yang sama. Semua hal lain di sistem ini mengikuti dari sana.

Saya memberi setiap pengajuan status yang eksplisit, alih-alih memperlakukannya sebagai pesan yang entah terjawab atau tidak. Status bisa dihitung, diukur umurnya, dan dieskalasi; utas pesan tidak. Satu perubahan itu mengubah proses informal menjadi proses yang bisa diukur, tanpa menambah birokrasi yang sebetulnya belum ada secara tersirat.

Tampilan cakupan saya masukkan sejak awal, dan menurut saya itulah alasan sistem ini bekerja. Perkakas kehadiran yang cuma menghasilkan catatan adalah formulir SDM, dan formulir SDM tidak akan diisi tepat waktu oleh orang yang pekerjaan sebenarnya adalah menjalankan shift. Perkakas kehadiran yang memberi tahu shift lead fungsi mana yang kurang orang hari ini memperoleh kepatuhannya sendiri, karena orang yang memasukkan datanya adalah orang yang diuntungkan bila datanya mutakhir.

Yang saya tolak bangun adalah penilaian otomatis dalam bentuk apa pun — skor, penandaan pola, atau pemeringkatan individu. Itu keputusan yang benar-benar berkonsekuensi atas seorang manusia, tempatnya di tangan manusia dan kebijakan tertulis, dan sistem yang mengisyaratkan kesimpulan akan melihat isyaratnya diperlakukan sebagai kesimpulan.

## Tindakan

Antrian pengajuan dikerjakan lebih dulu, sengaja sebagai lapisan tipis di atas kebiasaan yang sudah berjalan, bukan sebagai penggantinya. Proses yang menuntut kebiasaan baru di hari pertama akan dilewati di hari kedua. Pengajuan tetap boleh datang dengan cara yang familier lalu didaftarkan ke antrian — sehingga adopsinya tidak bergantung pada semua orang berubah serentak.

Validasi dibangun sebagai satu layar yang menahan bukti dan keputusan bersama-sama. Ketika dokumen pendukung tinggal di satu tempat dan keputusannya di tempat lain, jarak di antara keduanya menjadi tumpukan — selalu, di setiap sistem yang saya lihat melakukannya.

Cakupan menyusul, dinyatakan terhadap headcount rencana per fungsi, bukan sebagai total situs, karena sebuah situs bisa penuh tenaga dan tetap kekurangan pada satu fungsi yang justru menentukan shift berikutnya.

Rekap bulanan datang terakhir, dan perannya terbalik sepanjang jalan. Ia bermula sebagai tempat ketidakhadiran dihitung. Ia berakhir sebagai pembacaan atas keputusan yang sudah diambil — dan itu sinyal paling jelas bahwa proyek ini mencapai tujuannya.

## Hasil

Catatan ketidakhadiran kini selesai selagi masih segar, sehingga keputusan cakupan dan analisis operasional menarik dari data terkonfirmasi yang sama, bukan dari dua versi sementara yang berbeda. Tumpukan yang belum tervalidasi berubah menjadi angka yang terlihat dan berumur — artinya ia bisa dikelola, bukan ditemukan saat tutup buku.

Efek yang tidak saya duga justru ada pada angka operasionalnya sendiri. Begitu headcount berhenti direvisi berpekan-pekan kemudian, setiap indikator yang berdiri di atasnya berhenti bergoyang di bawah orang yang membacanya. Ternyata kestabilan sama pentingnya dengan keakuratan — angka yang berubah setelah Anda bertindak atasnya mengajari orang untuk tidak bertindak atasnya.

*Angka dasarnya milik perusahaan, jadi saya menjelaskan mekanisme dan indikatornya, bukan menerbitkan angka internal. Sistem ini menangani data karyawan; tidak ada identitas yang muncul di sini, dan antarmuka yang ditampilkan adalah rekonstruksi dengan data contoh.*

## Pelajaran

Versi pertama saya mensyaratkan validasi sebelum sebuah ketidakhadiran muncul di tampilan cakupan. Niatnya kebersihan data, dan hasilnya kebalikan dari yang saya butuhkan: shift lead yang melihat cakupan di awal shift justru mendapati gambaran yang kehilangan persis ketidakhadiran yang dilaporkan pagi itu — yang paling menentukan.

Memisahkan dua konsep itu menyelesaikannya. Cakupan kini langsung menampilkan ketidakhadiran yang dilaporkan, ditandai sebagai sementara, sedangkan catatan tervalidasi adalah yang memasok analisis dan rekap bulanan. Pelajaran umumnya terus saya pelajari ulang: tampilan operasional dan sistem pencatatan punya toleransi berbeda terhadap ketidakpastian, dan memaksa tampilan operasional menunggu standar pembuktian sistem pencatatan membuatnya tak berguna persis pada saat ia dibutuhkan.
