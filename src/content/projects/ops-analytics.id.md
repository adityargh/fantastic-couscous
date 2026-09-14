---
lang: id
slug: ops-analytics
title: "Mengubah catatan shift yang berserak menjadi satu gambaran operasi"
description: "Membangun lapisan analitik operasional gudang: memutuskan angka mana yang layak ada, dan memastikan tiap angka bermuara pada keputusan yang bisa ditindaklanjuti."
headline: "1 tampilan laporan menggantikan catatan shift yang berserak"
period: Feb 2026 – sekarang
role: "Warehouse Operations Analyst Supervisor · ASTRO, Jakarta"
tags: [Analitik Data, Operasional Gudang, Manajemen Produk]
order: 3
featured: true
measured:
  - Throughput inbound, penyimpanan, dan outbound
  - Akurasi catatan yang menjadi dasar pelaporan
  - Cakupan — seberapa banyak aktivitas nyata yang benar-benar terekam
  - Jeda keputusan, dari laporan tersedia sampai tindakan diambil
---

## Konteks

Ini pekerjaan yang sedang berjalan, jadi saya akan menggambarkannya sebagai sistem yang belum selesai, bukan yang sudah rampung. Setelah empat tahun di kualitas dan inventori, saya pindah ke sisi analitik operasional gudang. Mandatnya mudah diucapkan dan sulit dilakukan dengan baik: membuat operasi bisa dibaca. Inbound, penyimpanan, dan outbound menghasilkan aktivitas dalam jumlah besar setiap hari, dan sebagian besar darinya lenyap ke dalam ingatan masing-masing orang begitu shift berakhir.

## Masalah

Gudang tidak kekurangan data. Yang kurang adalah data *bersama*. Tiap fungsi memegang pandangannya sendiri — penerimaan tahu angkanya sendiri, penyimpanan tahu miliknya, pengiriman tahu miliknya — dan gambaran utuhnya baru bertemu di rapat, secara lisan, setelah semuanya lewat. Rapat adalah basis data yang sangat lambat dan sangat mahal.

Dua akibat mengikutinya. Masalah yang melintasi batas fungsi selalu paling terlambat terlihat, karena ia tidak tampak di pandangan mana pun secara terpisah dan baru kentara pada pandangan gabungan. Dan keputusan cenderung jatuh ke pihak yang paling pandai berargumen, sebab tidak ada angka bersama yang bisa menyudahi perbedaan pendapat.

Ada juga jebakan di sisi sebaliknya, yang sudah cukup sering saya lihat sehingga saya antisipasi sejak awal: menjawab "kita tidak punya visibilitas" dengan membangun dashboard berisi empat puluh kotak. Itu menghasilkan penampakan pengukuran tanpa manfaatnya, karena tidak ada orang yang bisa menindaklanjuti empat puluh hal, sehingga tidak ada satu pun yang ditindaklanjuti.

## Pendekatan

Saya memperlakukan ini sebagai masalah produk, bukan masalah pelaporan, dan memulainya dari keputusan, bukan dari data. Untuk setiap kandidat angka, satu pertanyaan: siapa yang melihatnya, dan apa yang ia lakukan secara berbeda tergantung isi angka itu. Apa pun yang tidak bisa menjawab itu adalah hiasan, semenarik apa pun.

Kerangka itu punya efek samping yang berguna terhadap biaya. Setiap indikator yang Anda terbitkan adalah kewajiban pemeliharaan permanen — ia harus terus benar, dan ketika sumbernya berubah, seseorang harus memperbaikinya. Indikator yang lebih sedikit dan lebih terpilih bukan sekadar selera desain, melainkan biaya operasi yang lebih rendah.

Saya juga bersikeras mengukur cakupan berdampingan dengan setiap angka akurasi. Pekerjaan inventori mengajarkan pelajaran itu dengan mahal: angka yang terlihat bagus karena hanya menyampel bagian mudah dari operasi lebih buruk daripada tidak ada angka, sebab ia menghasilkan rasa percaya diri, bukan keraguan.

## Tindakan

Pekerjaannya berjalan dalam tiga untai. Menyatukan aktivitas inbound, penyimpanan, dan outbound ke dalam satu tampilan yang dibaca semua fungsi, sehingga masalah lintas batas menjadi terlihat. Mendefinisikan indikator terhadap kenyataan lantai gudang — empat tahun saya di sana adalah keunggulan yang sesungguhnya di sini, karena saya tahu angka mana yang bisa dipengaruhi seorang shift lead dan angka mana yang sekadar menceritakan ulang harinya. Dan memperlakukan pelaporan itu sendiri sebagai produk: ia punya pengguna, penggunanya sibuk, dan bila tidak terbaca dalam tiga puluh detik yang tersedia di antara dua pekerjaan, ia tidak akan dibaca sama sekali.

Kendala saat ini ada pada kualitas catatan. Pelaporan berdiri di atas catatan dasar, dan lapisan pelaporan yang dibangun di atas catatan yang lemah hanya menyebarkan kelemahan itu lebih cepat dan dengan wibawa lebih besar. Jadi sebagian dari pekerjaan ini tidak terlihat keren: memperbaiki apa yang terekam di sumbernya, sebelum memperbaiki apa yang ditampilkan.

## Hasil

Sedang berjalan — dan saya lebih memilih jujur soal itu daripada mengklaim berlebihan. Arahnya sudah ditetapkan: satu gambaran operasi bersama menggantikan pandangan per fungsi, satu himpunan indikator yang sengaja kecil di mana setiap angka punya pemilik dan keputusan yang jelas, serta cakupan yang dilaporkan bersebelahan dengan akurasi agar angka-angkanya tidak bisa menyanjung kita.

*Ini pekerjaan aktif di dalam bisnis yang sedang berjalan, jadi angkanya tetap internal. Alasan rancangannya dan definisi indikatornya bisa saya telusuri secara rinci.*

## Pelajaran

Pelajaran yang sudah didapat: saya meremehkan betapa besar porsi pekerjaan analitik yang sebenarnya adalah negosiasi, bukan pembangunan. Memutuskan bahwa sebuah angka *tidak* akan diterbitkan lebih sulit daripada membangunnya, karena selalu ada yang menginginkannya, dan "kami tidak melacak itu" terdengar seperti kekurangan, bukan seperti pilihan. Menuliskan aturan keputusan-dulu membuat percakapan semacam itu lebih singkat dan tidak berubah menjadi urusan pribadi.

Satu lagi, warisan dari pekerjaan inventori dan terkonfirmasi lagi di sini: bangun kepercayaan sebelum kecanggihan. Tampilan sederhana yang dipercaya orang mengalahkan tampilan rumit yang selalu mereka cocokkan dengan spreadsheet sendiri — sebab begitu ada yang memelihara salinan bayangan pribadi, Anda sudah tidak punya gambaran bersama sama sekali.
