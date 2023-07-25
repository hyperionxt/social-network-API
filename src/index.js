import app from "./app.js";
import { connectDB } from "./db.js";
import { PORT } from "./config.js";;

connectDB();
app.listen(PORT);

console.log(`>>>> server running on port ${PORT}`);
