import app from "./app";
import { connectDB } from "./utils/mongoose";
import { DOCKER_PORT, LOCAL_PORT } from "./config";
import { connectRedis } from "./utils/redis";

connectRedis();
connectDB();
app.listen(DOCKER_PORT);
console.log(
  `>>>> Server running on port ${LOCAL_PORT} (1/3)` +
    `\n` +
    `>>>> Docs are available at http://localhost:${LOCAL_PORT}/api/docs (2/3)`
);
