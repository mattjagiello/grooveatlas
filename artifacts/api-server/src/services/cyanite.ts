const CYANITE_URL = "https://api.cyanite.ai/graphql";

async function gql<T = unknown>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(CYANITE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CYANITE_TOKEN}`,
    },
    body: JSON.stringify({ query, variables }),
  });
  const data = await res.json() as { data: T; errors?: { message: string }[] };
  if (data.errors?.length) throw new Error(data.errors[0].message);
  return data.data;
}

export async function requestUploadUrl(): Promise<{ id: string; uploadUrl: string }> {
  const data = await gql<{ fileUploadRequest: { id: string; uploadUrl: string } }>(
    `mutation { fileUploadRequest { id uploadUrl } }`
  );
  return data.fileUploadRequest;
}

export async function uploadToS3(audioBuffer: Buffer, uploadUrl: string): Promise<void> {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": "audio/mpeg" },
    body: audioBuffer as unknown as BodyInit,
  });
  if (!res.ok) throw new Error(`S3 upload failed: ${res.status}`);
}

export async function createLibraryTrack(title: string, uploadId: string): Promise<string> {
  const data = await gql<{
    libraryTrackCreate:
      | { createdLibraryTrack: { id: string } }
      | { message: string; code: string };
  }>(
    `mutation CreateTrack($title: String!, $uploadId: ID!) {
      libraryTrackCreate(input: { title: $title, uploadId: $uploadId }) {
        ... on LibraryTrackCreateSuccess { createdLibraryTrack { id } }
        ... on LibraryTrackCreateError { message code }
      }
    }`,
    { title, uploadId }
  );
  const r = data.libraryTrackCreate as Record<string, unknown>;
  if (r.createdLibraryTrack) return (r.createdLibraryTrack as { id: string }).id;
  throw new Error((r.message as string) ?? "Failed to create library track");
}

export async function enqueueLibraryTrack(trackId: string): Promise<void> {
  const data = await gql<{
    libraryTrackEnqueue:
      | { enqueuedLibraryTrack: { id: string } }
      | { message: string; code: string };
  }>(
    `mutation EnqueueTrack($id: ID!) {
      libraryTrackEnqueue(input: { libraryTrackId: $id }) {
        ... on LibraryTrackEnqueueSuccess { enqueuedLibraryTrack { id } }
        ... on LibraryTrackEnqueueError { message code }
      }
    }`,
    { id: trackId }
  );
  const r = data.libraryTrackEnqueue as Record<string, unknown>;
  if (!r.enqueuedLibraryTrack) throw new Error((r.message as string) ?? "Enqueue failed");
}

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

export type AnalysisStatus =
  | { status: "processing" }
  | { status: "finished"; analysis: CyaniteAnalysis }
  | { status: "failed"; message: string };

export async function checkAnalysis(trackId: string): Promise<AnalysisStatus> {
  const data = await gql<{
    libraryTrack: {
      __typename: string;
      audioAnalysisV7?: {
        __typename: string;
        result?: {
          bpmPrediction: { value: number } | null;
          valence: number;
          arousal: number;
          energyLevel: string;
          energyDynamics: string;
          musicalEraTag: string;
          timeSignature: string | null;
          transformerCaption: string | null;
          freeGenreTags: string | null;
          moodTags: string[];
          genreTags: string[];
          moodAdvancedTags: string[];
          movementTags: string[];
          characterTags: string[];
          advancedInstrumentTags: string[];
        };
        error?: { message: string };
      };
    };
  }>(
    `query GetAnalysis($id: ID!) {
      libraryTrack(id: $id) {
        __typename
        ... on LibraryTrack {
          audioAnalysisV7 {
            __typename
            ... on AudioAnalysisV7Finished {
              result {
                bpmPrediction { value }
                valence arousal energyLevel energyDynamics
                musicalEraTag timeSignature transformerCaption freeGenreTags
                moodTags genreTags moodAdvancedTags movementTags characterTags
                advancedInstrumentTags
              }
            }
            ... on AudioAnalysisV7Failed { error { message } }
            ... on AudioAnalysisV7NotAuthorized { __typename }
          }
        }
      }
    }`,
    { id: trackId }
  );

  const track = data.libraryTrack;
  if (track.__typename !== "LibraryTrack") return { status: "failed", message: "Track not found" };

  const av7 = track.audioAnalysisV7;
  if (!av7) return { status: "processing" };

  if (av7.__typename === "AudioAnalysisV7Finished" && av7.result) {
    const r = av7.result;
    return {
      status: "finished",
      analysis: {
        bpm: Math.round(r.bpmPrediction?.value ?? 0),
        valence: r.valence ?? 0,
        arousal: r.arousal ?? 0,
        energyLevel: r.energyLevel ?? "",
        energyDynamics: r.energyDynamics ?? "",
        musicalEraTag: r.musicalEraTag ?? "",
        timeSignature: r.timeSignature ?? "",
        transformerCaption: r.transformerCaption ?? null,
        freeGenreTags: r.freeGenreTags ?? null,
        moodTags: r.moodTags ?? [],
        genreTags: r.genreTags ?? [],
        moodAdvancedTags: r.moodAdvancedTags ?? [],
        movementTags: r.movementTags ?? [],
        characterTags: r.characterTags ?? [],
        instrumentTags: r.advancedInstrumentTags ?? [],
      },
    };
  }

  if (av7.__typename === "AudioAnalysisV7Failed") {
    return { status: "failed", message: av7.error?.message ?? "Analysis failed" };
  }

  if (av7.__typename === "AudioAnalysisV7NotAuthorized") {
    return { status: "failed", message: "AudioAnalysisV7 not authorized for this account" };
  }

  return { status: "processing" };
}
