import { spawn } from "child_process";
import path from "path";
import { eras, genres, drummers, songs } from "../data/index.js";
import tsClient, { TYPESENSE_API_KEY, TYPESENSE_PORT } from "./client.js";
import { logger } from "../lib/logger.js";

const WORKSPACE_ROOT = path.resolve(__dirname, "..", "..", "..");
const BINARY = path.join(
  WORKSPACE_ROOT,
  "tools",
  "typesense",
  "typesense-server",
);
const DATA_DIR = path.join(WORKSPACE_ROOT, ".typesense-data");

async function waitForTypesense(maxMs = 15_000): Promise<void> {
  const deadline = Date.now() + maxMs;
  while (Date.now() < deadline) {
    try {
      await tsClient.health.retrieve();
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 300));
    }
  }
  throw new Error("Typesense did not become ready in time");
}

function spawnTypesense(): void {
  const proc = spawn(
    BINARY,
    [
      `--data-dir=${DATA_DIR}`,
      `--api-key=${TYPESENSE_API_KEY}`,
      `--listen-port=${TYPESENSE_PORT}`,
      "--enable-cors",
    ],
    { detached: false, stdio: "ignore" },
  );
  proc.on("error", (err) => {
    logger.warn({ err }, "Typesense process error");
  });
}

async function ensureCollection(
  name: string,
  fields: object[],
): Promise<void> {
  try {
    await tsClient.collections(name).retrieve();
  } catch {
    await tsClient.collections().create({ name, fields } as any);
  }
}

async function indexAll(): Promise<void> {
  await ensureCollection("eras", [
    { name: "id", type: "string" },
    { name: "name", type: "string" },
    { name: "subtitle", type: "string" },
    { name: "years", type: "string" },
    { name: "description", type: "string" },
    { name: "color", type: "string", index: false, optional: true },
    { name: "characteristics", type: "string[]" },
    { name: "keyDrummerIds", type: "string[]", optional: true },
    { name: "iconicSongIds", type: "string[]", optional: true },
  ]);

  await ensureCollection("genres", [
    { name: "id", type: "string" },
    { name: "name", type: "string" },
    { name: "origin", type: "string" },
    { name: "era", type: "string" },
    { name: "description", type: "string" },
    { name: "color", type: "string", index: false, optional: true },
    { name: "characteristics", type: "string[]" },
    { name: "keyDrummerIds", type: "string[]", optional: true },
    { name: "iconicSongIds", type: "string[]", optional: true },
    { name: "lat", type: "float" },
    { name: "lng", type: "float" },
  ]);

  await ensureCollection("drummers", [
    { name: "id", type: "string" },
    { name: "name", type: "string" },
    { name: "bio", type: "string" },
    { name: "signatureStyle", type: "string" },
    { name: "influence", type: "string" },
    { name: "primaryEra", type: "string", facet: true },
    { name: "eras", type: "string[]", facet: true },
    { name: "genres", type: "string[]", facet: true },
    { name: "bands", type: "string[]" },
    { name: "born", type: "int32" },
    { name: "died", type: "int32", optional: true },
    { name: "bpmMin", type: "int32" },
    { name: "bpmMax", type: "int32" },
    { name: "iconicSongIds", type: "string[]", optional: true },
  ]);

  await ensureCollection("songs", [
    { name: "id", type: "string" },
    { name: "title", type: "string" },
    { name: "artist", type: "string" },
    { name: "feel", type: "string" },
    { name: "description", type: "string" },
    { name: "whyStudy", type: "string" },
    { name: "drummerId", type: "string", facet: true },
    { name: "eraId", type: "string", facet: true },
    { name: "genreIds", type: "string[]", facet: true },
    { name: "year", type: "int32" },
    { name: "tempo", type: "int32" },
    { name: "complexity", type: "int32" },
    { name: "songsterrSlug", type: "string", optional: true },
    { name: "lyricsSnippet", type: "string", optional: true },
  ]);

  const upsert = async (
    collection: string,
    docs: object[],
  ): Promise<void> => {
    await tsClient
      .collections(collection)
      .documents()
      .import(docs, { action: "upsert" });
  };

  await Promise.all([
    upsert("eras", eras),
    upsert("genres", genres),
    upsert(
      "drummers",
      drummers.map((d) => ({
        ...d,
        died: d.died ?? undefined,
        lyricsSnippet: undefined,
      })),
    ),
    upsert(
      "songs",
      songs.map((s) => ({
        ...s,
        songsterrSlug: s.songsterrSlug ?? undefined,
        lyricsSnippet: s.lyricsSnippet ?? undefined,
      })),
    ),
  ]);

  logger.info("Typesense: all data indexed");
}

export async function initTypesense(): Promise<void> {
  spawnTypesense();
  logger.info("Typesense: waiting for server...");
  await waitForTypesense();
  logger.info("Typesense: server ready, indexing data...");
  await indexAll();
}
