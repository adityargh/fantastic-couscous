---
lang: id
slug: occupancy-monitoring-alert
title: "Memperingatkan okupansi penyimpanan sebelum satu zona kehabisan ruang"
description: "Tingkat isi per zona dengan ambang yang memperingatkan shift lead selagi palet masih punya tempat, bukan setelah lorongnya terlanjur tertutup."
headline: "3 ambang, 1 peringatan sebelum jenuh"
period: Mar 2026 – Jul 2026
role: "Warehouse Operations Analyst Supervisor · ASTRO, Jakarta"
system: Pemantauan & peringatan
tags: [Operasional Gudang, Pemantauan, Kapasitas]
order: 2
featured: true
reconstructed: true
measured:
  - Tingkat isi tiap zona penyimpanan, diperbarui sepanjang shift
  - Lama jam tiap zona berada di atas ambang peringatan
  - Percobaan put-away yang gagal karena tidak ada lokasi
  - Jeda dari peringatan terbit sampai zona kembali di bawah ambang
shots:
  - file: 01-zone-map.png
    title: Peta zona
    alt: "Denah lantai zona penyimpanan yang diwarnai menurut tingkat isi, dengan legenda sehat, waspada, dan kritis, serta panel samping berisi tiga zona terpenuh."
    caption: "Okupansi dibaca sebagai denah, bukan tabel, karena keputusan put-away bersifat ruang. Yang dipilih adalah ke mana melangkah, bukan kolom mana yang diurutkan."
  - file: 02-fill-trend.png
    title: Tren tingkat isi
    alt: "Grafik garis tingkat isi empat zona selama empat belas hari terakhir, dengan ambang peringatan digambar sebagai garis acuan mendatar."
    caption: "Tren menjawab hal yang tidak bisa dijawab angka langsung: zona ini sesak hari ini, atau sudah diam-diam menyesak selama dua minggu?"
  - file: 03-threshold-rules.png
    title: Aturan ambang
    alt: "Tabel konfigurasi berisi satu baris per zona dengan persentase waspada dan kritis, penerima tiap peringatan, dan pengaturan jam senyap."
    caption: "Ambang disetel per zona, bukan global. Zona cepat di delapan puluh persen itu normal; zona lambat di angka yang sama sudah bermasalah."
  - file: 04-alert-log.png
    title: Log peringatan
    alt: "Log kronologis peringatan yang terbit berisi zona, tingkat, waktu terbit, siapa yang menerima, dan lama waktu sampai tertutup."
    caption: "Setiap peringatan ditutup oleh manusia, dan log menyimpan catatannya. Peringatan yang tak pernah ditutup adalah cara sistem pemantauan mengajari orang mengabaikannya."
---

## Konteks

Gudang quick commerce menghabiskan seharian dalam tegangan antara dua arus: barang masuk yang butuh tempat, dan barang keluar yang mengembalikan tempat itu. Okupansi penyimpanan adalah titik temu keduanya. Saat sehat, tak seorang pun menyebutnya. Saat tidak, semua hal lain melambat dengan cara yang nyaris tak pernah dikembalikan ke sebab aslinya.

Saya membangunnya sambil memegang analitik operasional gudang untuk hub Jakarta, setelah periode menjalankan dry inventory di situs kedua — tempat saya pertama kali melihat masalah ini dari sisi penerimaan.

## Masalah

Okupansi sebenarnya diketahui, tapi pada waktu dan resolusi yang salah. Ada angka tingkat situs yang ditinjau berkala, dan ada pengetahuan langsung siapa pun yang kebetulan sedang menaruh barang saat itu. Di antara keduanya, kosong.

Celah itu punya akibat yang khas. Sebuah situs bisa duduk di okupansi rata-rata yang nyaman sementara satu zona sudah jenuh total, karena rata-rata justru menyembunyikan hal yang perlu dilihat. Sinyal pertama bahwa sebuah zona penuh adalah operator yang memegang palet tanpa tempat menaruhnya — dan pada titik itu semua pilihan buruk: membawanya ke zona jauh dan menerima picking yang lebih lambat nanti, menaruhnya di lorong dan menerima masalah keselamatan sekaligus akurasi, atau menahannya di dok dan mendorong kemacetan kembali ke penerimaan.

Tidak satu pun kegagalan itu terlihat sebagai kegagalan okupansi setelahnya. Semuanya tampak sebagai put-away yang lambat, unit yang salah taruh, atau penerimaan yang tertunda. Sebabnya terus tercatat sebagai salah satu gejalanya.

## Pendekatan

Pertanyaan desainnya bukan "bagaimana mengukur okupansi" — angka itu sudah ada. Pertanyaannya: "seberapa awal angka itu harus tiba agar ada gunanya", dan jawabannya: sebelum paletnya ada di tangan orang. Pertanyaan itu menggeser seluruh pekerjaan dari pelaporan menjadi peringatan.

Ada dua keputusan yang membentuk sisanya. Pertama, ambang per zona, bukan satu angka global, karena zona tidak setara. Zona cepat mengosongkan dirinya beberapa kali sehari dan aman berjalan sesak; zona lambat pada persentase yang sama tidak punya kelegaan alami yang menunggu, dan benar-benar sedang bermasalah. Satu ambang untuk keduanya akan menjadi peringatan palsu bagi yang pertama atau kebisuan bagi yang kedua — dan sistem pemantauan yang melakukan salah satunya akan dimatikan orang dalam sebulan.

Kedua, setiap peringatan punya penerima bernama dan harus ditutup oleh manusia. Bagian inilah yang biasanya dilewati tim, dan justru ini yang memisahkan sistem pemantauan dari mesin kebisingan. Peringatan yang kedaluwarsa sendiri melatih semua orang untuk menunggunya kedaluwarsa.

Saya memilih tidak membuat rekomendasi slotting otomatis. Menggoda, dan di luar ruang lingkup — tugas sistem ini adalah mengatakan "zona ini akan penuh, dan ini perkiraan kapannya", sementara orang yang sedang bertugas jauh lebih layak memutuskan tindakannya ketimbang saya. Saran yang benar enam dari sepuluh kali lebih buruk daripada tanpa saran, karena memeriksanya tetap memakan perhatian.

## Tindakan

Pembangunan dimulai dari petanya, bukan dari metriknya. Okupansi adalah informasi ruang, dan menggambarkannya sebagai denah alih-alih tabel terurut membuat keputusan put-away bisa dibaca langsung dari layar. Satu pilihan itu menghapus sebagian besar kerja penafsiran.

Lalu tampilan tren, karena persentase langsung kehilangan satu dimensi. Zona di delapan puluh lima persen yang pekan lalu ada di enam puluh adalah situasi berbeda dari zona yang sudah sebulan di delapan puluh lima, dan responsnya pun berbeda — yang pertama masalah arus, yang kedua masalah kapasitas.

Ambangnya sendiri saya setel konservatif lebih dulu, baru diturunkan, dan urutannya memang disengaja. Mulai dari berisik lalu menenangkan berarti setiap pengurangan dibenarkan oleh peringatan palsu yang nyata. Mulai dari senyap lalu menaikkan kepekaan berarti menghabiskan pekan-pekan awal tanpa tahu apa yang terlewat.

## Hasil

Okupansi bergeser dari sesuatu yang ditemukan pada detik put-away menjadi sesuatu yang diketahui lebih awal, pada resolusi tempat keputusan benar-benar diambil: zona. Log peringatan mengubah rentetan insiden yang dulu tak saling terhubung menjadi catatan yang punya bentuk — zona mana yang sering menerbitkan peringatan, seberapa sering, dan berapa lama tertutupnya.

Catatan itulah yang paling saya hargai. Peringatan langsung menyelesaikan palet hari ini. Log-nya yang kelak memungkinkan seseorang mengusulkan perubahan tata letak atau slotting dengan bukti, bukan dengan firasat kuat.

*Angka dasarnya milik perusahaan, jadi saya menjelaskan mekanisme dan indikatornya, bukan menerbitkan angka internal. Dalam percakapan, saya bisa menelusuri bagaimana ambangnya ditetapkan dan bagaimana ia disetel ulang.*

## Pelajaran

Versi pertama saya hanya memperingatkan pada ambang kritis. Benar, dan tidak berguna — begitu sebuah zona kritis, keputusannya sudah terpaksa. Menambahkan tingkat waspada di bawahnya adalah perubahan yang membuat sistem ini layak ada, dan itu mengajari saya sesuatu yang kini saya perlakukan sebagai aturan: peringatan baru berguna bila terbit selagi masih ada lebih dari satu pilihan. Yang lebih lambat dari itu adalah pemberitahuan, bukan peringatan.

Saya juga akan mengukur percobaan put-away yang gagal sejak hari pertama. Indikator itu saya tambahkan terlambat, dan ternyata ia bukti paling jernih atas masalahnya — lebih baik daripada tingkat isi itu sendiri, karena ia menghitung momen saat kekurangan ruang benar-benar memakan biaya.
