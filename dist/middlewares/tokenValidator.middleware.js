"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailTokenRequired = exports.passwordTokenRequired = exports.authRequired = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const authRequired = (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ message: "no token, unauthorized" });
    }
    else {
        if (config_1.JWT_SECRET_KEY) {
            jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET_KEY, (err, userDecoded) => {
                if (err)
                    return res
                        .status(401)
                        .json({ message: "token invalid, unauthorized" });
                console.log("authentication token approved!");
                req.user = userDecoded;
                next();
            });
        }
        else {
            throw new Error("JWT_SECRET_KEY is not defined");
        }
    }
};
exports.authRequired = authRequired;
const passwordTokenRequired = (req, res, next) => {
    const { token } = req.params;
    if (!token) {
        return res.status(401).json({
            message: "no password reset token, you cant reset your password",
        });
    }
    else {
        if (config_1.JWT_SECRET_KEY) {
            jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET_KEY, (err) => {
                if (err) {
                    return res
                        .status(401)
                        .json({ message: "invalid password reset token." });
                }
                console.log("password reset token approved.");
                next();
            });
        }
        else {
            throw new Error("JWT_SECRET_KEY is not defined");
        }
    }
};
exports.passwordTokenRequired = passwordTokenRequired;
const emailTokenRequired = (req, res, next) => {
    const { token } = req.params;
    if (!token) {
        return res.status(401).json({
            message: "no token, you can not complete your register",
        });
    }
    else {
        if (config_1.JWT_SECRET_KEY) {
            jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET_KEY, (err, userDecoded) => {
                if (err) {
                    return res.status(401).json({ message: "invalid email token." });
                }
                console.log("email token approved.");
                req.user = userDecoded;
                next();
            });
        }
        else {
            throw new Error("JWT_SECRET_KEY is not defined");
        }
    }
};
exports.emailTokenRequired = emailTokenRequired;
