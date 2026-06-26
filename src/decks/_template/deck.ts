// Deck template — copy this folder to `src/decks/<your-deck-id>/` and edit.
//
// The registry auto-discovers every `src/decks/<id>/deck.ts` that exports a
// `deck`, EXCEPT folders whose name starts with `_` (like this one). So once you
// copy it to a real id, it shows up in the picker automatically — no registry edit.
import type { Deck } from '../types';
import './theme.css';
import { IntroSlide, PointSlide, ClosingSlide } from './slides';

export const deck: Deck = {
  // URL-safe id. Must match the folder name. Route is #/<id>/<slideNumber>.
  id: '_template',
  // Shown on the deck picker card and the browser tab.
  title: 'Template Deck',
  // One-line description on the picker card.
  blurb: 'Copy this folder to start a new deck.',
  // CSS class applied to the deck shell so this deck can theme itself in theme.css.
  themeClass: 'theme-template',
  // The ordered slides. One component per slide.
  slides: [IntroSlide, PointSlide, ClosingSlide],

  // ---- Optional fields below — delete the ones you don't use ----

  // Slides that reveal in steps on arrow/space. Key = slide index (0-based),
  // value = number of click steps. The slide receives `slideStep` (0-based).
  // interactiveStepCounts: { 1: 3 },

  // Presenter notes shown in the footer, keyed by slide index (0-based).
  speakerNotes: {
    0: 'Welcome — set the context in one sentence.',
    2: 'Close with the single thing you want remembered.',
  },

  // Decorative full-screen background component rendered behind every slide.
  // Background: MyBackground,

  // Enable the laser-pointer overlay (double-click / press-drag to draw).
  // enableLaser: true,

  // Footer keyboard hint text.
  footerHint: '← → / Space · Esc for decks',
};
