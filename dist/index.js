"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = __importDefault(require("./app.js"));
const mongoose_js_1 = require("./utils/mongoose.js");
const config_js_1 = require("./config.js");
const redis_js_1 = require("./utils/redis.js");
(0, redis_js_1.connectRedis)();
(0, mongoose_js_1.connectDB)();
app_js_1.default.listen(config_js_1.DOCKER_PORT);
console.log(`>>>> Server running on port ${config_js_1.LOCAL_PORT} (1/3)` +
    `\n` +
    `>>>> Docs are available at http://localhost:${config_js_1.LOCAL_PORT}/api/docs (2/3)`);
