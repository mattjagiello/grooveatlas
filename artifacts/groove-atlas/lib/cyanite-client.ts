const domain = process.env.EXPO_PUBLIC_DOMAIN;
const API_BASE = domain ? `https://${domain}/api` : 'http://localhost:8080';

export interface CyaniteAnalysis {
  bpm: number;
  valence: number;
  arousal: number;
  energyLevel: string;
  energyDynamics: string;
  moodTags: string[];
  genreTags: string[];
  musicalEraTag: string;
  transformerCaption: string | null;
  instrumentTags: string[];
}

export interface CyaniteStartResult {
  trackId: string;
  previewTitle: string;
  songId: string;
  songTitle: string;
  artist: string;
}

export type CyaniteError = { code: string; message: string };

export function isCyaniteError(r: unknown): r is CyaniteError {
  return typeof r === 'object' && r !== null && 'code' in r;
}

export async function startCyaniteAnalysis(songId: string): Promise<CyaniteStartResult | CyaniteError> {
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
    return data as CyaniteStartResult;
  } catch (err) {
    return { code: 'ERROR', message: String(err) };
  }
}

export type CyaniteStatusResult =
  | { status: 'processing' }
  | { status: 'finished'; analysis: CyaniteAnalysis }
  | CyaniteError;

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
