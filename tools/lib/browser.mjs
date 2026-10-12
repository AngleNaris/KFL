// KFL tools — shared Chromium launcher.
// Order: KFL_CHROMIUM (explicit executable) -> Playwright's own browser -> any
// chromium already cached by another Playwright version on this machine, so an
// audit does not require a fresh browser download after a minor version bump.
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const EXECUTABLES = [
  'chrome-headless-shell', 'headless_shell', 'chrome',
  'chrome-headless-shell.exe', 'headless_shell.exe', 'chrome.exe',
  'Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
  'Chromium.app/Contents/MacOS/Chromium',
];

function cacheRoots() {
  const roots = [process.env.PLAYWRIGHT_BROWSERS_PATH];
  if (process.env.LOCALAPPDATA) roots.push(join(process.env.LOCALAPPDATA, 'ms-playwright'));
  roots.push(join(homedir(), '.cache', 'ms-playwright'), join(homedir(), 'Library', 'Caches', 'ms-playwright'));
  return [...new Set(roots.filter((r) => r && existsSync(r)))];
}

function cachedExecutables() {
  const found = [];
  for (const root of cacheRoots()) {
    const dirs = readdirSync(root)
      .filter((d) => /^chromium(_headless_shell)?-\d+$/.test(d))
      .sort((a, b) => Number(b.split('-')[1]) - Number(a.split('-')[1]));
    for (const d of dirs) {
      for (const sub of readdirSync(join(root, d))) {
        for (const exe of EXECUTABLES) {
          const p = join(root, d, sub, exe);
          if (existsSync(p)) found.push(p);
        }
      }
    }
  }
  return found;
}

export async function launchChromium(tool) {
  let chromium;
  try { ({ chromium } = await import('playwright')); } catch (e) {
    console.error(`${tool}: playwright is not installed — run "npm install" in tools/ (${e.message})`);
    process.exit(2);
  }
  if (process.env.KFL_CHROMIUM) return chromium.launch({ executablePath: process.env.KFL_CHROMIUM });
  try { return await chromium.launch(); } catch (primary) {
    for (const executablePath of cachedExecutables()) {
      try { return await chromium.launch({ executablePath }); } catch { /* try the next cached build */ }
    }
    console.error(`${tool}: no usable Chromium. Run "npx playwright install chromium" in tools/, or set KFL_CHROMIUM to a Chromium executable.`);
    throw primary;
  }
}
