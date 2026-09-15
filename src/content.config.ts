import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Studi kasus disimpan sebagai Markdown karena isinya prosa panjang. Data
 * resume yang terstruktur tetap di src/data.json — lihat ADR-009.
 * Penamaan berkas: <slug>.<lang>.md, satu direktori datar.
 */

/**
 * Satu tangkapan antarmuka. Ukurannya seragam dan dipatok di src/site.ts
 * (SHOT_W × SHOT_H) supaya <img> selalu punya width/height — nol pergeseran
 * tata letak saat gambar masuk.
 */
const shot = z.object({
  /** Nama berkas di public/shots/<slug>/. Urutan ditentukan awalan angka. */
  file: z.string().regex(/^0[1-4]-[a-z0-9-]+\.png$/, 'nama berkas: 0N-nama-kebab.png'),
  /** Judul pendek panel — dipakai sebagai label thumbnail dan heading lightbox. */
  title: z.string().min(3).max(48),
  /** Teks alternatif: menjelaskan APA yang terlihat, untuk pembaca layar. */
  alt: z.string().min(25).max(180),
  /** Keterangan: menjelaskan MENGAPA panel ini ada. Bukan pengulangan alt. */
  caption: z.string().min(25).max(200),
}).strict();

export const collections = {
  projects: defineCollection({
    loader: glob({
      pattern: '**/*.md',
      base: './src/content/projects',
      // WAJIB: generateId bawaan memotong nama berkas pada titik PERTAMA,
      // sehingga <slug>.en.md dan <slug>.id.md bertabrakan pada id yang sama
      // dan versi kedua tertimpa tanpa peringatan.
      generateId: ({ entry }) => entry.replace(/\.md$/, '').replace(/\./g, '-'),
    }),
    schema: z.object({
      lang: z.enum(['en', 'id']),
      slug: z.string().regex(/^[a-z0-9-]+$/, 'slug: huruf kecil dan tanda hubung saja'),
      title: z.string().min(10).max(90),
      description: z.string().min(70).max(165), // batas praktis meta description Google
      headline: z.string().regex(/\d/, 'metrik headline wajib memuat angka'),
      period: z.string().min(4),
      role: z.string().min(3),

      /** Jenis sistem — kata benda pendek. Tampil sebagai kicker di katalog. */
      system: z.string().min(3).max(32),

      tags: z.array(z.string()).min(2).max(4),
      order: z.number().int().default(99),
      featured: z.boolean().default(false),

      /**
       * Indikator yang dikemudikan sehari-hari. WAJIB — menyebut apa yang Anda
       * ukur adalah sinyal kompetensi operasional, dan tidak menuntut angka
       * yang mungkin bersifat rahasia perusahaan (ADR-010).
       */
      measured: z.array(z.string().min(3)).min(2).max(5),

      /**
       * TEPAT empat tangkapan antarmuka (ADR-013). Empat, bukan "minimal
       * empat": katalog memberi setiap proyek bingkai yang sama besar, dan
       * proyek dengan lima panel akan merusak keseragaman itu tanpa menambah
       * informasi. Kalau sebuah sistem punya lebih dari empat layar penting,
       * pilih empat yang menjelaskan alurnya — itu keputusan editorial, dan
       * memang harus dipaksa.
       */
      shots: z.array(shot).length(4, 'wajib tepat 4 tangkapan layar per studi kasus'),

      /**
       * Antarmuka aslinya adalah sistem internal perusahaan dan tidak boleh
       * dipublikasikan. Yang ditampilkan adalah rekonstruksi tata letak dengan
       * data contoh. Nilainya WAJIB dinyatakan, bukan dibiarkan default, agar
       * menampilkan tangkapan asli kelak menjadi keputusan sadar (ADR-013).
       */
      reconstructed: z.boolean(),

      /**
       * Tabel sebelum/sesudah. OPSIONAL secara sengaja: lebih baik kosong
       * daripada diisi angka karangan. Begitu diisi, tabel muncul otomatis.
       */
      metrics: z
        .array(
          z.object({
            name: z.string(),
            before: z.string(),
            after: z.string(),
            delta: z.string(),
            window: z.string(),
          }),
        )
        .optional(),
    }),
  }),
};
