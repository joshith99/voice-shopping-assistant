# Approach

The app is a single SvelteKit application that keeps the entire voice pipeline on the client, so it runs with zero backend configuration and no API keys. Speech is captured with the browser's Web Speech API, with an optional bring-your-own-key Deepgram streaming provider for higher accuracy.

A hand-written, rule-based parser turns a transcript into a structured command — intent (add, remove, change, search, clear), item, quantity, unit, and price filters — across English, Hindi, and Spanish. I chose rules over a language model because they are deterministic, offline, and unit-testable, and they satisfy the brief without a hosted endpoint.

The list is grouped into categories through a keyword dictionary. Smart suggestions combine purchase-history cadence ("running low"), seasonal availability, on-sale flags, and substitutes. Search filters a seeded grocery catalog by brand, size, and price.

Persistence goes through one `Data` interface with two implementations: localStorage by default, and Supabase (Postgres with row-level security and anonymous auth) when configured. The UI is a minimal, mobile-first, voice-first interface with explicit listening, recognizing, confirming, and error states, plus spoken confirmations for hands-free use.

Unit tests cover the parser, categorization, suggestions, and data layer; Playwright covers the end-to-end voice and typed flows.
