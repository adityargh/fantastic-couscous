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
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { inflateSync, deflateSync, crc32 } from 'node:zlib';

const data = JSON.parse(
  await import('node:fs/promises').then((fs) => fs.readFile('src/data.json', 'utf8')),
);

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

/**
 * Memotong baris bawah sebuah PNG RGB8 tanpa pustaka apa pun.
 *
 * Chrome memotret seukuran JENDELA, bukan viewport, sehingga tangkapan
 * 1200x717 memuat pita 87 px yang tidak terlukis di bawah. Memangkas baris
 * TERAKHIR tidak menuntut penyaringan ulang: setiap baris menyaring terhadap
 * baris SEBELUMNYA, dan semua baris sebelumnya tetap utuh.
 */
function cropPngRows(buf, keepRows) {
  let pos = 8; // lewati tanda tangan PNG
  let ihdr = null;
  const idat = [];
  const tail = [];

  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === 'IHDR') ihdr = Buffer.from(data);
    else if (type === 'IDAT') idat.push(data);
    else if (type !== 'IEND') tail.push({ type, data });
    pos += 12 + len;
  }
  if (!ihdr) throw new Error('IHDR tidak ditemukan');

  const width = ihdr.readUInt32BE(0);
  const height = ihdr.readUInt32BE(4);
  const depth = ihdr[8];
  const colour = ihdr[9];
  if (depth !== 8 || (colour !== 2 && colour !== 6)) {
    throw new Error(`format PNG tak didukung: depth ${depth}, colour ${colour}`);
  }
  if (keepRows >= height) return buf;

  const channels = colour === 6 ? 4 : 3;
  const stride = 1 + width * channels;
  const raw = inflateSync(Buffer.concat(idat)).subarray(0, keepRows * stride);

  ihdr.writeUInt32BE(keepRows, 4);

  const chunk = (type, data) => {
    const out = Buffer.alloc(12 + data.length);
    out.writeUInt32BE(data.length, 0);
    out.write(type, 4, 'ascii');
    data.copy(out, 8);
    out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)) >>> 0, 8 + data.length);
    return out;
  };

  return Buffer.concat([
    buf.subarray(0, 8),
    chunk('IHDR', ihdr),
    ...tail.map((c) => chunk(c.type, Buffer.from(c.data))),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/**
 * Chrome headless memotong tinggi jendela untuk frame internal: meminta
 * --window-size=1200,630 menghasilkan viewport 1200x543 pada lingkungan ini.
 * Selisihnya diukur, bukan ditebak, supaya skrip ini tetap benar di mesin lain.
 */
function viewportOffset(tmpDir) {
  const probe = join(tmpDir, 'probe.html');
  writeFileSync(
    probe,
    '<!doctype html><meta charset="utf-8"><body><i id="o"></i>' +
      '<script>document.getElementById("o").textContent=innerWidth+"x"+innerHeight;<\/script>',
  );
  const dom = execFileSync(
    chrome,
    ['--headless', '--no-sandbox', '--disable-gpu', `--window-size=${W},${H}`,
     '--virtual-time-budget=2000', '--dump-dom', `file://${probe}`],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
  );
  const m = dom.match(/(\d+)x(\d+)<\/i>/);
  return m ? { x: W - Number(m[1]), y: H - Number(m[2]) } : { x: 0, y: 0 };
}

const W = 1200;
const H = 630;

mkdirSync('public/og', { recursive: true });
const tmp = mkdtempSync(join(tmpdir(), 'og-'));
const off = viewportOffset(tmp);
console.log(`kompensasi frame jendela: ${off.x}x${off.y} px`);

for (const lang of ['en', 'id']) {
  const html = join(tmp, `${lang}.html`);
  writeFileSync(html, card(data[lang]));
  execFileSync(chrome, [
    '--headless', '--no-sandbox', '--disable-gpu', '--hide-scrollbars',
    '--force-device-scale-factor=1', `--window-size=${W + off.x},${H + off.y}`,
    `--screenshot=${join(tmp, `${lang}.png`)}`, `file://${html}`,
  ], { stdio: 'pipe' });
  const shot = readFileSync(join(tmp, `${lang}.png`));
  writeFileSync(`public/og/og-${lang}.png`, cropPngRows(shot, H));
  console.log('dibuat: public/og/og-' + lang + '.png');
}

rmSync(tmp, { recursive: true, force: true });
