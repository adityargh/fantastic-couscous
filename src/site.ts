/**
 * Satu-satunya modul konfigurasi: skema data, validasi, i18n, dan helper rute.
 *
 * Digabung ke dalam satu berkas secara sengaja (ADR-009). Pada situs sekecil
 * ini, memecahnya menjadi src/i18n/, src/consts.ts, dan src/content/config.ts
 * hanya menambah berkas tanpa menambah kejelasan.
 */
import { z } from 'astro:content';
import raw from './data.json';

/* ------------------------------------------------------------------ situs -- */

/**
 * Cadangan bila `Astro.site` tidak tersedia. SATU-SATUNYA salinan URL produksi
 * di dalam src/ — sumber kebenarannya tetap `site` di astro.config.mjs, dan
 * robots.txt kini dibangkitkan dari `Astro.site` (ADR-010).
 */
export const FALLBACK_SITE = new URL('https://aditya-fauzi.pages.dev');

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
    /** Jabatan nyata. Dipakai di <title>, JSON-LD, dan resume.json — jaga tetap pendek. */
    headline: z.string().min(1).max(80),
    /** Pilar keahlian. Tampil sebagai chip di hero; menggantikan headline panjang (ADR-010). */
    disciplines: z.array(z.string().min(2).max(40)).min(3).max(6),
    positioning: z.string().min(20).max(240),
    location: z.string().min(1),
    availability: z.string().min(1),
    years: z.number().int().positive(),

    highlights: z
      .array(
        z.object({
          value: numeric('angka rekam jejak wajib memuat digit'),
          label: z.string().max(40),
          context: z.string().max(170),
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
          summary: z.string().max(300),
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
          note: z.string().max(120).optional(),
          items: z
            .array(
              // .strict() menolak field persentase: skill bar adalah sinyal palsu.
              // Tingkat bersifat ordinal (3 langkah), bukan presisi semu.
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
          period: z.string().optional(),
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
  /** Daftar angka yang masih menunggu verifikasi pemilik. Dokumentasi, bukan render. */
  _verify: z.array(z.string()).optional(),
  contact: z.object({
    web3formsKey: z.string(),
    /**
     * Email publik. Rencana awal (docs/01 §H) menyembunyikannya dan hanya
     * menyediakan form; pemilik membalikkan keputusan itu — lihat ADR-011.
     * Kosongkan string ini untuk menyembunyikannya lagi dari seluruh situs.
     */
    email: z.union([z.string().email(), z.literal('')]).default(''),
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
export type Role = Profile['experience'][number];
export const profileOf = (lang: Lang): Profile => DATA[lang];

/* --------------------------------------------------- tangkapan antarmuka -- */

/**
 * Seluruh tangkapan dibangkitkan pada ukuran yang SAMA (scripts/shots.mjs),
 * sehingga setiap <img> bisa membawa width/height — nol pergeseran tata letak
 * saat gambar masuk, dan rasio bingkainya seragam di seluruh katalog.
 */
export const SHOT_W = 1280;
export const SHOT_H = 800;

/** URL publik sebuah tangkapan. Satu-satunya tempat jalur ini dibentuk. */
export const shotSrc = (slug: string, file: string) => `/shots/${slug}/${file}`;

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

/** Halaman kanonik — yang masuk sitemap. Rute utilitas form sengaja di luar. */
export const PAGES = ['/', '/about', '/projects', '/contact', '/cv'] as const;

/* ----------------------------------------------------- pengelompokan peran -- */

export type Tenure = {
  company: string;
  industry?: string;
  roles: Role[];
  start: string;
  end: string;
  months: number;
};

/** Selisih bulan inklusif antara dua penanda YYYY-MM (atau 'present'). */
export function monthsBetween(start: string, end: string): number {
  const now = new Date();
  const [ys, ms] = start.split('-').map(Number);
  const [ye, me] =
    end === 'present' ? [now.getFullYear(), now.getMonth() + 1] : end.split('-').map(Number);
  return (ye - ys) * 12 + (me - ms) + 1;
}

/** Label durasi manusiawi: "4 thn 1 bln" / "4 yrs 1 mo". */
export function durationLabel(months: number, lang: Lang): string {
  const y = Math.floor(months / 12);
  const m = months % 12;
  const u = lang === 'id' ? { y: 'thn', m: 'bln' } : { y: y === 1 ? 'yr' : 'yrs', m: 'mo' };
  return [y > 0 ? `${y} ${u.y}` : '', m > 0 ? `${m} ${u.m}` : ''].filter(Boolean).join(' ') || `1 ${u.m}`;
}

/**
 * Mengelompokkan peran berurutan pada perusahaan yang sama menjadi satu blok.
 * Lima peran di satu perusahaan adalah sinyal karier terkuat pada profil ini —
 * menampilkannya sebagai satu jalur, bukan lima kartu terpisah, adalah inti
 * dari revamp ini (ADR-010).
 */
export function tenures(roles: Role[]): Tenure[] {
  const out: Tenure[] = [];
  for (const r of roles) {
    const last = out[out.length - 1];
    if (last && last.company === r.company) {
      last.roles.push(r);
      last.start = r.start < last.start ? r.start : last.start;
    } else {
      out.push({
        company: r.company,
        industry: r.industry,
        roles: [r],
        start: r.start,
        end: r.end,
        months: 0,
      });
    }
  }
  for (const t of out) t.months = monthsBetween(t.start, t.end);
  return out;
}

/* ------------------------------------------------------------- teks antarmuka -- */

type Key =
  | 'nav.about' | 'nav.projects' | 'nav.contact' | 'nav.cv' | 'nav.label'
  | 'hero.caseStudies' | 'hero.downloadCv' | 'hero.available' | 'hero.experience'
  | 'sec.record' | 'sec.experience' | 'sec.skills' | 'sec.featured' | 'sec.cta'
  | 'sec.education' | 'sec.about' | 'sec.contents'
  | 'cta.title' | 'cta.body' | 'cta.button'
  | 'proj.all' | 'proj.result' | 'proj.role' | 'proj.period' | 'proj.metrics'
  | 'proj.before' | 'proj.after' | 'proj.delta' | 'proj.window' | 'proj.back'
  | 'proj.measured' | 'proj.measuredHint' | 'proj.read' | 'proj.count'
  | 'proj.interface' | 'proj.interfaceHint' | 'proj.reconstructed'
  | 'proj.fullSize' | 'proj.screens' | 'proj.screen' | 'proj.system'
  | 'proj.catalogLede' | 'proj.openShot'
  | 'cv.print' | 'cv.hint' | 'cv.title' | 'cv.profile' | 'cv.contact'
  | 'form.name' | 'form.email' | 'form.message' | 'form.send' | 'form.required'
  | 'form.help' | 'form.unconfigured' | 'form.counter' | 'form.expect' | 'form.alt'
  | 'form.okTitle' | 'form.okBody' | 'form.errTitle' | 'form.errBody'
  | 'form.direct' | 'form.directHint' | 'form.or' | 'cv.download'
  | 'ui.present' | 'ui.skip' | 'ui.theme' | 'ui.themeAuto' | 'ui.themeLight'
  | 'ui.themeDark' | 'ui.switchLang' | 'ui.draft' | 'ui.current'
  | 'ui.notFound' | 'ui.notFoundBody' | 'ui.home' | 'ui.level' | 'ui.roleCount'
  | 'level.expert' | 'level.proficient' | 'level.familiar';

export const UI: Record<Lang, Record<Key, string>> = {
  en: {
    'nav.about': 'About', 'nav.projects': 'Case studies', 'nav.contact': 'Contact',
    'nav.cv': 'CV', 'nav.label': 'Main navigation',
    'hero.caseStudies': 'Read the case studies', 'hero.downloadCv': 'View CV',
    'hero.available': 'Availability', 'hero.experience': 'years in operations',
    'sec.record': 'Track record in numbers', 'sec.experience': 'Career path',
    'sec.skills': 'Core capabilities', 'sec.featured': 'Selected case studies',
    'sec.cta': 'Get in touch', 'sec.education': 'Education',
    'sec.about': 'About', 'sec.contents': 'On this page',
    'cta.title': 'Let us talk operations',
    'cta.body': 'Tell me where your operation loses accuracy, time or margin — and I will tell you how I would measure it before changing anything.',
    'cta.button': 'Start a conversation',
    'proj.all': 'All case studies', 'proj.result': 'Outcome', 'proj.role': 'Role',
    'proj.period': 'Period', 'proj.metrics': 'Measured outcome',
    'proj.before': 'Before', 'proj.after': 'After', 'proj.delta': 'Change',
    'proj.window': 'Measured over', 'proj.back': 'All case studies',
    'proj.measured': 'What I measured',
    'proj.measuredHint': 'The indicators this work was steered by, day to day.',
    'proj.read': 'Read case study', 'proj.count': 'case studies',
    'proj.interface': 'Interface', 'proj.screens': 'screens', 'proj.screen': 'Screen',
    'proj.system': 'System',
    'proj.interfaceHint': 'The four views that carry the work, in the order someone on shift moves through them.',
    'proj.reconstructed': 'Interface reconstruction. The original systems are internal to the operator and cannot be published, so the layouts are rebuilt here with sample data — no real people, suppliers or figures appear in them.',
    'proj.fullSize': 'Open full size', 'proj.openShot': 'Open full size in a new tab:',
    'proj.catalogLede': 'Six operating systems I built at ASTRO — written as decisions and their consequences, not as a list of duties. Each one carries four views of the interface behind it.',
    'cv.print': 'Save as PDF', 'cv.title': 'Curriculum vitae',
    'cv.profile': 'Profile', 'cv.contact': 'Contact',
    'cv.hint': 'Formatted for A4. Use Save as PDF for a text-based file that ATS parsers can read.',
    'form.name': 'Name', 'form.email': 'Email', 'form.message': 'Message',
    'form.send': 'Send message', 'form.required': 'required',
    'form.help': 'At least 20 characters. Context beats brevity here.',
    'form.counter': 'characters',
    'form.expect': 'Goes straight to my inbox. No newsletter, no tracking, no third party beyond the form handler.',
    'form.alt': 'Prefer another channel?',
    'form.unconfigured': 'The contact form is not live yet — the form handler key is still to be set. Use the links below in the meantime.',
    'form.okTitle': 'Message sent',
    'form.okBody': 'Thank you — it landed in my inbox. I usually reply within one working day.',
    'form.errTitle': 'That did not send',
    'form.errBody': 'Something went wrong on the way to my inbox. Try again, or reach me through the links below.',
    'form.direct': 'Email me directly', 'form.or': 'or',
    'form.directHint': 'Straight to my inbox. I usually reply within one working day.',
    'cv.download': 'Download PDF',
    'ui.present': 'Present', 'ui.skip': 'Skip to content',
    'ui.theme': 'Colour theme', 'ui.themeAuto': 'Theme: follow system',
    'ui.themeLight': 'Theme: light', 'ui.themeDark': 'Theme: dark',
    'ui.switchLang': 'Baca dalam Bahasa Indonesia', 'ui.level': 'Level',
    'ui.current': 'Current role', 'ui.roleCount': 'roles',
    'ui.draft': 'Preview — figures are pending the owner’s verification, so this site is not indexed yet.',
    'ui.notFound': 'Page not found',
    'ui.notFoundBody': 'That page does not exist. It may have moved, or the link may be wrong.',
    'ui.home': 'Go to homepage',
    'level.expert': 'Expert', 'level.proficient': 'Proficient', 'level.familiar': 'Working knowledge',
  },
  id: {
    'nav.about': 'Tentang', 'nav.projects': 'Studi kasus', 'nav.contact': 'Kontak',
    'nav.cv': 'CV', 'nav.label': 'Navigasi utama',
    'hero.caseStudies': 'Baca studi kasus', 'hero.downloadCv': 'Lihat CV',
    'hero.available': 'Ketersediaan', 'hero.experience': 'tahun di operasional',
    'sec.record': 'Rekam jejak dalam angka', 'sec.experience': 'Jalur karier',
    'sec.skills': 'Kemampuan inti', 'sec.featured': 'Studi kasus pilihan',
    'sec.cta': 'Hubungi saya', 'sec.education': 'Pendidikan',
    'sec.about': 'Tentang', 'sec.contents': 'Di halaman ini',
    'cta.title': 'Mari bicara operasional',
    'cta.body': 'Ceritakan di titik mana operasi Anda kehilangan akurasi, waktu, atau margin — saya akan jelaskan cara mengukurnya lebih dulu, sebelum mengubah apa pun.',
    'cta.button': 'Mulai percakapan',
    'proj.all': 'Semua studi kasus', 'proj.result': 'Hasil', 'proj.role': 'Peran',
    'proj.period': 'Periode', 'proj.metrics': 'Hasil terukur',
    'proj.before': 'Sebelum', 'proj.after': 'Sesudah', 'proj.delta': 'Perubahan',
    'proj.window': 'Periode ukur', 'proj.back': 'Semua studi kasus',
    'proj.measured': 'Yang saya ukur',
    'proj.measuredHint': 'Indikator yang menjadi kemudi pekerjaan ini, hari demi hari.',
    'proj.read': 'Baca studi kasus', 'proj.count': 'studi kasus',
    'proj.interface': 'Antarmuka', 'proj.screens': 'tampilan', 'proj.screen': 'Tampilan',
    'proj.system': 'Sistem',
    'proj.interfaceHint': 'Empat tampilan yang memikul pekerjaannya, dalam urutan seseorang di shift melewatinya.',
    'proj.reconstructed': 'Rekonstruksi antarmuka. Sistem aslinya internal milik perusahaan dan tidak boleh dipublikasikan, jadi tata letaknya dibangun ulang di sini dengan data contoh — tidak ada nama orang, pemasok, atau angka yang nyata di dalamnya.',
    'proj.fullSize': 'Buka ukuran penuh', 'proj.openShot': 'Buka ukuran penuh di tab baru:',
    'proj.catalogLede': 'Enam sistem operasional yang saya bangun di ASTRO — ditulis sebagai keputusan dan konsekuensinya, bukan sebagai daftar tugas. Masing-masing membawa empat tampilan antarmuka di baliknya.',
    'cv.print': 'Simpan sebagai PDF', 'cv.title': 'Daftar riwayat hidup',
    'cv.profile': 'Profil', 'cv.contact': 'Kontak',
    'cv.hint': 'Diformat untuk A4. Gunakan Simpan sebagai PDF agar menghasilkan berkas berbasis teks yang terbaca ATS.',
    'form.name': 'Nama', 'form.email': 'Email', 'form.message': 'Pesan',
    'form.send': 'Kirim pesan', 'form.required': 'wajib',
    'form.help': 'Minimal 20 karakter. Di sini konteks lebih berguna daripada ringkas.',
    'form.counter': 'karakter',
    'form.expect': 'Langsung masuk ke inbox saya. Tanpa newsletter, tanpa pelacakan, tanpa pihak ketiga selain penangan form.',
    'form.alt': 'Lebih suka kanal lain?',
    'form.unconfigured': 'Form kontak belum aktif — kunci penangan form belum disetel. Sementara ini, gunakan tautan di bawah.',
    'form.okTitle': 'Pesan terkirim',
    'form.okBody': 'Terima kasih — pesan Anda sudah masuk. Saya biasanya membalas dalam 1x24 jam kerja.',
    'form.errTitle': 'Pesan gagal terkirim',
    'form.errBody': 'Ada yang salah di perjalanan menuju inbox saya. Coba lagi, atau hubungi lewat tautan di bawah.',
    'form.direct': 'Email saya langsung', 'form.or': 'atau',
    'form.directHint': 'Langsung ke inbox saya. Biasanya saya balas dalam 1x24 jam kerja.',
    'cv.download': 'Unduh PDF',
    'ui.present': 'Sekarang', 'ui.skip': 'Lompat ke konten',
    'ui.theme': 'Tema warna', 'ui.themeAuto': 'Tema: ikut sistem',
    'ui.themeLight': 'Tema: terang', 'ui.themeDark': 'Tema: gelap',
    'ui.switchLang': 'Read in English', 'ui.level': 'Tingkat',
    'ui.current': 'Peran saat ini', 'ui.roleCount': 'peran',
    'ui.draft': 'Pratinjau — angka masih menunggu verifikasi pemilik, sehingga situs ini belum diindeks.',
    'ui.notFound': 'Halaman tidak ditemukan',
    'ui.notFoundBody': 'Halaman tersebut tidak ada. Mungkin sudah dipindahkan, atau tautannya keliru.',
    'ui.home': 'Ke beranda',
    'level.expert': 'Expert', 'level.proficient': 'Mahir', 'level.familiar': 'Cukup menguasai',
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
