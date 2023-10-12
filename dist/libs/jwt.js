"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmailToken = exports.createPasswordToken = exports.createAccessToken = void 0;
const config_1 = require("../config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function createAccessToken(payload) {
    return new Promise((resolve, reject) => {
        if (config_1.JWT_SECRET_KEY) {
            jsonwebtoken_1.default.sign(payload, config_1.JWT_SECRET_KEY, {
                expiresIn: "1d", // 24 hours
            }, (err, token) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(token);
                }
            });
        }
        else {
            reject(new Error("JWT_SECRET_KEY not defined"));
        }
    });
}
exports.createAccessToken = createAccessToken;
function createPasswordToken(payload) {
    return new Promise((resolve, reject) => {
        if (config_1.JWT_SECRET_KEY) {
            jsonwebtoken_1.default.sign(payload, config_1.JWT_SECRET_KEY, {
                expiresIn: "10m", //10 minutes
            }, (err, token) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(token);
                }
            });
        }
        else {
            reject(new Error("JWT_SECRET_KEY not defined"));
        }
    });
}
exports.createPasswordToken = createPasswordToken;
function createEmailToken(payload) {
    return new Promise((resolve, reject) => {
        if (config_1.JWT_SECRET_KEY) {
            jsonwebtoken_1.default.sign(payload, config_1.JWT_SECRET_KEY, {
                expiresIn: "1h", //1 hour,
            }, (err, token) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(token);
                }
            });
        }
        else {
            reject(new Error("JWT_SECRET_KEY not defined"));
        }
    });
}
exports.createEmailToken = createEmailToken;
