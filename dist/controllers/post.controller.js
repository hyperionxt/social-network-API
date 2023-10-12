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
exports.updatePost = exports.deletePost = exports.createPost = exports.getPost = exports.getPostByCommunity = exports.getPosts = void 0;
const post_model_1 = __importDefault(require("../models/post.model"));
const community_model_1 = __importDefault(require("../models/community.model"));
const cloudinary_1 = require("../utils/cloudinary");
const redis_1 = require("../utils/redis");
const mongoose_1 = __importDefault(require("mongoose"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reply = yield redis_1.redisClient.get("posts");
        if (reply)
            return res.json(JSON.parse(reply));
        const posts = yield post_model_1.default.find()
            .populate("user", "username")
            .populate("community", "title")
            .sort({ createdAt: -1 });
        yield redis_1.redisClient.set("posts", JSON.stringify(posts));
        yield redis_1.redisClient.expire("posts", 15);
        if (posts.length === 0)
            return res
                .status(200)
                .json({ message: "there are no posts published yet." });
        res.json(posts);
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.getPosts = getPosts;
const getPostByCommunity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reply = yield redis_1.redisClient.get(req.params.id);
        if (reply)
            return res.json(JSON.parse(reply));
        const posts = yield post_model_1.default.find({ community: req.params.id })
            .sort({
            createdAt: -1,
        })
            .populate("user", "username")
            .populate("community", "title");
        yield redis_1.redisClient.set(req.params.id, JSON.stringify(posts));
        yield redis_1.redisClient.expire(req.params.id, 15);
        if (posts.length === 0)
            return res
                .status(200)
                .json({ message: "there are no posts published yet." });
        res.json(posts);
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.getPostByCommunity = getPostByCommunity;
const getPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reply = yield redis_1.redisClient.get(req.params.id);
        if (reply)
            return res.json(JSON.parse(reply));
        const post = yield post_model_1.default.findById(req.params.id)
            .populate("user", "username")
            .populate("community", "title");
        yield redis_1.redisClient.set(req.params.id, JSON.stringify(post));
        yield redis_1.redisClient.expire(req.params.id, 15);
        if (!post)
            return res.status(404).json({ message: "post not found" });
        res.json(post);
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.getPost = getPost;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const { title, text, category } = req.body;
        const communityFound = yield community_model_1.default.findById(req.params.id);
        if (!communityFound) {
            yield session.abortTransaction();
            yield session.endSession();
            return res
                .status(404)
                .json({ message: "community not found, can not post" });
        }
        const newPost = new post_model_1.default({
            title,
            text,
            user: req.user.id,
            category,
            community: communityFound.id,
        });
        if (((_a = req.files) === null || _a === void 0 ? void 0 : _a.image) && "tempFilePath" in req.files.image) {
            const result = yield (0, cloudinary_1.uploadImage)(req.files.image.tempFilePath);
            newPost.image = {
                public_id: result.public_id,
                secure_url: result.secure_url,
            };
            yield fs_extra_1.default.unlinkSync(req.files.image.tempFilePath);
        }
        yield newPost.save({ session });
        yield session.commitTransaction();
        yield session.endSession();
        res.json({
            title: newPost.title,
            text: newPost.text,
            user: newPost.user,
            category: newPost.category,
            image: newPost.image,
        });
    }
    catch (err) {
        yield session.endSession();
        return res.status(500).json({ message: err.message });
    }
});
exports.createPost = createPost;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const post = yield post_model_1.default.findByIdAndDelete(req.params.id);
        if (!post)
            return res.status(404).json({ message: "post not found" });
        if ((_b = post.image) === null || _b === void 0 ? void 0 : _b.public_id) {
            yield (0, cloudinary_1.deleteImage)(post.image.public_id);
        }
        res.status(204).json({ message: "post deleted successfully" });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.deletePost = deletePost;
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const post = yield post_model_1.default.findByIdAndUpdate(req.params.id, {
            $set: {
                title: req.body.title,
                text: req.body.text,
                edited: true,
            },
        }, { new: true, session });
        if (!post) {
            yield session.abortTransaction();
            yield session.endSession();
            return res.status(404).json({ message: "post not found" });
        }
        if (((_c = req.files) === null || _c === void 0 ? void 0 : _c.image) && "tempFilePath" in req.files.image) {
            if ((_d = post.image) === null || _d === void 0 ? void 0 : _d.public_id) {
                yield (0, cloudinary_1.deleteImage)(post.image.public_id);
            }
            const result = yield (0, cloudinary_1.uploadImage)(req.files.image.tempFilePath);
            post.image = {
                public_id: result.public_id,
                secure_url: result.secure_url,
            };
            yield fs_extra_1.default.unlinkSync(req.files.image.tempFilePath);
        }
        const isObjectChanged = yield post_model_1.default.exists({ _id: post._id, __v: post.__v });
        if (isObjectChanged) {
            yield session.abortTransaction();
            yield session.endSession();
            return res
                .status(409)
                .json({ message: "Some error occured, please try again" });
        }
        yield session.commitTransaction();
        yield session.endSession();
        res.json({
            title: post.title,
            text: post.text,
            image: post.image,
        });
    }
    catch (err) {
        yield session.endSession();
        return res.status(500).json({ message: err.message });
    }
});
exports.updatePost = updatePost;
