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
      await page.locator('[commandfor="dlg-delete-ws"]').click();
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
