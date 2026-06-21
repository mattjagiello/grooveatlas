const MUSIXMATCH_BASE = "https://api.musixmatch.com/ws/1.1";

export function isMusixmatchConfigured(): boolean {
  return Boolean(process.env["MUSICMATCH_API_KEY"]);
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

export async function fetchTrackMeta(
  trackTitle: string,
  artist: string
): Promise<TrackMeta | null> {
  const apiKey = process.env["MUSICMATCH_API_KEY"];
  if (!apiKey) return null;

  try {
    const url = new URL(`${MUSIXMATCH_BASE}/matcher.track.get`);
    url.searchParams.set("apikey", apiKey);
    url.searchParams.set("q_track", trackTitle);
    url.searchParams.set("q_artist", artist);

    const res = await fetch(url.toString());
    if (!res.ok) return null;

    const data = (await res.json()) as {
      message: {
        header: { status_code: number };
        body: {
          track: {
            track_id: number;
            track_name: string;
            album_name: string;
            track_rating: number;
            num_favourite: number;
            track_length: number;
            track_spotify_id: string;
            primary_genres: {
              music_genre_list: Array<{
                music_genre: { music_genre_name: string };
              }>;
            };
          };
        };
      };
    };

    if (data.message.header.status_code !== 200) return null;
    const track = data.message.body.track;

    const genres =
      track.primary_genres?.music_genre_list?.map(
        (g) => g.music_genre.music_genre_name
      ) ?? [];

    return {
      trackId: String(track.track_id),
      trackName: track.track_name || null,
      albumTitle: track.album_name || null,
      trackRating: track.track_rating ?? 0,
      numFavourite: track.num_favourite ?? 0,
      trackLengthSecs: track.track_length ?? 0,
      genres,
      spotifyId: track.track_spotify_id || null,
    };
  } catch {
    return null;
  }
}

export async function fetchLyricsSnippet(
  trackTitle: string,
  artist: string
): Promise<string | null> {
  const apiKey = process.env["MUSICMATCH_API_KEY"];
  if (!apiKey) return null;

  try {
    const searchUrl = new URL(`${MUSIXMATCH_BASE}/track.search`);
    searchUrl.searchParams.set("apikey", apiKey);
    searchUrl.searchParams.set("q_track", trackTitle);
    searchUrl.searchParams.set("q_artist", artist);
    searchUrl.searchParams.set("page_size", "1");
    searchUrl.searchParams.set("s_track_rating", "desc");

    const searchRes = await fetch(searchUrl.toString());
    if (!searchRes.ok) return null;

    const searchData = (await searchRes.json()) as {
      message: {
        header: { status_code: number };
        body: { track_list: Array<{ track: { track_id: number } }> };
      };
    };

    if (searchData.message.header.status_code !== 200) return null;
    const trackList = searchData.message.body.track_list;
    if (!trackList.length) return null;

    const trackId = trackList[0]!.track.track_id;

    const lyricsUrl = new URL(`${MUSIXMATCH_BASE}/track.lyrics.get`);
    lyricsUrl.searchParams.set("apikey", apiKey);
    lyricsUrl.searchParams.set("track_id", String(trackId));

    const lyricsRes = await fetch(lyricsUrl.toString());
    if (!lyricsRes.ok) return null;

    const lyricsData = (await lyricsRes.json()) as {
      message: {
        header: { status_code: number };
        body: { lyrics: { lyrics_body: string } };
      };
    };

    if (lyricsData.message.header.status_code !== 200) return null;
    const fullLyrics = lyricsData.message.body.lyrics.lyrics_body;

    const lines = fullLyrics.split("\n").filter((l) => l.trim().length > 0);
    return lines.slice(0, 4).join("\n") || null;
  } catch {
    return null;
  }
}

export interface MusixmatchChartTrack {
  trackId: string;
  title: string;
  artist: string;
  albumTitle: string | null;
  rank: number;
}

export async function fetchGenreCharts(
  genreName: string,
  limit: number = 10
): Promise<MusixmatchChartTrack[] | null> {
  const apiKey = process.env["MUSICMATCH_API_KEY"];
  if (!apiKey) return null;

  try {
    const url = new URL(`${MUSIXMATCH_BASE}/track.search`);
    url.searchParams.set("apikey", apiKey);
    url.searchParams.set("q_genre", genreName);
    url.searchParams.set("page_size", String(Math.min(limit, 10)));
    url.searchParams.set("s_track_rating", "desc");
    url.searchParams.set("f_has_lyrics", "1");

    const res = await fetch(url.toString());
    if (!res.ok) return null;

    const data = (await res.json()) as {
      message: {
        header: { status_code: number };
        body: {
          track_list: Array<{
            track: {
              track_id: number;
              track_name: string;
              artist_name: string;
              album_name: string | null;
            };
          }>;
        };
      };
    };

    if (data.message.header.status_code !== 200) return null;
    const trackList = data.message.body.track_list;

    return trackList.map((item, idx) => ({
      trackId: String(item.track.track_id),
      title: item.track.track_name,
      artist: item.track.artist_name,
      albumTitle: item.track.album_name ?? null,
      rank: idx + 1,
    }));
  } catch {
    return null;
  }
}
