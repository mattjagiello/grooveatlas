#!/usr/bin/env node
/**
 * Groove Atlas — Cyanite Batch Vibe Analyser (V7)
 *
 * Analyses every song's 30s Deezer preview via Cyanite audioAnalysisV7 and
 * writes results to artifacts/api-server/src/data/cyanite-cache.json
 *
 * Already-cached songs are skipped automatically — safe to re-run at any time.
 *
 * Usage:
 *   node scripts/analyse-vibes.mjs             # analyse all uncached songs
 *   node scripts/analyse-vibes.mjs --dry-run   # show what would be analysed
 *   node scripts/analyse-vibes.mjs --limit 20  # analyse up to 20 songs this run
 *   node scripts/analyse-vibes.mjs --stats     # show cache stats and exit
 *
 * Requires: CYANITE_TOKEN env var (set in Replit secrets, already available)
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SONGS_PATH = join(__dirname, "../artifacts/api-server/src/data/songs.json");
const CACHE_PATH = join(__dirname, "../artifacts/api-server/src/data/cyanite-cache.json");
const CYANITE_URL = "https://api.cyanite.ai/graphql";
const DEEZER_URL  = "https://api.deezer.com/search";
const DELAY_MS    = 2000;
const POLL_MS     = 5000;
const MAX_POLL_MS = 3 * 60 * 1000;

const TOKEN = process.env.CYANITE_TOKEN;
if (!TOKEN) { console.error("❌  CYANITE_TOKEN not set"); process.exit(1); }

const args = process.argv.slice(2);
const DRY_RUN  = args.includes("--dry-run");
const STATS    = args.includes("--stats");
const limitIdx = args.indexOf("--limit");
const LIMIT    = limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) : Infinity;

function loadJson(path) {
  try { return existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : {}; }
  catch { return {}; }
}
function saveCache(cache) {
  writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function elapsed(startMs) { return `${Math.round((Date.now() - startMs) / 1000)}s`; }

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

async function findPreview(title, artist) {
  const q = encodeURIComponent(`${title} ${artist}`);
  const res = await fetch(`${DEEZER_URL}?q=${q}&limit=5`);
  const data = await res.json();
  for (const t of data.data ?? []) {
    if (t.preview && t.preview.length > 10) {
      return { previewUrl: t.preview, title: t.title };
    }
  }
  return null;
}

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
  const cr = createData.libraryTrackCreate;
  if (!cr.createdLibraryTrack) throw new Error(cr.message ?? "Create failed");
  const trackId = cr.createdLibraryTrack.id;

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

async function pollAnalysis(trackId, songLabel, startMs) {
  while (Date.now() - startMs < MAX_POLL_MS) {
    await sleep(POLL_MS);
    const data = await gql(
      `query G($id: ID!) {
         libraryTrack(id: $id) {
           __typename
           ... on LibraryTrack {
             audioAnalysisV7 {
               __typename
               ... on AudioAnalysisV7Finished {
                 result {
                   bpmPrediction { value }
                   valence arousal energyLevel energyDynamics
                   musicalEraTag timeSignature transformerCaption freeGenreTags
                   moodTags genreTags moodAdvancedTags movementTags characterTags
                   advancedInstrumentTags
                 }
               }
               ... on AudioAnalysisV7Failed { error { message } }
               ... on AudioAnalysisV7NotAuthorized { __typename }
             }
           }
         }
       }`,
      { id: trackId }
    );

    const track = data.libraryTrack;
    if (track.__typename !== "LibraryTrack") throw new Error("Track not found");
    const av7 = track.audioAnalysisV7;
    if (!av7) continue;

    if (av7.__typename === "AudioAnalysisV7Finished") {
      const r = av7.result;
      return {
        bpm: Math.round(r.bpmPrediction?.value ?? 0),
        valence: r.valence ?? 0,
        arousal: r.arousal ?? 0,
        energyLevel: r.energyLevel ?? "",
        energyDynamics: r.energyDynamics ?? "",
        musicalEraTag: r.musicalEraTag ?? "",
        timeSignature: r.timeSignature ?? "",
        transformerCaption: r.transformerCaption ?? null,
        freeGenreTags: r.freeGenreTags ?? null,
        moodTags: r.moodTags ?? [],
        genreTags: r.genreTags ?? [],
        moodAdvancedTags: r.moodAdvancedTags ?? [],
        movementTags: r.movementTags ?? [],
        characterTags: r.characterTags ?? [],
        instrumentTags: r.advancedInstrumentTags ?? [],
      };
    }
    if (av7.__typename === "AudioAnalysisV7Failed") {
      throw new Error(av7.error?.message ?? "Analysis failed");
    }
    if (av7.__typename === "AudioAnalysisV7NotAuthorized") {
      throw new Error("AudioAnalysisV7 not authorized for this account");
    }
    process.stdout.write(`\r  ⏳  ${songLabel} — waiting… (${elapsed(startMs)})      `);
  }
  throw new Error("Timeout after 3 minutes");
}

function isGoodEntry(a) {
  // A cached entry is considered valid if it has real data (BPM or tags)
  return a.bpm > 0 || (a.moodTags && a.moodTags.length > 0) || (a.genreTags && a.genreTags.length > 0);
}

async function main() {
  const songs = JSON.parse(readFileSync(SONGS_PATH, "utf8"));
  const cache = loadJson(CACHE_PATH);

  const goodCached = songs.filter(s => cache[s.id] && isGoodEntry(cache[s.id])).length;
  const badCached  = Object.keys(cache).filter(id => !isGoodEntry(cache[id])).length;
  const uncached   = songs.filter(s => !cache[s.id] || !isGoodEntry(cache[s.id]));
  const toProcess  = uncached.slice(0, LIMIT);

  console.log(`\n🎛  Groove Atlas — Cyanite V7 Vibe Analyser`);
  console.log(`   Songs total:        ${songs.length}`);
  console.log(`   Cached (good data): ${goodCached}`);
  console.log(`   Cached (bad/empty): ${badCached}  ← will be re-analysed`);
  console.log(`   To analyse:         ${toProcess.length}${LIMIT < Infinity ? ` (--limit ${LIMIT})` : ""}`);

  if (STATS) return;

  if (DRY_RUN) {
    console.log(`\n   DRY RUN — no API calls will be made`);
    toProcess.forEach((s, i) => {
      const reason = cache[s.id] ? "bad data" : "new";
      console.log(`   [${i + 1}] ${s.title} — ${s.artist}  (${reason})`);
    });
    return;
  }
  if (toProcess.length === 0) {
    console.log(`\n✅  All songs have good cached data. Nothing to do.\n`);
    return;
  }
  console.log(`\n   Starting… (Ctrl+C to stop — progress saved after each song)\n`);

  let done = 0, failed = 0;

  for (let i = 0; i < toProcess.length; i++) {
    const song = toProcess[i];
    const label = `"${song.title}" — ${song.artist}`;
    process.stdout.write(`[${i + 1}/${toProcess.length}] ${label}\n`);

    const songStart = Date.now();
    try {
      const preview = await findPreview(song.title, song.artist);
      if (!preview) {
        console.log(`  ⚠️  No Deezer preview found — skipping`);
        failed++;
        continue;
      }

      const audioRes = await fetch(preview.previewUrl);
      if (!audioRes.ok) throw new Error(`Download failed: ${audioRes.status}`);
      const audioBuffer = Buffer.from(await audioRes.arrayBuffer());
      if (audioBuffer.length < 10000) throw new Error("Audio too small — bad preview URL");

      const trackId = await uploadAndEnqueue(audioBuffer, `${song.title} — ${song.artist}`);
      const analysis = await pollAnalysis(trackId, label, songStart);

      cache[song.id] = analysis;
      saveCache(cache);
      done++;
      process.stdout.write(
        `\r  ✅  Done (${elapsed(songStart)}) — ` +
        `BPM:${analysis.bpm} energy:${analysis.energyLevel} ` +
        `moods:[${analysis.moodTags.slice(0, 3).join(", ")}]\n`
      );
    } catch (err) {
      process.stdout.write(`\r  ❌  Failed (${elapsed(songStart)}): ${err.message}\n`);
      failed++;
    }

    if (i < toProcess.length - 1) await sleep(DELAY_MS);
  }

  const finalGood = songs.filter(s => cache[s.id] && isGoodEntry(cache[s.id])).length;
  console.log(`\n📊  Done — ${done} analysed, ${failed} failed, ${finalGood}/${songs.length} with good data`);
  console.log(`   Cache saved to: ${CACHE_PATH}\n`);
}

main().catch(err => { console.error("Fatal:", err); process.exit(1); });
