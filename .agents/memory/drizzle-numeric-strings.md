---
name: Drizzle numeric type returns strings
description: Drizzle ORM returns PostgreSQL numeric columns as JS strings, not numbers.
---

PostgreSQL `numeric` / `decimal` columns selected via Drizzle ORM come back as JavaScript strings (e.g., `"6.5"` not `6.5`). If the OpenAPI spec defines these as `number`, the API response won't match unless you explicitly parse them.

**Why:** Drizzle preserves PostgreSQL's full precision for `numeric` by returning a string. This avoids floating-point loss, but breaks type contracts.

**How to apply:** In the route handler, map over the result and parse affected columns with `Number()`:
```ts
res.json(rows.map(r => ({ ...r, lat: Number(r.lat), lng: Number(r.lng) })));
```
Affects: any latitude/longitude, price, percentage, or similar `numeric` column.
