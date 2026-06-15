const DEEZER_BASE = "https://api.deezer.com";

export interface DeezerPreview {
  trackId: number;
  title: string;
  previewUrl: string;
}

export async function findPreviewUrl(
  trackTitle: string,
  artist: string
): Promise<DeezerPreview | null> {
  try {
    const q = encodeURIComponent(`track:"${trackTitle}" artist:"${artist}"`);
    const res = await fetch(`${DEEZER_BASE}/search?q=${q}&limit=3`);
    if (!res.ok) return null;

    const data = (await res.json()) as {
      data: Array<{ id: number; title: string; preview: string }>;
    };

    const track = data.data.find((t) => t.preview) ?? null;
    if (!track) return null;

    return {
      trackId: track.id,
      title: track.title,
      previewUrl: track.preview,
    };
  } catch {
    return null;
  }
}
