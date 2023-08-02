import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import swaggerUI from "swagger-ui-express";
import authRoute from "./routes/auth.routes.js";
import postRoute from "./routes/post.routes.js";
import commRoute from "./routes/comm.routes.js";
import categoryRoute from "./routes/category.routes.js";
import suscRoute from "./routes/suscription.routes.js";
import { swaggerServe, swaggerSetup } from "./swagger.js";

const app = express();
app.use("/api-docs", swaggerServe, swaggerSetup);
app.use(morgan("dev"));
app.use(express.json());
//To read cookies in console.
app.use(cookieParser());

//routes
app.use("/api", authRoute);
app.use("/api", postRoute);
app.use("/api", commRoute);
app.use("/api", categoryRoute);
app.use("/api", suscRoute);

//if route is not found, send 404 response
app.use((req, res) => {
  res.status(404).json({ message: "page not found" });
});

export default app;
