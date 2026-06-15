import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { createYoga, createSchema } from "graphql-yoga";
import { typeDefs } from "./graphql/schema.js";
import { resolvers } from "./graphql/resolvers.js";
import { logger } from "./lib/logger.js";
import { handleStemsExtract } from "./handlers/stems.js";

const schema = createSchema({ typeDefs, resolvers });

const yoga = createYoga({
  schema,
  graphiql: process.env.NODE_ENV === "development",
  cors: false,
  logging: {
    debug: (...args) => logger.debug(args),
    info: (...args) => logger.info(args),
    warn: (...args) => logger.warn(args),
    error: (...args) => logger.error(args),
  },
});

function setCorsHeaders(res: ServerResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url ?? "/", `http://${req.headers.host}`);

  if (url.pathname === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }

  if (url.pathname === "/stems/extract") {
    await handleStemsExtract(req, res);
    return;
  }

  yoga.handle(req, res);
});

export default server;
