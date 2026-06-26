// Capture clean PNG screenshots of a deck for the README / docs.
//
//   npm run screenshots                -> shoots the default deck
//   npm run screenshots -- <deckId>    -> shoots a specific deck
//
// It serves the production build with `vite preview`, drives a headless Chromium
// to specific slides/steps via the same keyboard nav a presenter uses, and saves
// one PNG per shot under docs/screenshots/. Footer/laser are hidden via ?export=1.
//
// Edit SHOTS below to pick which slides (and interactive steps) to capture.

import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const deckId = process.argv[2] || 'agentic-coding';
const PORT = 5098;
const BASE = `http://localhost:${PORT}`;
const VIEWPORT = { width: 1600, height: 900 }; // 16:9
const SCALE = 2; // retina-crisp
const SETTLE_MS = 800; // let reveal transitions finish

// Each shot: { name, slide (1-based, as in the hash), steps (ArrowRight presses) }.
const SHOTS = {
  'agentic-coding': [
    { name: '1-title', slide: 1, steps: 0 },
    { name: '2-tooling', slide: 4, steps: 3 },
    { name: '3-tokens', slide: 3, steps: 6 },
    { name: '4-subagents', slide: 10, steps: 2 },
    { name: '5-closing', slide: 18, steps: 0 },
  ],
};

const shots = SHOTS[deckId] ?? [{ name: '1-title', slide: 1, steps: 0 }];

const server = spawn('npm', ['run', 'preview', '--', '--port', String(PORT), '--strictPort'], {
  stdio: ['ignore', 'pipe', 'pipe'],
  env: process.env,
});
server.stderr.on('data', (d) => process.stderr.write(`[preview] ${d}`));
const killServer = () => {
  try {
    server.kill('SIGTERM');
  } catch {
    /* already gone */
  }
};
process.on('exit', killServer);

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: VIEWPORT, deviceScaleFactor: SCALE });

  // Wait for the preview server to accept connections.
  let loaded = false;
  for (let i = 0; i < 60 && !loaded; i++) {
    try {
      await page.goto(`${BASE}/?export=1#/${deckId}/1`, { waitUntil: 'domcontentloaded', timeout: 2000 });
      loaded = true;
    } catch {
      await sleep(500);
    }
  }
  if (!loaded) throw new Error('Preview server did not start in time.');

  await page.waitForFunction(() => Boolean(window.__DECK_META__), undefined, { timeout: 15000 });
  const meta = await page.evaluate(() => window.__DECK_META__);
  if (meta.id !== deckId) {
    throw new Error(`Loaded deck "${meta.id}" but expected "${deckId}".`);
  }
  await page.evaluate(() => document.fonts.ready);

  const outDir = path.join('docs', 'screenshots');
  await mkdir(outDir, { recursive: true });

  for (const shot of shots) {
    // Walk deterministically from the start: Home resets to (slide 0, step 0),
    // then ArrowRight steps through every (slide, step) state in order until we
    // hit the target. This is robust to leftover interactive-step state.
    const targetSlide = shot.slide - 1; // hash is 1-based; meta is 0-based
    const targetStep = shot.steps;
    await page.keyboard.press('Home');
    await page.waitForFunction(
      () => window.__DECK_META__.currentSlide === 0 && window.__DECK_META__.slideStep === 0,
    );
    for (let guard = 0; guard < 500; guard++) {
      const m = await page.evaluate(() => window.__DECK_META__);
      if (m.currentSlide === targetSlide && m.slideStep === targetStep) break;
      if (m.currentSlide > targetSlide) {
        throw new Error(`Overshot ${shot.name}: at slide ${m.currentSlide}, wanted ${targetSlide}.`);
      }
      await page.keyboard.press('ArrowRight');
      await sleep(120);
    }
    await sleep(SETTLE_MS);
    const file = path.join(outDir, `${deckId}-${shot.name}.png`);
    const buf = await page.screenshot({ type: 'png' });
    await writeFile(file, buf);
    console.log(`✓ ${file}`);
  }
} finally {
  await browser.close();
  killServer();
}
