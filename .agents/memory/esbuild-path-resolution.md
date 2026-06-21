---
name: esbuild bundle path resolution
description: When api-server is bundled with esbuild, import.meta.url resolves to dist/index.mjs — __dirname-based paths break. Use process.cwd() instead.
---

## Rule
Never use `dirname(fileURLToPath(import.meta.url))` to build paths to data files in the api-server.
esbuild bundles everything into `dist/index.mjs`, so `import.meta.url` points to `dist/`, not `src/`.

**Why:** `join(__dirname, "../data/cyanite-cache.json")` resolves to `api-server/data/cyanite-cache.json`
(doesn't exist) instead of `api-server/src/data/cyanite-cache.json` (the real file).

**How to apply:** Use `process.cwd()` for paths to data files that must survive bundling:
```typescript
import { join } from "node:path";
export const CACHE_PATH = join(process.cwd(), "src/data/cyanite-cache.json");
```

`process.cwd()` is always `artifacts/api-server/` regardless of whether the code runs from `src/` or `dist/`.
This was the root cause of the cyanite cache never being read by the running server (silent miss — the catch block returned `{}`).
