import express, { Response, Request } from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import authAndProfileRoute from "./routes/authAndProfile.routes";
import postRoute from "./routes/post.routes";
import communityRoute from "./routes/community.routes";
import commentRoute from "./routes/comment.routes";
import categoryRoute from "./routes/category.routes";
import usersRoute from "./routes/users.routes";
import suscRoute from "./routes/suscription.routes";
import banRoutes from "./routes/ban.routes";
import searchRoute from "./routes/search.routes";
import reportRoute from "./routes/report.routes";
import { createRoles, createAdminProfile } from "./libs/initialSetup";
import { swaggerServe, swaggerSetup } from "./utils/swagger";
import {
  unverifiedUsers,
  deleteOldReports,
  unbanningUsers,
} from "./utils/tasks.cron";
import { CLIENT } from "./config";

//express config
const app = express();
app.use(
  cors({
    origin: CLIENT,
  })
);

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
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "page not found" });
});

export default app;
