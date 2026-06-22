# Groove Atlas

> Explore eight decades of drum history — 169 drummers, 407 songs, and live audio intelligence in your pocket.

Groove Atlas is a mobile-first encyclopedia of drumming spanning the 1940s through today across jazz, funk, rock, latin, soul, hip-hop, and more.

---

## What it does

- **Drummer profiles** — era, genre, rhythm style, key contemporaries, and streaming stats
- **Song pages** — BPM, energy, moods, a 30-second audio preview, and an isolated drum stem you can listen to on demand
- **Era browsing** — navigate eight decades of percussion history with curated highlights per decade
- **Full-text search** — find any drummer, song, era, or genre instantly

---

## Stack

| Layer | Technology |
|---|---|
| Mobile app | Expo (React Native) · iOS, Android, Web |
| Data fetching | graphql-request · TanStack Query |
| API server | GraphQL Yoga · Node.js (ESM) |
| Search | Typesense (local binary, indexed on startup) |
| Core data | Static JSON — no database |
| Build | esbuild |
| Platform | Replit |

### Five live APIs

| API | Role |
|---|---|
| [Cyanite](https://cyanite.ai) | Audio AI — BPM, energy, moods, sonic fingerprints |
| [Songstats](https://songstats.com) | Streaming stats — Spotify listeners, radio plays |
| [LALAL.AI](https://lalal.ai) | Stem separation — isolates the drum track on demand |
| [Musixmatch](https://musixmatch.com) | Song metadata — ISRC, genres, catalogue enrichment |
| [Deezer](https://developers.deezer.com) | 30-second previews to feed stem extraction |

---

## Project structure

```
artifacts/
  groove-atlas/       # Expo mobile app
  api-server/         # GraphQL Yoga API + Typesense
  groove-atlas-deck/  # Hackathon pitch deck (React/Vite slides)
lib/
  db/                 # Shared workspace utilities
tools/
  typesense/          # Typesense server binary
```

---

## Running locally

This project is designed to run on [Replit](https://replit.com). All workflows are pre-configured.

To run manually:

```bash
# Install dependencies
pnpm install

# Start the API server (GraphQL + Typesense)
pnpm --filter @workspace/api-server run dev

# Start the mobile app
pnpm --filter @workspace/groove-atlas run dev
```

The API server runs on port `8080` and exposes a GraphQL endpoint at `/api/graphql`.

---

## Environment variables

The following API keys are required (set as Replit secrets or `.env`):

| Variable | Service |
|---|---|
| `CYANITE_TOKEN` | Cyanite audio AI |
| `SONGSTATS_API_KEY` | Songstats streaming stats |
| `LALAL_AI_KEY` | LALAL.AI stem separation |
| `MUSICMATCH_API_KEY` | Musixmatch metadata |

---

## License

Copyright © 2026 Matt Jagiello. All rights reserved.  
See [LICENSE](./LICENSE) for details.
