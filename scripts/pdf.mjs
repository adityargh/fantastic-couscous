/**
 * Membuat berkas PDF dari halaman /cv yang sudah ter-build.
 *
 * OPSIONAL — sengaja TIDAK dijalankan pada setiap build (ADR-009). Halaman
 * /cv sendiri sudah dicetak rapi dari browser, jadi tidak ada risiko drift.
 * Skrip ini hanya diperlukan bila ingin berkas .pdf yang dihosting.
 *
 *   pnpm build && pnpm pdf
 *
 * Butuh Chromium: `pnpm dlx playwright install chromium` (sekali saja).
 */
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const DIST = 'dist';
const PORT = 4399;
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.json': 'application/json' };

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error('Playwright belum terpasang. Jalankan: pnpm add -D playwright && pnpm dlx playwright install chromium');
  process.exit(1);
}

const server = createServer(async (req, res) => {
  try {
    let p = normalize(decodeURIComponent((req.url ?? '/').split('?')[0]));
    if (p.endsWith('/')) p += 'index.html';
    if (!extname(p)) p += '/index.html';
    const buf = await readFile(join(DIST, p));
    res.writeHead(200, { 'Content-Type': TYPES[extname(p)] ?? 'application/octet-stream' });
    res.end(buf);
  } catch {
    res.writeHead(404).end('not found');
  }
});
await new Promise((r) => server.listen(PORT, r));

await mkdir('dist/cv', { recursive: true });
const browser = await chromium.launch();

for (const [lang, path] of [['en', '/cv'], ['id', '/id/cv']]) {
  const page = await browser.newPage();
  await page.goto(`http://localhost:${PORT}${path}`, { waitUntil: 'load' });
  await page.emulateMedia({ media: 'print' });
  const out = `dist/cv/cv-${lang}.pdf`;
  await page.pdf({
    path: out,
    format: 'A4',
    printBackground: false,
    tagged: true, // PDF ter-tag: aksesibel dan lebih mudah diurai ATS
    margin: { top: '14mm', bottom: '14mm', left: '15mm', right: '15mm' },
  });
  console.log('dibuat:', out);
  await page.close();
}

await browser.close();
server.close();
