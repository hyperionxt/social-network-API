import { createClient } from "redis";
import { REDIS_HOST, REDIS_DOCKER_PORT, REDIS_PASS } from "../config";

export const redisClient = createClient({
<<<<<<< HEAD:src/utils/redis.js
  url: `redis://:${REDIS_PASS}@${REDIS_HOST}:${REDIS_PORT}`,
=======
  url: `redis://:${REDIS_PASS}@${REDIS_HOST}:${REDIS_DOCKER_PORT}`,
>>>>>>> ts:src/utils/redis.ts
});

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log(">>>> Redis connected successfully (3/4)");
  } catch (err: any) {
    console.error(`REDIS ERROR: ${err.message}`);
  }
};
