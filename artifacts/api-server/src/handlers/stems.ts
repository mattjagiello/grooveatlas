import type { IncomingMessage, ServerResponse } from "node:http";
import { findSong } from "../data/index.js";
import { findPreviewUrl } from "../services/deezer.js";
import {
  uploadAudio,
  requestDrumSplit,
  pollForResult,
  LalalPremiumError,
} from "../services/lalal.js";
import { logger } from "../lib/logger.js";

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
  res.writeHead(200, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(payload),
  });
  res.end(payload);
}

function jsonError(res: ServerResponse, code: string, error: string) {
  return json(res, { ok: false, code, error });
}

export async function handleStemsExtract(
  req: IncomingMessage,
  res: ServerResponse
) {
  if (req.method !== "POST") {
    return jsonError(res, "ERROR", "Method not allowed");
  }

  let body: { songId?: string };
  try {
    const raw = await readBody(req);
    body = JSON.parse(raw.toString());
  } catch {
    return jsonError(res, "ERROR", "Invalid JSON body");
  }

  const { songId } = body;
  if (!songId) return jsonError(res, "ERROR", "songId required");

  const song = findSong(songId);
  if (!song) return jsonError(res, "ERROR", "Song not found");

  logger.info({ songId, title: song.title }, "Stem extraction requested");

  // 1. Find a 30s preview via Deezer (no key needed)
  const preview = await findPreviewUrl(song.title, song.artist);
  if (!preview) {
    return jsonError(res, "NO_PREVIEW", "No preview audio found for this track on Deezer");
  }

  logger.info({ previewUrl: preview.previewUrl }, "Deezer preview found");

  // 2. Download the preview MP3
  let audioBuffer: Buffer;
  try {
    const audioRes = await fetch(preview.previewUrl);
    if (!audioRes.ok) throw new Error("Failed to download preview");
    audioBuffer = Buffer.from(await audioRes.arrayBuffer());
  } catch (err) {
    logger.error({ err }, "Failed to download Deezer preview");
    return jsonError(res, "ERROR", "Failed to download preview audio");
  }

  logger.info({ bytes: audioBuffer.length }, "Preview downloaded");

  // 3. Upload to LALAL.AI
  let sourceId: string;
  try {
    sourceId = await uploadAudio(audioBuffer, `${songId}-preview.mp3`);
  } catch (err) {
    logger.error({ err }, "LALAL upload failed");
    return jsonError(res, "ERROR", "Failed to upload audio to LALAL.AI");
  }

  logger.info({ sourceId }, "Uploaded to LALAL.AI");

  // 4. Request drum stem split
  let taskId: string;
  try {
    taskId = await requestDrumSplit(sourceId);
  } catch (err) {
    if (err instanceof LalalPremiumError) {
      logger.warn("LALAL premium required — key not yet upgraded");
      return jsonError(res, "PREMIUM_REQUIRED", "Drum isolation requires a premium LALAL.AI license");
    }
    logger.error({ err }, "LALAL split request failed");
    return jsonError(res, "ERROR", "Stem split request failed");
  }

  logger.info({ taskId }, "Drum split requested");

  // 5. Poll until done (up to 2 minutes for a 30s clip)
  try {
    const result = await pollForResult(taskId);
    logger.info({ taskId }, "Drum stem ready");
    return json(res, {
      ok: true,
      songId,
      songTitle: song.title,
      artist: song.artist,
      previewTitle: preview.title,
      drumUrl: result.drumUrl,
      accompanimentUrl: result.accompanimentUrl,
    });
  } catch (err) {
    logger.error({ err, taskId }, "Polling failed");
    return jsonError(res, "ERROR", String(err));
  }
}
