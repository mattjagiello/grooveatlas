import type { IncomingMessage, ServerResponse } from "node:http";
import { findSong } from "../data/index.js";
import { findPreviewUrl } from "../services/deezer.js";
import {
  requestUploadUrl,
  uploadToS3,
  createLibraryTrack,
  enqueueLibraryTrack,
  checkAnalysis,
} from "../services/cyanite.js";
import { getCached, setCached } from "../lib/cyanite-cache.js";
import { logger } from "../lib/logger.js";

// In-memory map: trackId → songId, so status endpoint can write to cache
const pending = new Map<string, string>();

function readBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function json(res: ServerResponse, body: unknown) {
  const payload = JSON.stringify(body);
  res.writeHead(200, { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(payload) });
  res.end(payload);
}

function jsonError(res: ServerResponse, code: string, error: string) {
  return json(res, { ok: false, code, error });
}

// GET /cyanite/peek?songId=xxx — instant cache check, no analysis triggered
export function handleCyanitePeek(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "GET") return jsonError(res, "ERROR", "Method not allowed");
  const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
  const songId = url.searchParams.get("songId");
  if (!songId) return jsonError(res, "ERROR", "songId required");
  const cached = getCached(songId);
  return json(res, { ok: true, cached: !!cached, analysis: cached ?? null });
}

// POST /cyanite/start
export async function handleCyaniteStart(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "POST") return jsonError(res, "ERROR", "Method not allowed");

  let body: { songId?: string };
  try {
    body = JSON.parse((await readBody(req)).toString());
  } catch {
    return jsonError(res, "ERROR", "Invalid JSON body");
  }

  const { songId } = body;
  if (!songId) return jsonError(res, "ERROR", "songId required");

  const song = findSong(songId);
  if (!song) return jsonError(res, "ERROR", "Song not found");

  // --- Cache hit: return immediately, no API call needed ---
  const cached = getCached(songId);
  if (cached) {
    logger.info({ songId }, "Cyanite cache hit");
    return json(res, { ok: true, cached: true, analysis: cached });
  }

  logger.info({ songId, title: song.title }, "Cyanite analysis requested");

  const preview = await findPreviewUrl(song.title, song.artist);
  if (!preview) return jsonError(res, "NO_PREVIEW", "No preview audio found for this track");
  logger.info({ previewTitle: preview.title }, "Deezer preview found");

  let audioBuffer: Buffer;
  try {
    const r = await fetch(preview.previewUrl);
    if (!r.ok) throw new Error("Download failed");
    audioBuffer = Buffer.from(await r.arrayBuffer());
  } catch (err) {
    logger.error({ err }, "Preview download failed");
    return jsonError(res, "ERROR", "Failed to download preview audio");
  }
  logger.info({ bytes: audioBuffer.length }, "Preview downloaded");

  let trackId: string;
  try {
    const { id: uploadId, uploadUrl } = await requestUploadUrl();
    await uploadToS3(audioBuffer, uploadUrl);
    const libTrackId = await createLibraryTrack(`${song.title} — ${song.artist}`, uploadId);
    await enqueueLibraryTrack(libTrackId);
    trackId = libTrackId;
  } catch (err) {
    logger.error({ err }, "Cyanite upload/enqueue failed");
    return jsonError(res, "ERROR", String(err));
  }

  // Remember which song this track belongs to for cache write on completion
  pending.set(trackId, songId);
  logger.info({ trackId }, "Cyanite track enqueued");

  return json(res, {
    ok: true,
    cached: false,
    trackId,
    previewTitle: preview.title,
    songId,
    songTitle: song.title,
    artist: song.artist,
  });
}

// GET /cyanite/status?trackId=xxx
export async function handleCyaniteStatus(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "GET") return jsonError(res, "ERROR", "Method not allowed");

  const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
  const trackId = url.searchParams.get("trackId");
  if (!trackId) return jsonError(res, "ERROR", "trackId required");

  try {
    const result = await checkAnalysis(trackId);
    logger.info({ trackId, status: result.status }, "Cyanite status checked");

    // Write to cache when analysis is finished
    if (result.status === "finished") {
      const songId = pending.get(trackId);
      if (songId) {
        setCached(songId, result.analysis);
        pending.delete(trackId);
        logger.info({ songId, trackId }, "Cyanite result cached");
      }
    }

    return json(res, { ok: true, ...result });
  } catch (err) {
    logger.error({ err, trackId }, "Cyanite status check failed");
    return jsonError(res, "ERROR", String(err));
  }
}
