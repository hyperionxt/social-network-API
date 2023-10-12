"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const authAndProfile_routes_1 = __importDefault(require("./routes/authAndProfile.routes"));
const post_routes_1 = __importDefault(require("./routes/post.routes"));
const community_routes_1 = __importDefault(require("./routes/community.routes"));
const comment_routes_1 = __importDefault(require("./routes/comment.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const users_routes_1 = __importDefault(require("./routes/users.routes"));
const suscription_routes_1 = __importDefault(require("./routes/suscription.routes"));
const ban_routes_1 = __importDefault(require("./routes/ban.routes"));
const search_routes_1 = __importDefault(require("./routes/search.routes"));
const report_routes_1 = __importDefault(require("./routes/report.routes"));
const initialSetup_1 = require("./libs/initialSetup");
const swagger_1 = require("./utils/swagger");
const tasks_cron_1 = require("./utils/tasks.cron");
const config_1 = require("./config");
//express config
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: config_1.CLIENT,
}));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
//initial config
(0, initialSetup_1.createRoles)();
(0, initialSetup_1.createAdminProfile)();
//task scheduler
(0, tasks_cron_1.unverifiedUsers)();
(0, tasks_cron_1.deleteOldReports)();
(0, tasks_cron_1.unbanningUsers)();
//routes
app.use("/api", authAndProfile_routes_1.default);
app.use("/api", post_routes_1.default);
app.use("/api", community_routes_1.default);
app.use("/api", category_routes_1.default);
app.use("/api", suscription_routes_1.default);
app.use("/api", comment_routes_1.default);
app.use("/api", users_routes_1.default);
app.use("/api", ban_routes_1.default);
app.use("/api", search_routes_1.default);
app.use("/api", report_routes_1.default);
//swagger doc
app.use("/api/docs", swagger_1.swaggerServe, swagger_1.swaggerSetup);
//if route is not found, send 404 status.
app.use((req, res) => {
    res.status(404).json({ message: "page not found" });
});
exports.default = app;
