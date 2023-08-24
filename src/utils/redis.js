import redis from "redis";
import { REDIS_HOST, REDIS_PORT } from "../config.js";

export const client = redis.createClient({
  host: REDIS_HOST,
  port: REDIS_PORT,
});
