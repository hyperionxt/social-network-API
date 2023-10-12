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
exports.updateComments = exports.deleteComments = exports.createReply = exports.createComments = exports.getCommentOrReply = exports.getCommentsByPost = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const comments_model_1 = __importDefault(require("../models/comments.model"));
const post_model_1 = __importDefault(require("../models/post.model"));
const redis_1 = require("../utils/redis");
const getCommentsByPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reply = yield redis_1.redisClient.get(req.params.postId);
        if (reply)
            return res.json(JSON.parse(reply));
        const comments = yield comments_model_1.default.find({ post: req.params.postId })
            .populate({
            path: "replies",
            populate: {
                path: "user",
                select: "username",
            },
        })
            .populate("user", "username");
        yield redis_1.redisClient.set(req.params.postId, JSON.stringify(comments));
        yield redis_1.redisClient.expire(req.params.postId, 15);
        if (comments.length === 0)
            return res.status(200).json({ message: "there are no comments" });
        res.json(comments);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.getCommentsByPost = getCommentsByPost;
const getCommentOrReply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reply = yield redis_1.redisClient.get(req.params.commentId);
        if (reply)
            return res.json(JSON.parse(reply));
        const comment = yield comments_model_1.default.findById(req.params.commentId).populate("user", "username");
        if (!comment)
            return res.status(404).json({ message: "comment not found" });
        yield redis_1.redisClient.set(req.params.commentId, JSON.stringify(comment));
        yield redis_1.redisClient.expire(req.params.commentId, 15);
        res.json(comment);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.getCommentOrReply = getCommentOrReply;
const createComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const text = req.body.text;
        const postFound = yield post_model_1.default.findById(req.params.postId);
        if (!postFound) {
            yield session.abortTransaction();
            yield session.endSession();
            return res.status(404).json({ message: "post not found" });
        }
        const newComment = new comments_model_1.default({
            text,
            user: req.user.id,
            post: req.params.postId,
        });
        yield newComment.save({ session });
        yield session.commitTransaction();
        yield session.endSession();
        res.json(newComment);
    }
    catch (error) {
        yield session.endSession();
        return res.status(500).json({ message: error.message });
    }
});
exports.createComments = createComments;
const createReply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const { text } = req.body;
        const commentFound = yield comments_model_1.default.findById(req.params.commentId);
        if (!commentFound) {
            yield session.abortTransaction();
            yield session.endSession();
            return res.status(404).json({ message: "comment not found" });
        }
        const newReply = new comments_model_1.default({
            text,
            user: req.user.id,
            parentComment: commentFound._id,
        });
        yield newReply.save({ session });
        commentFound.replies.push(newReply);
        yield commentFound.save({ session });
        yield session.commitTransaction();
        yield session.endSession();
        res.json(newReply);
    }
    catch (error) {
        yield session.endSession();
        return res.status(500).json({ message: error.message });
    }
});
exports.createReply = createReply;
const deleteComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const comment = yield comments_model_1.default.findByIdAndDelete(req.params.commentId);
        if (!comment) {
            yield session.abortTransaction();
            yield session.endSession();
            return res.status(404).json({ message: "comment not found" });
        }
        yield session.commitTransaction();
        yield session.endSession();
        return res.status(200).json({ messsage: "comment deleted successfully" });
    }
    catch (err) {
        yield session.endSession();
        return res.status(500).json({ message: err.message });
    }
});
exports.deleteComments = deleteComments;
const updateComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const comment = yield comments_model_1.default.findByIdAndUpdate(req.params.commentId, { $set: { text: req.body.text, edited: true } }, { new: true, session });
        if (!comment) {
            yield session.abortTransaction();
            yield session.endSession();
            return res.status(404).json({ message: "comment not found" });
        }
        yield session.commitTransaction();
        yield session.endSession();
        return res.json({ message: "comment updated!" });
    }
    catch (error) {
        yield session.endSession();
        return res.status(500).json({ message: error.message });
    }
});
exports.updateComments = updateComments;
