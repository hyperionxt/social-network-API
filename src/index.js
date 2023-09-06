import app from "./app.js";
import { connectDB } from "./utils/mongoose.js";
import { DOCKER_PORT, LOCAL_PORT } from "./config.js";
import { connectRedis } from "./utils/redis.js";

connectRedis();
connectDB();
app.listen(DOCKER_PORT);
console.log(
  `>>>> Server running on port ${LOCAL_PORT} (1/3)` +
    `\n` +
    `>>>> Docs are available at http://localhost:${LOCAL_PORT}/api/docs (2/3)`
);
