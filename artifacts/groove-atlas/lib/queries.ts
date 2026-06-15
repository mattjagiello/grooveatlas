import { gql } from 'graphql-request';

// ─── Fragments (inlined per query for clarity) ──────────────────────────────

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
      keyDrummers {
        id name born died primaryEra eras genres bands bio signatureStyle
        bpmMin bpmMax influence iconicSongIds
      }
      iconicSongs {
        id title artist drummerId year eraId genreIds
        tempo feel complexity description whyStudy songsterrSlug lyricsSnippet
      }
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
      keyDrummers {
        id name born died primaryEra eras genres bands bio signatureStyle
        bpmMin bpmMax influence iconicSongIds
      }
      iconicSongs {
        id title artist drummerId year eraId genreIds
        tempo feel complexity description whyStudy songsterrSlug lyricsSnippet
      }
      charts(limit: 5) {
        trackId title artist albumTitle rank source
      }
    }
  }
`;

export const DRUMMERS_QUERY = gql`
  query Drummers($eraId: String, $genreId: String) {
    drummers(eraId: $eraId, genreId: $genreId) {
      id name born died primaryEra eras genres bands bio signatureStyle
      bpmMin bpmMax influence iconicSongIds
    }
  }
`;

export const DRUMMER_DETAIL_QUERY = gql`
  query Drummer($id: ID!) {
    drummer(id: $id) {
      id name born died primaryEra eras genres bands bio signatureStyle
      bpmMin bpmMax influence iconicSongIds
      iconicSongs {
        id title artist drummerId year eraId genreIds
        tempo feel complexity description whyStudy songsterrSlug lyricsSnippet
      }
    }
  }
`;

export const SONGS_QUERY = gql`
  query Songs($eraId: String, $genreId: String, $drummerId: String) {
    songs(eraId: $eraId, genreId: $genreId, drummerId: $drummerId) {
      id title artist drummerId year eraId genreIds
      tempo feel complexity description whyStudy songsterrSlug lyricsSnippet
    }
  }
`;

export const SONG_DETAIL_QUERY = gql`
  query Song($id: ID!) {
    song(id: $id) {
      id title artist drummerId year eraId genreIds
      tempo feel complexity description whyStudy songsterrSlug lyricsSnippet
      drummer {
        id name born died primaryEra eras genres bands bio signatureStyle
        bpmMin bpmMax influence iconicSongIds
      }
    }
  }
`;

export const SEARCH_QUERY = gql`
  query Search($q: String!) {
    search(q: $q) {
      drummers {
        id name born died primaryEra eras genres bands bio signatureStyle
        bpmMin bpmMax influence iconicSongIds
      }
      songs {
        id title artist drummerId year eraId genreIds
        tempo feel complexity description whyStudy songsterrSlug lyricsSnippet
      }
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

// ─── Response types ──────────────────────────────────────────────────────────

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

export interface SongWithDrummer extends Song {
  drummer: Drummer | null;
}

export interface SearchResults {
  drummers: Drummer[];
  songs: Song[];
  genres: Genre[];
  eras: Era[];
}
