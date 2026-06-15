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

    const [drResult, soResult, gnResult, erResult] = result.results as any[];

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
        if (eraId && !d.eras.includes(eraId)) return false;
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
  },

  Song: {
    drummer: (song: Song) => findDrummer(song.drummerId) ?? null,
  },
};
