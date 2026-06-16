---
name: Replit proxy keeps /api prefix
description: The Replit proxy forwards /api/* to the API server port WITHOUT stripping the /api prefix. Explicit route checks must normalize the path.
---

## The rule
In `app.ts`, normalize the pathname before routing:
```typescript
const path = url.pathname.replace(/^\/api/, "") || "/";
```
Then use `path` (not `url.pathname`) in all route checks.

**Why:** The mobile client constructs `API_BASE = https://${domain}/api`, so all REST calls hit paths like `/api/stems/extract`. The Replit proxy forwards these to port 8080 as-is. Without normalization, explicit routes like `/stems/extract` never match — the request falls through to GraphQL Yoga, which returns a 404 with an empty body. `res.json()` on an empty body throws `SyntaxError: Unexpected end of JSON input`, which is the "syntax error" the user sees.

**How to apply:** Any time a new REST route is added to `app.ts`, use `path` (the normalized variable) for the check, not `url.pathname`. GraphQL Yoga as the catch-all is unaffected because it handles any path.
