import { createClient } from "redis";
import { REDIS_HOST, REDIS_DOCKER_PORT, REDIS_PASS } from "../config";

export const redisClient = createClient({
  url: `redis://:${REDIS_PASS}@${REDIS_HOST}:${REDIS_DOCKER_PORT}`,
});

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log(">>>> Redis connected successfully (3/4)");
  } catch (err: any) {
    console.error(`REDIS ERROR: ${err.message}`);
  }
};
