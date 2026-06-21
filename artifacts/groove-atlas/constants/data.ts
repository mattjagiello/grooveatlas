export type Era = {
  id: string;
  name: string;
  subtitle: string;
  years: string;
  description: string;
  color: string;
  characteristics: string[];
  keyDrummerIds: string[];
  iconicSongIds: string[];
};

export type Genre = {
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
};

export type Drummer = {
  id: string;
  name: string;
  born: number;
  died?: number | null;
  primaryEra: string;
  eras: string[];
  genres: string[];
  bands: string[];
  bio: string;
  signatureStyle: string;
  bpmMin: number;
  bpmMax: number;
  influence: string;
  photoUrl?: string | null;
  iconicSongIds: string[];
};

export type Song = {
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
  songsterrSlug?: string | null;
};

export type EraDetail = Era & {
  keyDrummers: Drummer[];
  iconicSongs: Song[];
};

export type GenreDetail = Genre & {
  keyDrummers: Drummer[];
  iconicSongs: Song[];
};

export type DrummerDetail = Drummer & {
  iconicSongs: Song[];
};

export type SongDetail = Song & {
  drummer: Drummer | null;
};
