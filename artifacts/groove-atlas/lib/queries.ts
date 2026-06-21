import { gql } from 'graphql-request';

// ─── Field sets ───────────────────────────────────────────────────────────────
// Card (list view) — no heavy prose fields
const DRUMMER_CARD = `id name born died primaryEra eras genres bands bpmMin bpmMax photoUrl iconicSongIds`;
// Detail page — full text fields
const DRUMMER_DETAIL = `${DRUMMER_CARD} bio signatureStyle influence`;

// Card (list view) — no description/whyStudy/songsterrSlug
const SONG_CARD = `id title artist drummerId year eraId genreIds tempo feel complexity`;
// Detail page — full text fields
const SONG_DETAIL = `${SONG_CARD} description whyStudy songsterrSlug`;

// ─── Queries ─────────────────────────────────────────────────────────────────

export const ERA_LIST_QUERY = gql`
  query Eras {
    eras {
      id name subtitle years description color characteristics
      keyDrummerIds iconicSongIds
    }
  }
`;

export const ERA_DETAIL_QUERY = gql`
  query Era($id: ID!) {
    era(id: $id) {
      id name subtitle years description color characteristics
      keyDrummerIds iconicSongIds
      keyDrummers { ${DRUMMER_CARD} }
      iconicSongs  { ${SONG_CARD} }
    }
  }
`;

export const GENRE_LIST_QUERY = gql`
  query Genres {
    genres {
      id name origin lat lng era description color characteristics
      keyDrummerIds iconicSongIds
    }
  }
`;

export const GENRE_DETAIL_QUERY = gql`
  query Genre($id: ID!) {
    genre(id: $id) {
      id name origin lat lng era description color characteristics
      keyDrummerIds iconicSongIds
      keyDrummers { ${DRUMMER_CARD} }
      iconicSongs  { ${SONG_CARD} }
      charts(limit: 5) {
        trackId title artist albumTitle rank source
      }
    }
  }
`;

export const DRUMMERS_QUERY = gql`
  query Drummers($eraId: String, $genreId: String) {
    drummers(eraId: $eraId, genreId: $genreId) {
      ${DRUMMER_CARD}
    }
  }
`;

export const DRUMMER_DETAIL_QUERY = gql`
  query Drummer($id: ID!) {
    drummer(id: $id) {
      ${DRUMMER_DETAIL}
      iconicSongs { ${SONG_CARD} }
    }
  }
`;

export const SONGS_QUERY = gql`
  query Songs($eraId: String, $genreId: String, $drummerId: String) {
    songs(eraId: $eraId, genreId: $genreId, drummerId: $drummerId) {
      ${SONG_CARD}
    }
  }
`;

export const SONG_DETAIL_QUERY = gql`
  query Song($id: ID!) {
    song(id: $id) {
      ${SONG_DETAIL}
      trackMeta {
        trackId trackName albumTitle trackRating numFavourite trackLengthSecs genres spotifyId
      }
      drummer { ${DRUMMER_CARD} }
    }
  }
`;

export const SEARCH_QUERY = gql`
  query Search($q: String!) {
    search(q: $q) {
      drummers { ${DRUMMER_CARD} }
      songs    { ${SONG_CARD} }
      genres {
        id name origin lat lng era description color characteristics
        keyDrummerIds iconicSongIds
      }
      eras {
        id name subtitle years description color characteristics
        keyDrummerIds iconicSongIds
      }
    }
  }
`;

export const DRUMMER_VIBE_QUERY = gql`
  query DrummerVibe($id: ID!) {
    drummerVibe(id: $id) {
      drummerId songCount analysedCount avgBpm dominantEnergy
      topMoods topGenres topCharacter freeGenreText transformerCaptions
    }
  }
`;

export const SIMILAR_SONGS_QUERY = gql`
  query SimilarSongs($id: ID!, $limit: Int) {
    similarSongs(id: $id, limit: $limit) {
      song { ${SONG_CARD} }
      score
      sharedTags
    }
  }
`;

// ─── Response types ───────────────────────────────────────────────────────────

import type { Era, Genre, Drummer, Song } from '@/constants/data';

export interface EraWithNested extends Era {
  keyDrummers: Drummer[];
  iconicSongs: Song[];
}

export interface GenreChartTrack {
  trackId: string;
  title: string;
  artist: string;
  albumTitle: string | null;
  rank: number;
  source: string;
}

export interface GenreWithNested extends Genre {
  keyDrummers: Drummer[];
  iconicSongs: Song[];
  charts: GenreChartTrack[];
}

export interface DrummerWithSongs extends Drummer {
  iconicSongs: Song[];
}

export interface TrackMeta {
  trackId: string;
  trackName: string | null;
  albumTitle: string | null;
  trackRating: number;
  numFavourite: number;
  trackLengthSecs: number;
  genres: string[];
  spotifyId: string | null;
}

export interface SongWithDrummer extends Song {
  drummer: Drummer | null;
  trackMeta: TrackMeta | null;
}

export interface SearchResults {
  drummers: Drummer[];
  songs: Song[];
  genres: Genre[];
  eras: Era[];
}

export interface DrummerVibe {
  drummerId: string;
  songCount: number;
  analysedCount: number;
  avgBpm: number | null;
  dominantEnergy: string | null;
  topMoods: string[];
  topGenres: string[];
  topCharacter: string[];
  freeGenreText: string | null;
  transformerCaptions: string[];
}

export interface SimilarSong {
  song: Song;
  score: number;
  sharedTags: string[];
}
