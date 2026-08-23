# Voice Command Shopping Assistant Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a voice-first shopping list manager (voice input, NLP parsing, smart suggestions, list management, voice search, optional Supabase persistence) as a single SvelteKit app.

**Architecture:** One SvelteKit app. Voice providers (Web Speech API, Deepgram BYOK) and a rule-based NLP parser run in the browser; a `Data` interface abstracts Supabase vs localStorage so the app works with no backend config.

**Tech Stack:** SvelteKit (Svelte 5, runes) + TypeScript strict, Tailwind CSS v4, Vitest (unit), Playwright (E2E), Supabase (optional), adapter-vercel.

**Spec:** `PRODUCT.md`, `ARCHITECTURE.md`, `DESIGN.md` in the repo root. This plan argues from those; read them alongside.

## Global Constraints

- Svelte 5 runes only (`$state`, `$derived`, `$props`); no legacy `let` reactivity.
- TypeScript strict; `npm run check` must report 0 errors/warnings after every task.
- Format with Prettier (`npm run format`) before committing.
- Minimal dependencies: no library for what a few lines or a native API covers.
- Rule-based logic is pure and lives in `src/lib/nlp` / `src/lib/suggestions`.
- No code comments unless they explain _why_. No dead code.
- Commit small after each task; push.

## File Structure

- `src/lib/nlp/types.ts` — shared types: `Command`, `Intent`, `Quantity`, `Filter`.
- `src/lib/nlp/parse.ts` — transcript → `Command` (intent + entities).
- `src/lib/nlp/categories.ts` — item-name → category dictionary + `categorize()`.
- `src/lib/voice/types.ts` — `VoiceProvider` interface + `VoiceState`.
- `src/lib/voice/web-speech.ts` — Web Speech API provider.
- `src/lib/voice/deepgram.ts` — Deepgram streaming provider (BYOK).
- `src/lib/voice/speech-synthesis.ts` — spoken confirmations.
- `src/lib/data/types.ts` — `ListData`, `Data` interface.
- `src/lib/data/local.ts` — localStorage implementation.
- `src/lib/data/supabase.ts` — Supabase implementation + client.
- `src/lib/suggestions/history.ts`, `seasonal.ts`, `substitutes.ts` — pure functions.
- `src/lib/catalog/seed.ts` — seeded catalog + substitutes.
- `src/routes/+page.svelte` — the single-page app shell.
- `supabase/migrations/` — schema + RLS + seed.

## Shared types (defined once, used everywhere)

```ts
// src/lib/nlp/types.ts
export type Intent = 'add' | 'remove' | 'change' | 'search' | 'clear' | 'unknown';

export interface Quantity {
	value: number;
	unit: string; // 'item' | 'bottle' | 'kg' | ... default 'item'
}

export interface Filter {
	brand?: string;
	size?: string;
	maxPrice?: number;
	minPrice?: number;
}

export interface Command {
	intent: Intent;
	item?: string;
	quantity?: Quantity;
	filter?: Filter;
	text: string; // original transcript
}
```

```ts
// src/lib/data/types.ts
export interface ListItem {
	id: string;
	name: string;
	category: string;
	quantity: number;
	unit: string;
	checked: boolean;
}

export interface Data {
	getList(): Promise<ListItem[]>;
	saveList(items: ListItem[]): Promise<void>;
	addToHistory(name: string, category: string): Promise<void>;
	getHistory(): Promise<{ name: string; category: string; purchasedAt: string }[]>;
	getSetting(key: string): string | null;
	setSetting(key: string, value: string): void;
}
```

---

### Task 1: NLP parser (intent + entities)

**Files:**

- Create: `src/lib/nlp/types.ts`, `src/lib/nlp/parse.ts`, `src/lib/nlp/categories.ts`
- Test: `src/lib/nlp/parse.test.ts`, `src/lib/nlp/categories.test.ts`

**Interfaces:**

- Produces: `parse(transcript: string): Command`, `categorize(name: string): string`.

- [ ] **Step 1: Write failing tests** — cover: "add milk" → `{intent:'add', item:'milk'}`, "I need two bottles of water" → quantity `{value:2, unit:'bottle'}`, "remove the bananas" → `{intent:'remove', item:'bananas'}`, "find toothpaste under $5" → `{intent:'search', item:'toothpaste', filter:{maxPrice:5}}`, garbage → `{intent:'unknown'}`.
- [ ] **Step 2: Run** `npm run test` — expected FAIL (module missing).
- [ ] **Step 3: Implement** intent keywords, number/unit regex, price-range parsing, item normalization (strip leading articles, plural→singular).
- [ ] **Step 4: Run** `npm run test` — expected PASS.
- [ ] **Step 5: `npm run check`, commit** `feat: nlp intent and entity parser`.

### Task 2: Voice pipeline — Web Speech API provider

**Files:**

- Create: `src/lib/voice/types.ts`, `src/lib/voice/web-speech.ts`, `src/lib/voice/speech-synthesis.ts`
- Test: `src/lib/voice/web-speech.test.ts` (mock `webkitSpeechRecognition`)

**Interfaces:**

- Consumes: `Command` from Task 1.
- Produces: `VoiceProvider { start(): void; stop(): void; onResult(transcript: string): void; onState(state: VoiceState): void }`, `VoiceState = 'idle' | 'listening' | 'recognizing' | 'confirming' | 'error'`.

- [ ] **Step 1: Write failing test** — a mocked recognizer drives `onResult` and `onState` transitions.
- [ ] **Step 2: Run** — FAIL.
- [ ] **Step 3: Implement** provider wrapping `webkitSpeechRecognition`, interim vs final results, language passthrough.
- [ ] **Step 4: Run** — PASS.
- [ ] **Step 5: Commit** `feat: web speech voice provider`.

### Task 3: List management + data layer (localStorage)

**Files:**

- Create: `src/lib/data/types.ts`, `src/lib/data/local.ts`
- Test: `src/lib/data/local.test.ts`

**Interfaces:**

- Consumes: `ListItem`, `Data` from `types.ts`.
- Produces: `localData: Data`.

- [ ] **Step 1: Write failing test** — save then load round-trips items.
- [ ] **Step 2: Run** — FAIL.
- [ ] **Step 3: Implement** localStorage-backed `Data` with a stable default list.
- [ ] **Step 4: Run** — PASS.
- [ ] **Step 5: Commit** `feat: local data layer`.

### Task 4: App shell — list UI + mic button + states

**Files:**

- Create: `src/routes/+page.svelte`, `src/lib/components/MicButton.svelte`, `src/lib/components/ListItem.svelte`
- Modify: `src/app.css` (design tokens from `DESIGN.md`)

- [ ] **Step 1:** Build the five-state UI per `DESIGN.md` (idle/listening/recognizing/confirming/error), wired to the Task 2 provider and Task 3 store.
- [ ] **Step 2:** Wire `parse()` output to list mutations with spoken confirmations.
- [ ] **Step 3: `npm run check`** — 0 warnings.
- [ ] **Step 4: Commit** `feat: app shell with voice list management`.

### Task 5: Suggestions (history, seasonal, substitutes)

**Files:**

- Create: `src/lib/suggestions/history.ts`, `seasonal.ts`, `substitutes.ts`, `src/lib/catalog/seed.ts`
- Test: `src/lib/suggestions/*.test.ts`

- [ ] **Step 1:** Write failing tests for each pure function (cadence-based "running low", season lookup, substitute lookup).
- [ ] **Step 2:** Run — FAIL.
- [ ] **Step 3:** Implement against the `Data.getHistory()` shape.
- [ ] **Step 4:** Run — PASS.
- [ ] **Step 5: Commit** `feat: suggestions engine`.

### Task 6: Voice search with filters

- [ ] Parse `Filter` (brand/size/price) against the seeded catalog; surface results in a search sheet.
- [ ] Test filter matching. Commit `feat: voice search`.

### Task 7: Deepgram BYOK provider + Settings

- [ ] Add `deepgram.ts` streaming provider and a Settings screen storing the user's key in `localStorage`.
- [ ] Provider fallback: if no key or browser lacks Web Speech, show a clear error state. Commit `feat: deepgram byok`.

### Task 8: Multilingual

- [ ] Language selector; drive both the recognizer `lang` and per-language intent/quantity dictionaries.
- [ ] Test English + Hindi + Spanish parse. Commit `feat: multilingual`.

### Task 9: Supabase persistence + migrations

- [ ] `src/lib/data/supabase.ts`; `supabase/migrations/*` with schema + RLS + seed.
- [ ] `Data` selection: Supabase when `VITE_SUPABASE_URL` present, else local. Commit `feat: supabase persistence`.

### Task 10: E2E + deploy + write-up

- [ ] Playwright happy-path (mock recognition), Vercel deploy, `WRITEUP.md`, final README links. Commit `test: e2e` / `docs: writeup`.
