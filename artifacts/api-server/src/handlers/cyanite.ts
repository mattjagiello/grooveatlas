import type { IncomingMessage, ServerResponse } from "node:http";
import { findSong } from "../data/index.js";
import { fetchTrackMeta } from "../services/musixmatch.js";
import { analyzeSpotifyTrack, isCyaniteConfigured } from "../services/cyanite.js";
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

export async function handleCyaniteAnalysis(
  req: IncomingMessage,
  res: ServerResponse
) {
  if (req.method !== "GET") return jsonError(res, "ERROR", "Method not allowed");

  if (!isCyaniteConfigured()) {
    return jsonError(res, "NOT_CONFIGURED", "Cyanite not yet activated");
  }

  const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
  const songId = url.searchParams.get("songId");
  if (!songId) return jsonError(res, "ERROR", "songId required");

  const song = findSong(songId);
  if (!song) return jsonError(res, "ERROR", "Song not found");

  let spotifyId = url.searchParams.get("spotifyId") ?? null;

  if (!spotifyId) {
    try {
      const meta = await fetchTrackMeta(song.title, song.artist);
      spotifyId = meta?.spotifyId ?? null;
    } catch (err) {
      logger.warn({ err }, "Musicmatch lookup failed when resolving Spotify ID");
    }
  }

  if (!spotifyId) {
    return jsonError(res, "NO_SPOTIFY_ID", "No Spotify ID found for this track");
  }

  logger.info({ songId, spotifyId }, "Cyanite: starting analysis");

  try {
    const analysis = await analyzeSpotifyTrack(spotifyId);
    return json(res, { ok: true, songId, spotifyId, ...analysis });
  } catch (err) {
    logger.error({ err, songId }, "Cyanite analysis failed");
    return jsonError(res, "ANALYSIS_FAILED", String(err));
  }
}
