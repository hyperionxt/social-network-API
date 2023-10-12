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
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUser = exports.getUserByUsername = exports.getUsers = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const cloudinary_1 = require("../utils/cloudinary");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const redis_1 = require("../utils/redis");
const fs_extra_1 = __importDefault(require("fs-extra"));
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reply = yield redis_1.redisClient.get("users");
        if (reply)
            return res.json(JSON.parse(reply));
        const users = yield user_model_1.default.find().populate("role", "title");
        yield redis_1.redisClient.set("users", JSON.stringify(users));
        yield redis_1.redisClient.expire("users", 15);
        if (users.length === 0)
            return res
                .status(200)
                .json({ message: "there are not users registered yet" });
        res.json(users);
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.getUsers = getUsers;
const getUserByUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reply = yield redis_1.redisClient.get(req.query.username);
        if (reply)
            return res.json(JSON.parse(reply));
        const userFound = yield user_model_1.default.find({
            username: { $regex: req.query.username, $options: "i" },
        });
        yield redis_1.redisClient.set(req.query.username, JSON.stringify(userFound));
        yield redis_1.redisClient.expire(req.query.username, 15);
        res.json(userFound);
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.getUserByUsername = getUserByUsername;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reply = yield redis_1.redisClient.get(req.params.id);
        if (reply)
            return res.json(JSON.parse(reply));
        const user = yield user_model_1.default.findById(req.params.id).populate("role", "title");
        yield redis_1.redisClient.set(req.params.id, JSON.stringify(user));
        yield redis_1.redisClient.expire(req.params.id, 15);
        if (!user)
            return res.status(404).json({ message: "user not found" });
        res.json(user);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.getUser = getUser;
//no email validation since is being creating by an admin.
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password, role } = req.body;
        const emailFound = yield user_model_1.default.findOne({ email });
        if (emailFound)
            return res.status(400).json({ message: "Email already in use" });
        const usernameFound = yield user_model_1.default.findOne({ username });
        if (usernameFound)
            return res.status(400).json({ message: "Username already in use" });
        const roleFound = yield user_model_1.default.findOne({ title: role });
        if (!roleFound)
            return res.status(400).json({ message: "role not found" });
        const passHash = yield bcryptjs_1.default.hash(password, 10);
        const newUser = new user_model_1.default({
            username,
            email,
            password: passHash,
            verified: true,
            role: roleFound._id,
        });
        const userCreated = yield newUser.save();
        yield userCreated.populate("role");
        res.json(userCreated);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.createUser = createUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { password, role, username, email } = req.body;
        const verified = req.body.verified;
        const userFound = yield user_model_1.default.findById(req.params.id);
        if (!userFound)
            return res.status(404).json({ message: "user not found" });
        if (verified)
            userFound.verified = verified;
        if (username) {
            const usernameFound = yield user_model_1.default.findOne({ username });
            if (usernameFound)
                return res.status(400).json({ message: "Username already in use" });
        }
        if (email) {
            const emailFound = yield user_model_1.default.findOne({ email });
            if (emailFound)
                return res.status(400).json({ message: "Email already in use" });
        }
        if (password) {
            const passHash = yield bcryptjs_1.default.hash(password, 10);
            userFound.password = passHash;
        }
        if (role) {
            const roleFound = yield user_model_1.default.findOne({ title: role });
            if (!roleFound)
                return res.status(400).json({ message: "role not found" });
            userFound.role = roleFound._id;
        }
        const updatedUser = yield userFound.save();
        if (((_a = req.files) === null || _a === void 0 ? void 0 : _a.image) && "tempFilePath" in req.files.image) {
            if ((_b = userFound.image) === null || _b === void 0 ? void 0 : _b.public_id) {
                yield (0, cloudinary_1.deleteImage)(userFound.image.public_id);
            }
            const result = yield (0, cloudinary_1.uploadImage)(req.files.image.tempFilePath);
            userFound.image = {
                public_id: result.public_id,
                secure_url: result.secure_url,
            };
            yield fs_extra_1.default.unlinkSync(req.files.image.tempFilePath);
        }
        res.json(updatedUser);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userFound = yield user_model_1.default.findByIdAndDelete(req.params.id);
        if (!userFound)
            return res.status(404).json({ message: "user not found" });
        res.json({ message: "user deleted" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.deleteUser = deleteUser;
