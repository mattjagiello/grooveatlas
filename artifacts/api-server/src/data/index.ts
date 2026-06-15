import erasData from "./eras.json" assert { type: "json" };
import genresData from "./genres.json" assert { type: "json" };
import drummersData from "./drummers.json" assert { type: "json" };
import songsData from "./songs.json" assert { type: "json" };

export interface Era {
  id: string;
  name: string;
  subtitle: string;
  years: string;
  description: string;
  color: string;
  characteristics: string[];
  keyDrummerIds: string[];
  iconicSongIds: string[];
}

export interface Genre {
  id: string;
  name: string;
  origin: string;
  lat: number;
  lng: number;
  era: string;
  description: string;
  color: string;
  characteristics: string[];
  keyDrummerIds: string[];
  iconicSongIds: string[];
}

export interface Drummer {
  id: string;
  name: string;
  born: number;
  died: number | null;
  primaryEra: string;
  eras: string[];
  genres: string[];
  bands: string[];
  bio: string;
  signatureStyle: string;
  bpmMin: number;
  bpmMax: number;
  influence: string;
  iconicSongIds: string[];
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  drummerId: string;
  year: number;
  eraId: string;
  genreIds: string[];
  tempo: number;
  feel: string;
  complexity: number;
  description: string;
  whyStudy: string;
  songsterrSlug: string | null;
  lyricsSnippet: string | null;
}

export const eras: Era[] = erasData as Era[];
export const genres: Genre[] = genresData as Genre[];
export const drummers: Drummer[] = drummersData as Drummer[];
export const songs: Song[] = songsData as Song[];

export function findEra(id: string): Era | undefined {
  return eras.find((e) => e.id === id);
}

export function findGenre(id: string): Genre | undefined {
  return genres.find((g) => g.id === id);
}

export function findDrummer(id: string): Drummer | undefined {
  return drummers.find((d) => d.id === id);
}

export function findSong(id: string): Song | undefined {
  return songs.find((s) => s.id === id);
}
