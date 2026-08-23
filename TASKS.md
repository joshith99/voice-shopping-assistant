# Tasks

Outstanding work and planned changes. Checked items are done; keep this in sync
as work lands. Inline `TODO` comments in code are for local, low-level follow-ups
only.

## Done

- [x] Voice pipeline — Web Speech API provider with live transcript and the five UI states.
- [x] List management — add / remove / check off / change quantity, grouped by category.
- [x] NLP intent parser — intents (add, remove, change, search, clear) + entities (item, quantity, unit, price range).
- [x] Categorization dictionary.
- [x] Suggestions — history-based "running low", seasonal, on sale, substitutes.
- [x] Voice search — brand / size / price filters against the catalog.
- [x] Deepgram BYOK — streaming provider + settings dialog for the key.
- [x] Multilingual — language selector driving recognition and parsing (English, Hindi, Spanish).
- [x] Supabase persistence — data layer + RLS migration, localStorage fallback.
- [x] Seed catalog — bundled grocery catalog + substitutes.
- [x] Tests — Vitest (parser, suggestions, data, catalog) + Playwright E2E (voice, typed, search).
- [x] Write-up — `WRITEUP.md` (approach summary).

## Remaining

- [x] Deploy — deployed to Vercel: `https://voice-shopping-assistant-mu-swart.vercel.app`.
- [x] Supabase backend — env vars set, tables + RLS migrated, anonymous sign-ins enabled, persistence verified.

## Notes

- Windows local `npm run build` hits the adapter-vercel symlink `EPERM`; verify with `npm run check` + `npm run dev` locally, build on Vercel.
- `catalog` and `substitutes` are bundled static seed in `src/lib/catalog/seed.ts` (fast, offline); only the list and purchase history persist to Supabase.
