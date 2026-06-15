const domain = process.env.EXPO_PUBLIC_DOMAIN;
const API_BASE = domain ? `https://${domain}/api` : 'http://localhost:8080';

export interface SongstatsStats {
  drummerId: string;
  band: string;
  name: string;
  avatarUrl: string | null;
  songstatsUrl: string;
  monthlyListeners: number | null;
  followersTotal: number | null;
  streamsTotal: number | null;
  popularityCurrent: number | null;
  playlistsCurrent: number | null;
}

export type SongstatsError =
  | { code: 'NOT_CONFIGURED'; message: string }
  | { code: 'NOT_FOUND'; message: string }
  | { code: 'NO_BAND'; message: string }
  | { code: 'ERROR'; message: string };

export function isSongstatsError(r: SongstatsStats | SongstatsError): r is SongstatsError {
  return 'code' in r;
}

export async function fetchDrummerStats(
  drummerId: string
): Promise<SongstatsStats | SongstatsError> {
  try {
    const res = await fetch(`${API_BASE}/songstats/artist?drummerId=${encodeURIComponent(drummerId)}`);
    const data = await res.json() as Record<string, unknown>;
    if (data.ok === false) {
      return {
        code: (data.code as SongstatsError['code']) ?? 'ERROR',
        message: (data.error as string) ?? 'Unknown error',
      };
    }
    return data as SongstatsStats;
  } catch (err) {
    return { code: 'ERROR', message: String(err) };
  }
}

export function formatCount(n: number | null): string {
  if (n === null) return '—';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}
