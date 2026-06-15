const domain = process.env.EXPO_PUBLIC_DOMAIN;
const API_BASE = domain ? `https://${domain}/api` : 'http://localhost:8080';

export interface CyaniteAnalysis {
  songId: string;
  spotifyId: string;
  moodTags: string[];
  genreTags: string[];
  instrumentTags: string[];
  advancedInstrumentTags: string[];
  bpm: number | null;
  bpmRangeAdjusted: number | null;
  valence: number | null;
  arousal: number | null;
  energyLevel: string | null;
  energyDynamics: string | null;
  emotionalProfile: string | null;
  musicalEraTag: string | null;
  transformerCaption: string | null;
  timeSignature: string | null;
  key: string | null;
  movementTags: string[];
  characterTags: string[];
}

export type CyaniteError =
  | { code: 'NOT_CONFIGURED'; message: string }
  | { code: 'NO_SPOTIFY_ID'; message: string }
  | { code: 'ANALYSIS_FAILED'; message: string }
  | { code: 'ERROR'; message: string };

export function isCyaniteError(r: CyaniteAnalysis | CyaniteError): r is CyaniteError {
  return 'code' in r;
}

export async function fetchCyaniteAnalysis(
  songId: string,
  spotifyId?: string | null
): Promise<CyaniteAnalysis | CyaniteError> {
  try {
    const params = new URLSearchParams({ songId });
    if (spotifyId) params.set('spotifyId', spotifyId);

    const res = await fetch(`${API_BASE}/cyanite/analysis?${params.toString()}`);
    const data = await res.json() as Record<string, unknown>;

    if (!res.ok) {
      return {
        code: (data.code as CyaniteError['code']) ?? 'ERROR',
        message: (data.error as string) ?? 'Unknown error',
      };
    }

    return data as CyaniteAnalysis;
  } catch (err) {
    return { code: 'ERROR', message: String(err) };
  }
}
