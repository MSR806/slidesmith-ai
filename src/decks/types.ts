import type { ComponentType } from 'react';

export type SlideProps = {
  slideStep?: number;
};

export type Deck = {
  /** URL-safe id used in the hash route: #/<id>/<slide> */
  id: string;
  /** Display name on the picker and browser title */
  title: string;
  /** One-line description for the picker card */
  blurb: string;
  /** Class applied to the deck shell so a deck can theme itself */
  themeClass: string;
  /** The ordered slide components */
  slides: ComponentType<SlideProps>[];
  /** Slide index (0-based) -> number of internal click steps */
  interactiveStepCounts?: Record<number, number>;
  /** Per-slide speaker notes, indexed by slide (0-based) */
  speakerNotes?: Record<number, string>;
  /** Optional decorative background rendered behind the stage */
  Background?: ComponentType;
  /** Enable the laser-pointer overlay (double-click / press to draw) */
  enableLaser?: boolean;
  /** Footer keyboard hint text */
  footerHint?: string;
};
