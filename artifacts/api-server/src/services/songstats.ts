const BASE = "https://api.songstats.com/enterprise/v1";
const KEY = process.env.SONGSTATS_API_KEY ?? "";

export interface SongstatsArtistStats {
  name: string;
  avatarUrl: string | null;
  songstatsUrl: string;
  monthlyListeners: number | null;
  followersTotal: number | null;
  streamsTotal: number | null;
  popularityCurrent: number | null;
  playlistsCurrent: number | null;
}

async function searchArtist(query: string): Promise<{ id: string; name: string; avatar: string; siteUrl: string } | null> {
  const url = `${BASE}/artists/search?q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { apikey: KEY } });
  if (!res.ok) return null;
  const data = await res.json() as { result: string; results: Array<{ songstats_artist_id: string; name: string; avatar: string; site_url: string }> };
  if (!data.results?.length) return null;
  const match = data.results[0];
  return { id: match.songstats_artist_id, name: match.name, avatar: match.avatar, siteUrl: match.site_url };
}

async function fetchArtistStats(songstatsId: string): Promise<{ monthlyListeners: number | null; followersTotal: number | null; streamsTotal: number | null; popularityCurrent: number | null; playlistsCurrent: number | null }> {
  const url = `${BASE}/artists/stats?songstats_artist_id=${songstatsId}&source=spotify`;
  const res = await fetch(url, { headers: { apikey: KEY } });
  if (!res.ok) return { monthlyListeners: null, followersTotal: null, streamsTotal: null, popularityCurrent: null, playlistsCurrent: null };
  const data = await res.json() as { stats: Array<{ source: string; data: Record<string, number> }> };
  const spotify = data.stats?.find((s) => s.source === "spotify")?.data ?? {};
  return {
    monthlyListeners: spotify.monthly_listeners_current ?? null,
    followersTotal: spotify.followers_total ?? null,
    streamsTotal: spotify.streams_total ?? null,
    popularityCurrent: spotify.popularity_current ?? null,
    playlistsCurrent: spotify.playlists_current ?? null,
  };
}

export async function fetchArtistStatsByName(bandName: string): Promise<SongstatsArtistStats | null> {
  if (!KEY) return null;
  const artist = await searchArtist(bandName);
  if (!artist) return null;
  const stats = await fetchArtistStats(artist.id);
  return {
    name: artist.name,
    avatarUrl: artist.avatar || null,
    songstatsUrl: artist.siteUrl,
    ...stats,
  };
}
