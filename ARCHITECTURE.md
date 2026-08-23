# Architecture

System design and the important decisions behind them.

## Overview

A single SvelteKit application handles the whole product. The browser does the voice recognition and rule-based language parsing; a Supabase backend (Postgres + Edge Functions) provides optional persistence. Everything degrades gracefully so the app is fully functional with no backend configuration at all.

```
┌──────────────────────────────────────────────────────────────┐
│ Browser                                                      │
│  ┌─────────────┐   ┌──────────────┐   ┌───────────────────┐  │
│  │ Mic / audio │──▶│ Voice provider│──▶│ NLP intent parser │  │
│  │  capture    │   │ (Web Speech /│   │ (rule-based, pure)│  │
│  └─────────────┘   │  Deepgram)   │   └─────────┬─────────┘  │
│                    └──────────────┘             │ command    │
│  ┌──────────────────────────────────────────────▼──────────┐  │
│  │ Store (localStorage) ◀── data layer ──▶ Supabase client │  │
│  └─────────────────────────────────────────────────────────┘  │
│  ┌──────────────┐   ┌─────────────────────────────────────┐  │
│  │ UI (Svelte 5)│◀──│ Suggestions engine (pure functions) │  │
│  └──────────────┘   └─────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼ (optional)
              Supabase (Postgres + RLS) / Edge Functions
```

## Components

| Path                   | Responsibility                                                                                                  |
| ---------------------- | --------------------------------------------------------------------------------------------------------------- |
| `src/lib/voice/`       | Speech-to-text. Two providers behind one interface: the browser's Web Speech API and Deepgram streaming (BYOK). |
| `src/lib/nlp/`         | Pure functions that turn a transcript into a structured command (intent + entities). No framework, no network.  |
| `src/lib/data/`        | Persistence. Supabase client with a local-storage fallback behind one interface.                                |
| `src/lib/suggestions/` | Pure functions for history-based, seasonal, and substitute suggestions.                                         |
| `src/lib/catalog/`     | Seeded product catalog (name, category, brand, size, price, season, on-sale flag).                              |
| `src/routes/`          | SvelteKit routes; the app is essentially a single page.                                                         |

## The voice pipeline

1. **Capture** — `getUserMedia` obtains the microphone stream.
2. **Recognize** — the active voice provider transcribes speech. Web Speech API streams interim results locally (no network, no key). Deepgram, when a key is present, streams over a WebSocket for sub-second results.
3. **Parse** — the transcript goes through the NLP parser, which emits a command such as `{ intent: 'add', item: 'milk', quantity: 2, unit: 'bottle' }`.
4. **Execute** — the command is applied to the store, which persists and returns the updated list.
5. **Confirm** — the UI updates and a spoken confirmation is queued (Web Speech Synthesis) for voice-only use.

## Key decisions

### Rule-based NLP, not a model

The brief asks for varied-phrase parsing ("I want to buy bananas" vs "add bananas"), multilingual input, and quantity/price extraction. A language model would need a hosted endpoint, an API key, and network latency on every utterance — and would be suspicious overkill for an 8-hour brief. A hand-written parser (intent keywords + quantity/number parsing + category dictionary) is fast, deterministic, unit-testable, and works offline. Multilingual support is a dictionary per language, not a training set.

### Web Speech API first, Deepgram BYOK second

Web Speech API is free, has zero round-trip latency, and streams interim results — the best reviewer experience in Chrome with no setup. It is limited to the browser's supported languages and accuracy. Deepgram is the escape hatch for users who want more: they paste their own key, and recognition routes through Deepgram's streaming endpoint. The key is the user's own and stays client-side.

### Supabase, optional and degraded

Supabase gives Postgres with Row Level Security and Edge Functions (TypeScript/Deno, matching the rest of the stack). It is _optional_: the data layer falls back to `localStorage` when no Supabase URL is configured, so the app runs with zero setup, and tests run without a database.

### One data layer, two backends

A single `Data` interface (`getList`, `saveList`, `addToHistory`, etc.) is implemented twice — once over `localStorage`, once over Supabase. Components and tests talk to the interface only, never to Supabase directly.

## Data model

```sql
shopping_list (
  id uuid pk,
  created_at timestamptz
)

list_item (
  id uuid pk,
  list_id uuid references shopping_list,
  name text,
  category text,          -- dairy | produce | snacks | bakery | beverages | ...
  quantity int,
  unit text,              -- item | bottle | kg | ...
  checked boolean,
  position int
)

purchase_history (
  id uuid pk,
  name text,
  category text,
  purchased_at timestamptz
)

catalog (
  id uuid pk,
  name text,
  category text,
  brand text,
  size text,
  price numeric,
  season text,            -- 'spring' | 'summer' | 'autumn' | 'winter' | 'all'
  on_sale boolean
)

substitute (
  item text,
  alternative text
)
```

`catalog` and `substitute` are seeded from a public grocery dataset at migration time. Suggestions are computed, not stored.

## Suggested-missing heuristic

History-based suggestions compare the gap since an item was last bought against a per-category typical cadence (e.g. milk ~7 days). If the gap exceeds the cadence, the item is surfaced as "running low". This is deliberately a heuristic, not a model — see `src/lib/suggestions/history.ts`.
