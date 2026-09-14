/**
 * Membangkitkan CV PDF dari halaman /cv yang sudah ter-build.
 *
 * NOL DEPENDENSI npm — memakai Chromium sistem lewat --print-to-pdf, pola yang
 * sama dengan scripts/og.mjs. Playwright (±130 MB Chromium) tidak lagi dibutuhkan.
 *
 *   pnpm build && pnpm pdf
 *   CHROME=/path/ke/chrome pnpm pdf
 *
 * Hasilnya ditulis ke public/cv/ (ikut di-commit, ADR-011) dan disalin ke
 * dist/cv/ supaya build yang sedang berjalan langsung lengkap.
 *
 * Berkas manifest mencatat sidik jari src/data.json. CI memakainya untuk
 * menolak PDF yang basi — mekanisme anti-drift pengganti pembangkitan
 * saat build (ADR-005 -> ADR-009 #8 -> ADR-011).
 */
import { execFileSync } from 'node:child_process';
import { readFile, mkdir, writeFile, copyFile, access } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, resolve } from 'node:path';

const DIST = 'dist';
const LANGS = [
  ['en', 'cv/index.html'],
  ['id', 'id/cv/index.html'],
];

const CANDIDATES = [
  process.env.CHROME,
  '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);

const chrome = CANDIDATES.find((p) => existsSync(p));
if (!chrome) {
  console.error('Chromium tidak ditemukan. Setel CHROME=/path/ke/chrome lalu ulangi.');
  process.exit(1);
}

try {
  await access(join(DIST, 'cv', 'index.html'));
} catch {
  console.error('dist/cv/index.html tidak ada. Jalankan `pnpm build` lebih dulu.');
  process.exit(1);
}

await mkdir('public/cv', { recursive: true });
const pages = {};

for (const [lang, page] of LANGS) {
  const out = `public/cv/cv-${lang}.pdf`;
  execFileSync(chrome, [
    '--headless', '--no-sandbox', '--disable-gpu',
    '--no-pdf-header-footer',            // tanpa URL & nomor halaman bawaan browser
    '--virtual-time-budget=5000',
    `--print-to-pdf=${out}`,
    `file://${resolve(DIST, page)}`,
  ], { stdio: ['ignore', 'ignore', 'ignore'] });

  // Hitung halaman langsung dari struktur PDF — satu-satunya ukuran yang jujur
  const buf = readFileSync(out);
  const count = Number(buf.toString('latin1').match(/\/Count\s+(\d+)/)?.[1] ?? 0);
  pages[lang] = count;
  console.log(`dibuat: ${out} — ${count} halaman, ${(buf.length / 1024).toFixed(0)} KB`);

  await mkdir(join(DIST, 'cv'), { recursive: true });
  await copyFile(out, join(DIST, 'cv', `cv-${lang}.pdf`));
}


const dataHash = createHash('sha256').update(await readFile('src/data.json')).digest('hex');
await writeFile(
  'public/cv/cv.manifest.json',
  JSON.stringify({ dataHash, pages, generatedAt: new Date().toISOString() }, null, 2) + '\n',
);
await copyFile('public/cv/cv.manifest.json', join(DIST, 'cv', 'cv.manifest.json'));
console.log('manifest ditulis — CI akan menolak PDF yang basi terhadap src/data.json');

const tooLong = Object.entries(pages).filter(([, n]) => n > 2);
if (tooLong.length) {
  console.error(`\nPERINGATAN: CV lebih dari 2 halaman: ${tooLong.map(([l, n]) => `${l}=${n}`).join(', ')}`);
  process.exit(1);
}
