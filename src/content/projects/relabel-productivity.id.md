---
lang: id
slug: relabel-productivity
title: "Membuat pekerjaan relabel terlihat, agar penyebabnya bisa dihapus"
description: "Mengukur rework yang tak pernah dihitung siapa pun — output per jam, umur tumpukan, dan sebabnya — agar relabel bisa diperdebatkan di hulunya, bukan diserap."
headline: "1 laju standar untuk pekerjaan dengan 0 pengukuran sebelumnya"
period: Sep 2024 – Feb 2025
role: "QA Team Leader, lalu Quality Management Officer · ASTRO, Jakarta"
system: Pelacakan produktivitas
tags: [Perbaikan Proses, Quality Assurance, Produktivitas]
order: 5
featured: false
reconstructed: true
measured:
  - Unit ter-relabel per jam-orang, terhadap laju standar
  - Umur tumpukan relabel, batch terlama lebih dulu
  - Komposisi sebab di balik tiap batch relabel
  - Porsi volume relabel yang tertelusur ke langkah sumber tertentu
shots:
  - file: 01-daily-output.png
    title: Output harian
    alt: "Papan yang menampilkan unit ter-relabel hari ini terhadap laju standar, jam kerja, tumpukan berjalan, dan batang pembanding tujuh hari."
    caption: "Angka pertama yang pernah dimiliki operasi untuk pekerjaan ini. Sebelumnya, relabel hanya digambarkan sibuk atau sepi, dan itu bukan pengukuran."
  - file: 02-operator-throughput.png
    title: Throughput per stasiun
    alt: "Tabel stasiun relabel berisi unit selesai, jam tercatat, laju per jam, dan kolom selisih terhadap laju standar."
    caption: "Dilaporkan per stasiun, bukan per orang. Tujuannya menemukan di mana metodenya berbeda, bukan memeringkat orang — daftar peringkat cepat berhenti jujur."
  - file: 03-backlog-ageing.png
    title: Umur tumpukan
    alt: "Batang bertumpuk berisi batch relabel tertunda yang dikelompokkan menurut umur, dari di bawah satu hari sampai di atas sepekan, dengan batch terlama ditandai."
    caption: "Volume saja menyembunyikan risikonya. Batch relabel yang tua adalah stok yang tak bisa dijual sekaligus masih memakan lokasi — dua biaya, bukan satu."
  - file: 04-cause-pareto.png
    title: Pareto sebab
    alt: "Diagram pareto yang memeringkat sebab relabel seperti label pemasok keliru, label rusak, perubahan harga, dan barcode salah, dengan garis persentase kumulatif."
    caption: "Inti dari seluruh latihan ini. Relabel adalah rework, dan rework hanya layak diukur bila pengukurannya menunjuk ke hulu, ke hal yang menciptakannya."
---

## Konteks

Relabel adalah pekerjaan yang tak terlihat. Ia bukan penerimaan, bukan picking, bukan packing — ia berdiri di samping ketiganya, menyerap apa pun yang butuh barcode baru, harga yang dikoreksi, atau label pengganti sebelum bisa dijual. Semua orang tahu pekerjaan itu ada. Nyaris tak ada yang tahu seberapa banyak, karena ia jarang punya barisnya sendiri di laporan mana pun.

Saya mengambilnya melewati masa peralihan dari memimpin tim QA menuju tata kelola kualitas tingkat situs — sudut pandang yang kebetulan pas untuk masalah ini: QA melihat cacat yang menciptakan relabel, dan tata kelola adalah fungsi yang bisa berbuat sesuatu terhadap sumbernya.

## Masalah

Tidak ada pengukuran sama sekali. Bukan pengukuran yang buruk — memang tidak ada. Relabel diisi tenaga berdasarkan perasaan, digambarkan dengan kata sifat, dan baru dilaporkan setelah menjadi hambatan. Itu melahirkan tiga kegagalan sekaligus, dan ketiganya saling memperberat.

Pertama, pekerjaannya tidak bisa direncanakan. Tanpa laju, tumpukan tidak bisa diubah menjadi jam, sehingga tidak bisa dijawab berapa orang yang dibutuhkan atau kapan akan bersih. Penempatan tenaga jadi reaktif, yang artinya selalu sedikit terlambat.

Kedua, biayanya tersembunyi. Relabel adalah rework — waktu yang dipakai memperbaiki sesuatu yang seharusnya datang sudah benar. Rework yang tak terukur tidak muncul dalam perbandingan pilihan apa pun, sehingga ia tak pernah bersaing memperebutkan perhatian. Ia sekadar terserap.

Ketiga, dan paling buruk: karena tidak ada yang mencatat *mengapa* sebuah batch perlu di-relabel, sebab-sebab di hulu tak pernah dihadapi. Pemasok yang konsisten mengirim stok berlabel keliru dan perubahan harga yang sekali terjadi tampak identik dari hilir — keduanya cuma datang sebagai tambahan pekerjaan. Operasi terus membayar masalah berulang pada titik termahal di rantainya, yaitu setelah barangnya sudah berada di dalam.

## Pendekatan

Saya mulai dari lajunya, karena semua hal lain bergantung padanya. Laju standar mengubah tumpukan menjadi durasi, dan durasi itulah yang membuat perencanaan mungkin. Saya menurunkannya lewat pengamatan pada sebaran jenis batch yang wajar, bukan dengan mengambil kasus terbaik — standar yang diambil dari hari bagus seseorang adalah standar yang membuat setiap hari normal terlihat seperti kegagalan, dan staf menyadarinya dalam sepekan.

Keputusan kedua: melaporkan pada tingkat stasiun, bukan tingkat individu. Ini disengaja, dan akan saya pertahankan di sistem serupa mana pun. Tujuan pengukurannya adalah menemukan di mana metodenya berbeda, bukan memeringkat orang. Begitu angka produktivitas menjadi papan skor pribadi, dua hal terjadi: batch mudah mulai diperebutkan, dan angkanya berhenti menggambarkan pekerjaannya. Saya menjaga resolusinya persis di titik yang berguna, dan tidak satu tingkat lebih halus.

Keputusan ketiga dan terpenting adalah kode sebab. Laju membuat relabel bisa dikelola; hanya kode sebab yang membuatnya bisa dikurangi. Mengelola rework lebih efisien ada nilainya. Menghapus sumbernya jauh lebih bernilai, dan itu satu-satunya versi proyek ini yang punya garis akhir.

## Tindakan

Perekaman dibangun ke dalam pekerjaannya, bukan ditempelkan di atasnya. Satu batch dicatat saat mulai dan saat selesai, dengan jumlah dan sebab — tiga field, dipilih agar mencatat lebih cepat daripada memutuskan untuk tidak mencatat. Langkah perekaman apa pun yang memakan lebih dari beberapa detik akan ditunda, dan perekaman yang ditunda adalah perekaman yang dikarang.

Umur tumpukan menyusul, karena total tumpukan adalah angka yang menyesatkan bila berdiri sendiri. Stok relabel tersangkut ganda: ia tak bisa dijual, dan ia masih menempati lokasi yang bisa dipakai barang yang laku. Batch berumur sepekan dan batch baru dengan ukuran sama bukan masalah yang sama, dan hanya tampilan umur yang menunjukkannya.

Tampilan pareto datang terakhir dan membenarkan semua yang sebelumnya. Begitu data sebab terkumpul beberapa bulan, sebarannya berbentuk seperti biasa — sedikit sebab berulang menghasilkan sebagian besar volume, bercampur ekor panjang berisi kejadian tunggal yang memang tunggal. Sebaran itulah seluruh argumen untuk naik ke hulu, dan argumen itu tidak bisa dibuat tanpa datanya.

## Hasil

Relabel berhenti menjadi suasana hati dan menjadi kuantitas. Tenaganya bisa disiapkan dari tumpukan dan laju, bukan dari kesan, dan tumpukannya bisa diprioritaskan menurut umur, bukan menurut batch mana yang paling dekat.

Perubahan yang lebih berharga ada pada apa yang kini bisa dibicarakan. Dengan sebab yang terperingkat, sumber berulang bisa diangkat sebagai masalah spesifik yang berbukti, bukan sebagai keluhan. Pekerjaannya bergeser dari mengerjakan rework lebih cepat menjadi membuat rework-nya lebih sedikit dibutuhkan — dan itu satu-satunya arah di pekerjaan semacam ini yang pada akhirnya menurunkan biayanya ke nol.

*Angka dasarnya milik perusahaan, jadi saya menjelaskan mekanisme dan indikatornya, bukan menerbitkan angka internal. Dalam percakapan, saya bisa menelusuri bagaimana laju standarnya diturunkan dan bagaimana kode sebabnya dijaga tetap pendek.*

## Pelajaran

Daftar sebab versi pertama saya terlalu banyak pilihan, dan orang memilih yang terdekat alih-alih yang benar. Kesalahan ini sudah saya buat pada selisih penghitungan stok, pada write-off kedaluwarsa, dan di sini — yang berarti ia bukan kesalahan tentang salah satu domain itu. Ia kesalahan umum: himpunan kategori yang tidak bisa dipakai dengan benar oleh orang lelah di akhir shift bukanlah himpunan kategori. Pendek dan sedikit kasar selalu mengalahkan lengkap tapi tak terpakai.

Saya juga akan memulai tampilan umur bersamaan dengan lajunya, bukan beberapa bulan kemudian. Periode awal saya habis mengoptimalkan throughput atas tumpukan yang komposisinya tak bisa saya lihat — artinya saya membuat antreannya bergerak lebih cepat tanpa tahu apakah yang bergerak adalah hal yang tepat.
