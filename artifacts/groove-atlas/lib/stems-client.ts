const domain = process.env.EXPO_PUBLIC_DOMAIN;
const API_BASE = domain ? `https://${domain}/api` : 'http://localhost:8080';

export interface StemResult {
  songId: string;
  songTitle: string;
  artist: string;
  previewTitle: string;
  drumUrl: string;
  accompanimentUrl: string;
}

export type StemError =
  | { code: 'PREMIUM_REQUIRED'; message: string }
  | { code: 'NO_PREVIEW'; message: string }
  | { code: 'ERROR'; message: string };

export async function extractDrumStem(
  songId: string
): Promise<StemResult | StemError> {
  try {
    const res = await fetch(`${API_BASE}/stems/extract`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ songId }),
    });

    const data = await res.json() as Record<string, unknown>;

    if (data.ok === false) {
      const code = (data.code as string) ?? 'ERROR';
      return {
        code: code as StemError['code'],
        message: (data.error as string) ?? 'Unknown error',
      };
    }

    return data as StemResult;
  } catch (err) {
    return { code: 'ERROR', message: String(err) };
  }
}

export function isStemError(r: StemResult | StemError): r is StemError {
  return 'code' in r;
}
