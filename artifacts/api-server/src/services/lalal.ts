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
}

export type TaskStatus =
  | { status: "processing" }
  | { status: "success"; drumUrl: string; accompanimentUrl: string }
  | { status: "error"; message: string };

export async function checkTask(taskId: string): Promise<TaskStatus> {
  const res = await fetch(`${LALAL_BASE}/check/`, {
    method: "POST",
    headers: {
      "X-License-Key": apiKey(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ task_ids: [taskId] }),
  });

  if (!res.ok) {
    return { status: "error", message: `LALAL check failed: HTTP ${res.status}` };
  }

  const data = (await res.json()) as {
    result?: Record<string, {
      status?: string;
      error?: string;
      result?: {
        tracks?: Array<{ type: string; label: string; url: string }>;
      };
    }>;
  };

  const task = data?.result?.[taskId];
  if (!task) return { status: "processing" };
  if (task.error) return { status: "error", message: task.error };
  if (task.status !== "success") return { status: "processing" };

  const tracks = task.result?.tracks ?? [];
  const drumTrack = tracks.find((t) => t.label === "drum");
  const backTrack = tracks.find((t) => t.label === "no_drum");

  if (!drumTrack?.url) return { status: "processing" };

  return {
    status: "success",
    drumUrl: drumTrack.url,
    accompanimentUrl: backTrack?.url ?? "",
  };
}
