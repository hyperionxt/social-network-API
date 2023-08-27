import app from "./app.js";
import { connectDB } from "./utils/mongoose.js";
import { PORT } from "./config.js";
import { connectRedis } from "./utils/redis.js";

connectRedis()
connectDB();
app.listen(PORT);
console.log(
  `>>>> Server running on port ${PORT} (1/3)` +
    `\n` +
    `>>>> Docs are available at http://localhost:${PORT}/api/docs (2/3)`
);
