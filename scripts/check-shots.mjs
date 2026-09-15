/**
 * Menjaga agar tangkapan antarmuka dan frontmatter tidak pernah menyimpang.
 *
 *   node scripts/check-shots.mjs [dir]      # default: dist
 *
 * Daftar berkas TIDAK ditulis ulang di sini. Ia dibaca dari frontmatter,
 * sehingga menambah studi kasus baru tidak menuntut siapa pun mengingat untuk
 * memperbarui skrip ini — sumber kebenarannya tetap satu (ADR-013).
 *
 * Tiga hal yang diperiksa:
 *   1. Setiap berkas yang dirujuk frontmatter benar-benar ada di keluaran.
 *   2. Tidak ada berkas yatim di public/shots/ yang tak dirujuk siapa pun.
 *   3. Versi EN dan ID sebuah studi kasus merujuk berkas yang SAMA — kalau
 *      tidak, salah satu bahasa diam-diam kehilangan gambarnya.
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const OUT = process.argv[2] ?? 'dist';
const SRC = 'src/content/projects';
const PUB = 'public/shots';

const fail = [];
const bySlug = new Map();

for (const name of readdirSync(SRC).filter((f) => f.endsWith('.md'))) {
  const fm = readFileSync(join(SRC, name), 'utf8').match(/^---\n([\s\S]*?)\n---/);
  if (!fm) { fail.push(`${name}: tanpa frontmatter`); continue; }
  const slug = fm[1].match(/^slug: *(.+)$/m)?.[1].trim();
  const lang = fm[1].match(/^lang: *(.+)$/m)?.[1].trim();
  const files = [...fm[1].matchAll(/^ *- file: *(.+)$/gm)].map((m) => m[1].trim());

  if (files.length !== 4) fail.push(`${name}: ${files.length} tangkapan, wajib 4`);

  for (const f of files) {
    const p = join(OUT, 'shots', slug, f);
    if (!existsSync(p)) fail.push(`${name}: ${p} tidak ada`);
    else if (statSync(p).size < 1024) fail.push(`${p}: kosong atau rusak (< 1 KB)`);
  }

  const key = slug;
  const prev = bySlug.get(key);
  if (prev && prev.files.join() !== files.join()) {
    fail.push(`${slug}: berkas versi ${prev.lang} dan ${lang} berbeda — salah satu bahasa akan kehilangan gambar`);
  }
  bySlug.set(key, { lang, files });
}

// Berkas yatim: biaya penyimpanan tanpa pembaca, dan tanda ada yang terlupa.
const referenced = new Set(
  [...bySlug].flatMap(([slug, v]) => v.files.map((f) => `${slug}/${f}`)),
);
if (existsSync(PUB)) {
  for (const dir of readdirSync(PUB)) {
    for (const f of readdirSync(join(PUB, dir))) {
      if (!referenced.has(`${dir}/${f}`)) fail.push(`${PUB}/${dir}/${f}: yatim, tidak dirujuk frontmatter mana pun`);
    }
  }
}

if (fail.length) {
  console.error('::error::tangkapan antarmuka tidak konsisten:');
  for (const f of fail) console.error('  • ' + f);
  process.exit(1);
}
if (bySlug.size === 0) {
  // Nol studi kasus adalah keadaan TRANSISI yang sah (ADR-014), bukan galat —
  // tapi ia tidak boleh lewat tanpa suara, karena katalog kosong itu sementara.
  console.log('Katalog studi kasus KOSONG — tidak ada yang diperiksa.');
  console.log('Isi ulang mengikuti docs/05-case-study-source-brief.md.');
} else {
  console.log(`Tangkapan konsisten: ${bySlug.size} studi kasus × 4 = ${referenced.size} berkas.`);
}
