#!/usr/bin/env node
// KFL grid tools — audit.mjs
// Audits a rendered page against a grid manifest (KFL Law 1, grid substrate):
//   - every [data-region] edge must resolve to a manifest track line (±1px)
//   - every region's span must match the manifest span map
//   - sibling gaps must be the gutter or empty-track spans
//   - grid ancestors must implement the declared column count
//
// Usage:
//   node audit.mjs --manifest <file> (--url <url> | --html <file>)
//                  [--viewports 375,768,1440] [--tolerance 1]
//                  [--screenshot <dir>] [--json <file>]
// Exit code 0 = pass, 1 = violations, 2 = usage/environment error.
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

function fail(msg) { console.error(`audit: ${msg}`); process.exit(2); }

const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf('--' + name); return i >= 0 ? args[i + 1] : undefined; };
const manifestPath = opt('manifest');
const url = opt('url');
const html = opt('html');
if (!manifestPath || (!url && !html)) fail('usage: node audit.mjs --manifest <file> (--url <url> | --html <file>) [--viewports 375,768,1440] [--tolerance 1] [--screenshot <dir>] [--json <file>]');

let manifest;
try { manifest = JSON.parse(readFileSync(resolve(manifestPath), 'utf8')); }
catch (e) { fail(`cannot read manifest: ${e.message}`); }
const tolerance = Number(opt('tolerance') ?? 1);
const target = url ?? 'file://' + resolve(html).replace(/\\/g, '/');

// Breakpoint resolution — same inheritance rules as generate.mjs.
const bps = [];
let prev = { columns: 12, gutter: 20, margin: 40, container: 1440 };
for (const bp of manifest.breakpoints ?? []) {
  const id = String(bp.id ?? `bp${bps.length}`);
  const r = {
    id,
    minWidth: Number(bp.minWidth),
    columns: Number(bp.columns ?? prev.columns),
    gutter: Number(bp.gutter ?? prev.gutter),
    margin: Number(bp.margin ?? prev.margin),
    container: Number(bp.container ?? prev.container),
  };
  if (!Number.isFinite(r.minWidth)) fail(`breakpoint "${id}": minWidth is required`);
  bps.push(r);
  prev = r;
}
if (!bps.length) fail('manifest.breakpoints must not be empty');
const roleSpans = new Map((manifest.regions ?? []).map((r) => [r.role, r.spans ?? {}]));
const roleMeta = new Map((manifest.regions ?? []).map((r) => [r.role, r]));
// Reading-measure window: 45–75 characters, enforced from the first tablet-width viewport up.
const MEASURE = { minCh: 45, maxCh: 75, fromViewport: 768 };

// One viewport per activated breakpoint, plus a container-fitting width for the widest one.
let viewports;
if (opt('viewports')) {
  viewports = opt('viewports').split(',').map(Number).filter((v) => Number.isFinite(v) && v > 0);
  if (!viewports.length) fail('--viewports must be a comma-separated list of widths');
} else {
  viewports = [Math.max(bps[0].minWidth, 375)];
  for (const bp of bps.slice(1)) if (!viewports.includes(bp.minWidth)) viewports.push(bp.minWidth);
  const last = bps[bps.length - 1];
  const wide = last.container + 2 * last.margin;
  if (wide > viewports[viewports.length - 1]) viewports.push(wide);
}

const { chromium } = await import('playwright').catch((e) => fail(`playwright is not installed: run "npm i playwright" in tools/grid (${e.message})`));

async function launch() {
  try { return await chromium.launch(); } catch (primary) {
    // Fall back to any chromium already cached under %LOCALAPPDATA%/ms-playwright.
    const base = process.env.LOCALAPPDATA ? resolve(process.env.LOCALAPPDATA, 'ms-playwright') : null;
    if (!base || !existsSync(base)) throw primary;
    const dirs = readdirSync(base)
      .filter((d) => /^chromium(_headless_shell)?-\d+$/.test(d))
      .sort((a, b) => Number(b.split('-')[1]) - Number(a.split('-')[1]));
    for (const d of dirs) {
      const root = resolve(base, d);
      for (const sub of readdirSync(root)) {
        for (const exe of ['chrome.exe', 'headless_shell.exe']) {
          const p = resolve(root, sub, exe);
          if (!existsSync(p)) continue;
          try { return await chromium.launch({ executablePath: p }); } catch (_) { /* try next */ }
        }
      }
    }
    throw primary;
  }
}

// Runs in the page: collect region geometry and, per grid ancestor, its content box.
function measure() {
  const grids = {};
  const regions = [];
  const gridInfo = new Map();
  const chCache = new Map();
  function chOf(el) {
    // One "0" glyph advance under the region's own typography = 1ch.
    const cs = getComputedStyle(el);
    const key = [cs.fontFamily, cs.fontSize, cs.fontWeight, cs.fontStyle, cs.letterSpacing].join('|');
    if (!chCache.has(key)) {
      const probe = document.createElement('span');
      probe.style.cssText = 'position:absolute;top:-9999px;left:-9999px;visibility:hidden;white-space:pre';
      probe.style.fontFamily = cs.fontFamily;
      probe.style.fontSize = cs.fontSize;
      probe.style.fontWeight = cs.fontWeight;
      probe.style.fontStyle = cs.fontStyle;
      probe.style.letterSpacing = cs.letterSpacing;
      probe.textContent = '0'.repeat(100);
      document.body.appendChild(probe);
      chCache.set(key, probe.getBoundingClientRect().width / 100);
      probe.remove();
    }
    return chCache.get(key);
  }
  function gridOf(el) {
    let g = el.parentElement;
    while (g) {
      if (getComputedStyle(g).display.includes('grid')) {
        if (!gridInfo.has(g)) {
          const r = g.getBoundingClientRect();
          const cs = getComputedStyle(g);
          const key = 'g' + gridInfo.size;
          gridInfo.set(g, key);
          grids[key] = {
            columnsAttr: g.getAttribute('data-grid-columns'),
            template: cs.gridTemplateColumns,
            box: {
              left: r.left + (parseFloat(cs.paddingLeft) || 0),
              right: r.right - (parseFloat(cs.paddingRight) || 0),
            },
          };
        }
        return gridInfo.get(g);
      }
      g = g.parentElement;
    }
    return null;
  }
  for (const el of document.querySelectorAll('[data-region]')) {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if (cs.display === 'none' || cs.visibility === 'hidden' || r.width === 0) continue;
    const role = el.getAttribute('data-region');
    const same = document.querySelectorAll(`[data-region="${CSS.escape(role)}"]`);
    regions.push({
      role,
      index: same.length > 1 ? [...same].indexOf(el) : 0,
      optical: el.hasAttribute('data-grid-optical'),
      grid: gridOf(el),
      rect: { left: r.left, right: r.right, top: r.top, bottom: r.bottom },
      chPx: chOf(el),
    });
  }
  return { grids, regions };
}

function label(r) { return `[data-region="${r.role}"]` + (r.index ? `:nth-of-type(${r.index + 1})` : ''); }

function trackLines(box, cols, gutter) {
  const w = (box.right - box.left - (cols - 1) * gutter) / cols;
  if (w <= 0) return null;
  const lines = [];
  let x = box.left;
  for (let i = 0; i < cols; i++) { lines.push([x, x + w]); x += w + gutter; }
  return { w, lines };
}

function auditViewport(m, bp, vpWidth) {
  const violations = [];
  const notes = [];
  let edges = 0, gaps = 0;
  const grids = {};
  for (const [key, g] of Object.entries(m.grids)) {
    const cols = g.columnsAttr ? Number(g.columnsAttr) : bp.columns;
    const widths = String(g.template).trim().split(/\s+/).map(Number).filter(Number.isFinite);
    let struct = null;
    if (!g.columnsAttr && widths.length && widths.length !== cols)
      struct = `grid implements ${widths.length} tracks but manifest "${bp.id}" declares ${cols}`;
    grids[key] = { ...g, cols, struct };
  }
  const geo = {};
  for (const [key, g] of Object.entries(grids)) {
    geo[key] = trackLines(g.box, g.cols, bp.gutter);
    if (!g.struct && geo[key] === null) g.struct = `content box ${(g.box.right - g.box.left).toFixed(1)}px cannot hold ${g.cols} columns at gutter ${bp.gutter}px`;
  }
  for (const r of m.regions) {
    const tag = `${label(r)} @${vpWidth}px`;
    const g = r.grid ? grids[r.grid] : null;
    if (!g) { violations.push({ viewport: vpWidth, region: tag, check: 'no-grid-ancestor', detail: 'element has no CSS grid ancestor; place regions as items of a grid-row' }); continue; }
    if (g.struct) { violations.push({ viewport: vpWidth, region: tag, check: 'grid-structure', detail: g.struct }); continue; }
    if (r.optical) { notes.push(`${tag} data-grid-optical exemption (must be documented)`); continue; }
    const t = geo[r.grid];
    const snap = (x) => Math.min(...t.lines.map(([l, rr]) => Math.min(Math.abs(x - l), Math.abs(x - rr))));
    const dl = snap(r.rect.left), dr = snap(r.rect.right);
    edges += 2;
    if (dl > tolerance) violations.push({ viewport: vpWidth, region: tag, check: 'left-edge-off-track', detail: `left ${r.rect.left.toFixed(1)} — nearest track line Δ${dl.toFixed(1)}px` });
    if (dr > tolerance) violations.push({ viewport: vpWidth, region: tag, check: 'right-edge-off-track', detail: `right ${r.rect.right.toFixed(1)} — nearest track line Δ${dr.toFixed(1)}px` });
    const s = roleSpans.get(r.role)?.[bp.id];
    if (s !== undefined) {
      const expected = s * t.w + (s - 1) * bp.gutter;
      if (Math.abs(r.rect.right - r.rect.left - expected) > tolerance)
        violations.push({ viewport: vpWidth, region: tag, check: 'span-mismatch', detail: `width ${(r.rect.right - r.rect.left).toFixed(1)} but manifest span ${s} = ${expected.toFixed(1)}px` });
    } else {
      notes.push(`${tag} role "${r.role}" is not declared in the manifest`);
    }
    const meta = roleMeta.get(r.role) ?? {};
    const w = r.rect.right - r.rect.left;
    if (meta.kind === 'measure' && vpWidth >= MEASURE.fromViewport && r.chPx) {
      const lo = MEASURE.minCh * r.chPx, hi = MEASURE.maxCh * r.chPx;
      if (w < lo - tolerance || w > hi + tolerance)
        violations.push({ viewport: vpWidth, region: tag, check: 'measure-window', detail: `${w.toFixed(1)}px ≈ ${(w / r.chPx).toFixed(0)}ch, outside the ${MEASURE.minCh}–${MEASURE.maxCh}ch reading window [${lo.toFixed(0)}–${hi.toFixed(0)}px]` });
    }
    if (meta.min !== undefined && w < meta.min - tolerance)
      violations.push({ viewport: vpWidth, region: tag, check: 'below-declared-min', detail: `width ${w.toFixed(1)}px is under the declared minimum ${meta.min}px` });
    if (meta.max !== undefined && w > meta.max + tolerance)
      violations.push({ viewport: vpWidth, region: tag, check: 'above-declared-max', detail: `width ${w.toFixed(1)}px is over the declared maximum ${meta.max}px` });
  }
  // Sibling gaps within one grid: gutter, or k empty tracks (k*(colW+gutter)).
  const byGrid = new Map();
  for (const r of m.regions) {
    if (!r.grid || r.optical) continue;
    if (!byGrid.has(r.grid)) byGrid.set(r.grid, []);
    byGrid.get(r.grid).push(r);
  }
  for (const [key, rs] of byGrid) {
    const g = grids[key], t = geo[key];
    if (!g || g.struct || !t) continue;
    rs.sort((a, b) => a.rect.left - b.rect.left);
    for (let i = 1; i < rs.length; i++) {
      const a = rs[i - 1], b = rs[i];
      const overlap = Math.min(a.rect.bottom, b.rect.bottom) - Math.max(a.rect.top, b.rect.top);
      if (overlap <= Math.min(a.rect.bottom - a.rect.top, b.rect.bottom - b.rect.top) * 0.5) continue;
      const gap = b.rect.left - a.rect.right;
      gaps++;
      const legal = Math.abs(gap - bp.gutter) <= tolerance
        || Number.isInteger((gap + tolerance) / (t.w + bp.gutter)) && Math.abs(gap - Math.round((gap) / (t.w + bp.gutter)) * (t.w + bp.gutter)) <= tolerance;
      if (!legal) violations.push({
        viewport: vpWidth,
        region: `${label(a)} → ${label(b)}`,
        check: 'gap-off-substrate',
        detail: `gap ${gap.toFixed(1)}px is neither the gutter (${bp.gutter}px) nor an empty-track span (${(t.w + bp.gutter).toFixed(1)}px per track)`,
      });
    }
  }
  return { violations, notes, edges, gaps, regions: m.regions.length };
}

const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const results = [];
try {
  for (const vp of viewports) {
    const bp = [...bps].reverse().find((b) => vp >= b.minWidth);
    await page.setViewportSize({ width: vp, height: 1000 });
    await page.goto(target, { waitUntil: 'load', timeout: 30000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(150);
    const m = await page.evaluate(measure);
    const result = auditViewport(m, bp, vp);
    results.push({ viewport: vp, breakpoint: bp.id, ...result });

    if (opt('screenshot')) {
      // Inject an overlay built from the same manifest numbers, then capture evidence.
      const cols = bp.columns, gutter = bp.gutter, margin = bp.margin, container = bp.container;
      await page.addStyleTag({ content: `.grid-overlay{position:fixed;inset:0;z-index:2147483000;pointer-events:none;opacity:1;visibility:visible;transition:none}.grid-overlay__inner{box-sizing:border-box;height:100%;max-width:${container + 2 * margin}px;margin-inline:auto;padding-inline:${margin}px;display:grid;grid-template-columns:repeat(${cols},minmax(0,1fr));column-gap:${gutter}px}.grid-overlay__inner>span{border-inline:1px solid ${manifest.overlayColor ?? '#e00087'}}` });
      await page.evaluate(({ cols }) => {
        const d = document.createElement('div');
        d.className = 'grid-overlay';
        d.setAttribute('aria-hidden', 'true');
        d.innerHTML = `<div class="grid-overlay__inner">${'<span></span>'.repeat(cols)}</div>`;
        document.body.appendChild(d);
      }, { cols });
      mkdirSync(opt('screenshot'), { recursive: true });
      await page.screenshot({ path: resolve(opt('screenshot'), `grid-${vp}.png`), fullPage: true });
    }
  }
} finally {
  await browser.close();
}

const violations = results.flatMap((r) => r.violations);
const notes = results.flatMap((r) => r.notes);
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
