import server from "./app.js";
import { logger } from "./lib/logger.js";
import { initTypesense } from "./typesense/startup.js";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error("PORT environment variable is required but was not provided.");
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function main() {
  await initTypesense();

  server.listen(port, () => {
    logger.info({ port }, "GraphQL server listening");
  });
}

main().catch((err) => {
  logger.error({ err }, "Fatal startup error");
  process.exit(1);
});
