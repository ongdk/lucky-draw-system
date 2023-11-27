import { createClient } from "redis";

const client = createClient({
  url: `redis://${process.env.REDIS_USER ?? "default"}${
    process.env.REDIS_PASSWORD && `:${process.env.REDIS_PASSWORD}`
  }@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}${
    process.env.REDIS_DB_NUMBER && `/${process.env.REDIS_DB_NUMBER}`
  }`,
});

client.on("error", (err) => console.error("Redis Client Error", err));

export default client;
