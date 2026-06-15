import { createServer } from "node:http";
import { createYoga, createSchema } from "graphql-yoga";
import { typeDefs } from "./graphql/schema.js";
import { resolvers } from "./graphql/resolvers.js";
import { logger } from "./lib/logger.js";

const schema = createSchema({ typeDefs, resolvers });

const yoga = createYoga({
  schema,
  graphiql: process.env.NODE_ENV === "development",
  cors: {
    origin: "*",
    credentials: true,
  },
  logging: {
    debug: (...args) => logger.debug(args),
    info: (...args) => logger.info(args),
    warn: (...args) => logger.warn(args),
    error: (...args) => logger.error(args),
  },
});

const server = createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host}`);

  if (url.pathname === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }

  yoga.handle(req, res);
});

export default server;
