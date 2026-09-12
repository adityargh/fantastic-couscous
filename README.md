# Portfolio & Resume Website

Repositori perencanaan dan pembangunan website portfolio yang berfungsi sebagai **resume digital utama** — dapat ditemukan lewat Google, terbaca dalam 30 detik oleh recruiter di ponsel, dan dibuktikan dengan studi kasus berbasis metrik.

| | |
| :--- | :--- |
| **Status** | Perencanaan selesai · Menunggu Sprint 0 (konten) |
| **Stack** | Astro 5 · Tailwind CSS 4 · TypeScript · output statis |
| **Hosting** | Cloudflare Pages (free tier) |
| **Bahasa** | English (default) + Bahasa Indonesia |
| **Biaya operasional** | **Rp 0 / bulan** |
| **Estimasi effort** | ± 56 jam kerja (± 67 jam dengan buffer 20%) |

---

## Dokumentasi

| Dokumen | Isi | Kapan dibaca |
| :--- | :--- | :--- |
| **[PORTFOLIO_WEBSITE_PLAN.md](PORTFOLIO_WEBSITE_PLAN.md)** | Rencana utama: tujuan & KPI, persona, ruang lingkup, arsitektur informasi, standar kualitas, roadmap 8 sprint, model biaya, risk register, operating model | **Mulai dari sini** |
| [docs/01-content-brief.md](docs/01-content-brief.md) | Template konten yang harus diisi — positioning, pengalaman format XYZ, 3 studi kasus, capabilities | Sprint 0 |
| [docs/02-technical-spec.md](docs/02-technical-spec.md) | Struktur repo, skema Zod, token desain, i18n, pipeline PDF, form, header keamanan, CI/CD, strategi pengujian | Sprint 1–6 |
| [docs/03-launch-checklist.md](docs/03-launch-checklist.md) | 8 quality gate, uji asap pasca-launch, runbook insiden, prosedur pemulihan | Sprint 5 dan seterusnya |
| [docs/04-decision-records.md](docs/04-decision-records.md) | ADR-001 s/d ADR-008 — keputusan arsitektur beserta alternatif yang ditolak dan trade-off-nya | Saat mempertanyakan sebuah keputusan |
| [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) | Sistem desain operasional yang sudah ada — menjadi sumber token visual (lihat ADR-008) | Sprint 1 |

---

## Langkah Berikutnya

> **Blocker tunggal saat ini: konten.**

Isi [`docs/01-content-brief.md`](docs/01-content-brief.md) sampai seluruh gerbang kualitas Sprint 0 tercentang. Jangan mulai mengoding sebelum itu — UI yang dibangun di atas konten placeholder selalu harus dibangun ulang.

Setelah brief terisi, jalankan Sprint 1 mengikuti [`docs/02-technical-spec.md`](docs/02-technical-spec.md).

---

## Prinsip yang Mengikat Seluruh Rencana

1. **Single source of truth** — satu berkas data menghasilkan halaman web, PDF CV, JSON-LD, dan ekspor JSON Resume. Tidak ada konten yang diketik dua kali.
2. **Cost efficiency nyata** — Rp 0/bulan permanen; optimasi diarahkan pada biaya pemeliharaan (berulang selamanya), bukan biaya pembangunan (sekali).
3. **Quality gate otomatis** — performa, aksesibilitas, tautan rusak, dan validitas konten diperiksa mesin di setiap PR. Standar tidak boleh bergantung pada disiplin manual.
4. **Reuse sebelum build** — sistem visual diturunkan dari `DESIGN_SYSTEM.md` yang sudah ada.
5. **Scope discipline** — fitur yang dibangun tapi tidak dirawat adalah liabilitas, bukan aset.

<!-- uji auto-commit -->
