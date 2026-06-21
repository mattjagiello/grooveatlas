import {
  eras,
  genres,
  drummers,
  songs,
  findEra,
  findGenre,
  findDrummer,
  findSong,
  type Era,
  type Genre,
  type Drummer,
  type Song,
} from "../data/index.js";
import { getCharts } from "../data/charts.js";
import tsClient from "../typesense/client.js";
import { logger } from "../lib/logger.js";
import { fetchTrackMeta, type TrackMeta } from "../services/musixmatch.js";
import { getCached } from "../lib/cyanite-cache.js";

const trackMetaCache = new Map<string, TrackMeta | null>();

function resolveKeyDrummers(ids: string[]): Drummer[] {
  return ids.flatMap((id) => {
    const d = findDrummer(id);
    return d ? [d] : [];
  });
}

function resolveIconicSongs(ids: string[]): Song[] {
  return ids.flatMap((id) => {
    const s = findSong(id);
    return s ? [s] : [];
  });
}

async function multiSearch(q: string) {
  try {
    const result = await tsClient.multiSearch.perform({
      searches: [
        { collection: "drummers", q, query_by: "name,bio,signatureStyle,influence", per_page: 5 },
        { collection: "songs", q, query_by: "title,artist,description,feel", per_page: 5 },
        { collection: "genres", q, query_by: "name,description,characteristics", per_page: 3 },
        { collection: "eras", q, query_by: "name,subtitle,description", per_page: 3 },
      ],
    } as any);

    const [drResult, soResult, gnResult, erResult] = (result as any).results as any[];

    return {
      drummers: (drResult?.hits ?? []).map((h: any) => findDrummer(h.document.id)).filter(Boolean) as Drummer[],
      songs: (soResult?.hits ?? []).map((h: any) => findSong(h.document.id)).filter(Boolean) as Song[],
      genres: (gnResult?.hits ?? []).map((h: any) => findGenre(h.document.id)).filter(Boolean) as Genre[],
      eras: (erResult?.hits ?? []).map((h: any) => findEra(h.document.id)).filter(Boolean) as Era[],
    };
  } catch (err) {
    logger.warn({ err }, "Typesense search failed, falling back to local filter");
    const ql = q.toLowerCase();
    return {
      drummers: drummers.filter(
        (d) =>
          d.name.toLowerCase().includes(ql) ||
          d.bio.toLowerCase().includes(ql),
      ).slice(0, 5),
      songs: songs.filter(
        (s) =>
          s.title.toLowerCase().includes(ql) ||
          s.artist.toLowerCase().includes(ql),
      ).slice(0, 5),
      genres: genres.filter((g) => g.name.toLowerCase().includes(ql)).slice(0, 3),
      eras: eras.filter((e) => e.name.toLowerCase().includes(ql)).slice(0, 3),
    };
  }
}

// ─── Vibe helpers ────────────────────────────────────────────────────────────

function topN(counts: Record<string, number>, n: number): string[] {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([t]) => t);
}

function aggregateDrummerVibe(drummerId: string) {
  const drummerSongs = songs.filter((s) => s.drummerId === drummerId);
  const analysed = drummerSongs.filter((s) => {
    const c = getCached(s.id);
    return c && (c.bpm > 0 || (c.moodTags?.length ?? 0) > 0 || (c.genreTags?.length ?? 0) > 0);
  });
  if (analysed.length === 0) return null;

  const moodCounts: Record<string, number> = {};
  const genreCounts: Record<string, number> = {};
  const charCounts: Record<string, number> = {};
  const energyCounts: Record<string, number> = {};
  const captions: string[] = [];
  let totalBpm = 0, bpmCount = 0;
  const freeGenreParts: string[] = [];

  for (const song of analysed) {
    const c = getCached(song.id)!;
    for (const t of c.moodTags ?? []) moodCounts[t] = (moodCounts[t] ?? 0) + 2;
    for (const t of c.moodAdvancedTags ?? []) moodCounts[t] = (moodCounts[t] ?? 0) + 1;
    for (const t of c.genreTags ?? []) genreCounts[t] = (genreCounts[t] ?? 0) + 1;
    for (const t of [...(c.characterTags ?? []), ...(c.movementTags ?? [])])
      charCounts[t] = (charCounts[t] ?? 0) + 1;
    if (c.energyLevel) energyCounts[c.energyLevel] = (energyCounts[c.energyLevel] ?? 0) + 1;
    if (c.bpm > 0) { totalBpm += c.bpm; bpmCount++; }
    if (c.transformerCaption) captions.push(c.transformerCaption);
    if (c.freeGenreTags) {
      for (const t of c.freeGenreTags.split(",").map((x: string) => x.trim()).filter(Boolean))
        freeGenreParts.push(t);
    }
  }

  const freeGenreCounts: Record<string, number> = {};
  for (const t of freeGenreParts) freeGenreCounts[t] = (freeGenreCounts[t] ?? 0) + 1;

  return {
    drummerId,
    songCount: drummerSongs.length,
    analysedCount: analysed.length,
    avgBpm: bpmCount > 0 ? Math.round(totalBpm / bpmCount) : null,
    dominantEnergy: topN(energyCounts, 1)[0] ?? null,
    topMoods: topN(moodCounts, 5),
    topGenres: topN(genreCounts, 4),
    topCharacter: topN(charCounts, 4),
    freeGenreText: topN(freeGenreCounts, 6).join(", ") || null,
    transformerCaptions: [...new Set(captions)].slice(0, 3),
  };
}

function computeSimilarSongs(songId: string, limit: number) {
  const targetCache = getCached(songId);
  if (!targetCache) return [];

  const targetSong = findSong(songId);
  const targetMoods = new Set(targetCache.moodTags ?? []);
  const targetGenres = new Set(targetCache.genreTags ?? []);
  const targetChars = new Set([
    ...(targetCache.characterTags ?? []),
    ...(targetCache.movementTags ?? []),
  ]);
  const targetAdvanced = new Set(targetCache.moodAdvancedTags ?? []);

  const scored: Array<{ song: Song; score: number; sharedTags: string[] }> = [];

  for (const song of songs) {
    if (song.id === songId) continue;
    const c = getCached(song.id);
    if (!c || (c.bpm === 0 && !(c.moodTags?.length))) continue;

    const shared: string[] = [];
    let score = 0;

    for (const t of c.moodTags ?? []) {
      if (targetMoods.has(t)) { score += 3; shared.push(t); }
    }
    for (const t of c.genreTags ?? []) {
      if (targetGenres.has(t)) { score += 2; if (!shared.includes(t)) shared.push(t); }
    }
    for (const t of [...(c.characterTags ?? []), ...(c.movementTags ?? [])]) {
      if (targetChars.has(t)) { score += 1; if (!shared.includes(t)) shared.push(t); }
    }
    for (const t of c.moodAdvancedTags ?? []) {
      if (targetAdvanced.has(t)) score += 1;
    }
    if (targetSong && song.eraId === targetSong.eraId) score += 1;

    if (score > 0) scored.push({ song, score, sharedTags: shared.slice(0, 4) });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

export const resolvers = {
  Query: {
    eras: () => eras,
    era: (_: unknown, { id }: { id: string }) => findEra(id) ?? null,

    genres: () => genres,
    genre: (_: unknown, { id }: { id: string }) => findGenre(id) ?? null,

    drummers: (
      _: unknown,
      { eraId, genreId }: { eraId?: string; genreId?: string },
    ) => {
      return drummers.filter((d) => {
        if (eraId && d.primaryEra !== eraId) return false;
        if (genreId && !d.genres.includes(genreId)) return false;
        return true;
      });
    },

    drummer: (_: unknown, { id }: { id: string }) =>
      findDrummer(id) ?? null,

    songs: (
      _: unknown,
      {
        eraId,
        genreId,
        drummerId,
      }: { eraId?: string; genreId?: string; drummerId?: string },
    ) => {
      return songs.filter((s) => {
        if (eraId && s.eraId !== eraId) return false;
        if (genreId && !s.genreIds.includes(genreId)) return false;
        if (drummerId && s.drummerId !== drummerId) return false;
        return true;
      });
    },

    song: (_: unknown, { id }: { id: string }) => findSong(id) ?? null,

    search: (_: unknown, { q }: { q: string }) => multiSearch(q),

    drummersByBand: (_: unknown, { band }: { band: string }) =>
      drummers.filter((d) => d.bands.includes(band)),

    drummerVibe: (_: unknown, { id }: { id: string }) =>
      aggregateDrummerVibe(id),

    similarSongs: (_: unknown, { id, limit = 4 }: { id: string; limit?: number }) =>
      computeSimilarSongs(id, limit),
  },

  Era: {
    keyDrummers: (era: Era) => resolveKeyDrummers(era.keyDrummerIds),
    iconicSongs: (era: Era) => resolveIconicSongs(era.iconicSongIds),
  },

  Genre: {
    keyDrummers: (genre: Genre) => resolveKeyDrummers(genre.keyDrummerIds),
    iconicSongs: (genre: Genre) => resolveIconicSongs(genre.iconicSongIds),
    charts: (genre: Genre, { limit = 5 }: { limit?: number }) =>
      getCharts(genre.id, limit),
  },

  Drummer: {
    iconicSongs: (drummer: Drummer) =>
      resolveIconicSongs(drummer.iconicSongIds),

    allSongs: (drummer: Drummer) =>
      songs.filter((s) => s.drummerId === drummer.id),

    contemporaries: (drummer: Drummer, { limit = 8 }: { limit?: number }) => {
      const erasSet = new Set(drummer.eras);
      const genresSet = new Set(drummer.genres);
      return drummers
        .filter((d) => d.id !== drummer.id)
        .map((d) => {
          const sharedEras = d.eras.filter((e) => erasSet.has(e)).length;
          const sharedGenres = d.genres.filter((g) => genresSet.has(g)).length;
          return { d, score: sharedEras * 2 + sharedGenres };
        })
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(({ d }) => d);
    },
  },

  Song: {
    drummer: (song: Song) => findDrummer(song.drummerId) ?? null,
    era: (song: Song) => findEra(song.eraId) ?? null,
    resolvedGenres: (song: Song) =>
      song.genreIds.flatMap((id) => {
        const g = findGenre(id);
        return g ? [g] : [];
      }),
    trackMeta: async (song: Song) => {
      if (trackMetaCache.has(song.id)) return trackMetaCache.get(song.id) ?? null;
      const meta = await fetchTrackMeta(song.title, song.artist);
      trackMetaCache.set(song.id, meta);
      return meta;
    },
  },
};
