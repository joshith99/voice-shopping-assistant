# Voice Command Shopping Assistant

A voice-first shopping list manager. Add, remove, and search for groceries by speaking, with automatic categorization, quantity parsing, and smart suggestions based on your history, the season, and what's on sale.

Built as a technical assessment project. Live demo and write-up are linked at the bottom.

## Features

- **Voice input** — add and manage items with natural phrases ("add milk", "I need two bottles of water", "remove the bananas"). Built on the browser's native Web Speech API for zero-latency recognition, with an optional bring-your-own-key path (Deepgram) for higher accuracy and broader language coverage.
- **Natural language parsing** — a rule-based intent parser (no model dependency) that extracts the action, item, quantity, unit, brand, size, and price range from a spoken sentence.
- **Smart suggestions** — items you're likely running low on (from purchase history), seasonal picks, and substitutes ("almond milk" when you ask for milk).
- **List management** — add, remove, check off, and change quantities; items are auto-categorized (dairy, produce, snacks, etc.).
- **Voice search** — search the product catalog by voice, filtered by brand, size, or price ("find toothpaste under $5").
- **Multilingual** — recognition and parsing work across a selectable set of languages (English, Hindi, Spanish out of the box).
- **Voice-first, mobile-first UI** — minimal interface with live recognition feedback and spoken confirmations for hands-free use.

## Tech stack

- [SvelteKit](https://svelte.dev/docs/kit) (Svelte 5) + TypeScript
- [Tailwind CSS](https://tailwindcss.com) v4
- [Supabase](https://supabase.com) — Postgres, Row Level Security, Edge Functions (optional; the app degrades gracefully to local storage when unconfigured)
- Web Speech API + [Deepgram](https://deepgram.com) (optional BYOK) for speech-to-text
- [Vercel](https://vercel.com) for hosting

## Getting started

```sh
npm install
cp .env.example .env   # optional — Supabase only
npm run dev            # http://localhost:5173
```

The app runs fully in the browser with local storage if you skip the `.env` step. Voice input uses the Web Speech API, which is available in Chrome and Edge (and most mobile browsers); a microphone is required.

### Optional: Supabase

Create a Supabase project, apply the migrations in `supabase/migrations/`, and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`. With those set, the list, history, and settings sync to Postgres instead of local storage.

### Optional: Deepgram BYOK

In the app's Settings, paste a Deepgram API key. Recognition then routes through Deepgram's streaming endpoint for higher accuracy. The key stays in your browser and is never sent to our servers.

## Scripts

| Command            | Purpose                           |
| ------------------ | --------------------------------- |
| `npm run dev`      | Start the dev server              |
| `npm run build`    | Production build (adapter-vercel) |
| `npm run check`    | Type-check with `svelte-check`    |
| `npm run format`   | Format with Prettier              |
| `npm run test`     | Run unit tests (Vitest)           |
| `npm run test:e2e` | Run end-to-end tests (Playwright) |

## Project structure

```
src/
  lib/
    nlp/        intent + entity parsing
    voice/      Web Speech + Deepgram providers
    data/       Supabase client + local-storage fallback
    suggestions/  history, seasonal, substitute logic
    catalog/    seeded product data
  routes/       SvelteKit routes
supabase/
  migrations/   schema + seed data
```

## Deployment

The app ships with `@sveltejs/adapter-vercel`. To deploy:

```sh
vercel        # link the project, then
vercel --prod
```

Or connect the GitHub repository in the Vercel dashboard — the framework preset is
SvelteKit and needs no custom build command. Set `PUBLIC_SUPABASE_URL` and
`PUBLIC_SUPABASE_ANON_KEY` as environment variables for the optional backend.

## Documentation

- [Architecture](ARCHITECTURE.md) — system design and key decisions
- [Product](PRODUCT.md) — goals and scope
- [Security](SECURITY.md) — practices and reporting
- [Tasks](TASKS.md) — outstanding work and planned changes

## Links

- Live demo: https://voice-shopping-assistant-mu-swart.vercel.app
- Write-up: [WRITEUP.md](WRITEUP.md)
