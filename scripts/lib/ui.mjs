/**
 * Primitif antarmuka untuk rekonstruksi tangkapan layar (scripts/shots.mjs).
 *
 * Satu bahasa visual dipakai oleh 24 panel: kalau tiap panel menggambar
 * tabelnya sendiri, katalognya akan terlihat seperti enam produk berbeda, dan
 * justru keseragaman itulah yang membuat katalog terbaca sebagai katalog.
 *
 * Warna mengikuti sistem desain "Control Room" (ADR-008) ditambah palet
 * visualisasi yang sudah divalidasi — ramp biru ordinal dan empat warna status
 * yang tidak pernah dipinjam sebagai warna seri. Lihat ADR-013.
 */

export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Ramp biru 4 langkah, terang → gelap. Untuk kategori BERURUT saja. */
export const RAMP = ['#86b6ef', '#5598e7', '#2a78d6', '#1c5cab'];
/** Warna seri tunggal. Deret tunggal tidak butuh legenda — judulnya yang menamai. */
export const SERIES = '#3987e5';
/** Status: selalu berpasangan dengan label teks, tidak pernah warna sendirian. */
export const STATUS = {
  good: '#0ca30c',
  warn: '#fab219',
  serious: '#ec835a',
  crit: '#d03b3b',
  idle: '#7d8da3',
};

/* ------------------------------------------------------------------ komponen -- */

/**
 * Kartu panel dengan kepala dan isi.
 * `grow` menandai panel yang MENGISI sisa tinggi bingkai. Tepat satu panel per
 * layar sebaiknya tumbuh; sisanya menyusut ke isinya. Tanpa ini, panel pendek
 * mengambang dan menyisakan pita latar kosong di bawah — cacat paling kentara
 * pada render pertama.
 */
export const panel = (title, body, { sub = '', pad = true, grow = false } = {}) => `
  <section class="pnl${grow ? ' grow' : ''}">
    <header class="pnl-h"><h2>${esc(title)}</h2>${sub ? `<span class="pnl-s">${esc(sub)}</span>` : ''}</header>
    <div class="pnl-b${pad ? '' : ' flush'}">${body}</div>
  </section>`;

/** Kartu angka. Satu angka besar tidak butuh grafik — angkanya adalah grafiknya. */
export const kpi = (label, value, sub, tone = '') => `
  <div class="kpi">
    <span class="kpi-l">${esc(label)}</span>
    <span class="kpi-v${tone ? ` t-${tone}` : ''}">${esc(value)}</span>
    <span class="kpi-s">${esc(sub)}</span>
  </div>`;

/** Pil status: titik + teks. Warna tidak pernah menjadi satu-satunya penanda. */
export const pill = (tone, text) =>
  `<span class="pill p-${tone}"><i></i>${esc(text)}</span>`;

/** Tabel data. `cols` boleh diakhiri ':n' agar rata kanan dengan angka tabular. */
export const table = (cols, rows) => {
  const head = cols
    .map((c) => {
      const num = c.endsWith(':n');
      return `<th${num ? ' class="n"' : ''}>${esc(num ? c.slice(0, -2) : c)}</th>`;
    })
    .join('');
  const body = rows
    .map(
      (r) =>
        `<tr>${r
          .map((cell, i) => `<td${cols[i].endsWith(':n') ? ' class="n"' : ''}>${cell}</td>`)
          .join('')}</tr>`,
    )
    .join('');
  return `<table class="tbl"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
};

/**
 * Batang mendatar berperingkat. Satu deret → satu warna: mewarnai tiap batang
 * menurut besarnya hanya menyandikan ulang panjang batang ke dalam rona.
 */
export const barRows = (items, { color = SERIES, max = 0 } = {}) => {
  const top = max || Math.max(...items.map((i) => i.value));
  return `<div class="bars">${items
    .map(
      (i) => `<div class="bar">
        <span class="bar-l">${esc(i.label)}</span>
        <span class="bar-t"><i style="width:${Math.max(2, (i.value / top) * 100)}%;background:${i.color || color}"></i></span>
        <span class="bar-v">${esc(i.display ?? i.value)}</span>
        ${i.note ? `<span class="bar-n">${esc(i.note)}</span>` : ''}
      </div>`,
    )
    .join('')}</div>`;
};

/** Batang tegak. `bands` memakai RAMP untuk kategori berurut (mis. pita umur). */
export const columns = (items, { height = 150, color = SERIES, rule = null } = {}) => {
  const top = Math.max(...items.map((i) => i.value)) * 1.15 || 1;
  const rulePct = rule ? (rule.value / top) * 100 : 0;
  // Label ambang diletakkan di ujung yang batangnya PALING RENDAH, supaya ia
  // tidak pernah menimpa label nilai batang. Ditentukan dari data, bukan
  // ditebak sekali lalu rusak pada dataset berikutnya.
  const rightSide = rule ? items[items.length - 1].value < items[0].value : false;
  return `<div class="cols" style="min-height:${height}px">
    ${rule ? `<span class="rule" style="bottom:${rulePct}%"><b class="${rightSide ? 'r' : 'l'}">${esc(rule.label)}</b></span>` : ''}
    ${items
      .map(
        (i) => `<div class="col">
          <span class="col-v">${esc(i.display ?? i.value)}</span>
          <span class="col-b" style="height:${Math.max(3, (i.value / top) * 100)}%;background:${i.color || color}"></span>
          <span class="col-l">${esc(i.label)}</span>
        </div>`,
      )
      .join('')}
  </div>`;
};

/**
 * Sparkline SVG dengan garis ambang. Dipakai sebagai small multiples: empat
 * panel kecil satu warna mengalahkan satu grafik empat garis, karena
 * pertanyaannya adalah "zona ini terhadap ambangnya", bukan "zona mana
 * yang tertinggi".
 */
export const spark = (values, { w = 232, h = 84, threshold = null } = {}) => {
  const min = Math.min(...values, threshold ?? Infinity) * 0.92;
  const max = Math.max(...values, threshold ?? -Infinity) * 1.04;
  const x = (i) => (i / (values.length - 1)) * (w - 2) + 1;
  const y = (v) => h - 4 - ((v - min) / (max - min || 1)) * (h - 10);
  const line = values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  const area = `${line} L${x(values.length - 1).toFixed(1)} ${h} L${x(0).toFixed(1)} ${h} Z`;
  const ty = threshold == null ? null : y(threshold).toFixed(1);
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="presentation">
    <path d="${area}" fill="${SERIES}" opacity=".13"/>
    ${ty ? `<line x1="0" y1="${ty}" x2="${w}" y2="${ty}" stroke="${STATUS.warn}" stroke-width="1.5" stroke-dasharray="4 3" opacity=".85"/>` : ''}
    <path d="${line}" fill="none" stroke="${SERIES}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="${x(values.length - 1).toFixed(1)}" cy="${y(values[values.length - 1]).toFixed(1)}" r="3.5" fill="${SERIES}" stroke="#0e151f" stroke-width="2"/>
  </svg>`;
};

/** Corong tahapan berurut — memakai RAMP karena tahapannya memang berurut. */
export const funnel = (stages) => {
  const top = Math.max(...stages.map((s) => s.value));
  return `<div class="funnel">${stages
    .map(
      (s, i) => `<div class="fn">
        <span class="fn-l">${esc(s.label)}</span>
        <span class="fn-b" style="width:${Math.max(8, (s.value / top) * 100)}%;background:${RAMP[i % RAMP.length]}"></span>
        <span class="fn-v">${esc(s.display ?? s.value)}</span>
      </div>`,
    )
    .join('')}</div>`;
};

/** Bilah kemajuan dengan ambang — dipakai untuk jendela paparan rantai dingin. */
export const progress = (pct, tone) =>
  `<span class="prog"><i style="width:${Math.min(100, pct)}%;background:${STATUS[tone]}"></i></span>`;
