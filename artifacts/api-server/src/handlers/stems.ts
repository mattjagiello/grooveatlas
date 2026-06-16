import type { IncomingMessage, ServerResponse } from "node:http";
import { findSong } from "../data/index.js";
import { findPreviewUrl } from "../services/deezer.js";
import {
  uploadAudio,
  requestDrumSplit,
  checkTask,
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

// POST /stems/start — fast: find preview, upload, enqueue split, return taskId immediately
export async function handleStemsStart(
  req: IncomingMessage,
  res: ServerResponse
) {
  if (req.method !== "POST") return jsonError(res, "ERROR", "Method not allowed");

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

  // 1. Find a 30s preview via Deezer
  const preview = await findPreviewUrl(song.title, song.artist);
  if (!preview) {
    return jsonError(res, "NO_PREVIEW", "No preview audio found for this track on Deezer");
  }
  logger.info({ previewTitle: preview.title }, "Deezer preview found");

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

  // 4. Request drum stem split — returns task ID immediately
  let taskId: string;
  try {
    taskId = await requestDrumSplit(sourceId);
  } catch (err) {
    if (err instanceof LalalPremiumError) {
      return jsonError(res, "PREMIUM_REQUIRED", "Drum isolation requires a premium LALAL.AI license");
    }
    logger.error({ err }, "LALAL split request failed");
    return jsonError(res, "ERROR", "Stem split request failed");
  }
  logger.info({ taskId }, "Drum split enqueued — returning task ID");

  return json(res, {
    ok: true,
    taskId,
    previewTitle: preview.title,
    songId,
    songTitle: song.title,
    artist: song.artist,
  });
}

// GET /stems/status?taskId=xxx — quick poll, returns processing/success/error
export async function handleStemsStatus(
  req: IncomingMessage,
  res: ServerResponse
) {
  if (req.method !== "GET") return jsonError(res, "ERROR", "Method not allowed");

  const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
  const taskId = url.searchParams.get("taskId");
  if (!taskId) return jsonError(res, "ERROR", "taskId required");

  try {
    const result = await checkTask(taskId);
    logger.info({ taskId, status: result.status }, "Stem status checked");
    return json(res, { ok: true, ...result });
  } catch (err) {
    logger.error({ err, taskId }, "Status check failed");
    return jsonError(res, "ERROR", String(err));
  }
}
