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
        tempo feel complexity description whyStudy songsterrSlug
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
        tempo feel complexity description whyStudy songsterrSlug
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
        tempo feel complexity description whyStudy songsterrSlug
      }
    }
  }
`;

export const SONGS_QUERY = gql`
  query Songs($eraId: String, $genreId: String, $drummerId: String) {
    songs(eraId: $eraId, genreId: $genreId, drummerId: $drummerId) {
      id title artist drummerId year eraId genreIds
      tempo feel complexity description whyStudy songsterrSlug
    }
  }
`;

export const SONG_DETAIL_QUERY = gql`
  query Song($id: ID!) {
    song(id: $id) {
      id title artist drummerId year eraId genreIds
      tempo feel complexity description whyStudy songsterrSlug
      trackMeta {
        trackId albumTitle trackRating numFavourite trackLengthSecs genres spotifyId
      }
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
        tempo feel complexity description whyStudy songsterrSlug
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
      song {
        id title artist year eraId genreIds tempo feel complexity
        description whyStudy songsterrSlug drummerId
      }
      score
      sharedTags
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

export interface TrackMeta {
  trackId: string;
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
