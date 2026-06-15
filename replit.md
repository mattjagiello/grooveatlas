# Groove Atlas

A mobile-first drum history and discovery app. Users can explore drummers across eras and styles, discover how drumming evolved, and browse genres and iconic recordings. Visual identity: parchment/old-map palette, globe and timeline as navigation metaphors.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm --filter @workspace/groove-atlas run dev` — run the Expo app
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run seed` — seed the database with curated drummer/era/genre data
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Mobile: Expo (React Native) — Android-primary, web secondary
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec at `lib/api-spec/openapi.yaml`)
- Build: esbuild

## Where things live

- **OpenAPI spec**: `lib/api-spec/openapi.yaml` — source of truth for all API contracts
- **DB schema**: `lib/db/src/schema/groove.ts` — Drizzle ORM table definitions
- **Seed data**: `artifacts/api-server/src/seed.ts` — curated historical drum data
- **API routes**: `artifacts/api-server/src/routes/` — eras, genres, drummers, songs, search
- **Musixmatch service**: `artifacts/api-server/src/services/musixmatch.ts` — graceful fallback when key absent
- **Mobile app**: `artifacts/groove-atlas/` — Expo app with parchment design system
- **Mobile colors**: `artifacts/groove-atlas/constants/colors.ts` — parchment palette tokens
- **Static data types**: `artifacts/groove-atlas/constants/data.ts` — TypeScript types only (data served from API)

## Architecture decisions

- Frontend-first build: the mobile app uses React Query hooks generated from the OpenAPI spec. All data is served from PostgreSQL via the Express API.
- Musixmatch integration is stubbed gracefully — the service returns `null` for `lyricsSnippet` when no API key is set, and enriches song data when `MUSIXMATCH_API_KEY` is present.
- Static seed data mirrors what was originally in `constants/data.ts` to maintain consistency across frontend and backend. The frontend now fetches from the API rather than importing static arrays.
- Parchment visual identity: single light theme (no dark mode), system `serif` font for headings, Inter for body.
- Android is the primary native target; web preview works via Expo Web.

## Environment Variables / Secrets

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string (auto-provisioned) |
| `MUSIXMATCH_API_KEY` | No | Musixmatch API key for lyrics enrichment. When set, song detail responses include a `lyricsSnippet`. Register at https://developer.musixmatch.com |

## Product

- **Explore tab**: World atlas globe with genre origin dots, decade timeline, era info, featured drummers
- **Eras tab**: Browse 8 decades (1940s–2010s) with characteristics and key recordings
- **Genres tab**: 10 genres mapped to geographic origins
- **Search tab**: Full-text search across all entities
- **Detail screens**: Rich drummer profiles (bio, BPM range, signature style, legacy), song detail with groove characteristics and Songsterr deep-links, era and genre deep-dives

## Gotchas

- After any DB schema change, run `pnpm --filter @workspace/db run push` then re-seed with `pnpm --filter @workspace/api-server run seed`
- After any OpenAPI spec change, run `pnpm --filter @workspace/api-spec run codegen` and restart the Expo workflow
- The `sheila-e` drummer data uses the Sheila E. band role for "Let's Go Crazy" (not Bobby Z, who was the primary drummer on many Prince tracks)
- Expo app uses `setBaseUrl` from `@workspace/api-client-react` in `_layout.tsx` to point to the correct API domain

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._
