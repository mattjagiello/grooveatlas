import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { CyaniteAnalysis } from "../services/cyanite.js";

// process.cwd() = artifacts/api-server/ whether running from src/ or dist/
export const CACHE_PATH = join(process.cwd(), "src/data/cyanite-cache.json");

type Cache = Record<string, CyaniteAnalysis>;

function load(): Cache {
  try {
    if (!existsSync(CACHE_PATH)) return {};
    return JSON.parse(readFileSync(CACHE_PATH, "utf8")) as Cache;
  } catch {
    return {};
  }
}

let _cache: Cache = load();

export function getCached(songId: string): CyaniteAnalysis | null {
  return _cache[songId] ?? null;
}

export function setCached(songId: string, analysis: CyaniteAnalysis): void {
  _cache[songId] = analysis;
  try {
    writeFileSync(CACHE_PATH, JSON.stringify(_cache, null, 2));
  } catch {
    // Non-fatal — in-memory cache still works for this session
  }
}

export function cacheStats(): { cached: number } {
  return { cached: Object.keys(_cache).length };
}
