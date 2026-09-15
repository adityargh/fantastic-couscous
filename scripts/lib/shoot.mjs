/**
 * Pemotret halaman HTML jadi PNG lewat Chromium sistem. NOL dependensi npm.
 *
 * Diekstrak dari scripts/og.mjs saat scripts/shots.mjs membutuhkan mekanisme
 * yang persis sama untuk 24 berkas (ADR-013). Dua penyalin logika kompensasi
 * bingkai jendela dan pemangkasan PNG akan menyimpang diam-diam; satu modul
 * bersama tidak bisa.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { inflateSync, deflateSync, crc32 } from 'node:zlib';

const CANDIDATES = [
  process.env.CHROME,
  '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);

/** Jalur Chromium pertama yang ada, atau null. */
export function findChrome() {
  return CANDIDATES.find((p) => existsSync(p)) ?? null;
}

/**
 * Memotong baris bawah sebuah PNG RGB8/RGBA8 tanpa pustaka apa pun.
 *
 * Chrome memotret seukuran JENDELA, bukan viewport, sehingga tangkapan yang
 * lebih tinggi dari target memuat pita yang tidak terlukis di bawah. Memangkas
 * baris TERAKHIR tidak menuntut penyaringan ulang: setiap baris menyaring
 * terhadap baris SEBELUMNYA, dan semua baris sebelumnya tetap utuh.
 */
export function cropPngRows(buf, keepRows) {
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
 * Membuat pemotret berukuran tetap.
 *
 * Chrome headless memotong tinggi jendela untuk frame internalnya, jadi selisih
 * jendela-ke-viewport DIUKUR sekali di awal, bukan ditebak — supaya skrip ini
 * tetap benar di mesin lain dan di versi Chromium lain.
 */
export function createShooter({ width, height, chrome = findChrome() }) {
  if (!chrome) throw new Error('Chromium tidak ditemukan. Setel CHROME=/path/ke/chrome.');
  const dir = mkdtempSync(join(tmpdir(), 'shoot-'));

  const probe = join(dir, 'probe.html');
  writeFileSync(
    probe,
    '<!doctype html><meta charset="utf-8"><body><i id="o"></i>' +
      '<script>document.getElementById("o").textContent=innerWidth+"x"+innerHeight;<\/script>',
  );
  const dom = execFileSync(
    chrome,
    ['--headless', '--no-sandbox', '--disable-gpu', `--window-size=${width},${height}`,
     '--virtual-time-budget=2000', '--dump-dom', `file://${probe}`],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
  );
  const m = dom.match(/(\d+)x(\d+)<\/i>/);
  const off = m ? { x: width - Number(m[1]), y: height - Number(m[2]) } : { x: 0, y: 0 };

  let n = 0;
  return {
    offset: off,
    /** Merender `html` lalu menulis PNG width×height ke `outPath`. */
    shoot(html, outPath) {
      const page = join(dir, `p${n}.html`);
      const raw = join(dir, `p${n}.png`);
      n += 1;
      writeFileSync(page, html);
      execFileSync(chrome, [
        '--headless', '--no-sandbox', '--disable-gpu', '--hide-scrollbars',
        '--force-device-scale-factor=1', `--window-size=${width + off.x},${height + off.y}`,
        '--virtual-time-budget=3000',
        `--screenshot=${raw}`, `file://${page}`,
      ], { stdio: 'pipe' });
      writeFileSync(outPath, cropPngRows(readFileSync(raw), height));
    },
    dispose() {
      rmSync(dir, { recursive: true, force: true });
    },
  };
}
