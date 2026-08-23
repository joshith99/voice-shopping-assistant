# Product

## What it is

A voice-first shopping list for people who want to add groceries without stopping to type. You speak a phrase, the app figures out the intent, updates the list, and talks back — so it works fully hands-free, especially on a phone.

## Target user

Anyone maintaining a recurring grocery list. The primary scene is a phone in the kitchen or on the counter, used hands-free while doing other things.

## Core jobs

1. **Add by voice, naturally** — "add milk", "I need two bottles of water", "buy 5 oranges" all add the right item with the right quantity.
2. **Manage the list** — remove, check off, or change quantities by voice or tap.
3. **Never forget a staple** — suggestions flag items you're likely running low on, plus seasonal picks and substitutes.
4. **Find items by voice** — search the catalog by brand, size, or price ("find toothpaste under $5").

## Features

- Voice input via Web Speech API (default) or Deepgram BYOK.
- Rule-based natural-language parsing: intent, item, quantity, unit, brand, size, price range.
- Automatic categorization (dairy, produce, snacks, bakery, beverages, household, etc.).
- Suggestions: history-based ("running low"), seasonal, and substitutes.
- Multilingual recognition and parsing (English, Hindi, Spanish initially).
- Minimal, mobile-first UI with live recognition feedback and spoken confirmations.

## Non-goals

- No user accounts or social features. Persistence is anonymous; Supabase is optional and device-independent.
- No real e-commerce integration, barcode scanning, or price API. The catalog is seeded public data.
- No machine-learning model for parsing or suggestions. Deterministic rules only.
- No offline speech models beyond the browser's built-in engine.

## Success criteria

A reviewer can open the URL, tap the mic, say "add two cartons of milk", see it appear categorized with quantity 2, then say "remove milk" and have it disappear — with no setup, no key, and no errors. The same flow should work in Chrome on desktop and mobile.
