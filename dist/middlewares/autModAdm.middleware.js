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
exports.profilePermissions = exports.commentPermissions = exports.communityPermissions = exports.postPermissions = void 0;
const post_model_1 = __importDefault(require("../models/post.model"));
const community_model_1 = __importDefault(require("../models/community.model"));
const comments_model_1 = __importDefault(require("../models/comments.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const postPermissions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield post_model_1.default.findById(req.params.id);
        if (post &&
            (post.user.toString() === req.user.id ||
                req.user.role.title === "moderator" ||
                req.user.role.title === "admin")) {
            next();
        }
        else {
            return res.status(403).json({ message: "not authorized" });
        }
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.postPermissions = postPermissions;
const communityPermissions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const community = yield community_model_1.default.findById(req.params.id);
        if (!community)
            return res.status(404).json({ message: "community not found" });
        if (community.user.toString() === req.user.id ||
            req.user.role.title === "moderator" ||
            req.user.role.title === "admin") {
            next();
        }
        else {
            return res.status(403).json({ message: "not authorized" });
        }
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.communityPermissions = communityPermissions;
const commentPermissions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commentFound = yield comments_model_1.default.findById(req.params.id);
        if (!commentFound)
            return res.status(404).json({ message: "comment not found" });
        if (commentFound.user.toString() === req.user.id ||
            req.user.role.title === "moderator" ||
            req.user.role.title === "admin") {
            next();
        }
        else {
            return res.status(403).json({ message: "not authorized" });
        }
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.commentPermissions = commentPermissions;
const profilePermissions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userFound = yield user_model_1.default.findById(req.user.id);
        if (userFound ||
            req.user.role.title === "moderator" ||
            req.user.role.title === "admin") {
            next();
        }
        else {
            return res.status(403).json({ message: "not authorized" });
        }
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.profilePermissions = profilePermissions;
