---
lang: id
slug: ex-analysis-system
title: "Mengubah write-off kedaluwarsa dari kejutan akhir bulan jadi keputusan mingguan"
description: "Tampilan masa simpan setingkat batch yang memilah stok ke pita sisa hari, menilai eksposurnya, lalu mengubahnya menjadi satu daftar tindakan per pekan."
headline: "4 pita kedaluwarsa menghasilkan 1 daftar tindakan mingguan"
period: Jan 2025 – Okt 2025
role: "Quality Management Officer · ASTRO, Jakarta"
system: Analisis kedaluwarsa
tags: [Manajemen Kualitas, Pengendalian Inventori, Analitik]
order: 3
featured: true
reconstructed: true
measured:
  - Nilai stok yang berada di tiap pita sisa hari
  - Porsi stok mendekati kedaluwarsa yang ditindak sebelum pitanya tutup
  - Nilai write-off, dipilah menurut sebab alih-alih menurut kategori
  - Kepatuhan FEFO saat picking, disampel per zona
shots:
  - file: 01-exposure-overview.png
    title: Ringkasan eksposur
    alt: "Ringkasan nilai stok pada empat pita sisa hari, dari di atas sembilan puluh hari sampai di bawah lima belas, dengan dua pita terdekat ditandai berisiko."
    caption: "Eksposur dinyatakan sebagai nilai per pita, bukan jumlah item. Seratus unit murah dan sepuluh unit mahal bukan keputusan yang sama."
  - file: 02-batch-ageing.png
    title: Umur batch
    alt: "Tabel batch berisi SKU, kategori, tanggal kedaluwarsa, sisa hari, kuantitas tersedia, nilai berisiko, dan tindakan yang ditetapkan."
    caption: "Daftar kerjanya. Setingkat batch, karena masa simpan melekat pada batch — rata-rata setingkat SKU justru menyembunyikan satu batch yang hampir jatuh tempo."
  - file: 03-cause-mix.png
    title: Komposisi sebab
    alt: "Diagram batang mendatar yang memeringkat sebab write-off, termasuk kelebihan pesan, perputaran lambat, pelanggaran FEFO, dan kerusakan saat penyimpanan."
    caption: "Write-off adalah akibat, bukan sebab. Memeringkat sebabnya yang mengubah laporan dari catatan akuntansi menjadi sesuatu yang bisa dicegah."
  - file: 04-action-list.png
    title: Daftar tindakan mingguan
    alt: "Daftar batch berprioritas dengan tindakan yang disarankan, pemilik, tenggat, dan kolom status berisi selesai, berjalan, atau lewat tenggat."
    caption: "Analisis berakhir pada penugasan. Apa pun yang berakhir pada grafik akan berakhir pada rapat, dan rapat tidak memindahkan stok."
---

## Konteks

Setiap kategori bermasa simpan menanggung biaya yang senyap dan terus berjalan. Stok menua entah ada yang mengawasi atau tidak, dan ia menua menurut jadwal tetap yang tidak bisa ditawar. Pada operasi quick commerce dengan asortimen lebar, jadwal itu berjalan pada ribuan batch sekaligus, masing-masing dengan jamnya sendiri.

Saya mengambil pekerjaan ini saat memegang tata kelola kualitas tingkat situs. Kedaluwarsa duduk canggung di antara fungsi — inventori memegang stoknya, komersial memegang pembeliannya, kualitas memegang standarnya — dan celah semacam itulah tempat biaya berulang bisa bertahan bertahun-tahun.

## Masalah

Kedaluwarsa memang ditangani, tapi secara reaktif. Stok mendekati kedaluwarsa ditemukan saat penghitungan atau oleh orang yang kebetulan meraihnya, dan stok kedaluwarsa ditemukan saat write-off. Pada titik itu, keputusan yang tersisa hanya bagaimana memusnahkannya. Setiap pilihan yang lebih murah — memindahkannya, mempromosikannya, mengalihkannya, atau sekadar memprioritaskan picking-nya — punya tenggatnya sendiri, dan semua tenggat itu sudah lewat.

Masalah yang lebih dalam ada pada bentuk laporannya. Write-off dilaporkan sebagai angka per kategori, per bulan. Itu menjelaskan berapa biayanya dan tidak menjelaskan apa pun tentang sebabnya, sehingga percakapan yang sama berulang tiap bulan dengan kesimpulan yang sama: harus lebih hati-hati. Lebih hati-hati bukan mekanisme. Tak ada satu pun bagian laporan yang menunjuk sebab yang bisa ditindak, maka tak ada yang berubah, dan biayanya diterima ulang tiap bulan seolah-olah ia cuaca.

## Pendekatan

Saya mulai dengan mengganti satuan analisisnya. Laporan per kategori dan per bulan menjawab pertanyaan akuntansi. Pertanyaan operasionalnya adalah "batch yang mana, dan paling lambat kapan" — jadi analisisnya harus setingkat batch, dan jamnya harus sisa hari, bukan bulan kalender.

Lalu pitanya. Mengelompokkan stok ke rentang sisa hari alih-alih membaca tanggal persis itulah yang membuat datanya terpakai, karena tiap pita memetakan ke kumpulan tindakan yang berbeda. Jauh dari tenggat, pilihannya murah dan banyak. Dekat tenggat, pilihannya menyempit ke satu atau dua. Pita membuat penyempitan itu terlihat, dan justru itu intinya — laporan ini seharusnya menunjukkan pilihan yang menutup, bukan sekadar waktu yang berjalan.

Saya bersikeras menilai eksposurnya, bukan menghitungnya. Hitungan memperlakukan semua unit setara, padahal tidak; perhatian itu terbatas, dan sebaiknya pergi ke tempat uangnya berada. Saya juga bersikeras setiap write-off membawa kode sebab, karena write-off tanpa sebab adalah kuitansi, bukan informasi.

Yang secara sadar tidak saya bangun adalah ramalan kedaluwarsa ke depan. Itu fitur lanjutan yang paling jelas, dan justru akan keliru pada tahap itu — operasinya belum punya tindak lanjut yang andal atas stok yang sudah kelihatan berisiko. Meramal masalah yang belum Anda tindak hanya menambah presisi pada kediaman.

## Tindakan

Versi pertamanya berupa siklus mingguan, bukan dashboard langsung, dan itu pertukaran yang disengaja. Masa simpan bergerak dalam hitungan hari; tampilan langsung akan menambah biaya dan rasa mendesak tanpa menambah satu pun keputusan. Irama mingguan cocok dengan laju perubahan benda yang diukurnya.

Tiap pekan menghasilkan satu daftar: batch pada pita berisiko, diurutkan menurut nilai, masing-masing dengan tindakan yang disarankan, pemilik, dan tenggat. Bagian saran itulah yang membuatnya dipakai — daftar masalah hanya dibaca, daftar penugasan dikerjakan.

Kode sebabnya butuh dua putaran. Set pertama terlalu rinci, dan orang memilih yang terdekat alih-alih yang benar. Saya potong menjadi daftar pendek yang diangkat dari temuan pekan-pekan awal, dan kualitas datanya langsung membaik. Pelajaran yang sama dari selisih penghitungan stok berlaku di sini tanpa perlu diubah sama sekali.

## Hasil

Kedaluwarsa bergeser dari peristiwa akuntansi bulanan menjadi keputusan operasional mingguan. Pita berisiko memberi operasi sebuah jendela saat pilihan murah masih ada, dan komposisi sebab memberi bahan perdebatan yang berada di hulu kerugian — kuantitas pembelian, laju perputaran, disiplin FEFO di muka picking — bukan kerugiannya sendiri.

Efek samping yang paling berguna justru bukan pada stoknya. Begitu write-off punya sebab yang melekat, percakapan antara kualitas, inventori, dan komersial akhirnya punya objek bersama. Sebelumnya, tiap fungsi punya penjelasannya sendiri, dan tak satu pun bisa diperiksa.

*Angka dasarnya milik perusahaan, jadi saya menjelaskan mekanisme dan indikatornya, bukan menerbitkan angka internal. Dalam percakapan, saya bisa menelusuri bagaimana pitanya dipilih dan bagaimana kode sebabnya didefinisikan.*

## Pelajaran

Saya menetapkan batas pita dari masa simpan produknya, bukan dari waktu tunggu tindakan yang tersedia. Itu terbalik. Sebuah pita baru bermakna bila, pada saat stok masuk ke dalamnya, masih ada waktu untuk melakukan hal yang menjadi tujuan pita itu — jadi batasnya seharusnya diturunkan dari berapa lama tiap tindakan butuh diatur, bukan dari angka bulat yang rapi. Menggambar ulang atas dasar itu membuat pita dekat menyempit dan pita jauh melebar, dan membuat daftarnya benar-benar bisa ditindak.

Saya juga akan melacak porsi stok berisiko yang benar-benar ditindak sejak pekan pertama. Saya mengukur eksposur jauh lebih dulu daripada mengukur tindak lanjut, padahal tindak lanjut itulah kendalanya sejak awal.
