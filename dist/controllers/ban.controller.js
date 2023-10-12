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
exports.updateBannedUser = exports.unBanUser = exports.createBannedUser = exports.getBannedUser = exports.getBannedUsers = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ban_model_1 = __importDefault(require("../models/ban.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const getBannedUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = ban_model_1.default.find().populate("user");
        if (!users)
            return res.status(200).json({ message: "No banned users" });
        res.json({
            id: users._id,
            username: users.username,
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.getBannedUsers = getBannedUsers;
const getBannedUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = ban_model_1.default.findById(req.params.id).populate("user");
        if (!user)
            return res.status(404).json({ message: "User not found" });
        res.json(user);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.getBannedUser = getBannedUser;
const createBannedUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const reason = req.body;
        const userFound = yield user_model_1.default.findById(req.params.id);
        if (!userFound) {
            yield session.abortTransaction();
            yield session.endSession();
            return res.status(404).json({ message: "user not found" });
        }
        if (userFound.banned) {
            yield session.abortTransaction();
            yield session.endSession();
            return res.status(400).json({ message: "user already banned" });
        }
        userFound.banned = true;
        const userBanned = new ban_model_1.default({
            user: userFound._id,
            reason: reason,
        });
        yield userBanned.save({ session });
        yield userFound.save({ session });
        yield session.commitTransaction();
        yield session.endSession();
        res.json({ message: "user banned" });
    }
    catch (error) {
        yield session.endSession();
        return res.status(500).json({ message: error.message });
    }
});
exports.createBannedUser = createBannedUser;
const unBanUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const userFound = yield user_model_1.default.findById(req.params.id);
        if (!userFound) {
            yield session.abortTransaction();
            yield session.endSession();
            return res.status(404).json({ message: "user not found" });
        }
        yield ban_model_1.default.findByIdAndDelete({ user: userFound._id });
        userFound.banned = false;
        yield userFound.save();
        res.json(userFound);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.unBanUser = unBanUser;
const updateBannedUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const reason = req.body;
        const userBanned = yield ban_model_1.default.findOneAndUpdate({ user: req.params.id }, reason, {
            new: true,
            session,
        });
        if (!userBanned) {
            yield session.abortTransaction();
            yield session.endSession();
            return res.status(404).json({ message: "user not found" });
        }
        yield session.commitTransaction();
        yield session.endSession();
        res.json(userBanned);
    }
    catch (error) {
        yield session.endSession();
        return res.status(500).json({ message: error.message });
    }
});
exports.updateBannedUser = updateBannedUser;
