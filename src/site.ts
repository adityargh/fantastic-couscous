/**
 * Satu-satunya modul konfigurasi: skema data, validasi, i18n, dan helper rute.
 *
 * Digabung ke dalam satu berkas secara sengaja (ADR-009). Pada situs sekecil
 * ini, memecahnya menjadi src/i18n/, src/consts.ts, dan src/content/config.ts
 * hanya menambah berkas tanpa menambah kejelasan.
 */
import { z } from 'astro:content';
import raw from './data.json';

/* ------------------------------------------------------------------ i18n -- */

export const LOCALES = ['en', 'id'] as const;
export type Lang = (typeof LOCALES)[number];
export const DEFAULT_LANG: Lang = 'en';
export const HTML_LANG: Record<Lang, string> = { en: 'en-US', id: 'id-ID' };

/* ------------------------------------------------------------------ skema -- */

/** Menegakkan aturan konten: nilai WAJIB memuat setidaknya satu angka. */
const numeric = (message: string) => z.string().regex(/\d/, message);

const profileSchema = z
  .object({
    name: z.string().min(1),
    headline: z.string().min(1).max(80),
    positioning: z.string().min(20).max(220),
    location: z.string().min(1),
    availability: z.string().min(1),
    years: z.number().int().positive(),

    highlights: z
      .array(
        z.object({
          value: numeric('impact highlight wajib memuat angka'),
          label: z.string().max(40),
          context: z.string().max(160),
        }).strict(),
      )
      .min(3)
      .max(4),

    experience: z
      .array(
        z.object({
          title: z.string().min(1),
          company: z.string().min(1),
          industry: z.string().optional(),
          location: z.string().min(1),
          start: z.string().regex(/^\d{4}-\d{2}$/, 'format tanggal harus YYYY-MM'),
          end: z.union([z.string().regex(/^\d{4}-\d{2}$/), z.literal('present')]),
          type: z.enum(['full-time', 'contract', 'consulting', 'internship']),
          scope: z.string().optional(),
          summary: z.string().max(280),
          achievements: z
            .array(numeric('bullet pencapaian wajib memuat angka terukur').min(20))
            .min(1)
            .max(6),
          tools: z.array(z.string()).default([]),
        }).strict(),
      )
      .min(1),

    skills: z
      .array(
        z.object({
          domain: z.string().min(1),
          items: z
            .array(
              // .strict() menolak field persentase: skill bar adalah sinyal palsu.
              z.object({
                name: z.string().min(1),
                level: z.enum(['expert', 'proficient', 'familiar']),
              }).strict(),
            )
            .min(1),
        }).strict(),
      )
      .min(1),

    education: z
      .array(
        z.object({
          kind: z.enum(['degree', 'certification', 'award']),
          name: z.string().min(1),
          institution: z.string().min(1),
          year: z.string().min(4),
          url: z.union([z.string().url(), z.literal('')]).optional(),
        }).strict(),
      )
      .default([]),

    about: z.array(z.string().min(1)).min(1),
    contactIntro: z.string().min(1),
  })
  // .strict() juga menegakkan privasi: tidak ada field untuk nomor telepon,
  // alamat, atau tanggal lahir, sehingga menambahkannya akan MENGGAGALKAN build.
  .strict();

const dataSchema = z.object({
  draft: z.boolean(),
  _readme: z.string().optional(),
  contact: z.object({
    web3formsKey: z.string(),
    social: z.array(z.object({ label: z.string().min(1), url: z.string().url() })),
  }),
  en: profileSchema,
  id: profileSchema,
});

const parsed = dataSchema.safeParse(raw);
if (!parsed.success) {
  throw new Error(
    'src/data.json tidak valid — build dihentikan:\n' +
      parsed.error.issues.map((i) => `  • ${i.path.join('.')}: ${i.message}`).join('\n'),
  );
}

export const DATA = parsed.data;
export const DRAFT = DATA.draft;
export const CONTACT = DATA.contact;
export type Profile = z.infer<typeof profileSchema>;
export const profileOf = (lang: Lang): Profile => DATA[lang];

/* ------------------------------------------------------------------ rute -- */

/** Membangun URL untuk sebuah halaman dalam bahasa tertentu. */
export function hrefFor(lang: Lang, path = '/'): string {
  const clean = path === '/' ? '' : `/${path.replace(/^\/|\/$/g, '')}`;
  return lang === DEFAULT_LANG ? clean || '/' : `/${lang}${clean}`;
}

/** getStaticPaths untuk setiap rute `[...lang]`. */
export function langPaths() {
  return LOCALES.map((lang) => ({
    params: { lang: lang === DEFAULT_LANG ? undefined : lang },
    props: { lang },
  }));
}

export const PAGES = ['/', '/about', '/projects', '/contact', '/cv'] as const;

/* ------------------------------------------------------------- teks antarmuka -- */

type Key =
  | 'nav.about' | 'nav.projects' | 'nav.contact' | 'nav.cv'
  | 'hero.caseStudies' | 'hero.downloadCv' | 'hero.available'
  | 'sec.impact' | 'sec.experience' | 'sec.skills' | 'sec.featured' | 'sec.cta'
  | 'sec.education' | 'sec.about'
  | 'cta.title' | 'cta.body' | 'cta.button'
  | 'proj.all' | 'proj.result' | 'proj.role' | 'proj.period' | 'proj.metrics'
  | 'proj.before' | 'proj.after' | 'proj.delta' | 'proj.window' | 'proj.back'
  | 'cv.print' | 'cv.hint' | 'cv.title'
  | 'form.name' | 'form.email' | 'form.message' | 'form.send' | 'form.required'
  | 'form.help' | 'form.unconfigured'
  | 'ui.present' | 'ui.skip' | 'ui.theme' | 'ui.switchLang' | 'ui.draft'
  | 'ui.notFound' | 'ui.notFoundBody' | 'ui.home' | 'ui.level'
  | 'level.expert' | 'level.proficient' | 'level.familiar';

export const UI: Record<Lang, Record<Key, string>> = {
  en: {
    'nav.about': 'About', 'nav.projects': 'Case studies', 'nav.contact': 'Contact', 'nav.cv': 'CV',
    'hero.caseStudies': 'View case studies', 'hero.downloadCv': 'Download CV',
    'hero.available': 'Availability',
    'sec.impact': 'Impact in numbers', 'sec.experience': 'Experience',
    'sec.skills': 'Core capabilities', 'sec.featured': 'Selected case studies',
    'sec.cta': 'Get in touch', 'sec.education': 'Education & certifications',
    'sec.about': 'About',
    'cta.title': 'Let us talk operations',
    'cta.body': 'Tell me what is slowing your operation down and I will tell you how I would measure it.',
    'cta.button': 'Start a conversation',
    'proj.all': 'All case studies', 'proj.result': 'Result', 'proj.role': 'Role',
    'proj.period': 'Period', 'proj.metrics': 'Measured outcome',
    'proj.before': 'Before', 'proj.after': 'After', 'proj.delta': 'Change',
    'proj.window': 'Measured over', 'proj.back': 'Back to all case studies',
    'cv.print': 'Save as PDF', 'cv.title': 'Curriculum vitae',
    'cv.hint': 'This page is formatted for A4. Use Save as PDF to get a file for ATS uploads.',
    'form.name': 'Name', 'form.email': 'Email', 'form.message': 'Message',
    'form.send': 'Send message', 'form.required': 'required',
    'form.help': 'At least 20 characters.',
    'form.unconfigured': 'The contact form is not configured yet. Set contact.web3formsKey in src/data.json. Until then, use the links below.',
    'ui.present': 'Present', 'ui.skip': 'Skip to content', 'ui.theme': 'Toggle dark mode',
    'ui.switchLang': 'Baca dalam Bahasa Indonesia', 'ui.level': 'Level',
    'ui.draft': 'Draft — this site still contains placeholder content and is not indexed.',
    'ui.notFound': 'Page not found',
    'ui.notFoundBody': 'That page does not exist. It may have been moved or the link may be wrong.',
    'ui.home': 'Go to homepage',
    'level.expert': 'Expert', 'level.proficient': 'Proficient', 'level.familiar': 'Familiar',
  },
  id: {
    'nav.about': 'Tentang', 'nav.projects': 'Studi kasus', 'nav.contact': 'Kontak', 'nav.cv': 'CV',
    'hero.caseStudies': 'Lihat studi kasus', 'hero.downloadCv': 'Unduh CV',
    'hero.available': 'Ketersediaan',
    'sec.impact': 'Dampak dalam angka', 'sec.experience': 'Pengalaman',
    'sec.skills': 'Kemampuan inti', 'sec.featured': 'Studi kasus pilihan',
    'sec.cta': 'Hubungi saya', 'sec.education': 'Pendidikan & sertifikasi',
    'sec.about': 'Tentang',
    'cta.title': 'Mari bicara operasional',
    'cta.body': 'Ceritakan apa yang memperlambat operasi Anda, dan saya akan jelaskan bagaimana saya mengukurnya.',
    'cta.button': 'Mulai percakapan',
    'proj.all': 'Semua studi kasus', 'proj.result': 'Hasil', 'proj.role': 'Peran',
    'proj.period': 'Periode', 'proj.metrics': 'Hasil terukur',
    'proj.before': 'Sebelum', 'proj.after': 'Sesudah', 'proj.delta': 'Perubahan',
    'proj.window': 'Periode ukur', 'proj.back': 'Kembali ke semua studi kasus',
    'cv.print': 'Simpan sebagai PDF', 'cv.title': 'Daftar riwayat hidup',
    'cv.hint': 'Halaman ini diformat untuk A4. Gunakan Simpan sebagai PDF untuk mendapatkan berkas yang siap diunggah ke ATS.',
    'form.name': 'Nama', 'form.email': 'Email', 'form.message': 'Pesan',
    'form.send': 'Kirim pesan', 'form.required': 'wajib',
    'form.help': 'Minimal 20 karakter.',
    'form.unconfigured': 'Form kontak belum dikonfigurasi. Isi contact.web3formsKey di src/data.json. Sementara itu, gunakan tautan di bawah.',
    'ui.present': 'Sekarang', 'ui.skip': 'Lompat ke konten', 'ui.theme': 'Ganti mode gelap',
    'ui.switchLang': 'Read in English', 'ui.level': 'Tingkat',
    'ui.draft': 'Draf — situs ini masih memuat konten placeholder dan tidak diindeks.',
    'ui.notFound': 'Halaman tidak ditemukan',
    'ui.notFoundBody': 'Halaman tersebut tidak ada. Mungkin sudah dipindahkan atau tautannya keliru.',
    'ui.home': 'Ke beranda',
    'level.expert': 'Expert', 'level.proficient': 'Proficient', 'level.familiar': 'Familiar',
  },
};

export const t = (lang: Lang) => (key: Key): string => UI[lang][key];

/* ------------------------------------------------------------------ format -- */

export function monthLabel(ym: string, lang: Lang): string {
  const [y, m] = ym.split('-');
  const d = new Date(Number(y), Number(m) - 1, 1);
  return new Intl.DateTimeFormat(HTML_LANG[lang], { month: 'short', year: 'numeric' }).format(d);
}

export function periodLabel(start: string, end: string, lang: Lang): string {
  const to = end === 'present' ? UI[lang]['ui.present'] : monthLabel(end, lang);
  return `${monthLabel(start, lang)} – ${to}`;
}
