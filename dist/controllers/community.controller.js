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
exports.updateCommunity = exports.deleteCommunity = exports.createCommunity = exports.getCommunity = exports.getCommunities = void 0;
const community_model_1 = __importDefault(require("../models/community.model"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const cloudinary_1 = require("../utils/cloudinary");
const redis_1 = require("../utils/redis");
const getCommunities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reply = yield redis_1.redisClient.get("communities");
        if (reply)
            return res.json(JSON.parse(reply));
        const communities = yield community_model_1.default.find()
            .populate("user", "username")
            .populate("category", "title");
        yield redis_1.redisClient.set("communities", JSON.stringify(communities));
        yield redis_1.redisClient.expire("communities", 15);
        res.json(communities);
    }
    catch (err) {
        return res.status(500).json({ message: "something went wrong" });
    }
});
exports.getCommunities = getCommunities;
const getCommunity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reply = yield redis_1.redisClient.get(req.params.id);
        if (reply)
            return res.json(JSON.parse(reply));
        const community = yield community_model_1.default.findById(req.params.id)
            .populate("user", "username")
            .populate("category", "title");
        yield redis_1.redisClient.set(req.params.id, JSON.stringify(community));
        yield redis_1.redisClient.expire(req.params.id, 15);
        if (!community)
            return res.status(404).json({ message: "community not found" });
        res.json(community);
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.getCommunity = getCommunity;
const createCommunity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, description, category } = req.body;
        const newCommunity = new community_model_1.default({
            title,
            description,
            category,
            user: req.user.id,
        });
        if (((_a = req.files) === null || _a === void 0 ? void 0 : _a.image) && "tempFilePath" in req.files.image) {
            const result = yield (0, cloudinary_1.uploadImage)(req.files.image.tempFilePath);
            newCommunity.image = {
                public_id: result.public_id,
                secure_url: result.secure_url,
            };
            yield fs_extra_1.default.unlinkSync(req.files.image.tempFilePath);
        }
        yield newCommunity.save();
        res.json(newCommunity);
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.createCommunity = createCommunity;
//superuser can delete any community
const deleteCommunity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const community = yield community_model_1.default.findByIdAndDelete(req.params.id);
        if (!community)
            return res.status(404).json({ message: "community not found" });
        if ((_b = community.image) === null || _b === void 0 ? void 0 : _b.public_id) {
            yield (0, cloudinary_1.deleteImage)(community.image.public_id);
        }
        res.status(204).json({ message: "community deleted successfully" });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.deleteCommunity = deleteCommunity;
const updateCommunity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        const community = yield community_model_1.default.findByIdAndUpdate(req.params.id, {
            $set: {
                title: req.body.title,
                description: req.body.description,
                edited: true,
            },
        }, { new: true });
        if (!community)
            return res.status(404).json({ message: "community not found" });
        console.log("community updated successfully by its author");
        if (((_c = req.files) === null || _c === void 0 ? void 0 : _c.image) && "tempFilePath" in req.files.image) {
            if ((_d = community.image) === null || _d === void 0 ? void 0 : _d.public_id) {
                yield (0, cloudinary_1.deleteImage)(community.image.public_id);
            }
            const result = yield (0, cloudinary_1.uploadImage)(req.files.image.tempFilePath);
            community.image = {
                public_id: result.public_id,
                secure_url: result.secure_url,
            };
            yield fs_extra_1.default.unlinkSync(req.files.image.tempFilePath);
            const isObjectChanged = yield community_model_1.default.exists({
                _id: community.id,
                __v: community.__v,
            });
            if (isObjectChanged)
                return res
                    .status(409)
                    .json({ message: "community was updated by another user" });
        }
        res.json({
            title: community.title,
            description: community.text,
        });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.updateCommunity = updateCommunity;
