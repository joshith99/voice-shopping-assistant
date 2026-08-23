# Tasks

Outstanding work and planned changes. Checked items are done; keep this in sync
as work lands. Inline `TODO` comments in code are for local, low-level follow-ups
only.

## In progress

- [ ] Voice pipeline — Web Speech API provider with live transcript + the five UI states (listening / recognizing / confirming / error).

## Backlog

- [ ] List management — add / remove / check off / change quantity, grouped by category, persisted through the data layer.
- [ ] NLP intent parser — intents (add, remove, change, search, clear) + entities (item, quantity, unit, brand, size, price range).
- [ ] Categorization dictionary — map item names to categories (dairy, produce, snacks, …).
- [ ] Suggestions — history-based "running low", seasonal picks, substitutes.
- [ ] Voice search — search the catalog with brand / size / price filters.
- [ ] Deepgram BYOK — streaming provider + Settings screen for the key.
- [ ] Multilingual — language selector driving both recognition and parsing dictionaries.
- [ ] Supabase persistence — data-layer implementation + RLS migrations.
- [ ] Seed catalog — public grocery dataset imported into `catalog` + `substitute` tables.
- [ ] Tests — Vitest for `src/lib/nlp` and `src/lib/suggestions`; Playwright for the happy-path voice flow (mocked recognition).
- [ ] Deploy — Vercel project, env vars, live URL.
- [ ] Write-up — 200-word approach summary (`WRITEUP.md`) and final README links.

## Notes

- `npm run test` / `npm run test:e2e` are wired for Vitest and Playwright; add the
  actual test files alongside the code they cover.
- Windows local `npm run build` hits the adapter-vercel symlink `EPERM`; verify
  with `npm run check` + `npm run dev` locally, build on Vercel.
