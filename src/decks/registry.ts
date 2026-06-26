import type { Deck } from './types';

/**
 * Decks are auto-discovered: every `src/decks/<id>/deck.ts` that exports a
 * `deck: Deck` is picked up automatically. To add a deck, create the folder and
 * export a `deck` — no edits to this file are needed.
 *
 * Folders whose name starts with `_` (e.g. `_template`) are skipped, and any
 * deck that is gitignored locally simply won't exist on a fresh clone, so the
 * glob adapts to whatever decks are present.
 */
const modules = import.meta.glob<{ deck?: Deck }>('./*/deck.ts', { eager: true });

export const decks: Deck[] = Object.entries(modules)
  .filter(([path]) => !path.split('/').some((segment) => segment.startsWith('_')))
  .map(([, module]) => module.deck)
  .filter((deck): deck is Deck => Boolean(deck))
  .sort((a, b) => a.title.localeCompare(b.title));

export function findDeck(id: string | undefined): Deck | undefined {
  return decks.find((deck) => deck.id === id);
}
