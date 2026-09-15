/**
 * Cangkang aplikasi untuk rekonstruksi tangkapan layar.
 *
 * Satu cangkang, 24 panel. Bilah tab menampilkan KEEMPAT tampilan sistem dengan
 * satu tab aktif per tangkapan, sehingga empat gambar terbaca sebagai satu
 * produk dan bukan empat gambar lepas — itu inti katalognya (ADR-013).
 *
 * Teks antarmuka sengaja berbahasa Inggris untuk KEDUA bahasa situs: alt dan
 * keterangan yang menerjemahkan maknanya sudah dilokalkan, sementara
 * menggandakan 24 gambar menjadi 48 hanya untuk label tombol adalah biaya
 * penyimpanan dan pemeliharaan tanpa hasil yang sepadan.
 */
import { esc } from './ui.mjs';

export const W = 1280;
export const H = 800;

const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
body{width:${W}px;height:${H}px;overflow:hidden;background:#070b11;color:#e8eef7;
  font:15px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif;
  -webkit-font-smoothing:antialiased}
.n,.tnum,.kpi-v,.bar-v,.col-v,.fn-v{font-variant-numeric:tabular-nums}

/* --- bilah atas --- */
.tb{height:58px;display:flex;align-items:center;gap:14px;padding:0 22px;
  background:#0e151f;border-bottom:1px solid #1c2634}
.mark{width:30px;height:30px;flex:none;border-radius:8px;background:#3987e5;color:#06101f;
  display:flex;align-items:center;justify-content:center;font:700 12px ui-monospace,Menlo,monospace}
.tb-t{font-size:15px;font-weight:650;letter-spacing:-.01em}
.tb-s{font-size:12.5px;color:#7d8da3;font-family:ui-monospace,Menlo,monospace}
.tb-r{margin-left:auto;display:flex;align-items:center;gap:12px}
.recon{display:flex;align-items:center;gap:7px;height:26px;padding:0 11px;border-radius:999px;
  border:1px solid #3a4152;background:#141a12;color:#c9d38f;font-size:11.5px;font-weight:650;
  letter-spacing:.07em;text-transform:uppercase}
.recon b{width:6px;height:6px;border-radius:50%;background:#fab219;display:block}
.clock{font:12.5px ui-monospace,Menlo,monospace;color:#a5b3c6}

/* --- tab --- */
.tabs{height:46px;display:flex;align-items:flex-end;gap:4px;padding:0 22px;
  background:#0b1119;border-bottom:1px solid #1c2634}
.tab{height:33px;display:flex;align-items:center;padding:0 15px;border-radius:8px 8px 0 0;
  font-size:13.5px;font-weight:600;color:#7d8da3;border:1px solid transparent;border-bottom:0}
.tab.on{background:#070b11;color:#e8eef7;border-color:#1c2634}

/* --- badan --- */
.body{height:${H - 58 - 46}px;padding:18px 22px;overflow:hidden;display:flex;flex-direction:column;gap:14px}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.gs{display:grid;grid-template-columns:1.62fr 1fr;gap:14px}
.grow{flex:1;min-height:0}

/* --- panel --- */
.pnl{background:#0e151f;border:1px solid #1c2634;border-radius:12px;overflow:hidden;
  display:flex;flex-direction:column;min-height:0;flex:none}
.pnl.grow{flex:1}
.body>.g2,.body>.g3,.body>.g4,.body>.gs{flex:none}
.body>.grow,.body>.gs.grow,.body>.g2.grow{flex:1}
.gs.grow>.pnl,.g2.grow>.pnl,.g4.grow>.pnl{height:100%}
.pnl-h{height:42px;flex:none;display:flex;align-items:center;gap:10px;padding:0 15px;
  border-bottom:1px solid #1c2634;background:#111926}
.pnl-h h2{font-size:13px;font-weight:650;letter-spacing:.1em;text-transform:uppercase;color:#a5b3c6}
.pnl-s{margin-left:auto;font-size:12.5px;color:#7d8da3}
.pnl-b{padding:15px;flex:1;min-height:0;overflow:hidden;display:flex;flex-direction:column}
.pnl-b.flush{padding:0}

/* --- kartu angka --- */
.kpi{background:#0e151f;border:1px solid #1c2634;border-radius:12px;padding:14px 16px;
  display:flex;flex-direction:column;gap:2px;position:relative;overflow:hidden}
.kpi::before{content:"";position:absolute;inset:0 auto 0 0;width:3px;background:#3987e5;opacity:.75}
.kpi-l{font-size:12px;font-weight:650;letter-spacing:.09em;text-transform:uppercase;color:#7d8da3}
.kpi-v{font-size:30px;font-weight:750;letter-spacing:-.025em;line-height:1.15}
.kpi-v.t-good{color:#0ca30c}.kpi-v.t-warn{color:#fab219}.kpi-v.t-crit{color:#d03b3b}
.kpi-s{font-size:12.5px;color:#a5b3c6}

/* --- pil status --- */
.pill{display:inline-flex;align-items:center;gap:6px;height:23px;padding:0 9px;border-radius:999px;
  font-size:12px;font-weight:650;border:1px solid;white-space:nowrap}
.pill i{width:6px;height:6px;border-radius:50%;background:currentColor;flex:none}
.p-good{color:#3fbf3f;border-color:#0ca30c55;background:#0ca30c1f}
.p-warn{color:#fab219;border-color:#fab21955;background:#fab2191c}
.p-serious{color:#ec835a;border-color:#ec835a55;background:#ec835a1c}
.p-crit{color:#e86a6a;border-color:#d03b3b66;background:#d03b3b22}
.p-idle{color:#95a3b8;border-color:#2a3849;background:#151d29}

/* --- tabel --- */
.tbl{width:100%;border-collapse:collapse;font-size:13.5px}
.tbl th{text-align:left;padding:8px 12px;font-size:11.5px;font-weight:650;letter-spacing:.1em;
  text-transform:uppercase;color:#7d8da3;background:#111926;border-bottom:1px solid #1c2634;white-space:nowrap}
.tbl td{padding:9px 12px;border-bottom:1px solid #141d28;color:#cdd8e6;white-space:nowrap}
.tbl tr:last-child td{border-bottom:0}
.tbl .n{text-align:right;font-variant-numeric:tabular-nums}
.tbl .mut{color:#7d8da3}
.tbl .str{color:#e8eef7;font-weight:600}

/* --- batang mendatar --- */
.bars{display:flex;flex-direction:column;gap:11px}
.pnl.grow .bars{gap:19px}
.bar{display:grid;grid-template-columns:168px 1fr 96px;align-items:center;gap:12px;font-size:13.5px}
.bar-l{color:#cdd8e6;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.bar-t{height:12px;border-radius:3px;background:#151d29;display:block;overflow:hidden}
.bar-t i{display:block;height:100%;border-radius:0 3px 3px 0}
.bar-v{text-align:right;font-weight:650;font-variant-numeric:tabular-nums;white-space:nowrap}
.bar-n{grid-column:2/4;font-size:12px;color:#7d8da3;margin-top:-6px}

/* --- batang tegak --- */
.cols{display:flex;align-items:flex-end;gap:10px;position:relative;padding-top:20px;flex:1 1 auto}
.col{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;gap:5px}
.col-b{width:100%;max-width:46px;border-radius:4px 4px 0 0;display:block}
.col-v{font-size:12px;font-weight:650;color:#cdd8e6}
.col-l{font-size:11.5px;color:#7d8da3;white-space:nowrap}
.rule{position:absolute;left:0;right:0;border-top:1.5px dashed #fab219;opacity:.85}
.rule b{position:absolute;top:-9px;font-size:11px;color:#fab219;font-weight:650;
  background:#0e151f;padding:0 7px;border-radius:3px;white-space:nowrap}
.rule b.l{left:0}.rule b.r{right:0}

/* --- corong --- */
.funnel{display:flex;flex-direction:column;gap:9px}
.fn{display:grid;grid-template-columns:104px 1fr 76px;align-items:center;gap:12px;font-size:13.5px}
.fn-l{color:#a5b3c6;font-weight:600}
.fn-b{height:22px;border-radius:4px;display:block}
.fn-v{text-align:right;font-weight:700;font-size:15px}

/* --- small multiples --- */
.sm{display:grid;grid-template-columns:1fr 1fr;gap:13px}
.smc{background:#0b121b;border:1px solid #16202c;border-radius:9px;padding:10px 12px}
.smc-h{display:flex;align-items:baseline;gap:8px;margin-bottom:4px}
.smc-h b{font-size:13.5px;font-weight:650}
.smc-h span{margin-left:auto;font-size:15px;font-weight:700;font-variant-numeric:tabular-nums}
.spark{display:block;width:100%;height:auto}

/* --- bilah kemajuan --- */
.prog{display:block;height:14px;border-radius:4px;background:#151d29;overflow:hidden}
.prog i{display:block;height:100%}

/* --- peta zona --- */
.zmap{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
.z{border:1px solid #1c2634;border-radius:9px;padding:10px 11px;background:#0b121b;
  border-left-width:3px;display:flex;flex-direction:column;gap:2px}
.z b{font-size:13px;font-weight:650}
.z u{text-decoration:none;font-size:20px;font-weight:750;font-variant-numeric:tabular-nums;line-height:1.2}
.z s{text-decoration:none;font-size:11.5px;color:#7d8da3}

/* --- formulir --- */
.form{display:grid;grid-template-columns:1fr 1fr;gap:12px 14px}
.fld{display:flex;flex-direction:column;gap:5px}
.fld label{font-size:11.5px;font-weight:650;letter-spacing:.09em;text-transform:uppercase;color:#7d8da3}
.fld .in{height:38px;border:1px solid #2a3849;border-radius:8px;background:#0b121b;
  display:flex;align-items:center;padding:0 12px;font-size:14px;color:#e8eef7}
.fld .in.ph{color:#5d6b80}
.wide{grid-column:1/3}
.btns{display:flex;gap:10px;margin-top:2px}
.btn{height:38px;padding:0 18px;border-radius:8px;display:inline-flex;align-items:center;
  font-size:13.5px;font-weight:650;border:1px solid #2a3849;background:#151d29;color:#cdd8e6}
.btn.pri{background:#3987e5;border-color:#3987e5;color:#06101f}

/* --- misc --- */
.note{font-size:12.5px;color:#7d8da3;display:flex;align-items:center;gap:7px}
.dl{display:flex;flex-direction:column;gap:9px}
.dl div{display:flex;gap:12px;font-size:13.5px;align-items:baseline}
.dl dt{width:120px;flex:none;color:#7d8da3;font-size:12px;font-weight:650;letter-spacing:.07em;text-transform:uppercase}
.dl dd{color:#e8eef7;font-weight:600}
.ev{border:1px dashed #2a3849;border-radius:9px;padding:11px 13px;background:#0b121b;
  display:flex;align-items:center;gap:11px;font-size:13.5px;color:#a5b3c6}
.ev b{width:34px;height:40px;border-radius:4px;background:#1c2634;flex:none;
  display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#7d8da3}
`;

/**
 * Membungkus satu panel ke dalam cangkang aplikasi.
 * `app` = { name, short, tabs }, `i` = indeks tab aktif (0-3).
 */
export const frame = (app, i, body, clock = '14:07') => `<!doctype html>
<html><head><meta charset="utf-8"><style>${CSS}</style></head><body>
  <header class="tb">
    <span class="mark">${esc(app.short)}</span>
    <span class="tb-t">${esc(app.name)}</span>
    <span class="tb-s">${esc(app.site)}</span>
    <span class="tb-r">
      <span class="recon"><b></b>Reconstruction · sample data</span>
      <span class="clock">${esc(clock)}</span>
    </span>
  </header>
  <nav class="tabs">
    ${app.tabs.map((t, k) => `<span class="tab${k === i ? ' on' : ''}">${esc(t)}</span>`).join('')}
  </nav>
  <main class="body">${body}</main>
</body></html>`;
