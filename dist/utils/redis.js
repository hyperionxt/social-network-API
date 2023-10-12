"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = exports.redisClient = void 0;
const redis_1 = require("redis");
const config_1 = require("../config");
exports.redisClient = (0, redis_1.createClient)({
    url: `redis://:${config_1.REDIS_PASS}@${config_1.REDIS_HOST}:${config_1.REDIS_DOCKER_PORT}`,
});
const connectRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.redisClient.connect();
        console.log(">>>> Redis connected successfully (3/4)");
    }
    catch (err) {
        console.error(`REDIS ERROR: ${err.message}`);
    }
});
exports.connectRedis = connectRedis;
