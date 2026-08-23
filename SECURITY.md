# Security

## Scope

This is a client-side-first application with optional Supabase persistence. The main security-relevant surface is the user's own speech-to-text key (Deepgram BYOK) and any Supabase credentials.

## Principles

- **No secrets in the repository.** Only `.env.example` is committed; `.env` and all variants are git-ignored. Real Supabase keys live in environment variables (Vercel project settings or local `.env`).
- **Client keys are the right kind of key.** Supabase exposes only its `anon` (publishable) key to the browser. It is rate-limited and scoped by Row Level Security, so a leaked anon key is not a credential leak.
- **Row Level Security on all tables.** Every Postgres table has RLS enabled with policies so a client can only read/write its own rows. There is no service-role key used in the browser.
- **BYOK keys are the user's, not ours.** A Deepgram key is pasted into Settings by the user, stored in the browser's `localStorage`, and sent only to Deepgram. It is never transmitted to our servers, never logged, and never persisted server-side. Users can clear it at any time.

## Handling untrusted input

- Voice transcripts are untrusted text. The NLP parser treats everything as data, never as code, and all rendering is escaped by Svelte by default (no raw HTML injection).
- The parser is defensive: malformed or unexpected input produces a "didn't understand" result rather than a partial mutation.
- Supabase queries are parameterized; item names and categories are values, never interpolated SQL.

## Rate limiting & abuse

- Edge Functions (used only if a server-side STT proxy is added) enforce a request limit and size limit, and validate the provider key's format before use.
- Supabase's own per-key rate limiting applies to anonymous traffic.

## Dependencies

- Dependencies are kept minimal and pinned. `npm audit` is run as part of routine maintenance; known issues are triaged against actual usage, not blindly force-upgraded.

## Reporting

To report a security issue, open an issue in the GitHub repository (this project is a small assessment; there is no separate security list) or contact the repository owner directly. Please do not disclose suspected vulnerabilities publicly before the owner has had a chance to respond.
