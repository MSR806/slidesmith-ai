# Template deck

A minimal, self-contained deck you copy to start a new one. It is **not** shown
in the picker (folders starting with `_` are skipped by the registry), but it is
type-checked by the build so it always stays valid.

## To create a new deck

1. Copy this folder to `src/decks/<your-deck-id>/`.
2. In `deck.ts`, set `id` to match the folder name, and update `title` / `blurb`.
3. Rename the `theme-template` class in `theme.css` to your deck's `themeClass`.
4. Replace the slides in `slides.tsx` with your content (one component per slide).
5. Run `npm run dev` — your deck appears in the picker automatically.

No edits to `registry.ts` are needed: decks are auto-discovered.

See the repo root `AGENTS.md` for the full authoring guide.
