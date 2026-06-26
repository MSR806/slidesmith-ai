# AGENTS.md

Instructions for a coding agent working in this repo. Read this fully before
building or editing a deck.

## What this repo is

A small **React + TypeScript + Vite** engine for building presentation decks
**as code**. One repo holds many decks. A generic player renders any deck:
keyboard navigation, progressive reveals, a deck picker, an optional
laser-pointer, and a headless PDF exporter. Your job is usually to **author a new
deck** from an outline the user gives you, or to edit an existing one.

There is no database and no markdown-at-runtime parsing. Slides are plain React
components. The source of truth for a deck is its TypeScript, not a `.md` file.

## Commands

```bash
npm install        # once
npm run dev        # local dev server (http://localhost:5173) — the picker is at /
npm run build      # tsc --noEmit + vite build — ALWAYS run this to verify your work
npm run export:pdf -- <deckId>   # render a deck to exports/<deckId>.pdf (Playwright)
npm run screenshots -- <deckId>  # save slide PNGs to docs/screenshots/ (Playwright)
```

Verify with `npm run build`. It type-checks the whole repo, so a broken deck
fails the build.

## Architecture

```
src/
  main.tsx                 # mounts <App>, imports global CSS
  App.tsx                  # hash router: #/ -> picker, #/<deckId>/<n> -> player
  styles.css               # global styles + the shared "terminal" theme
  player/
    DeckPlayer.tsx          # renders a deck: nav, steps, laser, export hooks
    DeckPicker.tsx          # the landing grid of deck cards
    player.css
  components/               # reusable slide building blocks (see below)
  decks/
    types.ts                # the Deck contract — read this
    registry.ts             # AUTO-DISCOVERS decks; you do not edit this
    _template/              # copy this to start a new deck
    <deck-id>/              # one folder per deck, self-contained
      deck.ts               #   exports `deck: Deck`
      slides.tsx            #   the slide components (or a slides/ folder)
      theme.css             #   deck-scoped styles
```

**The engine (`player/`, `components/`, `App.tsx`, `decks/types.ts`,
`decks/registry.ts`) is shared. Do not change it to make one deck work** —
solve it inside your deck folder instead. The only time you touch the engine is a
deliberate, repo-wide capability change the user asked for.

## Decks are auto-discovered

`registry.ts` globs `src/decks/*/deck.ts` and registers every module that exports
a `deck`. Consequences:

- **To add a deck, just create the folder** and export `deck`. No registry edit.
- Folders whose name starts with `_` (e.g. `_template`) are **skipped**.
- A gitignored deck still loads locally and disappears on a fresh clone — that's
  how private decks are kept out of the public repo.

Each `deck.ts` **must** `export const deck: Deck`.

## The Deck contract

From `src/decks/types.ts`:

```ts
type Deck = {
  id: string;            // URL-safe, MUST equal the folder name; route is #/<id>/<n>
  title: string;         // picker card + browser tab
  blurb: string;         // one-line picker description
  themeClass: string;    // CSS class applied to the deck shell for scoped theming
  slides: ComponentType<SlideProps>[];   // ordered slides, one component each
  interactiveStepCounts?: Record<number, number>;  // slideIndex(0-based) -> #steps
  speakerNotes?: Record<number, string>;           // slideIndex(0-based) -> note
  Background?: ComponentType;            // optional full-screen background
  enableLaser?: boolean;                 // laser-pointer overlay
  footerHint?: string;                   // footer keyboard hint
};

type SlideProps = { slideStep?: number };  // passed only to interactive slides
```

## How to author a new deck

1. **Copy the template:** `cp -r src/decks/_template src/decks/<deck-id>`.
2. Set `id` (= folder name), `title`, `blurb`, `themeClass` in `deck.ts`.
3. Rename the `theme-template` class in `theme.css` to your `themeClass` and
   restyle. **Scope every rule under `themeClass`** (e.g. `.theme-foo .x { }`) so
   decks never bleed into each other.
4. Turn the user's outline into slides in `slides.tsx` — **one component per
   slide** — and list them in `deck.slides` in order.
5. Add `speakerNotes` and, for any slide that reveals progressively,
   `interactiveStepCounts`.
6. `npm run build`, then `npm run dev` and click through.

If the user gives you a markdown/outline file, treat it as content only: extract
each slide's title, points, and intent — do not render the markdown at runtime.

### Progressive reveals (interactive steps)

A slide reveals in steps only if its index is in `interactiveStepCounts`. The
player then passes `slideStep` (0-based, `0 … count-1`). Drive your render off it:

```tsx
export function MySlide({ slideStep = 0 }: SlideProps) {
  return <ul>{items.slice(0, slideStep + 1).map(/* … */)}</ul>;
}
```

### Reusable building blocks (`src/components/`)

These belong to the shared **terminal** theme (used by the `agentic-coding`
example deck). Use them when your deck uses that theme; otherwise build your own:

- `TerminalFrame({ title, children, className? })` — full-screen terminal shell.
- `FilePanel({ filename, tone?, children })` — a "file" card; `tone` is `cyan`|`green`|`amber`.
- `TerminalPrompt({ command, path?, cursor? })` — a shell prompt line.
- `ProgressBar` — used by the player; you won't usually need it directly.

## Authoring many slides in parallel (optional)

For a large deck you may fan out one subagent per slide. To keep them
conflict-free:

- Each agent writes **only its own slide component** (its own function, and if it
  needs CSS, scoped rules in the deck's `theme.css` with a slide-specific prefix).
- Agents must **not** edit `deck.ts`, the engine, or another agent's slide.
- You (the orchestrator) assemble the `slides` array and wire steps/notes in
  `deck.ts` after the slide agents finish, then run `npm run build`.

## Quality bar

- `npm run build` passes (type-check is part of it).
- Readable from a distance: large type, generous spacing, no tiny text.
- Respect reduced-motion; keep animation subtle.
- No new runtime dependencies unless the user asks.
- Keep content faithful to the user's outline, but make it visually strong.

## Do not

- Do not edit the engine to fix one deck.
- Do not commit `dist/`, `node_modules/`, or anything matched by `.gitignore`.
- Do not publish or un-ignore private decks listed in `.gitignore`.
