import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import authAndProfileRoute from "./routes/authAndProfile.routes.js";
import postRoute from "./routes/post.routes.js";
import communityRoute from "./routes/community.routes.js";
import commentRoute from "./routes/comment.routes.js";
import categoryRoute from "./routes/category.routes.js";
import usersRoute from "./routes/users.routes.js";
import suscRoute from "./routes/suscription.routes.js";
import banRoutes from "./routes/ban.routes.js";
import searchRoute from "./routes/search.routes.js";
import reportRoute from "./routes/report.routes.js";
import { createRoles, createAdminProfile } from "./libs/initialSetup.js";
import { swaggerServe, swaggerSetup } from "./utils/swagger.js";
import {
  unverifiedUsers,
  deleteOldReports,
  unbanningUsers,
} from "./utils/cron.js";
import { CLIENT } from "./config.js";
import responseTime from "response-time";

//express config
const app = express();
app.use(
  cors({
    origin: CLIENT,
  })
);

app.use(responseTime());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

//initial config
createRoles();
createAdminProfile();

//task scheduler
unverifiedUsers();
deleteOldReports();
unbanningUsers();

//routes
app.use("/api", authAndProfileRoute);
app.use("/api", postRoute);
app.use("/api", communityRoute);
app.use("/api", categoryRoute);
app.use("/api", suscRoute);
app.use("/api", commentRoute);
app.use("/api", usersRoute);
app.use("/api", banRoutes);
app.use("/api", searchRoute);
app.use("/api", reportRoute);

//swagger doc
app.use("/api/docs", swaggerServe, swaggerSetup);

//if route is not found, send 404 status.
app.use((req, res) => {
  res.status(404).json({ message: "page not found" });
});

export default app;
