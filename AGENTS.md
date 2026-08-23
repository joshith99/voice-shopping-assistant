# AGENTS.md

Working notes for AI coding agents (opencode) on this repository. Read before making changes.

## Project

Voice Command Shopping Assistant — a voice-first shopping list manager. SvelteKit (Svelte 5) frontend, Supabase for optional persistence, Web Speech API + optional Deepgram BYOK for speech-to-text. See `README.md`, `ARCHITECTURE.md`, `PRODUCT.md`, `DESIGN.md`.

## Commands

| Task       | Command                         |
| ---------- | ------------------------------- |
| Dev server | `npm run dev`                   |
| Type-check | `npm run check`                 |
| Build      | `npm run build`                 |
| Format     | `npm run format`                |
| Unit tests | `npm run test` (Vitest)         |
| E2E        | `npm run test:e2e` (Playwright) |

## Conventions

- Svelte 5 runes mode (`$state`, `$derived`, `$props`). No legacy `let` reactivity.
- TypeScript strict. Run `npm run check` before finishing any task; zero errors/warnings.
- Format with Prettier before committing (`npm run format`).
- Minimal dependencies. Do not add a library for something a few lines or a native API covers.
- No code comments unless they explain _why_ (not _what_). No dead code, no TODO-scaffolding.
- Rule-based logic lives in `src/lib/nlp` as pure functions (easy to unit test).
- Data access goes through `src/lib/data` (Supabase with local-storage fallback) so the app works with no env config.

## Windows note

`npm run build` fails locally on Windows at the adapter-vercel symlink step (`EPERM`). This is a known adapter-vercel limitation; the build compiles fine and deploys on Vercel's Linux runners. Verify locally with `npm run check` and `npm run dev` instead.

## Tools

- **Design:** use the `impeccable` skill for all UI work; keep `DESIGN.md` and `PRODUCT.md` in sync.
- **Process:** use `superpowers` skills — brainstorming before new features, test-driven-development for new logic, systematic-debugging for bugs, verification-before-completion before claiming done.
- **Docs lookup:** use context7 for current SvelteKit / Supabase / Deepgram documentation.
- **Search:** use exa / brave-search for external data (e.g. the product catalog dataset).
- **Code graph:** use codebase-memory to index after major changes.
- **GitHub:** use the github MCP for repo/PR actions; `gh` CLI is not installed.
- **Testing:** Playwright for E2E.

## Commit cadence

Small, meaningful commits after each working slice. Message style: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`. Never one giant "everything" commit. Push after every slice. Never commit secrets, `.env`, or build output.
