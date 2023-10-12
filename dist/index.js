"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const mongoose_1 = require("./utils/mongoose");
const config_1 = require("./config");
const redis_1 = require("./utils/redis");
(0, redis_1.connectRedis)();
(0, mongoose_1.connectDB)();
app_1.default.listen(config_1.DOCKER_PORT);
console.log(`>>>> Server running on port ${config_1.LOCAL_PORT} (1/3)` +
    `\n` +
    `>>>> Docs are available at http://localhost:${config_1.LOCAL_PORT}/api/docs (2/3)`);
