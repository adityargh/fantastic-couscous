/**
 * Membangkitkan 24 tangkapan antarmuka (4 per studi kasus) ke public/shots/.
 *
 *   node scripts/shots.mjs            # pakai Chromium sistem bila ada
 *   CHROME=/path/ke/chrome node scripts/shots.mjs
 *
 * OPSIONAL dan dijalankan MANUAL, sama seperti scripts/og.mjs — berkasnya
 * di-commit supaya build dan deploy tetap nol-dependensi (ADR-013).
 *
 * PENTING — sistem aslinya milik perusahaan dan tidak boleh dipublikasikan.
 * Yang dirender di sini adalah REKONSTRUKSI tata letak dengan DATA CONTOH:
 * setiap bingkai membawa penanda "Reconstruction · sample data", dan tidak ada
 * satu pun nama orang, pemasok, atau angka internal yang nyata di dalamnya.
 *
 * Aturan visualisasi yang ditegakkan di sini (ADR-013):
 *   • Kategori BERURUT memakai ramp biru satu rona (RAMP), tervalidasi.
 *   • Deret tunggal memakai satu warna (SERIES) — bukan gradasi menurut besar.
 *   • Warna status tidak pernah dipinjam sebagai warna seri, dan tidak pernah
 *     berdiri tanpa label teks.
 *   • Tidak ada sumbu ganda. Dua satuan berbeda = dua grafik bersumbu x sama.
 */
import { mkdirSync } from 'node:fs';
import { createShooter, findChrome } from './lib/shoot.mjs';
import { frame, W, H } from './lib/shell.mjs';
import {
  RAMP, STATUS, panel, kpi, pill, table, barRows, columns, spark, funnel, progress,
} from './lib/ui.mjs';

if (!findChrome()) {
  console.error('Chromium tidak ditemukan. Setel CHROME=/path/ke/chrome lalu ulangi.');
  process.exit(1);
}

const band = (i) => RAMP[i];

/* ============================================ 1. Outbound Operations Tower == */

const oot = {
  name: 'Outbound Operations Tower',
  short: 'OOT',
  site: 'jakarta-hub / outbound',
  tabs: ['Shift overview', 'Stage board', 'Wave countdown', 'Exception lane'],
  panels: [
    // 01 — ringkasan shift
    `<div class="g4">
      ${kpi('Active wave', 'W3 / 5', 'Released 13:20')}
      ${kpi('To cut-off', '42 min', 'Closes 18:00', 'warn')}
      ${kpi('Open orders', '2,455', 'Across 4 stages')}
      ${kpi('On-time today', '96.4%', '3 waves closed', 'good')}
    </div>
    <div class="gs">
      ${panel('Open orders by stage', funnel([
        { label: 'Released', value: 1284, display: '1,284' },
        { label: 'Picking', value: 612 },
        { label: 'Packing', value: 341 },
        { label: 'Staged', value: 218 },
      ]), { sub: 'wave W3' })}
      ${panel('Projected finish', `
        <div style="display:flex;flex-direction:column;gap:13px">
          <div>
            <div style="font-size:42px;font-weight:750;letter-spacing:-.03em;line-height:1.1">17:52</div>
            <div class="note" style="margin-top:4px">Cut-off 18:00 · ${pill('good', '8 min margin')}</div>
          </div>
          ${progress(86, 'good')}
          <div class="dl">
            <div><dt>Required</dt><dd>58 / min</dd></div>
            <div><dt>Last 45 min</dt><dd>63 / min</dd></div>
            <div><dt>Basis</dt><dd style="font-weight:500;color:#a5b3c6">Trailing window, not shift average</dd></div>
          </div>
        </div>`)}
    </div>
    ${panel('Open exceptions by reason', barRows([
      { label: 'Short pick', value: 9, display: '9' },
      { label: 'Location empty', value: 7, display: '7' },
      { label: 'Damaged unit', value: 4, display: '4' },
      { label: 'Address hold', value: 3, display: '3' },
    ]) + '<div class="note" style="margin-top:13px">Summary only — the exception lane is where each one gets an owner and an age.</div>',
      { sub: '23 open · 5 past the age limit', grow: true })}`,

    // 02 — papan tahapan
    `<div class="g4">
      ${['Released', 'Picking', 'Packing', 'Staged'].map((s, i) => {
        const tot = [1284, 612, 341, 218][i];
        const ages = [
          [[820, 310, 154], [402, 168, 42], [255, 71, 15], [196, 18, 4]][i],
        ][0];
        return panel(s, `
          <div style="font-size:30px;font-weight:750;letter-spacing:-.025em;margin-bottom:11px">${tot.toLocaleString('en-US')}</div>
          ${barRows(
            [
              { label: '< 15 min', value: ages[0], color: band(0) },
              { label: '15 – 45 min', value: ages[1], color: band(2) },
              { label: '> 45 min', value: ages[2], color: band(3) },
            ],
            { max: Math.max(...ages) },
          )}`, { sub: i === 2 ? 'slowest' : '' });
      }).join('')}
    </div>
    <style>.g4 .bar{grid-template-columns:78px 1fr 40px;gap:8px;font-size:12.5px}</style>
    ${panel('Throughput by lane · orders completed per 30 minutes', columns([
      { label: '11:30', value: 412 }, { label: '12:00', value: 468 },
      { label: '12:30', value: 501 }, { label: '13:00', value: 344 },
      { label: '13:30', value: 486 }, { label: '14:00', value: 523 },
      { label: '14:30', value: 508 }, { label: '15:00', value: 471 },
    ], { height: 168, rule: { value: 470, label: 'rate needed for cut-off' } }), { sub: 'all lanes', grow: true })}`,

    // 03 — hitung mundur wave
    `<div class="g3">
      ${kpi('Waves today', '5', '3 closed · 1 running')}
      ${kpi('Closed on time', '3 / 3', 'No overtime used', 'good')}
      ${kpi('At risk', '1', 'W4 — 11 min short', 'warn')}
    </div>
    ${panel('Wave schedule', table(
      ['Wave', 'Cut-off', 'Remaining:n', 'Required /min:n', 'Current /min:n', 'Projected', 'Status'],
      [
        ['<span class="str">W1</span>', '10:00', '0', '—', '—', '09:41', pill('good', 'Closed')],
        ['<span class="str">W2</span>', '13:00', '0', '—', '—', '12:52', pill('good', 'Closed')],
        ['<span class="str">W3</span>', '18:00', '2,455', '58', '63', '<span class="str">17:52</span>', pill('good', 'On track')],
        ['<span class="str">W4</span>', '21:00', '3,180', '71', '59', '<span class="str">21:11</span>', pill('warn', '11 min late')],
        ['<span class="str">W5</span>', '23:30', '1,640', '—', '—', '<span class="mut">not released</span>', pill('idle', 'Queued')],
      ],
    ), { sub: 'projection from trailing 45 min', pad: false, grow: true })}
    ${panel('Why W4 is short', `<div class="note" style="font-size:13.5px;line-height:1.6">
      W4 inherits the release backlog from W3. Required rate assumes the current
      headcount stays on the lane after 18:00 — reassigning 2 pickers from staging
      closes the gap without overtime.</div>`)}`,

    // 04 — lajur eksepsi
    `<div class="g3">
      ${kpi('Open exceptions', '23', 'Across 4 reasons')}
      ${kpi('Past age limit', '5', 'Escalated automatically', 'crit')}
      ${kpi('Median age', '18 min', 'Limit is 30 min')}
    </div>
    ${panel('Blocked orders', table(
      ['Order', 'Stage', 'Reason', 'Owner', 'Age:n', 'Escalation'],
      [
        ['<span class="str">ORD-48213</span>', 'Picking', 'Short pick', 'Lane 2 lead', '41 min', pill('crit', 'Escalated')],
        ['<span class="str">ORD-48197</span>', 'Packing', 'Damaged unit', 'QA on shift', '38 min', pill('crit', 'Escalated')],
        ['<span class="str">ORD-48260</span>', 'Picking', 'Location empty', 'Inventory', '33 min', pill('crit', 'Escalated')],
        ['<span class="str">ORD-48288</span>', 'Staged', 'Address hold', 'Dispatch', '24 min', pill('warn', 'Due in 6 min')],
        ['<span class="str">ORD-48301</span>', 'Packing', 'Short pick', 'Lane 1 lead', '19 min', pill('warn', 'Due in 11 min')],
        ['<span class="str">ORD-48334</span>', 'Picking', 'Location empty', 'Inventory', '12 min', pill('idle', 'Within limit')],
        ['<span class="str">ORD-48350</span>', 'Picking', 'Short pick', 'Lane 3 lead', '7 min', pill('idle', 'Within limit')],
      ],
    ), { sub: 'oldest first', pad: false, grow: true })}`,
  ],
};

/* ========================================= 2. Occupancy Monitoring & Alert == */

const zones = [
  ['A1', 'Ambient · fast', 62, 'good'], ['A2', 'Ambient · fast', 71, 'good'],
  ['A3', 'Ambient · slow', 88, 'warn'], ['A4', 'Ambient · slow', 94, 'crit'],
  ['B1', 'Dry bulk', 54, 'good'], ['B2', 'Dry bulk', 79, 'good'],
  ['B3', 'Dry bulk', 66, 'good'], ['B4', 'Dry bulk', 83, 'good'],
  ['C1', 'Chilled', 91, 'crit'], ['C2', 'Frozen', 68, 'good'],
  ['C3', 'Frozen', 74, 'good'], ['D1', 'Overflow', 37, 'good'],
];
const zoneTone = { good: STATUS.good, warn: STATUS.warn, crit: STATUS.crit };
const zoneWord = { good: 'healthy', warn: 'warning', crit: 'critical' };

const occ = {
  name: 'Occupancy Monitoring & Alert',
  short: 'OCC',
  site: 'jakarta-hub / storage',
  tabs: ['Zone map', 'Fill trend', 'Thresholds', 'Alert log'],
  panels: [
    // 01 — peta zona
    `<div class="g4">
      ${kpi('Site occupancy', '76%', 'Average hides the tail')}
      ${kpi('Zones in warning', '1', 'A3 at 88%', 'warn')}
      ${kpi('Zones critical', '2', 'A4, C1', 'crit')}
      ${kpi('Put-away rejects', '14', 'Today · no location found')}
    </div>
    <div class="gs grow">
      ${panel('Storage zones', `<div class="zmap">
        ${zones.map(([id, kind, pct, tone]) => `<div class="z" style="border-left-color:${zoneTone[tone]}">
          <b>${id}</b><u>${pct}%</u><s>${kind}</s><s style="color:${zoneTone[tone]};font-weight:650">${zoneWord[tone]}</s>
        </div>`).join('')}
      </div>
      <div class="note" style="margin-top:12px">Read as a floor plan — a put-away decision is about where to walk.</div>`,
        { sub: 'live · 12 zones', grow: true })}
      ${panel('Fullest right now', barRows(
        zones.slice().sort((a, b) => b[2] - a[2]).slice(0, 5)
          .map(([id, kind, pct, tone]) => ({
            label: `${id} · ${kind.split(' · ')[0]}`,
            value: pct,
            display: `${pct}%`,
            color: zoneTone[tone],
          })),
        { max: 100 },
      ) + `<div class="note" style="margin-top:13px">Each bar carries its zone label and status word — colour never decides on its own.</div>
      <div style="margin-top:15px;border-top:1px solid #1c2634;padding-top:14px">
        <div style="font-size:11.5px;font-weight:650;letter-spacing:.1em;text-transform:uppercase;color:#7d8da3;margin-bottom:10px">Raised in the last hour</div>
        <div class="dl">
          <div><dt>14:02 · C1</dt><dd style="font-weight:500">Critical · 91% · open</dd></div>
          <div><dt>13:18 · A4</dt><dd style="font-weight:500">Critical · 94% · open</dd></div>
          <div><dt>13:41 · B4</dt><dd style="font-weight:500">Cleared in 22 min</dd></div>
        </div>
      </div>`, { grow: true })}
    </div>`,

    // 02 — tren (small multiples, satu rona per panel)
    `${panel('Fill rate · last 14 days', `<div class="sm">
      ${[
        ['A3 · ambient slow', [71, 72, 70, 74, 76, 75, 79, 81, 80, 83, 85, 84, 87, 88], 85],
        ['A4 · ambient slow', [80, 82, 81, 85, 84, 87, 88, 90, 89, 92, 91, 93, 93, 94], 85],
        ['C1 · chilled', [66, 70, 69, 74, 77, 76, 80, 83, 85, 84, 88, 89, 90, 91], 80],
        ['B1 · dry bulk', [58, 61, 57, 60, 55, 59, 54, 57, 53, 56, 52, 55, 53, 54], 85],
      ].map(([label, series, th]) => `<div class="smc">
        <div class="smc-h"><b>${label}</b><span>${series[series.length - 1]}%</span></div>
        ${spark(series, { threshold: th })}
        <div class="note" style="margin-top:5px;font-size:11.5px">warning threshold ${th}%</div>
      </div>`).join('')}
    </div>
    <div class="note" style="margin-top:13px">Four small charts, one hue, each against its own threshold — the question is
      "this zone versus its limit", not "which zone is highest".</div>`, { sub: 'daily average', grow: true })}`,

    // 03 — aturan ambang
    `${panel('Threshold configuration', table(
      ['Zone', 'Profile', 'Warning:n', 'Critical:n', 'Alert to', 'Quiet hours', 'State'],
      [
        ['<span class="str">A1</span>', 'Ambient · fast', '90%', '96%', 'Shift lead', '00:00 – 05:00', pill('good', 'Active')],
        ['<span class="str">A2</span>', 'Ambient · fast', '90%', '96%', 'Shift lead', '00:00 – 05:00', pill('good', 'Active')],
        ['<span class="str">A3</span>', 'Ambient · slow', '85%', '92%', 'Shift lead', '00:00 – 05:00', pill('good', 'Active')],
        ['<span class="str">A4</span>', 'Ambient · slow', '85%', '92%', 'Shift lead + inbound', '00:00 – 05:00', pill('good', 'Active')],
        ['<span class="str">B1</span>', 'Dry bulk', '85%', '93%', 'Shift lead', '—', pill('good', 'Active')],
        ['<span class="str">C1</span>', 'Chilled', '80%', '88%', 'Shift lead + QA', '—', pill('good', 'Active')],
        ['<span class="str">C2</span>', 'Frozen', '80%', '88%', 'Shift lead + QA', '—', pill('good', 'Active')],
      ],
    ), { sub: 'per zone, never global', pad: false, grow: true })}
    ${panel('Why thresholds differ', `<div class="note" style="font-size:13.5px;line-height:1.6">
      A fast zone empties several times a day and can safely run tight. A slow zone at the
      same percentage has no relief coming. One global number would cry wolf on the first
      or stay silent on the second — and either way it gets switched off within a month.</div>`)}`,

    // 04 — log peringatan
    `<div class="g3">
      ${kpi('Raised today', '9', '2 still open')}
      ${kpi('Median time to clear', '34 min', 'Acknowledged by a person')}
      ${kpi('Unacknowledged', '0', 'No alert expires by itself', 'good')}
    </div>
    ${panel('Alert history', table(
      ['Raised', 'Zone', 'Level', 'Fill:n', 'Acknowledged by', 'Cleared in:n', 'State'],
      [
        ['14:02', 'C1', pill('crit', 'Critical'), '91%', 'Shift lead', '—', pill('warn', 'Open')],
        ['13:18', 'A4', pill('crit', 'Critical'), '94%', 'Shift lead', '—', pill('warn', 'Open')],
        ['11:47', 'A3', pill('warn', 'Warning'), '88%', 'Shift lead', '52 min', pill('good', 'Cleared')],
        ['10:05', 'C1', pill('warn', 'Warning'), '83%', 'QA on shift', '38 min', pill('good', 'Cleared')],
        ['09:12', 'A4', pill('warn', 'Warning'), '86%', 'Inbound lead', '27 min', pill('good', 'Cleared')],
        ['08:40', 'A3', pill('warn', 'Warning'), '85%', 'Shift lead', '19 min', pill('good', 'Cleared')],
        ['07:55', 'B2', pill('warn', 'Warning'), '85%', 'Shift lead', '41 min', pill('good', 'Cleared')],
      ],
    ), { sub: 'newest first', pad: false, grow: true })}`,
  ],
};

/* ================================================ 3. EX Analysis System ===== */

const exa = {
  name: 'EX Analysis System',
  short: 'EXA',
  site: 'quality / expiry control',
  tabs: ['Exposure', 'Batch ageing', 'Cause mix', 'Action list'],
  panels: [
    // 01 — eksposur per pita
    `<div class="g3">
      ${kpi('Exposure at risk', 'IDR 142 M', 'Bands under 45 days')}
      ${kpi('Actioned this week', '71%', 'Of at-risk value', 'good')}
      ${kpi('Overdue actions', '4', 'Past their band', 'warn')}
    </div>
    <div class="gs">
      ${panel('Value by days to expiry', barRows([
        { label: '> 90 days', value: 1840, display: 'IDR 1.84 B', color: band(0), note: 'options are cheap and many' },
        { label: '46 – 90 days', value: 612, display: 'IDR 612 M', color: band(1), note: 'redirect or promote' },
        { label: '15 – 45 days', value: 98, display: 'IDR 98 M', color: band(2), note: 'pick-first and markdown' },
        { label: '< 15 days', value: 44, display: 'IDR 44 M', color: band(3), note: 'one option left' },
      ]), { sub: 'value, not item count' })}
      ${panel('Band boundaries', `<div class="dl">
        <div><dt>Derived from</dt><dd>Lead time of the action</dd></div>
        <div><dt>Not from</dt><dd style="color:#a5b3c6;font-weight:500">Round numbers</dd></div>
        <div><dt>Rule</dt><dd style="color:#a5b3c6;font-weight:500">A band is valid only if the action it exists for can still be arranged</dd></div>
      </div>
      <div class="note" style="margin-top:14px">Bands read light to dark as urgency rises — an ordered scale, one hue.</div>`)}
    </div>
    ${panel('At-risk exposure · last 12 weeks', columns([
      { label: 'W31', value: 214 }, { label: 'W32', value: 198 }, { label: 'W33', value: 231 },
      { label: 'W34', value: 205 }, { label: 'W35', value: 187 }, { label: 'W36', value: 176 },
      { label: 'W37', value: 192 }, { label: 'W38', value: 168 }, { label: 'W39', value: 159 },
      { label: 'W40', value: 171 }, { label: 'W41', value: 150 }, { label: 'W42', value: 142 },
    ], { height: 150, rule: { value: 180, label: 'review trigger' } }), {
      sub: 'IDR million, bands under 45 days', grow: true,
    })}`,

    // 02 — umur batch
    `${panel('Batches in the at-risk bands', table(
      ['Batch', 'Category', 'Expires', 'Days left:n', 'On hand:n', 'Value at risk:n', 'Action'],
      [
        ['<span class="str">BTH-20418</span>', 'Dairy', '2025-10-24', '9', '412', 'IDR 14.2 M', pill('crit', 'Markdown')],
        ['<span class="str">BTH-20377</span>', 'Bakery', '2025-10-26', '11', '188', 'IDR 5.1 M', pill('crit', 'Pick first')],
        ['<span class="str">BTH-20455</span>', 'Beverage', '2025-11-02', '18', '1,240', 'IDR 22.8 M', pill('warn', 'Promote')],
        ['<span class="str">BTH-20390</span>', 'Snacks', '2025-11-09', '25', '960', 'IDR 11.4 M', pill('warn', 'Promote')],
        ['<span class="str">BTH-20501</span>', 'Dairy', '2025-11-18', '34', '520', 'IDR 18.0 M', pill('idle', 'Redirect')],
        ['<span class="str">BTH-20466</span>', 'Frozen', '2025-11-25', '41', '300', 'IDR 9.7 M', pill('idle', 'Watch')],
        ['<span class="str">BTH-20512</span>', 'Beverage', '2025-11-28', '44', '2,100', 'IDR 16.6 M', pill('idle', 'Watch')],
      ],
    ), { sub: 'batch level — an SKU average hides the one batch that matters', pad: false, grow: true })}`,

    // 03 — komposisi sebab
    `<div class="g3">
      ${kpi('Write-off, 6 months', 'IDR 612 M', 'Across 5 causes')}
      ${kpi('Upstream of the warehouse', '62%', 'Two causes, both in buying', 'warn')}
      ${kpi('Causes tracked', '5', 'Short list, on purpose')}
    </div>
    ${panel('Write-off causes · last 6 months', barRows([
      { label: 'Ordered above movement', value: 38, display: '38%', note: 'cumulative 38%' },
      { label: 'Slow mover, no review', value: 24, display: '24%', note: 'cumulative 62%' },
      { label: 'FEFO breach at picking', value: 17, display: '17%', note: 'cumulative 79%' },
      { label: 'Damaged in storage', value: 12, display: '12%', note: 'cumulative 91%' },
      { label: 'Supplier short shelf life', value: 9, display: '9%', note: 'cumulative 100%' },
    ]), { sub: 'share of write-off value', grow: true })}
    ${panel('Reading this', `<div class="note" style="font-size:13.5px;line-height:1.6">
      Write-off is an outcome, not a cause. Two causes carry 62% of the value and both sit
      upstream of the warehouse — which makes this a buying-and-review conversation, not a
      storage one. Ranked bars, one series, one colour: length already encodes the size.</div>`)}`,

    // 04 — daftar tindakan
    `<div class="g3">
      ${kpi('Actions this week', '18', 'Each with an owner')}
      ${kpi('Closed', '13', 'Before the band closed', 'good')}
      ${kpi('Overdue', '4', 'Escalated to category lead', 'warn')}
    </div>
    ${panel('Week 42 action list', table(
      ['Batch', 'Action', 'Owner', 'Due', 'Value:n', 'Status'],
      [
        ['<span class="str">BTH-20418</span>', 'Markdown 30%', 'Category · dairy', 'Today', 'IDR 14.2 M', pill('crit', 'Overdue')],
        ['<span class="str">BTH-20377</span>', 'Move to pick-first slot', 'Inventory', 'Today', 'IDR 5.1 M', pill('warn', 'In progress')],
        ['<span class="str">BTH-20455</span>', 'Include in promo basket', 'Commercial', 'Thu', 'IDR 22.8 M', pill('warn', 'In progress')],
        ['<span class="str">BTH-20390</span>', 'Include in promo basket', 'Commercial', 'Thu', 'IDR 11.4 M', pill('good', 'Done')],
        ['<span class="str">BTH-20501</span>', 'Redirect to second site', 'Inventory', 'Fri', 'IDR 18.0 M', pill('good', 'Done')],
        ['<span class="str">BTH-20466</span>', 'Review order quantity', 'Commercial', 'Fri', 'IDR 9.7 M', pill('good', 'Done')],
      ],
    ), { sub: 'analysis ends in an assignment', pad: false, grow: true })}`,
  ],
};

/* ============================================ 4. Antrian Inbound Frozen ===== */

const aif = {
  name: 'Antrian Inbound Frozen',
  short: 'AIF',
  site: 'jakarta-hub / receiving',
  tabs: ['Queue board', 'Check-in', 'Exposure timer', 'Queue analysis'],
  panels: [
    // 01 — papan antrian
    `<div class="g4">
      ${kpi('In queue', '6', 'Frozen and chilled')}
      ${kpi('Longest wait', '74 min', 'Window is 90 min', 'warn')}
      ${kpi('Lanes open', '3 / 3', 'All receiving')}
      ${kpi('Inside window today', '92%', '24 loads received', 'good')}
    </div>
    ${panel('Live queue', table(
      ['#', 'Vehicle', 'Supplier', 'Load', 'Lane', 'Waiting:n', 'Window used:n', 'Status'],
      [
        ['1', '<span class="str">B 9041 XX</span>', 'Supplier A', 'Frozen', 'L1', '74 min', '82%', pill('crit', 'Near limit')],
        ['2', '<span class="str">B 7712 XX</span>', 'Supplier C', 'Chilled', 'L2', '58 min', '64%', pill('warn', 'Watch')],
        ['3', '<span class="str">B 2288 XX</span>', 'Supplier A', 'Frozen', 'L3', '41 min', '46%', pill('warn', 'Watch')],
        ['4', '<span class="str">B 5530 XX</span>', 'Supplier B', 'Frozen', '<span class="mut">unassigned</span>', '27 min', '30%', pill('idle', 'Queued')],
        ['5', '<span class="str">B 6104 XX</span>', 'Supplier D', 'Chilled', '<span class="mut">unassigned</span>', '16 min', '18%', pill('idle', 'Queued')],
        ['6', '<span class="str">B 3395 XX</span>', 'Supplier B', 'Frozen', '<span class="mut">unassigned</span>', '4 min', '4%', pill('idle', 'Queued')],
      ],
    ), { sub: 'ordered by arrival · sorted by exposure', pad: false, grow: true })}
    ${panel('Priority', `<div class="note" style="font-size:13.5px;line-height:1.6">
      Position 1 is not next because it arrived first — it is next because it has consumed
      82% of its cold-chain window. Arrival order sets the list; exposure sets the priority.</div>`)}`,

    // 02 — check-in
    `<div class="gs grow">
      ${panel('Arrival check-in', `<div class="form">
        <div class="fld"><label>Vehicle</label><div class="in">B 3395 XX</div></div>
        <div class="fld"><label>Supplier</label><div class="in">Supplier B</div></div>
        <div class="fld"><label>Load type</label><div class="in">Frozen</div></div>
        <div class="fld"><label>Arrival temperature</label><div class="in">−19.4 °C</div></div>
        <div class="fld"><label>Seal number</label><div class="in">SL-77120</div></div>
        <div class="fld"><label>Gate arrival</label><div class="in">14:03</div></div>
        <div class="fld wide"><label>Note (optional)</label><div class="in ph">Anything the receiving lane should know</div></div>
        <div class="wide btns">
          <span class="btn pri">Register arrival</span>
          <span class="btn">Cancel</span>
        </div>
      </div>
      <div class="note" style="margin-top:15px">Six fields. The exposure clock starts at
        <b style="color:#e8eef7;margin:0 3px">gate arrival</b>, not at check-in — the risk begins
        before the system sees the load.</div>`)}
      ${panel('Registered in the last hour', table(
        ['Time', 'Vehicle', 'Temp:n'],
        [
          ['14:03', 'B 3395 XX', '−19.4'],
          ['13:51', 'B 6104 XX', '+2.1'],
          ['13:40', 'B 5530 XX', '−18.8'],
          ['13:26', 'B 2288 XX', '−20.2'],
          ['13:09', 'B 7712 XX', '+3.0'],
          ['12:53', 'B 9041 XX', '−19.1'],
          ['12:38', 'B 1177 XX', '−18.5'],
          ['12:21', 'B 4420 XX', '+2.6'],
          ['12:04', 'B 8863 XX', '−19.8'],
          ['11:47', 'B 2019 XX', '−20.0'],
        ],
      ) + `<div class="note" style="margin:13px 15px 0">Temperature on arrival is recorded even
        when it is in spec — a value that is only captured when it fails cannot show a drift.</div>`,
        { pad: false, grow: true })}
    </div>`,

    // 03 — pewaktu paparan
    `${panel('Load B 9041 XX · Supplier A · frozen', `
      <div style="display:flex;align-items:flex-end;gap:22px;margin-bottom:14px">
        <div>
          <div style="font-size:12px;font-weight:650;letter-spacing:.09em;text-transform:uppercase;color:#7d8da3">Window used</div>
          <div style="font-size:46px;font-weight:750;letter-spacing:-.03em;line-height:1.1;color:${STATUS.crit}">82%</div>
        </div>
        <div style="padding-bottom:9px">${pill('crit', '16 min of window left')}</div>
      </div>
      ${progress(82, 'crit')}
      <div class="g4" style="margin-top:16px">
        ${kpi('Gate arrival', '12:53', 'Clock starts here')}
        ${kpi('Checked in', '12:58', '5 min at the gate')}
        ${kpi('Elapsed', '74 min', 'Against a 90 min window')}
        ${kpi('Arrival temp', '−19.1 °C', 'Within spec on arrival', 'good')}
      </div>
      <div style="margin-top:16px;border-top:1px solid #1c2634;padding-top:15px">
        <div style="font-size:11.5px;font-weight:650;letter-spacing:.1em;text-transform:uppercase;color:#7d8da3;margin-bottom:12px">Where the window went</div>
        ${barRows([
          { label: 'Waiting at the gate', value: 5, display: '5 min', color: band(0) },
          { label: 'Queued, lane unassigned', value: 31, display: '31 min', color: band(1) },
          { label: 'Queued, lane L1 busy', value: 38, display: '38 min', color: band(3) },
          { label: 'Unloading', value: 0, display: 'not started', color: STATUS.idle },
        ], { max: 40 })}
        <div class="note" style="margin-top:13px">69 of the 74 minutes were spent queued, not at the gate —
          which points the fix at lane assignment rather than at the driver.</div>
      </div>`, { sub: 'position 1 in queue', grow: true })}
    ${panel('What happens at 100%', `<div class="note" style="font-size:13.5px;line-height:1.6">
      The load does not fail automatically — it moves to mandatory QA inspection before
      put-away, and the delay is recorded against the queue rather than against the supplier.
      That distinction is the reason the timer exists.</div>`)}`,

    // 04 — analisis antrian (dua grafik, satu sumbu x, tanpa sumbu ganda)
    `${panel('Waiting time by hour · minutes', columns([
      { label: '06', value: 12 }, { label: '07', value: 18 }, { label: '08', value: 44 },
      { label: '09', value: 61 }, { label: '10', value: 38 }, { label: '11', value: 21 },
      { label: '12', value: 16 }, { label: '13', value: 52 }, { label: '14', value: 68 },
      { label: '15', value: 33 }, { label: '16', value: 19 }, { label: '17', value: 14 },
    ], { height: 190, rule: { value: 45, label: 'escalation point' } }), { sub: 'average, last 30 days', grow: true })}
    ${panel('Arrivals by hour · loads', columns([
      { label: '06', value: 1 }, { label: '07', value: 2 }, { label: '08', value: 5 },
      { label: '09', value: 6 }, { label: '10', value: 3 }, { label: '11', value: 2 },
      { label: '12', value: 1 }, { label: '13', value: 5 }, { label: '14', value: 6 },
      { label: '15', value: 3 }, { label: '16', value: 2 }, { label: '17', value: 1 },
    ], { height: 190, rule: { value: 3, label: 'lane capacity per hour' } }), {
      sub: 'same x-axis — two units never share one scale', grow: true,
    })}`,
  ],
};

/* ============================================== 5. Relabel Productivity ===== */

const rlp = {
  name: 'Relabel Productivity',
  short: 'RLP',
  site: 'jakarta-hub / rework',
  tabs: ['Daily output', 'Stations', 'Backlog', 'Cause ranking'],
  panels: [
    // 01 — output harian
    `<div class="g4">
      ${kpi('Units today', '5,280', 'Across 6 stations')}
      ${kpi('Rate', '186 / hr', 'Standard is 175', 'good')}
      ${kpi('Hours logged', '29.0', 'Person-hours')}
      ${kpi('Backlog', '9,240', 'About 53 person-hours', 'warn')}
    </div>
    ${panel('Units relabelled · last 7 days', columns([
      { label: 'Mon', value: 3620 }, { label: 'Tue', value: 4010 },
      { label: 'Wed', value: 3880 }, { label: 'Thu', value: 4460 },
      { label: 'Fri', value: 5120 }, { label: 'Sat', value: 2740 },
      { label: 'Sun', value: 4180 },
    ], { height: 172, rule: { value: 3900, label: 'daily target' } }), { sub: 'all stations', grow: true })}
    ${panel('Why a standard rate matters', `<div class="note" style="font-size:13.5px;line-height:1.6">
      A rate turns a backlog into hours, and hours into a staffing decision. Before this,
      the work was described as busy or quiet — which cannot be planned against.</div>`)}`,

    // 02 — stasiun
    `${panel('Throughput by station · today', table(
      ['Station', 'Shift', 'Units:n', 'Hours:n', 'Rate /hr:n', 'Vs standard:n', 'Note'],
      [
        ['<span class="str">RL-01</span>', 'A', '1,240', '6.0', '207', '+18%', pill('good', 'Above standard')],
        ['<span class="str">RL-02</span>', 'A', '1,020', '6.0', '170', '−3%', pill('idle', 'At standard')],
        ['<span class="str">RL-03</span>', 'B', '1,080', '5.5', '196', '+12%', pill('good', 'Above standard')],
        ['<span class="str">RL-04</span>', 'B', '840', '5.0', '168', '−4%', pill('idle', 'At standard')],
        ['<span class="str">RL-05</span>', 'C', '620', '3.5', '177', '+1%', pill('idle', 'At standard')],
        ['<span class="str">RL-06</span>', 'C', '480', '3.0', '160', '−9%', pill('warn', 'Below standard')],
      ],
    ), { sub: 'station level, never person level', pad: false, grow: true })}
    ${panel('Reported per station, on purpose', `<div class="note" style="font-size:13.5px;line-height:1.6">
      The point is to find where the method differs — RL-01 and RL-03 both pre-sort by label
      type before starting, and that is the difference worth copying. The moment this becomes
      a personal scoreboard, easy batches get competed for and the number stops describing the
      work.</div>`)}`,

    // 03 — umur tumpukan
    `<div class="g3">
      ${kpi('Batches pending', '61', '9,240 units')}
      ${kpi('Oldest batch', '11 days', 'RLB-3092 · price change', 'crit')}
      ${kpi('Over 7 days', '8', 'Unsellable and occupying space', 'warn')}
    </div>
    ${panel('Backlog by age', columns([
      { label: '< 1 day', value: 21, color: band(0) },
      { label: '1 – 3 days', value: 18, color: band(1) },
      { label: '4 – 7 days', value: 14, color: band(2) },
      { label: '> 7 days', value: 8, color: band(3) },
    ], { height: 170 }), { sub: 'batches · ordered bands, one hue', grow: true })}
    ${panel('Double cost', `<div class="note" style="font-size:13.5px;line-height:1.6">
      An old relabel batch is stock that cannot be sold and is still holding a location that
      sellable stock could use. Volume alone hides that — only ageing shows it.</div>`)}`,

    // 04 — peringkat sebab
    `<div class="g3">
      ${kpi('Relabel volume', '186k units', 'Last 6 months')}
      ${kpi('Avoidable share', '69%', 'Label error + wrong barcode + damage', 'warn')}
      ${kpi('Traced to a source', '92%', 'Of volume carries a cause code', 'good')}
    </div>
    ${panel('Relabel causes · last 6 months', barRows([
      { label: 'Supplier label error', value: 41, display: '41%', note: 'cumulative 41% — recurring, 3 suppliers' },
      { label: 'Price change', value: 23, display: '23%', note: 'cumulative 64% — scheduled, unavoidable' },
      { label: 'Wrong barcode', value: 16, display: '16%', note: 'cumulative 80% — recurring, 1 supplier' },
      { label: 'Label damaged in transit', value: 12, display: '12%', note: 'cumulative 92%' },
      { label: 'One-off corrections', value: 8, display: '8%', note: 'cumulative 100% — genuine long tail' },
    ]), { sub: 'share of relabel volume', grow: true })}
    ${panel('The whole point', `<div class="note" style="font-size:13.5px;line-height:1.6">
      Relabelling is rework. Measuring it is only worth doing if the measurement points
      upstream — 57% of the volume comes from four suppliers, which is a supplier conversation,
      not a staffing one. Cumulative share is shown as a value, not as a second axis.</div>`)}`,
  ],
};

/* ================================ 6. AVAS — Astro Validation Absence System == */

const avas = {
  name: 'Astro Validation Absence System',
  short: 'AVAS',
  site: 'jakarta-hub / workforce',
  tabs: ['Submissions', 'Validation', 'Coverage', 'Monthly recap'],
  panels: [
    // 01 — antrian pengajuan
    `<div class="g4">
      ${kpi('Submitted today', '17', 'Across 3 shifts')}
      ${kpi('Validated same shift', '82%', 'Target is 90%', 'warn')}
      ${kpi('Pending', '3', 'Oldest 4 hours')}
      ${kpi('Unvalidated backlog', '0 days', 'Nothing carried over', 'good')}
    </div>
    ${panel('Submission queue', table(
      ['Ref', 'Employee', 'Shift', 'Category', 'Submitted', 'Evidence', 'State'],
      [
        ['<span class="str">ABS-4471</span>', 'EMP-0412', 'A', 'Sick leave', '06:12', 'Attached', pill('good', 'Validated')],
        ['<span class="str">ABS-4472</span>', 'EMP-0188', 'A', 'Annual leave', '06:20', 'Approved in advance', pill('good', 'Validated')],
        ['<span class="str">ABS-4473</span>', 'EMP-0356', 'A', 'Sick leave', '07:03', 'Attached', pill('good', 'Validated')],
        ['<span class="str">ABS-4474</span>', 'EMP-0521', 'B', 'Unplanned', '13:41', '<span class="mut">None</span>', pill('warn', 'Pending')],
        ['<span class="str">ABS-4475</span>', 'EMP-0290', 'B', 'Sick leave', '13:55', 'Attached', pill('warn', 'Pending')],
        ['<span class="str">ABS-4476</span>', 'EMP-0463', 'B', 'Permit', '14:02', 'Attached', pill('warn', 'Pending')],
      ],
    ), { sub: 'one queue, not a set of chat messages', pad: false, grow: true })}`,

    // 02 — rincian validasi
    `<div class="gs grow">
      ${panel('ABS-4475 · EMP-0290', `<div class="dl">
        <div><dt>Category</dt><dd>Sick leave</dd></div>
        <div><dt>Dates</dt><dd>15 Sep 2026 · 1 day</dd></div>
        <div><dt>Shift</dt><dd>B · Packing</dd></div>
        <div><dt>Submitted</dt><dd>13:55 · via shift lead</dd></div>
        <div><dt>Reported to</dt><dd>Coverage view at 13:56 (provisional)</dd></div>
      </div>
      <div class="ev" style="margin-top:14px"><b>PDF</b>
        <span>Supporting document attached · 1 file<br>
          <span style="color:#7d8da3;font-size:12.5px">Evidence sits beside the decision, not in another system</span></span>
      </div>
      <div class="btns" style="margin-top:15px">
        <span class="btn pri">Validate</span>
        <span class="btn">Return for detail</span>
      </div>`, { sub: 'pending' })}
      ${panel('Still open', table(
        ['Ref', 'Shift', 'Age:n'],
        [
          ['<span class="str">ABS-4474</span>', 'B', '26 min'],
          ['<span class="str">ABS-4475</span>', 'B', '12 min'],
          ['<span class="str">ABS-4476</span>', 'B', '5 min'],
        ],
      ) + `<div style="padding:15px">
        <div style="font-size:11.5px;font-weight:650;letter-spacing:.1em;text-transform:uppercase;color:#7d8da3;margin-bottom:10px">Validated this shift</div>
        <div class="dl">
          <div><dt>Same shift</dt><dd>14 of 17</dd></div>
          <div><dt>Median time</dt><dd>38 min</dd></div>
          <div><dt>Returned</dt><dd>1 · detail missing</dd></div>
        </div>
        <div class="note" style="margin-top:15px">No automated judgement, scoring or
          pattern flagging — a consequential decision about a person belongs with a person
          and a written policy.</div>
      </div>`, { pad: false, grow: true })}
    </div>`,

    // 03 — dampak cakupan
    `<div class="g3">
      ${kpi('Planned headcount', '86', 'Across 3 shifts today')}
      ${kpi('Available now', '79', '7 absent · 3 provisional')}
      ${kpi('Functions short', '2', 'Packing and inbound', 'warn')}
    </div>
    ${panel('Coverage by shift and function', table(
      ['Function', 'Shift A:n', 'Shift B:n', 'Shift C:n', 'Gap today', 'State'],
      [
        ['<span class="str">Inbound</span>', '9 / 10', '8 / 10', '6 / 6', '−3', pill('warn', 'Short')],
        ['<span class="str">Put-away</span>', '7 / 7', '7 / 7', '4 / 4', '0', pill('good', 'Covered')],
        ['<span class="str">Picking</span>', '12 / 12', '11 / 12', '8 / 8', '−1', pill('good', 'Covered')],
        ['<span class="str">Packing</span>', '8 / 9', '6 / 9', '5 / 5', '−5', pill('crit', 'Short')],
        ['<span class="str">Dispatch</span>', '4 / 4', '4 / 4', '3 / 3', '0', pill('good', 'Covered')],
        ['<span class="str">Relabel</span>', '2 / 2', '2 / 2', '1 / 2', '−1', pill('good', 'Covered')],
        ['<span class="str">Quality</span>', '3 / 3', '2 / 3', '2 / 2', '−1', pill('good', 'Covered')],
      ],
    ), { sub: 'against planned headcount, per function', pad: false, grow: true })}
    ${panel('Provisional counts', `<div class="note" style="font-size:13.5px;line-height:1.6">
      Coverage shows reported absence immediately, marked provisional. Only the validated
      record feeds the recap. An operational view and a system of record have different
      tolerances for uncertainty — making the first wait for the second makes it useless.</div>`)}`,

    // 04 — rekap bulanan
    `<div class="g3">
      ${kpi('Records this month', '312', 'All categories')}
      ${kpi('Validated', '99.0%', '3 pending, all from today', 'good')}
      ${kpi('Absence rate', '4.1%', '4.6% last month', 'good')}
    </div>
    ${panel('September 2026 · by category and shift', table(
      ['Category', 'Shift A:n', 'Shift B:n', 'Shift C:n', 'Total:n', 'Validated:n', 'Vs last month'],
      [
        ['<span class="str">Annual leave</span>', '41', '38', '22', '101', '101', '+4'],
        ['<span class="str">Sick leave</span>', '34', '40', '19', '93', '93', '−11'],
        ['<span class="str">Permit</span>', '22', '18', '11', '51', '51', '−2'],
        ['<span class="str">Unplanned</span>', '14', '21', '9', '44', '41', '−8'],
        ['<span class="str">Other</span>', '9', '8', '6', '23', '23', '+1'],
      ],
    ), { sub: 'a read-out of decisions already made', pad: false, grow: true })}`,
  ],
};

/* ------------------------------------------------------------------ render -- */

const APPS = [
  ['outbound-operations-tower', oot],
  ['occupancy-monitoring-alert', occ],
  ['ex-analysis-system', exa],
  ['antrian-inbound-frozen', aif],
  ['relabel-productivity', rlp],
  ['avas', avas],
];

/** Nama berkas HARUS cocok dengan frontmatter — skema menuntut 0N-nama.png. */
const FILES = {
  'outbound-operations-tower': ['01-shift-overview', '02-stage-board', '03-wave-sla', '04-exception-lane'],
  'occupancy-monitoring-alert': ['01-zone-map', '02-fill-trend', '03-threshold-rules', '04-alert-log'],
  'ex-analysis-system': ['01-exposure-overview', '02-batch-ageing', '03-cause-mix', '04-action-list'],
  'antrian-inbound-frozen': ['01-queue-board', '02-check-in', '03-exposure-timer', '04-queue-analysis'],
  'relabel-productivity': ['01-daily-output', '02-operator-throughput', '03-backlog-ageing', '04-cause-pareto'],
  avas: ['01-submission-queue', '02-validation-detail', '03-coverage-impact', '04-monthly-recap'],
};

const shooter = createShooter({ width: W, height: H });
console.log(`kompensasi frame jendela: ${shooter.offset.x}x${shooter.offset.y} px`);

let n = 0;
for (const [slug, app] of APPS) {
  mkdirSync(`public/shots/${slug}`, { recursive: true });
  app.panels.forEach((body, i) => {
    const out = `public/shots/${slug}/${FILES[slug][i]}.png`;
    shooter.shoot(frame(app, i, body), out);
    n += 1;
    console.log(`dibuat: ${out}`);
  });
}

shooter.dispose();
console.log(`\n${n} tangkapan dibangkitkan (${W}x${H}).`);
