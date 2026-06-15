---
name: Groove Atlas stack
description: Architecture decisions for the Groove Atlas data/API layer after PostgreSQL removal.
---

# Groove Atlas Stack

## Architecture
Static JSON files → Typesense binary (port 8108, spawned by Node on startup) → GraphQL Yoga HTTP server (port 8080, `/graphql`) → `graphql-request` + React Query in Expo mobile app.

## Key decisions

**esbuild + JSON data files**: Must use static ESM `import` statements (e.g. `import erasData from './eras.json' assert { type: "json" }`) so esbuild bundles the JSON inline into `dist/index.mjs`. Using `createRequire()` at runtime fails because the built bundle looks for the JSON file relative to `dist/` but the file only exists in `src/data/`.

**Why:** esbuild only follows statically-analyzable imports. `createRequire` is a runtime call, so esbuild can't see the dependency and doesn't copy/bundle the file.

**No express**: The api-server uses Node.js `http.createServer` + GraphQL Yoga's `.handle()` method. Yoga provides its own CORS and routing. Removing express shrank the dep tree significantly.

**GraphQL URL in Expo**: `https://${EXPO_PUBLIC_DOMAIN}/graphql` — the api-server is port 8080 which maps to the Replit external port 8080 (root domain). Set via `EXPO_PUBLIC_DOMAIN=$REPLIT_DEV_DOMAIN` in the expo workflow command.

**How to apply:** Any time JSON data files are needed in the api-server bundle, use static imports. If adding new data JSON files, they auto-bundle via esbuild with no build script changes needed.
