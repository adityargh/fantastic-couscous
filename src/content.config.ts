import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Studi kasus disimpan sebagai Markdown karena isinya prosa panjang. Data
 * resume yang terstruktur tetap di src/data.json — lihat ADR-009.
 * Penamaan berkas: <slug>.<lang>.md, satu direktori datar.
 */
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
