export const typeDefs = /* GraphQL */ `
  type Era {
    id: ID!
    name: String!
    subtitle: String!
    years: String!
    description: String!
    color: String!
    characteristics: [String!]!
    keyDrummerIds: [String!]!
    iconicSongIds: [String!]!
    keyDrummers: [Drummer!]!
    iconicSongs: [Song!]!
  }

  type Genre {
    id: ID!
    name: String!
    origin: String!
    lat: Float!
    lng: Float!
    era: String!
    description: String!
    color: String!
    characteristics: [String!]!
    keyDrummerIds: [String!]!
    iconicSongIds: [String!]!
    keyDrummers: [Drummer!]!
    iconicSongs: [Song!]!
    charts(limit: Int): [ChartTrack!]!
  }

  type Drummer {
    id: ID!
    name: String!
    born: Int!
    died: Int
    primaryEra: String!
    eras: [String!]!
    genres: [String!]!
    bands: [String!]!
    bio: String!
    signatureStyle: String!
    bpmMin: Int!
    bpmMax: Int!
    influence: String!
    photoUrl: String
    iconicSongIds: [String!]!
    iconicSongs: [Song!]!
  }

  type TrackMeta {
    trackId: String!
    trackName: String
    albumTitle: String
    trackRating: Int!
    numFavourite: Int!
    trackLengthSecs: Int!
    genres: [String!]!
    spotifyId: String
  }

  type Song {
    id: ID!
    title: String!
    artist: String!
    drummerId: String!
    year: Int!
    eraId: String!
    genreIds: [String!]!
    tempo: Int!
    feel: String!
    complexity: Int!
    description: String!
    whyStudy: String!
    songsterrSlug: String
    drummer: Drummer
    trackMeta: TrackMeta
  }

  type ChartTrack {
    trackId: String!
    title: String!
    artist: String!
    albumTitle: String
    rank: Int!
    source: String!
  }

  type SearchResults {
    drummers: [Drummer!]!
    songs: [Song!]!
    genres: [Genre!]!
    eras: [Era!]!
  }

  type DrummerVibe {
    drummerId: ID!
    songCount: Int!
    analysedCount: Int!
    avgBpm: Int
    dominantEnergy: String
    topMoods: [String!]!
    topGenres: [String!]!
    topCharacter: [String!]!
    freeGenreText: String
    transformerCaptions: [String!]!
  }

  type SimilarSong {
    song: Song!
    score: Int!
    sharedTags: [String!]!
  }

  type Query {
    eras: [Era!]!
    era(id: ID!): Era
    genres: [Genre!]!
    genre(id: ID!): Genre
    drummers(eraId: String, genreId: String): [Drummer!]!
    drummer(id: ID!): Drummer
    songs(eraId: String, genreId: String, drummerId: String): [Song!]!
    song(id: ID!): Song
    search(q: String!): SearchResults!
    drummersByBand(band: String!): [Drummer!]!
    drummerVibe(id: ID!): DrummerVibe
    similarSongs(id: ID!, limit: Int): [SimilarSong!]!
  }
`;
