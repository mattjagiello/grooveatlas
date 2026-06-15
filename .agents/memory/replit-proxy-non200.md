---
name: Replit proxy strips non-200 bodies
description: The Replit reverse proxy silently drops response bodies for non-200 HTTP status codes forwarded from artifact services.
---

When an artifact's service (e.g. the API server on port 8080) returns a non-200 HTTP status (4xx / 5xx), the Replit proxy forwards the status code to the browser but strips the response body. The client receives an empty body and `JSON.parse('')` throws "unexpected end of data".

**Why:** Observed in production when LALAL.AI handlers returned 402 and Cyanite returned 503 — server logs confirmed correct JSON was sent, but browser clients got empty bodies.

**How to apply:** All REST handlers in artifact services must always respond with HTTP 200. Encode success/failure in the body using an `ok: boolean` field (and `code` + `error` fields for failures). Never rely on HTTP status codes to signal errors through the Replit proxy.

Example body shape:
- Success: `{ ok: true, ...data }`
- Error: `{ ok: false, code: 'PREMIUM_REQUIRED', error: 'Human-readable message' }`

Client-side check: `if (data.ok === false) { /* handle error */ }`
