import type { IncomingMessage, ServerResponse } from "node:http";
import { findSong } from "../data/index.js";
import { fetchTrackMeta } from "../services/musixmatch.js";
import { analyzeSpotifyTrack, isCyaniteConfigured } from "../services/cyanite.js";
import { logger } from "../lib/logger.js";

function json(res: ServerResponse, status: number, body: unknown) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(payload),
  });
  res.end(payload);
}

export async function handleCyaniteAnalysis(
  req: IncomingMessage,
  res: ServerResponse
) {
  if (req.method !== "GET") return json(res, 405, { error: "Method not allowed" });

  if (!isCyaniteConfigured()) {
    return json(res, 503, { error: "Cyanite not yet activated", code: "NOT_CONFIGURED" });
  }

  const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
  const songId = url.searchParams.get("songId");
  if (!songId) return json(res, 400, { error: "songId required" });

  const song = findSong(songId);
  if (!song) return json(res, 404, { error: "Song not found" });

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
    return json(res, 422, {
      error: "No Spotify ID found for this track",
      code: "NO_SPOTIFY_ID",
    });
  }

  logger.info({ songId, spotifyId }, "Cyanite: starting analysis");

  try {
    const analysis = await analyzeSpotifyTrack(spotifyId);
    return json(res, 200, { songId, spotifyId, ...analysis });
  } catch (err) {
    logger.error({ err, songId }, "Cyanite analysis failed");
    return json(res, 502, { error: String(err), code: "ANALYSIS_FAILED" });
  }
}
