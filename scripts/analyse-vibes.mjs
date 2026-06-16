#!/usr/bin/env node
/**
 * Groove Atlas — Cyanite Batch Vibe Analyser
 *
 * Analyses every song's 30s Deezer preview via Cyanite and writes results to
 *   artifacts/api-server/src/data/cyanite-cache.json
 *
 * Already-cached songs are skipped automatically — safe to re-run at any time.
 *
 * Usage:
 *   node scripts/analyse-vibes.mjs             # analyse all uncached songs
 *   node scripts/analyse-vibes.mjs --dry-run   # show what would be analysed
 *   node scripts/analyse-vibes.mjs --limit 20  # analyse up to 20 songs this run
 *
 * Requires: CYANITE_TOKEN env var (set in Replit secrets, already available)
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SONGS_PATH   = join(__dirname, "../artifacts/api-server/src/data/songs.json");
const CACHE_PATH   = join(__dirname, "../artifacts/api-server/src/data/cyanite-cache.json");
const CYANITE_URL  = "https://api.cyanite.ai/graphql";
const DEEZER_URL   = "https://api.deezer.com/search";
const DELAY_MS     = 2000;   // pause between songs (be polite to APIs)
const POLL_MS      = 5000;   // how often to check analysis status
const MAX_POLL_MS  = 3 * 60 * 1000; // 3 min timeout per song

const TOKEN = process.env.CYANITE_TOKEN;
if (!TOKEN) { console.error("❌  CYANITE_TOKEN not set"); process.exit(1); }

// --- Args ---
const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const limitIdx = args.indexOf("--limit");
const LIMIT = limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) : Infinity;

// --- Helpers ---
function loadJson(path) {
  try { return existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : {}; }
  catch { return {}; }
}

function saveCache(cache) {
  writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function elapsed(startMs) {
  return `${Math.round((Date.now() - startMs) / 1000)}s`;
}

// --- Cyanite GraphQL ---
async function gql(query, variables) {
  const res = await fetch(CYANITE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ query, variables }),
  });
  const data = await res.json();
  if (data.errors?.length) throw new Error(data.errors[0].message);
  return data.data;
}

// --- Deezer preview lookup ---
async function findPreview(title, artist) {
  const q = encodeURIComponent(`${title} ${artist}`);
  const res = await fetch(`${DEEZER_URL}?q=${q}&limit=5`);
  const data = await res.json();
  const tracks = data.data ?? [];
  for (const t of tracks) {
    if (t.preview && t.preview.length > 10) {
      return { previewUrl: t.preview, title: t.title };
    }
  }
  return null;
}

// --- Cyanite upload + enqueue ---
async function uploadAndEnqueue(audioBuffer, label) {
  const { fileUploadRequest } = await gql(`mutation { fileUploadRequest { id uploadUrl } }`);
  const s3Res = await fetch(fileUploadRequest.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": "audio/mpeg" },
    body: audioBuffer,
  });
  if (!s3Res.ok) throw new Error(`S3 upload failed: ${s3Res.status}`);

  const createData = await gql(
    `mutation C($title: String!, $uploadId: ID!) {
       libraryTrackCreate(input: { title: $title, uploadId: $uploadId }) {
         ... on LibraryTrackCreateSuccess { createdLibraryTrack { id } }
         ... on LibraryTrackCreateError { message }
       }
     }`,
    { title: label, uploadId: fileUploadRequest.id }
  );
  const createResult = createData.libraryTrackCreate;
  if (!createResult.createdLibraryTrack) throw new Error(createResult.message ?? "Create failed");
  const trackId = createResult.createdLibraryTrack.id;

  const enqueueData = await gql(
    `mutation E($id: ID!) {
       libraryTrackEnqueue(input: { libraryTrackId: $id }) {
         ... on LibraryTrackEnqueueSuccess { enqueuedLibraryTrack { id } }
         ... on LibraryTrackEnqueueError { message }
       }
     }`,
    { id: trackId }
  );
  if (!enqueueData.libraryTrackEnqueue.enqueuedLibraryTrack) {
    throw new Error(enqueueData.libraryTrackEnqueue.message ?? "Enqueue failed");
  }
  return trackId;
}

// --- Poll until finished ---
async function pollAnalysis(trackId, songLabel, startMs) {
  while (Date.now() - startMs < MAX_POLL_MS) {
    await sleep(POLL_MS);
    const data = await gql(
      `query G($id: ID!) {
         libraryTrack(id: $id) {
           __typename
           ... on LibraryTrack {
             audioAnalysisV6 {
               __typename
               ... on AudioAnalysisV6Finished {
                 result {
                   bpmPrediction { value }
                   valence arousal energyLevel energyDynamics
                   moodTags genreTags musicalEraTag transformerCaption
                   advancedInstrumentTags
                 }
               }
               ... on AudioAnalysisV6Failed { error { message } }
             }
           }
         }
       }`,
      { id: trackId }
    );

    const track = data.libraryTrack;
    if (track.__typename !== "LibraryTrack") throw new Error("Track not found");
    const av6 = track.audioAnalysisV6;
    if (!av6) continue;

    if (av6.__typename === "AudioAnalysisV6Finished") {
      const r = av6.result;
      return {
        bpm: Math.round(r.bpmPrediction?.value ?? 0),
        valence: r.valence ?? 0,
        arousal: r.arousal ?? 0,
        energyLevel: r.energyLevel ?? "",
        energyDynamics: r.energyDynamics ?? "",
        moodTags: r.moodTags ?? [],
        genreTags: r.genreTags ?? [],
        musicalEraTag: r.musicalEraTag ?? "",
        transformerCaption: r.transformerCaption ?? null,
        instrumentTags: r.advancedInstrumentTags ?? [],
      };
    }
    if (av6.__typename === "AudioAnalysisV6Failed") {
      throw new Error(av6.error?.message ?? "Analysis failed");
    }
    process.stdout.write(`\r  ⏳  ${songLabel} — waiting… (${elapsed(startMs)})`);
  }
  throw new Error("Timeout after 3 minutes");
}

// --- Main ---
async function main() {
  const songs = JSON.parse(readFileSync(SONGS_PATH, "utf8"));
  const cache = loadJson(CACHE_PATH);

  const uncached = songs.filter((s) => !cache[s.id]);
  const toProcess = uncached.slice(0, LIMIT);

  console.log(`\n🎛  Groove Atlas — Cyanite Vibe Analyser`);
  console.log(`   Songs total:   ${songs.length}`);
  console.log(`   Already cached: ${songs.length - uncached.length}`);
  console.log(`   To analyse:    ${toProcess.length}${LIMIT < Infinity ? ` (--limit ${LIMIT})` : ""}`);
  if (DRY_RUN) {
    console.log(`\n   DRY RUN — no API calls will be made`);
    toProcess.forEach((s, i) => console.log(`   [${i + 1}] ${s.title} — ${s.artist}`));
    return;
  }
  if (toProcess.length === 0) {
    console.log(`\n✅  All songs are already cached. Nothing to do.\n`);
    return;
  }
  console.log(`\n   Starting… (Ctrl+C to stop — progress is saved after each song)\n`);

  let done = 0, failed = 0;

  for (let i = 0; i < toProcess.length; i++) {
    const song = toProcess[i];
    const label = `"${song.title}" — ${song.artist}`;
    const prefix = `[${i + 1}/${toProcess.length}]`;
    process.stdout.write(`${prefix} ${label}\n`);

    const songStart = Date.now();
    try {
      // 1. Find preview
      const preview = await findPreview(song.title, song.artist);
      if (!preview) {
        console.log(`  ⚠️  No Deezer preview found — skipping`);
        failed++;
        continue;
      }

      // 2. Download
      const audioRes = await fetch(preview.previewUrl);
      if (!audioRes.ok) throw new Error(`Download failed: ${audioRes.status}`);
      const audioBuffer = Buffer.from(await audioRes.arrayBuffer());
      if (audioBuffer.length < 10000) throw new Error("Audio too small — bad preview URL");

      // 3. Upload + enqueue
      const trackId = await uploadAndEnqueue(audioBuffer, `${song.title} — ${song.artist}`);

      // 4. Poll
      const analysis = await pollAnalysis(trackId, label, songStart);

      // 5. Save
      cache[song.id] = analysis;
      saveCache(cache);
      done++;
      process.stdout.write(`\r  ✅  Done (${elapsed(songStart)}) — BPM:${analysis.bpm} energy:${analysis.energyLevel || "?"} moods:[${analysis.moodTags.slice(0,3).join(", ")}]\n`);
    } catch (err) {
      process.stdout.write(`\r  ❌  Failed (${elapsed(songStart)}): ${err.message}\n`);
      failed++;
    }

    if (i < toProcess.length - 1) await sleep(DELAY_MS);
  }

  const finalCached = Object.keys(cache).length;
  console.log(`\n📊  Done — ${done} analysed, ${failed} failed, ${finalCached}/${songs.length} total cached`);
  console.log(`   Cache saved to: ${CACHE_PATH}\n`);
}

main().catch((err) => { console.error("Fatal:", err); process.exit(1); });
