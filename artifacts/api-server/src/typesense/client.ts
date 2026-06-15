import Typesense from "typesense";

export const TYPESENSE_PORT = 8108;
export const TYPESENSE_API_KEY =
  process.env.TYPESENSE_API_KEY ?? "groove-atlas-dev-key";

export const tsClient = new Typesense.Client({
  nodes: [{ host: "localhost", port: TYPESENSE_PORT, protocol: "http" }],
  apiKey: TYPESENSE_API_KEY,
  connectionTimeoutSeconds: 10,
  retryIntervalSeconds: 0.1,
  numRetries: 3,
});

export default tsClient;
