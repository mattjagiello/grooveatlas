const domain = process.env.EXPO_PUBLIC_DOMAIN;
const API_BASE = domain ? `https://${domain}/api` : 'http://localhost:8080';

export interface CyaniteAnalysis {
  bpm: number;
  valence: number;
  arousal: number;
  energyLevel: string;
  energyDynamics: string;
  musicalEraTag: string;
  timeSignature: string;
  transformerCaption: string | null;
  freeGenreTags: string | null;
  moodTags: string[];
  genreTags: string[];
  moodAdvancedTags: string[];
  movementTags: string[];
  characterTags: string[];
  instrumentTags: string[];
}

export type CyaniteError = { code: string; message: string };

export function isCyaniteError(r: unknown): r is CyaniteError {
  return typeof r === 'object' && r !== null && 'code' in r;
}

export interface CyaniteCacheHit {
  cached: true;
  analysis: CyaniteAnalysis;
}

export interface CyaniteStartResult {
  cached: false;
  trackId: string;
  previewTitle: string;
  songId: string;
  songTitle: string;
  artist: string;
}

export async function startCyaniteAnalysis(
  songId: string
): Promise<CyaniteCacheHit | CyaniteStartResult | CyaniteError> {
  try {
    const res = await fetch(`${API_BASE}/cyanite/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ songId }),
    });
    const data = await res.json() as Record<string, unknown>;
    if (data.ok === false) {
      return { code: (data.code as string) ?? 'ERROR', message: (data.error as string) ?? 'Unknown error' };
    }
    if (data.cached === true) {
      return { cached: true, analysis: data.analysis as CyaniteAnalysis };
    }
    return data as unknown as CyaniteStartResult;
  } catch (err) {
    return { code: 'ERROR', message: String(err) };
  }
}

export type CyaniteStatusResult =
  | { status: 'processing' }
  | { status: 'finished'; analysis: CyaniteAnalysis }
  | CyaniteError;

export async function peekCyaniteCache(
  songId: string
): Promise<CyaniteAnalysis | null> {
  try {
    const res = await fetch(`${API_BASE}/cyanite/peek?songId=${encodeURIComponent(songId)}`);
    const data = await res.json() as Record<string, unknown>;
    if (data.cached && data.analysis) return data.analysis as CyaniteAnalysis;
    return null;
  } catch {
    return null;
  }
}

export async function checkCyaniteStatus(trackId: string): Promise<CyaniteStatusResult> {
  try {
    const res = await fetch(`${API_BASE}/cyanite/status?trackId=${encodeURIComponent(trackId)}`);
    const data = await res.json() as Record<string, unknown>;
    if (data.ok === false) {
      return { code: (data.code as string) ?? 'ERROR', message: (data.error as string) ?? 'Unknown error' };
    }
    if (data.status === 'processing') return { status: 'processing' };
    if (data.status === 'finished') return { status: 'finished', analysis: data.analysis as CyaniteAnalysis };
    return { code: 'ERROR', message: (data.message as string) ?? 'Unknown status' };
  } catch (err) {
    return { code: 'ERROR', message: String(err) };
  }
}
