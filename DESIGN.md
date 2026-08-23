# Design

Design system and interaction model for the voice-first UI.

## Principles

1. **Voice is the primary input, the button is the anchor.** A single, large, always-visible mic button is the focal point. Everything else is secondary.
2. **Speak back.** Every action gets a visual _and_ spoken confirmation, so the app works with the screen ignored.
3. **Minimal but legible.** One list, one clear hierarchy. No chrome, no settings sprawl. High contrast, large targets.
4. **Honest feedback.** The UI always shows what the recognizer is doing — listening, hearing, or unsure. No silent hangs.

## Interaction states

The mic button and list communicate one of five states at all times:

| State         | Visual                                                                      | Spoken                  |
| ------------- | --------------------------------------------------------------------------- | ----------------------- |
| `idle`        | Neutral mic, resting                                                        | —                       |
| `listening`   | Mic expands, pulsing ring                                                   | short "listening" chime |
| `recognizing` | Live transcript streamed below the button, ring pulses faster               | —                       |
| `confirming`  | Parsed command shown (item + quantity), brief highlight on the affected row | "added milk"            |
| `error`       | Amber state, reason shown ("didn't catch that")                             | "sorry, try again"      |

Transitions between states are animated (150–250ms) and always resolve to a visible terminal state — never a hang.

## Layout

Single column, max-width container, phone-first:

- **Top bar** — app name, language selector, settings (one tap to the key screen).
- **Mic button** — centered, 72px, sticky above the list.
- **Transcript strip** — interim/parsed text directly under the button.
- **Suggestions** — a compact horizontal rail above the list ("Running low: milk · bread").
- **List** — the main surface, grouped by category, each row showing checkbox, name, quantity, unit.
- **Empty state** — a single friendly prompt ("Tap the mic and say 'add milk'").

## Visual system

Tailwind v4, tokens defined in `@theme` (see `src/app.css`).

- **Color** — warm neutral canvas (`#faf9f7`), white surfaces, ink text (`#1c1917`), one fresh-green accent (`#16a34a`) used sparingly for the mic and check state. Category tags use muted secondary tints. Errors use amber (`#d97706`), not red, to stay friendly.
- **Type** — system font stack (native, fast, no webfont request). Sizes from 13px (meta) to 20px (item names) to 32px (empty-state headline). Numbers tabular for quantities.
- **Radius** — 12px cards, 9999px pills for the mic and tags.
- **Elevation** — minimal; one subtle shadow on the sticky mic area, none elsewhere.
- **Motion** — 150–250ms ease-out for state changes; the mic pulse is a gentle scale+opacity loop. Respects `prefers-reduced-motion`.

## Copy

Short, first-person, conversational. Confirmations are verb-like ("added milk", "removed bananas"). Errors say what to do next, not what failed internally. No jargon, no emoji in UI text.

## Accessibility

- The mic button is a real `<button>` with an accessible name and a minimum 44px target.
- All feedback has a non-audio equivalent (visual transcript + row highlight), so the app is usable with the mic unavailable or screen readers active.
- Contrast meets WCAG AA on all text over canvas and surfaces.
