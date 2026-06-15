---
name: Expo + pnpm monorepo Metro config
description: How to configure metro.config.js in an Expo app inside a pnpm workspace monorepo.
---

Only add `watchFolders` pointing to the workspace root. Do NOT add `nodeModulesPaths` with the workspace root — that causes Metro to find React/react-native at two paths, triggering "Invalid hook call / multiple React copies" errors.

**Why:** pnpm creates symlinks in each package's `node_modules`. Metro follows these symlinks and deduplicates by real path automatically. Adding `nodeModulesPaths: [workspaceRoot]` makes Metro find packages at two different symlink paths before deduplication, breaking React's singleton assumption.

**How to apply:**
```js
const config = getDefaultConfig(projectRoot);
config.watchFolders = [workspaceRoot]; // just this, nothing else
module.exports = config;
```

The `disableHierarchicalLookup` and `resolver.resolveRequest` overrides both caused further breakage — avoid them.
