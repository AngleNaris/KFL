import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, readdirSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { resolveManifest } from '../lib/manifest.mjs';
import { launchChromium } from '../lib/browser.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const examples = resolve(root, '../examples');
const run = (script, args) => spawnSync(process.execPath, [join(root, script), ...args], { encoding: 'utf8', timeout: 60000 });
const manifest = { breakpoints: [{ id: 'small', minWidth: 0, columns: 4, margin: 16 }, { id: 'wide', minWidth: 768 }], regions: [{ role: 'content', spans: { small: 4 } }] };
const parse = value => resolveManifest(value, message => { throw Error(message); });

test('shared manifest inherits layout and rejects ambiguous or impossible contracts', () => {
  const result = parse(manifest);
  assert.equal(result.bps[1].columns, 4);
  assert.equal(result.regions[0].spans.wide, 4);
  for (const mutate of [
    m => m.breakpoints.push({ id: 'wide', minWidth: 1024 }),
    m => m.regions.push({ role: 'content' }),
    m => { m.regions[0].role = 'a] {}'; },
    m => { m.regions[0].starts = { small: 2 }; },
  ]) { const m = structuredClone(manifest); mutate(m); assert.throws(() => parse(m)); }
});

test('browser-backed audits measure generated layout, reject empty pages and unsafe tolerances', () => {
  const scratch = mkdtempSync(join(tmpdir(), 'kfl # percent% '));
  try {
    const input = join(scratch, 'manifest.json');
    writeFileSync(input, JSON.stringify(manifest));
    assert.equal(run('grid/generate.mjs', [input, scratch]).status, 0);
    const html = join(scratch, 'page.html');
    writeFileSync(html, '<link rel="stylesheet" href="grid.css"><style>body{margin:0}</style><main class="grid-container"><div class="grid-row"><section data-region="content">Valid layout</section></div></main>');
    const args = ['--manifest', input, '--html', html, '--viewports', '375,768'];
    const good = run('grid/audit.mjs', args);
    assert.equal(good.status, 0, good.stdout + good.stderr);
    for (const value of ['NaN', 'Infinity', '-1']) assert.equal(run('grid/audit.mjs', [...args, '--tolerance', value]).status, 2);
    writeFileSync(html, '<p>No annotated regions</p>');
    const empty = run('grid/audit.mjs', args);
    assert.equal(empty.status, 1, empty.stdout + empty.stderr);
    writeFileSync(html, '<button style="width:80px;height:44px;border-radius:8px;font-size:8px">Small</button>');
    const badSurface = run('surface/audit.mjs', ['--html', html, '--viewports', '375t']);
    assert.equal(badSurface.status, 1, badSurface.stdout + badSurface.stderr);
    assert.equal(run('surface/audit.mjs', ['--html', html, '--viewports', '0']).status, 2);
    assert.equal(run('surface/audit.mjs', ['--html', html, '--geometry', 'oval']).status, 2);
    // A reserved scrollbar gutter narrows the root box; the frame check must follow it.
    writeFileSync(html, '<!doctype html><link rel="stylesheet" href="grid.css"><style>html{scrollbar-gutter:stable}body{margin:0}</style><main class="grid-container"><div class="grid-row"><section data-region="content">Valid layout</section></div></main>');
    const gutter = run('grid/audit.mjs', args);
    assert.equal(gutter.status, 0, gutter.stdout + gutter.stderr);
    const missing = run('grid/audit.mjs', ['--manifest', input, '--html', join(scratch, 'missing.html'), '--viewports', '375']);
    assert.equal(missing.status, 2, missing.stdout + missing.stderr);
  } finally { rmSync(scratch, { recursive: true, force: true }); }
});

test('grid reading measure uses the actual font and rejects short or long prose', () => {
  const scratch = mkdtempSync(join(tmpdir(), 'kfl-measure-'));
  try {
    const input = join(scratch, 'manifest.json');
    writeFileSync(input, JSON.stringify({
      breakpoints: [{ id: 'base', minWidth: 0 }],
      regions: [{ role: 'content', kind: 'measure' }],
    }));
    const html = join(scratch, 'page.html');
    for (const font of ['serif', 'monospace']) {
      for (const width of [44, 60, 76]) {
        writeFileSync(html, `<!doctype html><style>body{margin:0}.prose{display:grid;grid-template-columns:minmax(0,1fr);font:16px ${font};width:${width}ch}</style><main class="prose" data-grid="local"><section data-region="content">Reading measure</section></main>`);
        const result = run('grid/audit.mjs', ['--manifest', input, '--html', html, '--viewports', '768']);
        const output = result.stdout + result.stderr;
        assert.equal(result.status, width === 60 ? 0 : 1, `${font} ${width}ch: ${output}`);
        if (width !== 60) assert.match(output, /measure-window/);
      }
    }
  } finally { rmSync(scratch, { recursive: true, force: true }); }
});

test('surface radius scale: one radius per family, larger tiers rounder, nested corners concentric', () => {
  const scratch = mkdtempSync(join(tmpdir(), 'kfl-radius-'));
  const audit = (body) => {
    const html = join(scratch, 'page.html');
    writeFileSync(html, `<style>body{margin:0;font:16px sans-serif}.panel{margin:20px;padding:12px;width:400px;height:240px;background:#eee}.inner{height:120px;background:#ccc}.btn{height:40px;width:120px;margin:12px;font-size:14px}</style>${body}`);
    return run('surface/audit.mjs', ['--html', html, '--viewports', '1440']);
  };
  try {
    const good = audit('<div class="panel" style="border-radius:20px"><div class="inner" style="border-radius:8px">x</div><button class="btn" style="border-radius:6px">Go</button></div>');
    assert.equal(good.status, 0, good.stdout);
    const offset = audit('<div class="panel" style="border-radius:20px"><div class="inner" style="border-radius:12px">x</div></div>');
    assert.match(offset.stdout, /radius-not-concentric/);
    const flat = audit('<div class="panel" style="border-radius:6px">x<button class="btn" style="border-radius:6px">Go</button></div>');
    assert.match(flat.stdout, /radius-scale-inverted/);
    const mixed = audit('<button class="btn" style="border-radius:6px">A</button><button class="btn" style="border-radius:10px">B</button>');
    assert.match(mixed.stdout, /radius-family-mismatch/);
    const label = audit('<label for="f" style="display:block">Name</label><p>Hint between label and field</p><input id="f" style="height:40px">');
    assert.doesNotMatch(label.stdout, /target-under-24/, label.stdout);
  } finally { rmSync(scratch, { recursive: true, force: true }); }
});

test('surface scrollbars: default scrollbars fail, inherited color or WebKit parts pass; smooth scrolling does not fake a target miss', () => {
  const scratch = mkdtempSync(join(tmpdir(), 'kfl-scroll-'));
  const audit = (style) => {
    const html = join(scratch, 'page.html');
    const rows = Array.from({ length: 40 }, (_, i) => `<button style="display:block;width:120px;height:44px">Row ${i}</button>`).join('');
    writeFileSync(html, `<!doctype html><style>html{scroll-behavior:smooth}body{margin:0;font:16px sans-serif}.box{overflow:auto;height:80px}${style}</style><div class="box">${rows}</div>${rows}`);
    return run('surface/audit.mjs', ['--html', html, '--viewports', '1440']);
  };
  try {
    const plain = audit('');
    assert.match(plain.stdout, /default-scrollbar html/);
    assert.match(plain.stdout, /default-scrollbar div\.box/);
    assert.doesNotMatch(plain.stdout, /target-under-24/, plain.stdout);
    const styled = audit('html{scrollbar-color:#888 transparent}');
    assert.equal(styled.status, 0, styled.stdout);
    const parts = audit('::-webkit-scrollbar{width:8px;height:8px}');
    assert.equal(parts.status, 0, parts.stdout);
  } finally { rmSync(scratch, { recursive: true, force: true }); }
});

test('reference pages link to existing local files', () => {
  for (const name of readdirSync(examples).filter(n => n.endsWith('.html'))) {
    const html = readFileSync(join(examples, name), 'utf8');
    for (const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
      const target = match[1].split('#')[0];
      if (/^(?:https?:|mailto:|data:)/.test(target)) continue;
      assert.ok(existsSync(resolve(examples, target)), `${name}: ${target}`);
    }
  }
});

test('workspace dialog cancellation works with empty, invalid and valid input; form feedback is truthful', async () => {
  const browser = await launchChromium('test');
  try {
    const page = await browser.newPage();
    await page.goto(pathToFileURL(join(examples, 'settings.html')).href);
    for (const value of ['', 'wrong', 'northwind']) {
      await page.locator('[data-dialog-open="dlg-delete-ws"]').click();
      await page.locator('#dlg-confirm-name').fill(value);
      await page.locator('#dlg-delete-ws button[value="cancel"]').click();
      assert.equal(await page.locator('#dlg-delete-ws').evaluate(el => el.open), false);
    }
    const form = page.locator('.kfl-form').first();
    await page.locator('#s-name').fill('');
    await form.locator('button[type="submit"]').click();
    assert.equal(await page.locator('#s-name').getAttribute('aria-invalid'), 'true');
    assert.equal(await form.locator('[role="status"]').textContent(), '');
    await page.locator('#s-name').fill('Example Name');
    await form.locator('button[type="submit"]').click();
    assert.match(await form.locator('[role="status"]').textContent(), /nothing was saved or sent/);
  } finally { await browser.close(); }
});

test('kit behaviour: select-all skips disabled members, toast pause holds for hover and focus, fields without ids validate separately', async () => {
  const browser = await launchChromium('test');
  try {
    const page = await browser.newPage();
    await page.goto(pathToFileURL(join(examples, 'components.html')).href);
    const locked = page.locator('input[data-select-group="notify"][disabled]');
    const before = await locked.isChecked();
    const all = page.locator('[data-select-all="notify"]');
    await all.check();
    assert.equal(await locked.isChecked(), before);
    assert.equal(await all.evaluate(el => el.checked && !el.indeterminate), true);

    await page.evaluate(() => KFL.toast('Paused toast', { duration: 1000 }));
    const toast = page.locator('.kfl-toast', { hasText: 'Paused toast' });
    await toast.hover();
    await toast.locator('button').last().focus();
    await page.mouse.move(0, 0);
    await page.waitForTimeout(1500);
    assert.equal(await toast.isVisible(), true, 'focus inside keeps the toast');
    await page.locator('body').focus();
    await page.evaluate(() => document.activeElement.blur());
    await page.waitForTimeout(2000);
    assert.equal(await toast.count(), 0, 'the toast resumes and leaves once hover and focus are gone');

    const ids = await page.evaluate(() => {
      const box = document.createElement('div');
      box.innerHTML = '<form data-validate><input required><input required><button>Go</button></form>';
      document.body.append(box);
      KFL.init(box);
      box.querySelector('form').requestSubmit();
      return [...box.querySelectorAll('.kfl-field__error')].map(e => e.id);
    });
    assert.equal(ids.length, 2);
    assert.notEqual(ids[0], ids[1]);
  } finally { await browser.close(); }
});
