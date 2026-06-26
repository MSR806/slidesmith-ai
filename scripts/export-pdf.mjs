// CLI PDF exporter for the slide decks.
//
//   npm run export:pdf                 -> exports the default deck
//   npm run export:pdf -- <deckId>     -> exports a specific deck by id
//
// It builds the app, serves the production bundle with `vite preview`, drives a
// headless Chromium through every slide (and every interactive step) via the same
// keyboard navigation a presenter uses, screenshots each state, and stitches the
// shots into a landscape 16:9 PDF under ./exports/. Footer/laser are hidden via the
// ?export=1 flag the player reads.

import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import { PDFDocument } from 'pdf-lib';

const deckId = process.argv[2] || 'agentic-coding';
const PORT = 5099;
const BASE = `http://localhost:${PORT}`;
const VIEWPORT = { width: 1600, height: 900 }; // 16:9
const SCALE = 2; // retina-crisp screenshots
const SETTLE_MS = 600; // let field-reveal transitions finish before each shot

// 1. Serve the built bundle.
const server = spawn('npm', ['run', 'preview', '--', '--port', String(PORT), '--strictPort'], {
  stdio: ['ignore', 'pipe', 'pipe'],
  env: process.env,
});
server.stdout.on('data', (d) => process.stdout.write(`[preview] ${d}`));
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
  const url = `${BASE}/?export=1#/${deckId}/1`;

  // Wait for the preview server to come up.
  let loaded = false;
  for (let i = 0; i < 60 && !loaded; i++) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 2000 });
      loaded = true;
    } catch {
      await sleep(500);
    }
  }
  if (!loaded) throw new Error('Preview server did not start in time.');

  await page.waitForFunction(() => Boolean(window.__DECK_META__), undefined, { timeout: 15000 });
  await page.evaluate(() => document.fonts.ready);

  const meta = await page.evaluate(() => window.__DECK_META__);
  if (meta.id !== deckId) {
    throw new Error(`Loaded deck "${meta.id}" but expected "${deckId}". Check the deck id.`);
  }
  const { slideCount, stepCounts } = meta;
  const finalStepOf = (i) => (stepCounts[i] ?? 1) - 1; // 0-based index of the last step

  // Start at the very first slide/step.
  await page.keyboard.press('Home');
  await page.waitForFunction(
    () => window.__DECK_META__.currentSlide === 0 && window.__DECK_META__.slideStep === 0,
  );

  // Walk forward exactly like a presenter: ArrowRight steps within a slide, then
  // advances to the next slide — one screenshot per state.
  const shots = [];
  // eslint-disable-next-line no-constant-condition
  while (true) {
    await sleep(SETTLE_MS);
    shots.push(await page.screenshot({ type: 'png' }));

    const m = await page.evaluate(() => window.__DECK_META__);
    const atEnd = m.currentSlide === slideCount - 1 && m.slideStep === finalStepOf(m.currentSlide);
    if (atEnd) break;

    const prev = { s: m.currentSlide, st: m.slideStep };
    await page.keyboard.press('ArrowRight');
    await page.waitForFunction(
      (p) => window.__DECK_META__.currentSlide !== p.s || window.__DECK_META__.slideStep !== p.st,
      prev,
      { timeout: 8000 },
    );
  }

  // Stitch the shots into a 16:9 PDF (one screenshot per page).
  const pdf = await PDFDocument.create();
  for (const buf of shots) {
    const png = await pdf.embedPng(buf);
    const sheet = pdf.addPage([VIEWPORT.width, VIEWPORT.height]);
    sheet.drawImage(png, { x: 0, y: 0, width: VIEWPORT.width, height: VIEWPORT.height });
  }
  const bytes = await pdf.save();

  await mkdir('exports', { recursive: true });
  const out = path.join('exports', `${deckId}.pdf`);
  await writeFile(out, bytes);
  console.log(`\n✓ Exported ${shots.length} page(s) → ${out}`);
} finally {
  await browser.close();
  killServer();
}
