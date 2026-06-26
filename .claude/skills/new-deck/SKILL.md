---
name: new-deck
description: Scaffold a new presentation deck in this repo from a talk outline. Use when the user wants to create a new deck/slideshow/presentation, or says "new deck", "build a deck", "/new-deck", or gives an outline to turn into slides.
---

# Create a new deck

Scaffold and fill in a new deck in this Slidesmith AI repo. Read `AGENTS.md` at the
repo root first — it is the source of truth for conventions and the `Deck`
contract. This skill is the step-by-step recipe.

## 1. Gather inputs

You need:
- A **deck id** — URL-safe kebab-case (e.g. `q3-review`). It becomes the folder
  name and the route `#/<id>/<n>`. Ask if not given.
- A **title** and one-line **blurb**.
- The **content** — the user's outline, bullets, or talk notes. If they haven't
  given any, ask for a rough per-slide outline before generating slides.

If the user gave an outline file, read it for content only — never render
markdown at runtime; turn it into React components.

## 2. Scaffold from the template

```bash
cp -r src/decks/_template src/decks/<deck-id>
```

This gives you `deck.ts`, `slides.tsx`, `theme.css`, and a `README.md`.

## 3. Wire up `deck.ts`

- Set `id` to `<deck-id>` (must equal the folder name).
- Set `title` and `blurb`.
- Set `themeClass` to a unique class (e.g. `theme-<deck-id>`).
- List your slide components in `slides` in order.
- Add `speakerNotes` (keyed by 0-based slide index).
- For slides that reveal progressively, add `interactiveStepCounts`.
- Delete optional fields you don't use.

## 4. Write the slides

In `slides.tsx`, write **one component per slide**, each returning a `<section>`.
Components for progressive slides accept `{ slideStep }: SlideProps` and render
based on it. Keep text large and readable.

## 5. Theme it

In `theme.css`, rename the `theme-template` class to your `themeClass` and
restyle. **Scope every rule under the themeClass** (e.g. `.theme-<id> .x { }`) so
it can't leak into other decks. Reuse `src/components/` (TerminalFrame, FilePanel,
TerminalPrompt) if you want the built-in terminal look.

## 6. Verify

```bash
npm run build      # must pass — it type-checks the whole repo
npm run dev        # then open the picker and click through the deck
```

The deck appears in the picker automatically — the registry auto-discovers it.
Do not edit `registry.ts` or the engine (`player/`, `components/`, `types.ts`).

## 7. Report back

Tell the user the deck id, its route (`#/<deck-id>/1`), the slide count, and that
the build passed.
