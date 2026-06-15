const MUSIXMATCH_BASE = "https://api.musixmatch.com/ws/1.1";

export function isMusixmatchConfigured(): boolean {
  return Boolean(process.env["MUSIXMATCH_API_KEY"]);
}

export async function fetchLyricsSnippet(
  trackTitle: string,
  artist: string
): Promise<string | null> {
  const apiKey = process.env["MUSIXMATCH_API_KEY"];
  if (!apiKey) {
    return null;
  }

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
