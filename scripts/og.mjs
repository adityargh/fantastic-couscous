/**
 * Membangkitkan OG image (1200×630 PNG) untuk pratinjau tautan di WhatsApp,
 * LinkedIn, dan Slack.
 *
 * OPSIONAL dan dijalankan MANUAL — bukan bagian dari `pnpm build` (ADR-010).
 * Kartunya statis: berubah hanya bila nama, jabatan, atau positioning berubah,
 * yaitu beberapa kali seumur situs. Menjalankannya di setiap build berarti
 * membayar unduhan Chromium ±130 MB pada setiap deploy demi berkas yang nyaris
 * tidak pernah berubah — itu biaya tanpa hasil.
 *
 *   node scripts/og.mjs                     # pakai Chromium sistem bila ada
 *   CHROME=/path/ke/chrome node scripts/og.mjs
 *
 * Hasilnya di-commit ke public/og/ (dua berkas, ±30 KB) sehingga build dan
 * deploy tetap nol-dependensi.
 */
import { mkdirSync } from 'node:fs';
import { createShooter, findChrome } from './lib/shoot.mjs';

const data = JSON.parse(
  await import('node:fs/promises').then((fs) => fs.readFile('src/data.json', 'utf8')),
);

if (!findChrome()) {
  console.error('Chromium tidak ditemukan. Setel CHROME=/path/ke/chrome lalu ulangi.');
  process.exit(1);
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Kartu OG — token warna dan tata letak sama dengan situs.
 * Grid 3 baris dengan tinggi tetap: apa pun panjang teksnya, tidak ada yang
 * terdorong keluar bingkai 1200x630 (kesalahan versi pertama).
 */
const card = (p) => `<!doctype html><html><head><meta charset="utf-8"><style>
  *{box-sizing:border-box;margin:0}
  body{position:relative;width:1200px;height:630px;overflow:hidden;
    background:#070b11;color:#e8eef7;
    font-family:-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif;
    background-image:linear-gradient(#9fc0ff14 1px,transparent 1px),linear-gradient(90deg,#9fc0ff14 1px,transparent 1px);
    background-size:48px 48px}
  /* Penempatan absolut: tidak ada blok yang bisa mendorong blok lain keluar
     bingkai, berapa pun panjang teksnya. */
  .top{position:absolute;top:58px;left:72px;right:72px;display:flex;align-items:center;gap:18px}
  .mono{width:52px;height:52px;flex:none;border-radius:14px;background:#7fa6ff;color:#06101f;
    display:flex;align-items:center;justify-content:center;font:700 19px ui-monospace,Menlo,monospace}
  .role{font-size:20px;font-weight:600;color:#a5b3c6;letter-spacing:.01em}
  .mid{position:absolute;top:172px;left:72px;right:72px;height:300px;overflow:hidden}
  .rule{height:5px;width:176px;background:linear-gradient(90deg,#7fa6ff,#7fa6ff22);
    border-radius:5px;margin-bottom:24px}
  h1{font-size:72px;line-height:1.02;letter-spacing:-.04em;font-weight:800}
  .pos{margin-top:20px;font-size:24px;line-height:1.45;color:#a5b3c6;max-width:32ch;
    display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
  .chips{position:absolute;left:72px;right:72px;bottom:56px;height:42px;overflow:hidden;
    display:flex;gap:10px}
  .chip{border:1px solid #2a3849;border-radius:999px;padding:0 16px;height:42px;
    display:flex;align-items:center;font-size:17px;font-weight:600;color:#a5b3c6;
    background:#0e151f;white-space:nowrap}
</style></head><body>
  <div class="top">
    <div class="mono">${esc(p.name.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase())}</div>
    <div class="role">${esc(p.headline)}</div>
  </div>
  <div class="mid">
    <div class="rule"></div>
    <h1>${esc(p.name)}</h1>
    <div class="pos">${esc(p.positioning.split(" \u2014 ")[0])}</div>
  </div>
  <div class="chips">${p.disciplines.map((d) => `<div class="chip">${esc(d)}</div>`).join('')}</div>
</body></html>`;

const W = 1200;
const H = 630;

mkdirSync('public/og', { recursive: true });
const shooter = createShooter({ width: W, height: H });
console.log(`kompensasi frame jendela: ${shooter.offset.x}x${shooter.offset.y} px`);

for (const lang of ['en', 'id']) {
  shooter.shoot(card(data[lang]), `public/og/og-${lang}.png`);
  console.log('dibuat: public/og/og-' + lang + '.png');
}

shooter.dispose();
