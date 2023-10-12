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
exports.newPassword = exports.forgotPassword = exports.updateProfile = exports.otherUserProfile = exports.myProfile = exports.signOut = exports.signIn = exports.userVerified = exports.signUp = void 0;
const jwt_1 = require("../libs/jwt");
const user_model_1 = __importDefault(require("../models/user.model"));
const role_models_1 = __importDefault(require("../models/role.models"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const cloudinary_1 = require("../utils/cloudinary");
const fs_extra_1 = __importDefault(require("fs-extra"));
const resend_1 = require("../utils/resend");
const redis_1 = require("../utils/redis");
const mongoose_1 = __importDefault(require("mongoose"));
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const { email, password, username } = req.body;
        const emailFound = yield user_model_1.default.findOne({ email });
        if (emailFound)
            return res.status(400).json({ message: "Email already in use" });
        const usernameFound = yield user_model_1.default.findOne({ username });
        if (usernameFound)
            return res.status(400).json({ message: "Username already in use" });
        const roleFound = yield role_models_1.default.findOne({ title: "regular" });
        if (!roleFound)
            return res
                .status(404)
                .json({ message: "Role 'regular' is required on database" });
        const passHash = yield bcryptjs_1.default.hash(password, 10);
        const newUser = new user_model_1.default({
            email,
            password: passHash,
            username,
            role: roleFound,
        });
        const userCreated = yield newUser.save({ session });
        const token = yield (0, jwt_1.createEmailToken)({
            id: userCreated._id,
            role: userCreated.role,
        });
        const subject = "Email confirmaation";
        const url = `http://localhost:3000/api/user-verified/${token}`;
        yield (0, resend_1.emailService)(email, url, subject);
        yield session.commitTransaction();
        session.endSession();
        return res.status(201).json({ message: "Email sent" });
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        return res.status(500).json({ message: error.message });
    }
});
exports.signUp = signUp;
const userVerified = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const session = yield mongoose_1.default.startSession();
    try {
        const newUser = yield user_model_1.default.findByIdAndUpdate(req.user.id, {
            $set: { verified: true },
        }, { new: true, session }).populate("role");
        if (!newUser) {
            yield session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "User does not exist" });
        }
        if (((_a = req.files) === null || _a === void 0 ? void 0 : _a.image) && "tempFilePath" in req.files.image) {
            const result = yield (0, cloudinary_1.uploadImage)(req.files.image.tempFilePath);
            newUser.image = {
                public_id: result.public_id,
                secure_url: result.secure_url,
            };
            yield fs_extra_1.default.unlinkSync(req.files.image.tempFilePath);
        }
        const token = yield (0, jwt_1.createAccessToken)({
            id: newUser._id,
            role: newUser.role,
        });
        res.cookie("token", token);
        res.json({
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            image: newUser.image.secure_url,
        });
        yield session.commitTransaction();
        session.endSession();
    }
    catch (error) {
        session.endSession();
        return res.status(500).json({ message: error.message });
    }
});
exports.userVerified = userVerified;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const userFound = yield user_model_1.default.findOne({ email }).populate("role");
        if (!userFound)
            return res.status(400).json({ message: "User not found" });
        if (userFound.verified === false)
            return res.status(400).json({
                message: "email not verified, check your inbox and use the confirmation link",
            });
        if (userFound.banned === true)
            return res.status(400).json({ message: "Cant login, you are banned" });
        const match = yield bcryptjs_1.default.compare(password, userFound.password);
        if (!match)
            return res.status(400).json({ message: "Invalid password" });
        const token = yield (0, jwt_1.createAccessToken)({
            id: userFound._id,
            role: userFound.role,
            banned: userFound.banned,
        });
        res.cookie("token", token);
        res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            role: userFound.role,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.signIn = signIn;
const signOut = (req, res) => {
    res.cookie("token", "", {
        expires: new Date(0),
    });
    console.log("Bye");
    return res.sendStatus(200);
};
exports.signOut = signOut;
const myProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reply = yield redis_1.redisClient.get(req.user.id);
        if (reply)
            return res.json(JSON.parse(reply));
        const userFound = yield user_model_1.default.findById(req.user.id);
        yield redis_1.redisClient.set(req.user.id, JSON.stringify(userFound));
        yield redis_1.redisClient.expire(req.user.id, 15);
        if (!userFound)
            return res.status(404).json({ message: "User does not exist" });
        return res.json({
            username: userFound.username,
            email: userFound.email,
            description: userFound.description,
            created: userFound.createdAt,
            image: userFound.image.secure_url,
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.myProfile = myProfile;
const otherUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reply = yield redis_1.redisClient.get(req.params.id);
        if (reply)
            return res.json(JSON.parse(reply));
        const userFound = yield user_model_1.default.findById(req.params.id);
        yield redis_1.redisClient.set(req.params.id, JSON.stringify(userFound));
        yield redis_1.redisClient.expire(req.params.id, 15);
        if (!userFound)
            return res.status(404).json({ message: "User does not exist" });
        return res.json({
            username: userFound.username,
            description: userFound.description,
            image: userFound.image.secure_url,
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.otherUserProfile = otherUserProfile;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const { oldPassword, password, username, email, description } = req.body;
        const userFound = yield user_model_1.default.findById(req.user.id).sesion(session);
        if (!userFound) {
            yield session.abortTransaction();
            session.endSession();
            return res.status(500).json({ message: "User not found" });
        }
        if (oldPassword) {
            const match = yield bcryptjs_1.default.compare(oldPassword, userFound.password);
            if (!match) {
                yield session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: "Invalid password" });
            }
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            userFound.password = hashedPassword;
        }
        if (email) {
            const emailFound = yield user_model_1.default.findOne({ email }).session(session);
            if (emailFound) {
                yield session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: "Email already in use" });
            }
            userFound.email = email;
        }
        if (description)
            userFound.description = description;
        if (username) {
            const usernameFound = yield user_model_1.default.findOne({ username });
            if (usernameFound) {
                yield session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: "Username already in use" });
            }
            userFound.username = username;
        }
        const updatedUser = yield userFound.save({ session });
        if (((_b = req.files) === null || _b === void 0 ? void 0 : _b.image) && "tempFilePath" in req.files.image) {
            if ((_c = userFound.image) === null || _c === void 0 ? void 0 : _c.public_id) {
                yield (0, cloudinary_1.deleteImage)(userFound.image.public_id);
            }
            const result = yield (0, cloudinary_1.uploadImage)(req.files.image.tempFilePath);
            userFound.image = {
                public_id: result.public_id,
                secure_url: result.secure_url,
            };
            yield fs_extra_1.default.unlinkSync(req.files.image.tempFilePath);
        }
        yield session.commitTransaction();
        session.endSession();
        res.json({
            username: updatedUser.username,
            email: updatedUser.email,
            description: updatedUser.description,
            verified: updatedUser.verified,
            image: updatedUser.image.secure_url,
        });
        console.log("Profile updated successfully");
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: error.message });
    }
});
exports.updateProfile = updateProfile;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const userFound = yield user_model_1.default.findOne({ email });
        if (!userFound)
            return res.status(404).json({ message: "User not found" });
        const token = yield (0, jwt_1.createPasswordToken)({
            email: userFound.email,
            id: userFound._id,
        });
        const subject = "Reset Password";
        const url = `http://localhost:3000/api/reset-password/${userFound._id}/${token}`;
        yield (0, resend_1.emailService)(email, url, subject);
        res.status(200).json({ message: "Email sent, please check your inbox" });
    }
    catch (error) {
        return res.status(404).json({ message: error.message });
    }
});
exports.forgotPassword = forgotPassword;
const newPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const { password } = req.body;
        const passHash = yield bcryptjs_1.default.hash(password, 10);
        const userFound = yield user_model_1.default.findByIdAndUpdate(req.params.id, { $set: { password: passHash } }, { new: true, session });
        if (!userFound) {
            yield session.abortTransaction();
            yield session.endSession();
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "Password updated successfully" });
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        return res.status(404).json({ message: err.message });
    }
});
exports.newPassword = newPassword;
