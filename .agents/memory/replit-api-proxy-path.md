---
name: Replit API proxy path prefix
description: api-server artifact routes and how clients must construct URLs
---

The api-server artifact (`.replit-artifact/artifact.toml`) has:

```toml
[[services]]
localPort = 8080
paths = ["/api"]
```

Replit's proxy routes all requests whose path starts with `/api` to local port 8080, **stripping the `/api` prefix** before forwarding. So the server handles `/graphql`, `/health`, etc. at its local port — no prefix needed server-side.

**Why:** Client URLs must include the `/api` prefix to reach the api-server through the shared proxy domain (`REPLIT_DEV_DOMAIN`). Without it, requests go to whatever other service handles the root path (e.g. the Expo dev server or mockup-sandbox).

**How to apply:** In `lib/gql-client.ts` (and any other API clients):
```ts
const BASE = domain ? `https://${domain}/api` : 'http://localhost:8080';
```

The `localhost:8080` fallback (for native/direct access) omits the prefix since it hits the server directly.
