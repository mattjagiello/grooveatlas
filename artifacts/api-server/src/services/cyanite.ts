const CYANITE_URL = "https://api.cyanite.ai/graphql";

export function isCyaniteConfigured(): boolean {
  return !!process.env.CYANITE_TOKEN;
}

async function gql<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const token = process.env.CYANITE_TOKEN;
  if (!token) throw new Error("CYANITE_TOKEN not configured");

  const res = await fetch(CYANITE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  const data = (await res.json()) as {
    data?: T;
    errors?: Array<{ message: string }>;
  };
  if (data.errors?.length) throw new Error(data.errors[0].message);
  if (!data.data) throw new Error("Empty response from Cyanite");
  return data.data;
}

interface EnqueueResult {
  spotifyTrackEnqueue: {
    enqueuedSpotifyTrack?: { id: string };
    message?: string;
  };
}

export async function enqueueSpotifyTrack(spotifyTrackId: string): Promise<string> {
  const data = await gql<EnqueueResult>(
    `mutation EnqueueSpotify($input: SpotifyTrackEnqueueInput!) {
      spotifyTrackEnqueue(input: $input) {
        ... on SpotifyTrackEnqueueSuccess {
          enqueuedSpotifyTrack { id }
        }
        ... on SpotifyTrackEnqueueError {
          message
        }
      }
    }`,
    { input: { spotifyTrackId } }
  );

  const r = data.spotifyTrackEnqueue;
  if (r.message) throw new Error(`Cyanite enqueue failed: ${r.message}`);
  if (!r.enqueuedSpotifyTrack?.id) throw new Error("No track ID from Cyanite enqueue");
  return r.enqueuedSpotifyTrack.id;
}

export interface CyaniteAnalysis {
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

interface RawResult {
  moodTags?: string[];
  genreTags?: string[];
  instrumentTags?: string[];
  advancedInstrumentTags?: string[];
  bpmPrediction?: { value: number; confidence: number };
  bpmRangeAdjusted?: number;
  valence?: number;
  arousal?: number;
  energyLevel?: string;
  energyDynamics?: string;
  emotionalProfile?: string;
  musicalEraTag?: string;
  transformerCaption?: string;
  timeSignature?: string;
  keyPrediction?: { value: string; confidence: number };
  movementTags?: string[];
  characterTags?: string[];
}

interface AnalysisQueryResult {
  spotifyTrack: {
    audioAnalysisV6:
      | { __typename: "AudioAnalysisV6Finished"; result: RawResult }
      | { __typename: string };
  };
}

const ANALYSIS_QUERY = `
  query GetAnalysis($id: ID!) {
    spotifyTrack(id: $id) {
      audioAnalysisV6 {
        ... on AudioAnalysisV6Finished {
          result {
            moodTags
            genreTags
            instrumentTags
            advancedInstrumentTags
            bpmPrediction { value confidence }
            bpmRangeAdjusted
            valence
            arousal
            energyLevel
            energyDynamics
            emotionalProfile
            musicalEraTag
            transformerCaption
            timeSignature
            keyPrediction { value confidence }
            movementTags
            characterTags
          }
        }
        ... on AudioAnalysisV6NotStarted { __typename }
        ... on AudioAnalysisV6Enqueued { __typename }
        ... on AudioAnalysisV6Processing { __typename }
        ... on AudioAnalysisV6Failed { __typename }
        ... on AudioAnalysisV6NotAuthorized { __typename }
      }
    }
  }
`;

export async function fetchAnalysis(cyaniteTrackId: string): Promise<CyaniteAnalysis | null> {
  const data = await gql<AnalysisQueryResult>(ANALYSIS_QUERY, { id: cyaniteTrackId });

  const av6 = data.spotifyTrack?.audioAnalysisV6;
  if (!av6 || av6.__typename !== "AudioAnalysisV6Finished") return null;

  const r = (av6 as { __typename: "AudioAnalysisV6Finished"; result: RawResult }).result;
  return {
    moodTags: r.moodTags ?? [],
    genreTags: r.genreTags ?? [],
    instrumentTags: r.instrumentTags ?? [],
    advancedInstrumentTags: r.advancedInstrumentTags ?? [],
    bpm: r.bpmPrediction?.value ?? null,
    bpmRangeAdjusted: r.bpmRangeAdjusted ?? null,
    valence: r.valence ?? null,
    arousal: r.arousal ?? null,
    energyLevel: r.energyLevel ?? null,
    energyDynamics: r.energyDynamics ?? null,
    emotionalProfile: r.emotionalProfile ?? null,
    musicalEraTag: r.musicalEraTag ?? null,
    transformerCaption: r.transformerCaption ?? null,
    timeSignature: r.timeSignature ?? null,
    key: r.keyPrediction?.value ?? null,
    movementTags: r.movementTags ?? [],
    characterTags: r.characterTags ?? [],
  };
}

async function pollAnalysis(cyaniteTrackId: string): Promise<CyaniteAnalysis> {
  for (let i = 0; i < 30; i++) {
    const result = await fetchAnalysis(cyaniteTrackId);
    if (result) return result;
    await new Promise((r) => setTimeout(r, 3000));
  }
  throw new Error("Cyanite analysis timed out after 90s");
}

const cache = new Map<string, CyaniteAnalysis>();

export async function analyzeSpotifyTrack(spotifyTrackId: string): Promise<CyaniteAnalysis> {
  const cached = cache.get(spotifyTrackId);
  if (cached) return cached;

  const cyaniteId = await enqueueSpotifyTrack(spotifyTrackId);
  const quick = await fetchAnalysis(cyaniteId);
  const analysis = quick ?? (await pollAnalysis(cyaniteId));

  cache.set(spotifyTrackId, analysis);
  return analysis;
}
