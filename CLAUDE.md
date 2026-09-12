# CLAUDE.md

Instruksi untuk sesi Claude Code yang bekerja di repositori ini.

## Alur Git: commit & push langsung ke `main`

Pemilik repositori secara eksplisit meminta agar **setiap sesi melakukan commit dan push langsung ke `main`**, tanpa melalui pull request.

- Kembangkan di branch kerja yang ditetapkan sesi (`claude/...`) bila ada, lalu dorong hasilnya ke `main` dengan `git push origin HEAD:main`.
- Dorong juga branch kerja itu sendiri agar tetap sinkron.
- **Jangan pernah force-push.** Jika push ditolak karena non-fast-forward, integrasikan dulu (`git fetch origin main && git merge origin/main`), selesaikan konflik, baru push ulang.
- Buat pull request hanya bila diminta secara eksplisit.

## Otomasi

Stop hook [`.claude/hooks/auto-commit-push.sh`](.claude/hooks/auto-commit-push.sh) — terdaftar di [`.claude/settings.json`](.claude/settings.json) — menjalankan alur di atas otomatis di akhir setiap giliran, pada setiap sesi baru.

Hook tersebut:

| Perilaku | Keterangan |
| :--- | :--- |
| Commit sisa perubahan | Hanya bila ada perubahan yang belum ter-commit. Pesan commit dibuat otomatis. |
| Push ke `main` | `git push origin HEAD:main`, lalu sinkronkan branch kerja. |
| Menolak berkas kredensial | Membatalkan commit bila ada `.env`, `*.pem`, `*.key`, `id_rsa`, `*credentials*.json`, dll. Deteksi berbasis nama berkas. |
| Tidak pernah force-push | Konflik dilaporkan agar diselesaikan manual. |
| Diam saat tidak ada pekerjaan | Tidak membuat commit kosong atau notifikasi tanpa isi. |

Hook **tidak menggantikan commit yang baik.** Tetap buat commit manual dengan pesan yang deskriptif untuk pekerjaan yang berarti — hook hanya menyapu sisa yang belum ter-commit dan memastikan semuanya terdorong.

## Konteks proyek

Repositori ini memuat rencana pembangunan website portfolio/resume. Mulai dari [`PORTFOLIO_WEBSITE_PLAN.md`](PORTFOLIO_WEBSITE_PLAN.md); dokumen turunan ada di [`docs/`](docs/).

Keputusan arsitektur dicatat sebagai ADR di [`docs/04-decision-records.md`](docs/04-decision-records.md). **Perubahan ruang lingkup harus dicatat sebagai ADR baru**, bukan diputuskan diam-diam di tengah implementasi.
