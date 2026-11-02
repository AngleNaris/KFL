#!/usr/bin/env node
// KFL surface tools — audit.mjs
// Audits what a rendered page paints, independent of any grid manifest:
//   radius   --geometry rounded (default), KFL Corner Radius: one radius per
//            component family; a clearly larger family (short side >= 2x) uses a
//            larger radius, because equal CSS radii look sharper on larger boxes;
//            a rounded box sitting in a rounded ancestor's corner is concentric
//            (inner radius = outer radius - inset) and leaves the size scale.
//            Square boxes, pills and circles are exempt; square-only designs pass.
//   corners  --geometry square, the reference kit's contract: no rounded
//            rectangles. Every rendered box and ::before/::after is sharp, or a
//            true circle/ellipse with no straight edge left. Pills, partly rounded
//            corners, SVG <rect rx>, round stroke caps/joins, and clip-path "round"
//            insets all fail. Circles are listed so a reviewer can confirm each
//            one is an affordance.
//   type     Type Legibility floors on the rendered size (transforms included):
//            10px for Latin text, 12px for text containing CJK.
//   targets  Interaction Baseline: every pointer target offers a 24x24 hit area
//            (WCAG 2.5.8). Touch viewports also report targets under 44x44.
//            Hit-tested, so associated labels and pseudo-element hit areas count;
//            inline links inside running text and targets parked outside the
//            viewport (a skip link before focus) are exempt.
//   scrollbar  every scroll container (the page when it scrolls, and any element
//            with overflow auto/scroll) is styled: the standard scrollbar-color
//            or scrollbar-width (inherited color included), or a sized
//            ::-webkit-scrollbar. The browser default fails.
//
// Usage:
//   node audit.mjs (--url <url> | --html <file>) [--viewports 375t,1440]
//                  [--geometry rounded|square] [--strict-touch]
//                  [--screenshot <dir>] [--json <file>]
// A viewport suffixed with "t" is emulated as a touch device (coarse pointer).
// --strict-touch turns touch targets under 44x44 from warnings into violations.
// Exit code 0 = pass, 1 = violations, 2 = not tested (usage, page or browser error).
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { launchChromium } from '../lib/browser.mjs';

function fail(msg) { console.error(`surface: ${msg}`); process.exit(2); }

const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf('--' + name); return i >= 0 ? args[i + 1] : undefined; };
const url = opt('url');
const html = opt('html');
if (Boolean(url) === Boolean(html)) fail('usage: node audit.mjs (--url <url> | --html <file>) [--viewports 375t,1440] [--geometry rounded|square] [--strict-touch] [--screenshot <dir>] [--json <file>]');
const geometry = opt('geometry') ?? 'rounded';
if (!['rounded', 'square'].includes(geometry)) fail('--geometry must be "rounded" or "square"');
const target = url ?? pathToFileURL(resolve(html)).href;
const strictTouch = args.includes('--strict-touch');
const viewports = (opt('viewports') ?? '375t,1440').split(',').map((v) => {
  const m = /^(\d+)(t?)$/.exec(v.trim());
  if (!m || Number(m[1]) <= 0) fail(`bad viewport "${v}" — use a positive width, optionally suffixed with t for touch`);
  return { width: Number(m[1]), touch: m[2] === 't' };
});

// Runs in the page. Returns findings for the current viewport.
function inspect({ touch, geometry }) {
  const out = { corners: [], radius: [], circles: [], type: [], targets: [], scrollbars: [], warnings: [] };
  const px = (v) => parseFloat(v) || 0;
  const shown = (el) => el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true });
  function name(el) {
    const one = (e) => e.tagName.toLowerCase() + (e.id ? '#' + e.id : [...(e.classList ?? [])].slice(0, 2).map((c) => '.' + c).join(''));
    const parts = [];
    for (let e = el; e && e !== document.body && parts.length < 3; e = e.parentElement) {
      parts.unshift(one(e));
      if (e.id) break;
    }
    return parts.join(' > ');
  }

  // --- corners -------------------------------------------------------------
  const STRAIGHT = /^(bevel|notch|square|superellipse\((0|-?infinity)\))$/;
  const CORNERS = ['top-left', 'top-right', 'bottom-right', 'bottom-left'];
  function shape(cs, w, h) {
    const radii = CORNERS.map((c) => {
      const [a, b = a] = cs.getPropertyValue(`border-${c}-radius`).trim().split(/\s+/);
      const res = (v, base) => (v.endsWith('%') ? (parseFloat(v) / 100) * base : px(v));
      return [res(a, w), res(b, h)];
    });
    const [tl, tr, br, bl] = radii;
    const fit = (len, sum) => (sum > 0 ? len / sum : Infinity);
    // CSS scales all radii by one factor when adjacent radii exceed a side.
    const f = Math.min(1, fit(w, tl[0] + tr[0]), fit(w, bl[0] + br[0]), fit(h, tl[1] + bl[1]), fit(h, tr[1] + br[1]));
    const r = radii.map(([x, y]) => [x * f, y * f]);
    const curved = r.map(([x, y], i) => x > 0.5 && y > 0.5 && !STRAIGHT.test(cs.getPropertyValue(`corner-${CORNERS[i]}-shape`).trim()));
    if (!curved.some(Boolean)) return { kind: 'sharp' };
    const straight = [w - r[0][0] - r[1][0], w - r[3][0] - r[2][0], h - r[0][1] - r[3][1], h - r[1][1] - r[2][1]];
    if (curved.every(Boolean) && straight.every((s) => s <= 1)) return { kind: Math.abs(w - h) <= 1 ? 'circle' : 'ellipse' };
    // Circular radii per corner (0 where the corner is straight), for the radius scale.
    const circular = r.map(([x, y], i) => (curved[i] ? Math.min(x, y) : 0));
    const pill = Math.min(...circular) >= Math.min(w, h) / 2 - 0.5;
    return { kind: pill ? 'pill' : 'rounded', radius: cs.borderRadius, radii: circular };
  }
  // --- radius scale (geometry rounded) ------------------------------------
  const rounded = [];
  function recordRadius(el, cs, label) {
    const w = el.offsetWidth, h = el.offsetHeight;
    if (w < 1 || h < 1) return;
    const s = shape(cs, w, h);
    if (s.kind !== 'rounded') return;
    const cls = el.classList[0];
    rounded.push({ el, label, w, h, radii: s.radii, r: Math.max(...s.radii), family: cls ? '.' + cls + (el.dataset.size ? `[data-size=${el.dataset.size}]` : '') : null });
  }
  function checkRadius() {
    const tol = 1;
    // Concentric first: a rounded box in the corner zone of its nearest rounded ancestor
    // takes its radius from that ancestor (inner = outer - inset), not from the size scale.
    const byEl = new Map(rounded.map((b) => [b.el, b]));
    for (const c of rounded) {
      let p = null;
      for (let e = c.el.parentElement; e && !p; e = e.parentElement) p = byEl.get(e) ?? null;
      if (!p) continue;
      const cr = c.el.getBoundingClientRect(), pr = p.el.getBoundingClientRect();
      const insets = [[cr.left - pr.left, cr.top - pr.top], [pr.right - cr.right, cr.top - pr.top],
        [pr.right - cr.right, pr.bottom - cr.bottom], [cr.left - pr.left, pr.bottom - cr.bottom]];
      insets.forEach(([dx, dy], i) => {
        const rp = p.radii[i];
        if (rp <= 0 || dx < -0.5 || dy < -0.5 || dx >= rp || dy >= rp || Math.abs(dx - dy) > tol) return;
        c.nested = true;
        const expected = Math.max(0, rp - (dx + dy) / 2);
        if (Math.abs(c.radii[i] - expected) > tol)
          out.radius.push({ check: 'radius-not-concentric', element: c.label,
            detail: `${CORNERS[i]} radius ${c.radii[i].toFixed(1)}px inside ${p.label} (${rp.toFixed(1)}px, inset ${((dx + dy) / 2).toFixed(1)}px); concentric is ${expected.toFixed(1)}px` });
      });
    }
    const families = new Map();
    for (const b of rounded) {
      if (!b.family) continue;
      if (!families.has(b.family)) families.set(b.family, []);
      families.get(b.family).push(b);
    }
    const median = (xs) => { const s = [...xs].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };
    const fams = [];
    for (const [family, bs] of families) {
      const radii = [...new Set(bs.map((b) => Math.round(b.r * 2) / 2))];
      if (Math.max(...radii) - Math.min(...radii) > tol)
        out.radius.push({ check: 'radius-family-mismatch', element: family, detail: `${bs.length} boxes use ${radii.join(', ')}px; one component family keeps one radius` });
      const free = bs.filter((b) => !b.nested);
      if (free.length) fams.push({ family, r: median(free.map((b) => b.r)), short: median(free.map((b) => Math.min(b.w, b.h))) });
    }
    for (const big of fams) for (const small of fams) {
      if (big.short >= 2 * small.short && big.r <= small.r + 0.5)
        out.radius.push({ check: 'radius-scale-inverted', element: `${big.family} vs ${small.family}`,
          detail: `${big.family} (short side ${big.short.toFixed(0)}px) uses ${big.r.toFixed(1)}px, not larger than ${small.family} (short side ${small.short.toFixed(0)}px, ${small.r.toFixed(1)}px); a larger tier needs a larger radius to look equally round` });
    }
  }
  function checkBox(el, cs, w, h, label) {
    if (w < 1 || h < 1) return;
    const s = shape(cs, w, h);
    if (s.kind === 'rounded' || s.kind === 'pill') out.corners.push({ element: label, detail: `border-radius ${s.radius} on a ${w.toFixed(0)}x${h.toFixed(0)} box` });
    else if (s.kind !== 'sharp') out.circles.push({ element: label, detail: `${s.kind} ${w.toFixed(0)}x${h.toFixed(0)}` });
    if (/\b(inset|rect|xywh)\([^)]*\bround\b/.test(cs.clipPath)) out.corners.push({ element: label, detail: `clip-path ${cs.clipPath}` });
  }
  const svgRounded = new Map();
  for (const el of document.body.querySelectorAll('*')) {
    if (!shown(el)) continue;
    const cs = getComputedStyle(el);
    if (geometry === 'rounded') {
      if (!(el instanceof SVGElement)) recordRadius(el, cs, name(el));
      continue;
    }
    if (el instanceof SVGElement) {
      if (el instanceof SVGSVGElement) continue;
      const root = el.ownerSVGElement;
      const note = (why) => { const k = root ?? el; if (!svgRounded.has(k)) svgRounded.set(k, new Set()); svgRounded.get(k).add(why); };
      if (el instanceof SVGRectElement) {
        const b = el.getBBox();
        let rx = px(cs.rx), ry = px(cs.ry);
        if (cs.rx === 'auto') rx = ry; if (cs.ry === 'auto') ry = rx;
        if ((rx > 0.5 || ry > 0.5) && !(rx >= b.width / 2 - 0.5 && ry >= b.height / 2 - 0.5)) note(`<rect rx=${rx} ry=${ry}>`);
      }
      const stroked = cs.stroke !== 'none' && px(cs.strokeWidth) > 0;
      const open = el instanceof SVGPathElement || el instanceof SVGLineElement || el instanceof SVGPolylineElement;
      const cornered = el instanceof SVGPathElement || el instanceof SVGPolylineElement || el instanceof SVGPolygonElement || el instanceof SVGRectElement;
      if (stroked && open && cs.strokeLinecap === 'round') note('stroke-linecap: round');
      if (stroked && cornered && /^(round|arcs)$/.test(cs.strokeLinejoin)) note(`stroke-linejoin: ${cs.strokeLinejoin}`);
      continue;
    }
    checkBox(el, cs, el.offsetWidth, el.offsetHeight, name(el));
    for (const pseudo of ['::before', '::after']) {
      const ps = getComputedStyle(el, pseudo);
      if (ps.content === 'none' || ps.content === 'normal' || ps.display === 'none') continue;
      const boxW = px(ps.width) + (ps.boxSizing === 'border-box' ? 0 : px(ps.paddingLeft) + px(ps.paddingRight) + px(ps.borderLeftWidth) + px(ps.borderRightWidth));
      const boxH = px(ps.height) + (ps.boxSizing === 'border-box' ? 0 : px(ps.paddingTop) + px(ps.paddingBottom) + px(ps.borderTopWidth) + px(ps.borderBottomWidth));
      if (ps.width === 'auto' || ps.height === 'auto') {
        if (CORNERS.some((c) => px(ps.getPropertyValue(`border-${c}-radius`)) > 0.5)) out.corners.push({ element: name(el) + pseudo, detail: `border-radius ${ps.borderRadius} on an auto-sized pseudo-element` });
      } else checkBox(el, ps, boxW, boxH, name(el) + pseudo);
    }
    const native = el.matches('input[type=checkbox], input[type=range], input[type=color], progress, meter')
      || (el.matches('select') && cs.appearance !== 'base-select');
    if (native && cs.appearance !== 'none') out.warnings.push({ element: name(el), detail: `appearance: ${cs.appearance} — the platform paints this control and may round it; set appearance: none (or base-select) and draw it square` });
  }
  for (const [root, why] of svgRounded) out.corners.push({ element: name(root), detail: `SVG ${[...why].join(', ')}` });
  if (geometry === 'rounded') checkRadius();

  // --- type floors ---------------------------------------------------------
  const CJK = /[⺀-⿟　-ヿ㄀-ㄯ㆐-ㇿ㐀-䶿一-鿿가-힯豈-﫿︰-﹏＀-￯]/;
  const seen = new Set();
  // Rendered size = computed size x the scale of any transformed ancestor.
  const scaleOf = (el) => {
    for (let e = el; e && e !== document.documentElement; e = e.parentElement) {
      const s = getComputedStyle(e);
      if (s.transform !== 'none' || s.scale !== 'none' || (s.zoom && s.zoom !== '1')) {
        const block = el.closest('*:not(a, span, em, strong, b, i, code, kbd, small, label)') ?? el;
        return block.offsetWidth > 0 ? block.getBoundingClientRect().width / block.offsetWidth : 1;
      }
    }
    return 1;
  };
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent.trim();
    const el = node.parentElement;
    if (!text || !el || el.closest('script,style,noscript,template') || !shown(el)) continue;
    const box = el.getBoundingClientRect();
    if (box.width < 2 || box.height < 2) continue; // visually hidden (screen-reader-only) text
    const size = px(getComputedStyle(el).fontSize) * (el instanceof SVGElement ? 1 : scaleOf(el));
    const floor = CJK.test(text) ? 12 : 10;
    const key = name(el) + '|' + size.toFixed(1);
    if (size < floor - 0.01 && !seen.has(key)) {
      seen.add(key);
      out.type.push({ element: name(el), detail: `${size.toFixed(1)}px under the ${floor}px ${floor === 12 ? 'CJK' : 'Latin'} floor: "${text.slice(0, 40)}"` });
    }
  }
  for (const field of document.querySelectorAll('input[placeholder], textarea[placeholder]')) {
    if (!shown(field)) continue;
    const size = px(getComputedStyle(field, '::placeholder').fontSize);
    const floor = CJK.test(field.placeholder) ? 12 : 10;
    if (size && size < floor - 0.01) out.type.push({ element: name(field) + '::placeholder', detail: `${size.toFixed(1)}px under the ${floor}px floor` });
  }
  for (const p of document.querySelectorAll('main p, article p')) {
    if (shown(p) && p.textContent.trim().length > 160 && px(getComputedStyle(p).fontSize) < 16)
      out.warnings.push({ element: name(p), detail: `long-form text at ${getComputedStyle(p).fontSize}; primary reading text should be at least 16px` });
  }

  // --- scrollbars ----------------------------------------------------------
  // Styling is static CSS, so hidden containers (closed dialogs and disclosures)
  // count too. Chromium ignores ::-webkit-scrollbar once a standard property is
  // set, so a page may legitimately use either route.
  const rootScrolls = document.documentElement.scrollHeight > innerHeight || document.documentElement.scrollWidth > innerWidth;
  for (const el of [document.documentElement, ...document.body.querySelectorAll('*')]) {
    const cs = getComputedStyle(el);
    const container = el === document.documentElement ? rootScrolls : /auto|scroll/.test(cs.overflowX + cs.overflowY);
    const wk = getComputedStyle(el, '::-webkit-scrollbar');
    if (container && cs.scrollbarColor === 'auto' && cs.scrollbarWidth === 'auto' && wk.width === 'auto' && wk.height === 'auto')
      out.scrollbars.push({ element: el === document.documentElement ? 'html (page scroll)' : name(el), detail: 'browser default scrollbar; style it from shared tokens (scrollbar-color/scrollbar-width or ::-webkit-scrollbar)' });
  }

  // --- targets -------------------------------------------------------------
  const TARGETS = 'a[href], button, input:not([type=hidden]), select, textarea, summary, [role=button], [role=link], [role=checkbox], [role=radio], [role=switch], [role=tab], [role=menuitem], [role=menuitemcheckbox], [role=menuitemradio], [role=option], [role=slider], [tabindex]:not([tabindex="-1"])';
  const inRunningText = (a) => {
    if (a.tagName !== 'A' || getComputedStyle(a).display !== 'inline') return false;
    const block = a.parentElement;
    return block && block.textContent.replace(a.textContent, '').trim().length > 0;
  };
  // 5x5 samples over a size x size square centred on one box, 1px inside its edges.
  function hitRatio(set, cx, cy, size) {
    let hits = 0, n = 0;
    for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) {
      const x = cx - size / 2 + 1 + (i * (size - 2)) / 4;
      const y = cy - size / 2 + 1 + (j * (size - 2)) / 4;
      const hit = document.elementFromPoint(x, y);
      n++;
      if (hit && set.some((s) => s === hit || s.contains(hit))) hits++;
    }
    return hits / n;
  }
  for (const el of document.querySelectorAll(TARGETS)) {
    if (el.disabled || el.getAttribute('aria-disabled') === 'true' || el.closest('[inert]') || !shown(el)) continue;
    if (getComputedStyle(el).pointerEvents === 'none' || inRunningText(el)) continue;
    const set = [el, ...(el.labels ?? [])].filter((e) => shown(e));
    const boxes = () => set.map((e) => e.getBoundingClientRect()).filter((r) => r.width >= 2 && r.height >= 2);
    if (!boxes().length) continue;
    const anchor = set.find((e) => { const r = e.getBoundingClientRect(); return r.width >= 2 && r.height >= 2; });
    // Instant: a page's scroll-behavior: smooth would otherwise leave the target mid-scroll when sampled.
    anchor.scrollIntoView({ block: 'center', inline: 'center', behavior: 'instant' });
    const b = boxes();
    // Parked outside the viewport (a skip link before focus): not pointer-reachable in this state.
    if (b.every((r) => r.bottom <= 0 || r.right <= 0 || r.top >= innerHeight || r.left >= innerWidth)) continue;
    // The best of the target's own box and each associated label's box, not their union:
    // the gap between a field label and its input belongs to neither hit area.
    const best = (size) => Math.max(...b.map((r) => hitRatio(set, (r.left + r.right) / 2, (r.top + r.bottom) / 2, size)));
    const own = el.getBoundingClientRect();
    const detail = `${own.width.toFixed(0)}x${own.height.toFixed(0)} visible box`;
    if (best(24) < 0.9) out.targets.push({ element: name(el), size: 24, detail });
    else if (touch && best(44) < 0.9) out.targets.push({ element: name(el), size: 44, detail });
  }
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  return out;
}

// Browser or page failures are blocked checks (exit 2), never violations (exit 1).
const browser = await launchChromium('surface').catch((e) => fail(`browser unavailable — not tested (${e.message})`));
const results = [];
try {
  for (const vp of viewports) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: 900 }, hasTouch: vp.touch, isMobile: vp.touch });
    const page = await context.newPage();
    await page.goto(target, { waitUntil: 'load', timeout: 30000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(250);
    if (opt('screenshot')) {
      mkdirSync(opt('screenshot'), { recursive: true });
      await page.screenshot({ path: resolve(opt('screenshot'), `surface-${vp.width}${vp.touch ? 't' : ''}.png`), fullPage: true });
    }
    const found = await page.evaluate(inspect, { touch: vp.touch, geometry });
    const small = found.targets.filter((t) => t.size === 24);
    const touchSmall = found.targets.filter((t) => t.size === 44);
    const violations = [
      ...found.corners.map((f) => ({ check: 'rounded-rectangle', ...f })),
      ...found.radius,
      ...found.type.map((f) => ({ check: 'type-floor', ...f })),
      ...small.map((f) => ({ check: 'target-under-24', ...f })),
      ...found.scrollbars.map((f) => ({ check: 'default-scrollbar', ...f })),
      ...(strictTouch ? touchSmall.map((f) => ({ check: 'touch-target-under-44', ...f })) : []),
    ];
    const warnings = [...found.warnings, ...(strictTouch ? [] : touchSmall.map((f) => ({ element: f.element, detail: `touch target under 44x44 (${f.detail})` })))];
    results.push({ viewport: `${vp.width}${vp.touch ? ' touch' : ''}`, violations, warnings, circles: found.circles });
    await context.close();
  }
} catch (e) {
  await browser.close();
  fail(`page could not be audited — not tested (${e.message})`);
} finally {
  await browser.close();
}

const LIMIT = 12;
const list = (items, fmt) => {
  for (const it of items.slice(0, LIMIT)) console.log(fmt(it));
  if (items.length > LIMIT) console.log(`      … ${items.length - LIMIT} more (see --json)`);
};
console.log(`surface audit — ${target} (geometry ${geometry})`);
for (const r of results) {
  console.log(`  @${r.viewport} violations=${r.violations.length} warnings=${r.warnings.length} circles=${r.circles.length}`);
  list(r.violations, (v) => `    FAIL ${v.check} ${v.element} — ${v.detail}`);
  list(r.warnings, (w) => `    warn ${w.element} — ${w.detail}`);
}
const circles = [...new Map(results.flatMap((r) => r.circles).map((c) => [c.element, c])).values()];
if (circles.length) {
  console.log(`  circles (allowed; confirm each is an affordance such as a radio control):`);
  list(circles, (c) => `    ${c.element} — ${c.detail}`);
}
if (opt('json')) writeFileSync(resolve(opt('json')), JSON.stringify({ target, results }, null, 2));
const total = results.reduce((n, r) => n + r.violations.length, 0);
if (total) {
  console.log(`FAIL — ${total} violation${total > 1 ? 's' : ''}. Fix the shared token or component, not the instance.`);
  process.exit(1);
}
console.log(`PASS — ${geometry === 'square' ? 'square geometry' : 'radius scale'}, type floors, 24px targets and styled scrollbars hold at every audited viewport.`);
