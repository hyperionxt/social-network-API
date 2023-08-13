import app from "./app.js";
import { connectDB } from "./utils/mongoose.js";
import { PORT } from "./config.js";

connectDB();
app.listen(PORT);
console.log(
  `>>>> Server running on port ${PORT}` +
    `\n` +
    `>>>> Docs are available at http://localhost:${PORT}/api/docs`
);
