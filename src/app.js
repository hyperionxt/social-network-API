import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.routes.js";
import postRoute from "./routes/post.routes.js";
import multer from "multer";

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

//auth routes
app.use("/api", authRoute);
app.use("/api", postRoute);
//if route is not found, send 404 response
app.use((req, res) => {
  res.status(404).json({ message: "not found" });
});

export default app;
