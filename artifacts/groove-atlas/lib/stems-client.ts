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

export function isStemError(r: StartResult | StemResult | StemError | { status: string }): r is StemError {
  return 'code' in r;
}

interface StartResult {
  taskId: string;
  previewTitle: string;
  songId: string;
  songTitle: string;
  artist: string;
}

// Step 1: upload + enqueue. Returns taskId quickly (< 10s).
export async function startDrumExtraction(
  songId: string
): Promise<StartResult | StemError> {
  try {
    const res = await fetch(`${API_BASE}/stems/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ songId }),
    });
    const data = await res.json() as Record<string, unknown>;
    if (data.ok === false) {
      return {
        code: (data.code as StemError['code']) ?? 'ERROR',
        message: (data.error as string) ?? 'Unknown error',
      };
    }
    return data as unknown as StartResult;
  } catch (err) {
    return { code: 'ERROR', message: String(err) };
  }
}

// Step 2: poll once. Call repeatedly until status !== 'processing'.
export async function checkStemStatus(
  taskId: string
): Promise<{ status: 'processing' } | StemResult | StemError> {
  try {
    const res = await fetch(`${API_BASE}/stems/status?taskId=${encodeURIComponent(taskId)}`);
    const data = await res.json() as Record<string, unknown>;
    if (data.ok === false) {
      return {
        code: (data.code as StemError['code']) ?? 'ERROR',
        message: (data.error as string) ?? 'Unknown error',
      };
    }
    if (data.status === 'processing') return { status: 'processing' };
    if (data.status === 'error') {
      return { code: 'ERROR', message: (data.message as string) ?? 'Processing failed' };
    }
    return data as unknown as StemResult;
  } catch (err) {
    return { code: 'ERROR', message: String(err) };
  }
}
