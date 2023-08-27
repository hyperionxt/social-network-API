import { createClient } from "redis";

export const redisClient = createClient();

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log(">>>> Redis connected successfully (3/4)");
  } catch (err) {
    console.error(err);
  }
};
