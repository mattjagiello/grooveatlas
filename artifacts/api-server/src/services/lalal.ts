const LALAL_BASE = "https://www.lalal.ai/api/v1";

export class LalalPremiumError extends Error {
  constructor() {
    super("Premium license required");
    this.name = "LalalPremiumError";
  }
}

function apiKey(): string {
  const key = process.env["LALAL_AI_KEY"];
  if (!key) throw new Error("LALAL_AI_KEY not configured");
  return key;
}

export async function uploadAudio(
  audioBuffer: Buffer,
  filename: string
): Promise<string> {
  const res = await fetch(`${LALAL_BASE}/upload/`, {
    method: "POST",
    headers: {
      "X-License-Key": apiKey(),
      "Content-Disposition": `attachment; filename=${filename}`,
    },
    body: audioBuffer,
  });

  const data = (await res.json()) as { id?: string; detail?: string };
  if (!data.id) throw new Error(data.detail ?? "LALAL upload failed");
  return data.id;
}

export async function requestDrumSplit(sourceId: string): Promise<string> {
  const res = await fetch(`${LALAL_BASE}/split/stem_separator/`, {
    method: "POST",
    headers: {
      "X-License-Key": apiKey(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ source_id: sourceId, presets: { stem: "drum" } }),
  });

  const data = (await res.json()) as {
    task_id?: string;
    detail?: string | Array<unknown>;
  };

  if (typeof data.detail === "string" && data.detail.toLowerCase().includes("premium")) {
    throw new LalalPremiumError();
  }
  if (!data.task_id) {
    throw new Error(
      typeof data.detail === "string" ? data.detail : "Split request failed"
    );
  }
  return data.task_id;
}

export interface StemResult {
  drumUrl: string;
  accompanimentUrl: string;
  progress?: number;
}

export async function pollForResult(
  taskId: string,
  maxWaitMs = 120_000
): Promise<StemResult> {
  const deadline = Date.now() + maxWaitMs;

  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 3000));

    const res = await fetch(`${LALAL_BASE}/check/`, {
      method: "POST",
      headers: {
        "X-License-Key": apiKey(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task_ids: [taskId] }),
    });

    const data = (await res.json()) as Record<
      string,
      Record<
        string,
        {
          status?: string;
          error?: string;
          result?: {
            stems?: {
              drum?: { url: string };
              no_drum?: { url: string };
            };
          };
        }
      >
    >;

    const task = data?.data?.[taskId];
    if (!task) continue;

    if (task.error) throw new Error(task.error);

    const stems = task.result?.stems;
    if (stems?.drum?.url) {
      return {
        drumUrl: stems.drum.url,
        accompanimentUrl: stems.no_drum?.url ?? "",
      };
    }
  }

  throw new Error("Timed out waiting for drum stem (120s)");
}
