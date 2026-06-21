import { useQuery } from '@tanstack/react-query';
import { gqlClient } from '@/lib/gql-client';
import {
  ERA_LIST_QUERY,
  ERA_DETAIL_QUERY,
  GENRE_LIST_QUERY,
  GENRE_DETAIL_QUERY,
  DRUMMERS_QUERY,
  DRUMMER_DETAIL_QUERY,
  SONGS_QUERY,
  SONG_DETAIL_QUERY,
  SEARCH_QUERY,
  DRUMMER_VIBE_QUERY,
  SIMILAR_SONGS_QUERY,
  type EraWithNested,
  type GenreWithNested,
  type DrummerWithSongs,
  type SongWithDrummer,
  type SearchResults,
  type DrummerVibe,
  type SimilarSong,
} from '@/lib/queries';
import type { Era, Genre, Drummer, Song } from '@/constants/data';

export function useEras() {
  return useQuery<Era[]>({
    queryKey: ['eras'],
    queryFn: () =>
      gqlClient.request<{ eras: Era[] }>(ERA_LIST_QUERY).then((d) => d.eras),
  });
}

export function useEra(id: string) {
  return useQuery<EraWithNested | null>({
    queryKey: ['era', id],
    queryFn: () =>
      gqlClient
        .request<{ era: EraWithNested | null }>(ERA_DETAIL_QUERY, { id })
        .then((d) => d.era),
    enabled: !!id,
  });
}

export function useGenres() {
  return useQuery<Genre[]>({
    queryKey: ['genres'],
    queryFn: () =>
      gqlClient
        .request<{ genres: Genre[] }>(GENRE_LIST_QUERY)
        .then((d) => d.genres),
  });
}

export function useGenre(id: string) {
  return useQuery<GenreWithNested | null>({
    queryKey: ['genre', id],
    queryFn: () =>
      gqlClient
        .request<{ genre: GenreWithNested | null }>(GENRE_DETAIL_QUERY, { id })
        .then((d) => d.genre),
    enabled: !!id,
  });
}

export function useDrummers(params?: { eraId?: string; genreId?: string }) {
  return useQuery<Drummer[]>({
    queryKey: ['drummers', params?.eraId, params?.genreId],
    queryFn: () =>
      gqlClient
        .request<{ drummers: Drummer[] }>(DRUMMERS_QUERY, params ?? {})
        .then((d) => d.drummers),
  });
}

export function useDrummer(id: string) {
  return useQuery<DrummerWithSongs | null>({
    queryKey: ['drummer', id],
    queryFn: () =>
      gqlClient
        .request<{ drummer: DrummerWithSongs | null }>(DRUMMER_DETAIL_QUERY, { id })
        .then((d) => d.drummer),
    enabled: !!id,
  });
}

export function useSongs(params?: {
  eraId?: string;
  genreId?: string;
  drummerId?: string;
}) {
  return useQuery<Song[]>({
    queryKey: ['songs', params?.eraId, params?.genreId, params?.drummerId],
    queryFn: () =>
      gqlClient
        .request<{ songs: Song[] }>(SONGS_QUERY, params ?? {})
        .then((d) => d.songs),
  });
}

export function useSong(id: string) {
  return useQuery<SongWithDrummer | null>({
    queryKey: ['song', id],
    queryFn: () =>
      gqlClient
        .request<{ song: SongWithDrummer | null }>(SONG_DETAIL_QUERY, { id })
        .then((d) => d.song),
    enabled: !!id,
  });
}

export function useSearch(q: string) {
  return useQuery<SearchResults>({
    queryKey: ['search', q],
    queryFn: () =>
      gqlClient
        .request<{ search: SearchResults }>(SEARCH_QUERY, { q })
        .then((d) => d.search),
    enabled: q.length > 0,
  });
}

export function useDrummerVibe(id: string) {
  return useQuery<DrummerVibe | null>({
    queryKey: ['drummerVibe', id],
    queryFn: () =>
      gqlClient
        .request<{ drummerVibe: DrummerVibe | null }>(DRUMMER_VIBE_QUERY, { id })
        .then((d) => d.drummerVibe),
    enabled: !!id,
  });
}

export function useSimilarSongs(id: string, limit = 4) {
  return useQuery<SimilarSong[]>({
    queryKey: ['similarSongs', id, limit],
    queryFn: () =>
      gqlClient
        .request<{ similarSongs: SimilarSong[] }>(SIMILAR_SONGS_QUERY, { id, limit })
        .then((d) => d.similarSongs),
    enabled: !!id,
  });
}
