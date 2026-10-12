#!/usr/bin/env node
// KFL grid tools — audit.mjs
// Audits a rendered page against a grid manifest (KFL Law 1, grid substrate):
//   - page grids implement the manifest: column count, equal tracks, gutter, and
//     for top-level grids the page frame (margin + container)
//   - every [data-region] left edge sits on a track start and right edge on a
//     track end of its owning grid (±tolerance)
//   - regions on a page grid match the manifest span map and declared starts
//   - sibling regions on a page grid do not overlap
//   - measure / min / max bounds declared per role
// The owning grid is the nearest CSS grid ancestor, looking through subgrids to
// the grid whose tracks they borrow. Nested grids opt out of the page frame:
//   data-grid-columns="N"  nested grid of N equal tracks
//   data-grid="local"      independent local layout (rail + workspace, named
//                          areas); region edges must still land on its tracks
//
// Usage:
//   node audit.mjs --manifest <file> (--url <url> | --html <file>)
//                  [--viewports 375,768,1440] [--tolerance 1]
//                  [--screenshot <dir>] [--json <file>]
// Exit code 0 = pass, 1 = violations, 2 = usage/environment error.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { resolveManifest, breakpointAt } from '../lib/manifest.mjs';
import { launchChromium } from '../lib/browser.mjs';

function fail(msg) { console.error(`audit: ${msg}`); process.exit(2); }

const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf('--' + name); return i >= 0 ? args[i + 1] : undefined; };
const manifestPath = opt('manifest');
const url = opt('url');
const html = opt('html');
if (!manifestPath || Boolean(url) === Boolean(html)) fail('usage: node audit.mjs --manifest <file> (--url <url> | --html <file>) [--viewports 375,768,1440] [--tolerance 1] [--screenshot <dir>] [--json <file>]');

let manifest;
try { manifest = JSON.parse(readFileSync(resolve(manifestPath), 'utf8')); }
catch (e) { fail(`cannot read manifest: ${e.message}`); }
const tolerance = Number(opt('tolerance') ?? 1);
if (!Number.isFinite(tolerance) || tolerance < 0) fail('--tolerance must be a finite non-negative number');
const target = url ?? pathToFileURL(resolve(html)).href;
const { bps, regions: roleList } = resolveManifest(manifest, fail);
const roles = new Map(roleList.map((r) => [r.role, r]));
// Reading-measure window: 45–75 characters, enforced from the first tablet-width viewport up.
const MEASURE = { minCh: 45, maxCh: 75, fromViewport: 768 };

// Default viewports: phone, both sides of every breakpoint, and a container-fitting width.
let viewports;
if (opt('viewports')) {
  viewports = opt('viewports').split(',').map(Number);
  if (!viewports.length || viewports.some((v) => !Number.isInteger(v) || v <= 0)) fail('--viewports must be a comma-separated list of positive integer widths');
} else {
  const set = new Set([Math.max(bps[0].minWidth, 375)]);
  for (const bp of bps.slice(1)) { set.add(bp.minWidth - 1); set.add(bp.minWidth); }
  const last = bps[bps.length - 1];
  set.add(Math.max(last.container + 2 * last.margin, last.minWidth));
  viewports = [...set].sort((a, b) => a - b);
}

// Runs in the page: region geometry plus, per owning grid, its computed tracks.
function measure() {
  const px = (v) => parseFloat(v) || 0;
  const grids = {};
  const gridKeys = new Map();
  const chCache = new Map();
  const isGrid = (el) => getComputedStyle(el).display.includes('grid');
  const isSubgrid = (el) => /^subgrid/.test(getComputedStyle(el).gridTemplateColumns);
  function chOf(el) {
    // One "0" glyph advance under the region's own typography = 1ch.
    const cs = getComputedStyle(el);
    const key = [cs.fontFamily, cs.fontSize, cs.fontWeight, cs.fontStyle, cs.letterSpacing].join('|');
    if (!chCache.has(key)) {
      const probe = document.createElement('span');
      probe.style.cssText = 'position:absolute;top:-9999px;left:-9999px;visibility:hidden;white-space:pre';
      for (const p of ['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing']) probe.style[p] = cs[p];
      probe.textContent = '0'.repeat(100);
      document.body.appendChild(probe);
      chCache.set(key, probe.getBoundingClientRect().width / 100);
      probe.remove();
    }
    return chCache.get(key);
  }
  function nameOf(el) {
    const cls = [...el.classList].slice(0, 2).map((c) => '.' + c).join('');
    const attr = el.getAttribute('data-grid') ? `[data-grid="${el.getAttribute('data-grid')}"]` : '';
    return el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + cls + attr;
  }
  function describe(g) {
    const r = g.getBoundingClientRect();
    const cs = getComputedStyle(g);
    let parent = g.parentElement;
    while (parent && !isGrid(parent)) parent = parent.parentElement;
    return {
      name: nameOf(g),
      mode: g.getAttribute('data-grid') === 'local' ? 'local' : g.hasAttribute('data-grid-columns') ? 'nested' : 'page',
      columnsAttr: g.getAttribute('data-grid-columns'),
      // Resolved value lists every track in px (line names in brackets are dropped).
      tracks: cs.gridTemplateColumns.replace(/\[[^\]]*\]/g, ' ').trim().split(/\s+/).map(parseFloat).filter(Number.isFinite),
      gap: cs.columnGap === 'normal' ? 0 : px(cs.columnGap),
      justify: cs.justifyContent,
      box: {
        left: r.left + px(cs.borderLeftWidth) + px(cs.paddingLeft),
        right: r.right - px(cs.borderRightWidth) - px(cs.paddingRight),
      },
      topLevel: !parent,
    };
  }
  function ownerOf(el) {
    for (let g = el.parentElement; g; g = g.parentElement) {
      if (!isGrid(g) || isSubgrid(g)) continue;
      if (!gridKeys.has(g)) { gridKeys.set(g, 'g' + gridKeys.size); grids[gridKeys.get(g)] = describe(g); }
      return gridKeys.get(g);
    }
    return null;
  }
  const regions = [];
  const all = [...document.querySelectorAll('[data-region]')];
  for (const el of all) {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if (cs.display === 'none' || cs.visibility === 'hidden' || r.width === 0) continue;
    const role = el.getAttribute('data-region');
    const same = document.querySelectorAll(`[data-region="${CSS.escape(role)}"]`);
    regions.push({
      role,
      index: same.length > 1 ? [...same].indexOf(el) : 0,
      optical: el.hasAttribute('data-grid-optical'),
      grid: ownerOf(el),
      rect: { left: r.left, right: r.right, top: r.top, bottom: r.bottom },
      chPx: chOf(el),
      id: all.indexOf(el),
      // Regions that contain this one: a region nested in another is not its sibling.
      within: all.filter((a) => a !== el && a.contains(el)).map((a) => all.indexOf(a)),
    });
  }
  return { grids, regions, viewportWidth: document.documentElement.clientWidth };
}

function label(r) { return `[data-region="${r.role}"]` + (r.index ? `:nth-of-type(${r.index + 1})` : ''); }

// Track [start, end] pairs from the grid's own computed tracks and gap.
function trackLines(g) {
  const tracks = g.tracks.length ? g.tracks : [g.box.right - g.box.left];
  const used = tracks.reduce((a, b) => a + b, 0) + g.gap * (tracks.length - 1);
  const free = g.box.right - g.box.left - used;
  let x = g.box.left;
  if (free > 0.5 && /center/.test(g.justify)) x += free / 2;
  else if (free > 0.5 && /(end|right)$/.test(g.justify)) x += free;
  return tracks.map((w) => { const line = [x, x + w]; x += w + g.gap; return line; });
}

// Structural problems of one grid at one breakpoint, or null.
function gridIssue(g, bp, viewportWidth) {
  if (g.mode === 'local') return null;
  if (g.mode === 'nested') {
    const n = Number(g.columnsAttr);
    if (g.tracks.length !== n) return `declares data-grid-columns="${n}" but implements ${g.tracks.length} tracks`;
    if (g.tracks.some((t) => Math.abs(t - g.tracks[0]) > tolerance)) return `data-grid-columns="${n}" tracks are not equal`;
    return null;
  }
  if (g.tracks.length !== bp.columns) return `implements ${g.tracks.length} tracks but manifest "${bp.id}" declares ${bp.columns}`;
  if (Math.abs(g.gap - bp.gutter) > tolerance) return `column gap ${g.gap}px but manifest "${bp.id}" gutter is ${bp.gutter}px`;
  const w = (g.box.right - g.box.left - (bp.columns - 1) * bp.gutter) / bp.columns;
  if (w <= 0) return `content box ${(g.box.right - g.box.left).toFixed(1)}px cannot hold ${bp.columns} columns at gutter ${bp.gutter}px`;
  if (g.tracks.some((t) => Math.abs(t - w) > tolerance)) return `tracks are not ${bp.columns} equal columns of ${w.toFixed(1)}px`;
  if (g.topLevel) {
    const width = Math.min(viewportWidth - 2 * bp.margin, bp.container);
    const left = (viewportWidth - width) / 2;
    if (Math.abs(g.box.left - left) > tolerance || Math.abs(g.box.right - g.box.left - width) > tolerance)
      return `frame ${g.box.left.toFixed(1)}–${g.box.right.toFixed(1)}px, but margin ${bp.margin}px / container ${bp.container}px put the content box at ${left.toFixed(1)}–${(left + width).toFixed(1)}px`;
  }
  return null;
}

function auditViewport(m, bp, vpWidth) {
  const violations = [];
  const notes = [];
  let edges = 0, gaps = 0;
  const geo = {};
  const fault = (region, check, detail) => violations.push({ viewport: vpWidth, region, check, detail });
  if (!m.regions.length) fault('page', 'no-regions', 'no visible data-region elements were measured; this audit cannot establish grid conformance');
  for (const [key, g] of Object.entries(m.grids)) {
    geo[key] = { lines: trackLines(g), issue: gridIssue(g, bp, m.viewportWidth) };
    // One structural fault per grid: its regions cannot be judged until it is fixed.
    const owned = m.regions.filter((r) => r.grid === key).length;
    if (geo[key].issue) fault(`${g.name} @${vpWidth}px (${owned} region${owned === 1 ? '' : 's'} not checked)`, 'grid-structure', geo[key].issue);
  }

  for (const r of m.regions) {
    const tag = `${label(r)} @${vpWidth}px`;
    const g = r.grid ? m.grids[r.grid] : null;
    if (!g) { fault(tag, 'no-grid-ancestor', 'element has no CSS grid ancestor; place regions as items of a grid-row'); continue; }
    const { lines, issue } = geo[r.grid];
    if (issue) continue;
    if (r.optical) { notes.push(`${tag} data-grid-optical exemption (must be documented)`); continue; }
    const dl = Math.min(...lines.map(([s]) => Math.abs(r.rect.left - s)));
    const dr = Math.min(...lines.map(([, e]) => Math.abs(r.rect.right - e)));
    edges += 2;
    if (dl > tolerance) fault(tag, 'left-edge-off-track', `left ${r.rect.left.toFixed(1)} — nearest track start Δ${dl.toFixed(1)}px`);
    if (dr > tolerance) fault(tag, 'right-edge-off-track', `right ${r.rect.right.toFixed(1)} — nearest track end Δ${dr.toFixed(1)}px`);
    const w = r.rect.right - r.rect.left;
    const role = roles.get(r.role);
    if (!role) notes.push(`role "${r.role}" is not declared in the manifest (edges checked, no span/bounds)`);
    else if (g.mode === 'page' && !role.local) {
      const s = role.spans[bp.id];
      const t = lines[0][1] - lines[0][0];
      const expected = s * t + (s - 1) * bp.gutter;
      if (Math.abs(w - expected) > tolerance) fault(tag, 'span-mismatch', `width ${w.toFixed(1)} but manifest span ${s} = ${expected.toFixed(1)}px`);
      const st = role.starts[bp.id];
      if (st !== 'auto' && Math.abs(r.rect.left - lines[st - 1][0]) > tolerance)
        fault(tag, 'start-mismatch', `left ${r.rect.left.toFixed(1)} but manifest start ${st} = ${lines[st - 1][0].toFixed(1)}px`);
    }
    const meta = role ?? {};
    if (meta.kind === 'measure' && vpWidth >= MEASURE.fromViewport && r.chPx) {
      const lo = MEASURE.minCh * r.chPx, hi = MEASURE.maxCh * r.chPx;
      if (w < lo - tolerance || w > hi + tolerance)
        fault(tag, 'measure-window', `${w.toFixed(1)}px ≈ ${(w / r.chPx).toFixed(0)}ch, outside the ${MEASURE.minCh}–${MEASURE.maxCh}ch reading window [${lo.toFixed(0)}–${hi.toFixed(0)}px]`);
    }
    if (meta.min !== undefined && w < meta.min - tolerance) fault(tag, 'below-declared-min', `width ${w.toFixed(1)}px is under the declared minimum ${meta.min}px`);
    if (meta.max !== undefined && w > meta.max + tolerance) fault(tag, 'above-declared-max', `width ${w.toFixed(1)}px is over the declared maximum ${meta.max}px`);
  }

  // Side-by-side siblings on one page grid: with both edges on tracks, the gap is the
  // gutter or gutter + k whole tracks; anything else means the regions overlap.
  const byGrid = new Map();
  for (const r of m.regions) {
    if (!r.grid || r.optical || m.grids[r.grid].mode !== 'page') continue;
    if (!byGrid.has(r.grid)) byGrid.set(r.grid, []);
    byGrid.get(r.grid).push(r);
  }
  for (const [key, rs] of byGrid) {
    const { lines, issue } = geo[key];
    if (issue) continue;
    const t = lines[0][1] - lines[0][0];
    const sameRow = (a, b) => Math.min(a.rect.bottom, b.rect.bottom) - Math.max(a.rect.top, b.rect.top)
      > Math.min(a.rect.bottom - a.rect.top, b.rect.bottom - b.rect.top) * 0.5;
    const nested = (a, b) => a.within.includes(b.id) || b.within.includes(a.id);
    for (const a of rs) {
      // Nearest region starting to the right of a, on the same row, not nested in it.
      const b = rs.filter((c) => c !== a && c.rect.left > a.rect.left + tolerance && sameRow(a, c) && !nested(a, c))
        .sort((x, y) => x.rect.left - y.rect.left)[0];
      if (!b) continue;
      const gap = b.rect.left - a.rect.right;
      gaps++;
      const k = Math.round((gap - bp.gutter) / (t + bp.gutter));
      if (k < 0 || Math.abs(gap - (bp.gutter + k * (t + bp.gutter))) > tolerance)
        fault(`${label(a)} → ${label(b)} @${vpWidth}px`, 'gap-off-substrate',
          gap < 0 ? `regions overlap by ${(-gap).toFixed(1)}px` : `gap ${gap.toFixed(1)}px is neither the gutter (${bp.gutter}px) nor gutter + whole empty tracks (${(t + bp.gutter).toFixed(1)}px per track)`);
    }
  }
  return { violations, notes, edges, gaps, regions: m.regions.length };
}

const browser = await launchChromium('audit');
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const results = [];
try {
  for (const vp of viewports) {
    const bp = breakpointAt(bps, vp);
    await page.setViewportSize({ width: vp, height: 1000 });
    await page.goto(target, { waitUntil: 'load', timeout: 30000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(150);
    const m = await page.evaluate(measure);
    results.push({ viewport: vp, breakpoint: bp.id, ...auditViewport(m, bp, vp) });

    if (opt('screenshot')) {
      // Inject an overlay built from the same manifest numbers, then capture evidence.
      const { columns: cols, gutter, margin, container } = bp;
      await page.addStyleTag({ content: `.kfl-audit-overlay{position:fixed;inset:0;z-index:2147483000;pointer-events:none}.kfl-audit-overlay>div{box-sizing:border-box;height:100%;max-width:${container + 2 * margin}px;margin-inline:auto;padding-inline:${margin}px;display:grid;grid-template-columns:repeat(${cols},minmax(0,1fr));column-gap:${gutter}px}.kfl-audit-overlay span{border-inline:1px solid ${manifest.overlayColor ?? '#e00087'}}` });
      await page.evaluate((n) => {
        const d = document.createElement('div');
        d.className = 'kfl-audit-overlay';
        d.setAttribute('aria-hidden', 'true');
        d.innerHTML = `<div>${'<span></span>'.repeat(n)}</div>`;
        document.body.appendChild(d);
      }, cols);
      mkdirSync(opt('screenshot'), { recursive: true });
      await page.screenshot({ path: resolve(opt('screenshot'), `grid-${vp}.png`), fullPage: true });
    }
  }
} finally {
  await browser.close();
}

const violations = results.flatMap((r) => r.violations);
const notes = [...new Set(results.flatMap((r) => r.notes))];
console.log(`grid audit — ${target}`);
for (const r of results) {
  console.log(`  @${r.viewport}px [${r.breakpoint}] regions=${r.regions} edges=${r.edges} gaps=${r.gaps} violations=${r.violations.length}`);
  for (const v of r.violations) console.log(`    FAIL ${v.region} — ${v.check}: ${v.detail}`);
}
for (const n of notes) console.log(`  note ${n}`);
if (opt('json')) writeFileSync(resolve(opt('json')), JSON.stringify({ target, manifest: manifestPath, results }, null, 2));
if (violations.length) {
  console.log(`FAIL — ${violations.length} violation${violations.length > 1 ? 's' : ''}. Fix the shared root cause (tokens, span map, or placement), not the symptom.`);
  process.exit(1);
}
console.log(`PASS — every region edge resolves to a declared track within ${tolerance}px.`);
