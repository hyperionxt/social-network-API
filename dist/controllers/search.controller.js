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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchPostOrCommunities = void 0;
const post_model_1 = __importDefault(require("../models/post.model"));
const community_model_1 = __importDefault(require("../models/community.model"));
const redis_1 = require("../utils/redis");
const searchPostOrCommunities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reply = yield redis_1.redisClient.get(req.query.value);
        if (reply)
            return res.json(JSON.parse(reply));
        const postsFound = yield post_model_1.default.find({
            title: { $regex: req.query.value, $options: "i" },
        }).populate("community", "title");
        const communitiesFound = yield community_model_1.default.find({
            title: { $regex: req.query.value, $options: "i" },
        });
        const results = {
            posts: postsFound,
            communities: communitiesFound,
        };
        yield redis_1.redisClient.set(req.query.value, JSON.stringify(results));
        yield redis_1.redisClient.expire(req.query.value, 15);
        res.json(results);
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.searchPostOrCommunities = searchPostOrCommunities;
