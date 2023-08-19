import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.routes.js";
import postRoute from "./routes/post.routes.js";
import communityRoute from "./routes/community.routes.js";
import commentRoute from "./routes/comment.routes.js";
import categoryRoute from "./routes/category.routes.js";
import suscRoute from "./routes/suscription.routes.js";
import { swaggerServe, swaggerSetup } from "./utils/swagger.js";
import { cronFunction } from "./utils/cron.js";

const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

//task scheduler
cronFunction()

//routes
app.use("/api", authRoute);
app.use("/api", postRoute);
app.use("/api", communityRoute);
app.use("/api", categoryRoute);
app.use("/api", suscRoute);
app.use("/api", commentRoute);

//swagger doc
app.use("/api/docs", swaggerServe, swaggerSetup);

//if route is not found, send 404 status.
app.use((req, res) => {
  res.status(404).json({ message: "page not found" });
});

export default app;
