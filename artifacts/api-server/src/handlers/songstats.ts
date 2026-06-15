import type { IncomingMessage, ServerResponse } from "node:http";
import { findDrummer } from "../data/index.js";
import { fetchArtistStatsByName } from "../services/songstats.js";
import { logger } from "../lib/logger.js";

function json(res: ServerResponse, body: unknown) {
  const payload = JSON.stringify(body);
  res.writeHead(200, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(payload),
  });
  res.end(payload);
}

function jsonError(res: ServerResponse, code: string, error: string) {
  return json(res, { ok: false, code, error });
}

export async function handleSongstatsArtist(
  req: IncomingMessage,
  res: ServerResponse
) {
  if (req.method !== "GET") return jsonError(res, "ERROR", "Method not allowed");

  if (!process.env.SONGSTATS_API_KEY) {
    return jsonError(res, "NOT_CONFIGURED", "Songstats not configured");
  }

  const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
  const drummerId = url.searchParams.get("drummerId");
  if (!drummerId) return jsonError(res, "ERROR", "drummerId required");

  const drummer = findDrummer(drummerId);
  if (!drummer) return jsonError(res, "ERROR", "Drummer not found");

  const bands: string[] = drummer.bands ?? [];
  const primaryBand = bands.find(
    (b) => !b.toLowerCase().includes("session") && !b.toLowerCase().includes("no primary")
  ) ?? bands[0];

  if (!primaryBand) {
    return jsonError(res, "NO_BAND", "No band found for this drummer");
  }

  logger.info({ drummerId, primaryBand }, "Songstats: fetching artist stats");

  try {
    const stats = await fetchArtistStatsByName(primaryBand);
    if (!stats) {
      return jsonError(res, "NOT_FOUND", `No Songstats data found for "${primaryBand}"`);
    }
    logger.info({ drummerId, band: stats.name }, "Songstats: stats retrieved");
    return json(res, { ok: true, drummerId, band: primaryBand, ...stats });
  } catch (err) {
    logger.error({ err, drummerId }, "Songstats fetch failed");
    return jsonError(res, "ERROR", String(err));
  }
}
