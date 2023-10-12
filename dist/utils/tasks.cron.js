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
exports.deleteOldReports = exports.unbanningUsers = exports.unverifiedUsers = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const user_model_1 = __importDefault(require("../models/user.model"));
const report_model_1 = __importDefault(require("../models/report.model"));
const ban_model_1 = __importDefault(require("../models/ban.model"));
const unverifiedUsers = () => {
    try {
        node_cron_1.default.schedule("0 0 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
            const currentTime = new Date();
            const nextTask = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000);
            currentTime.setHours(currentTime.getHours() - 2);
            const deletedUsers = yield user_model_1.default.deleteMany({
                verified: false,
                createdAt: { $lt: currentTime },
            });
            console.log(`Task completed at ${new Date()}`);
            console.log(`Deleted ${deletedUsers.deletedCount} unverified users.`);
            console.log(`Next check at ${nextTask}`);
        }));
    }
    catch (error) {
        console.log(error);
    }
};
exports.unverifiedUsers = unverifiedUsers;
const unbanningUsers = () => {
    try {
        node_cron_1.default.schedule("0 20 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
            const bannedUsers = yield ban_model_1.default.find({
                createdAt: { $lte: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
            });
            if (bannedUsers.length === 0)
                return console.log("No banned users to unban, task complete!");
            for (const bannedUser of bannedUsers) {
                const userFound = yield user_model_1.default.findOne({ user: bannedUser.user });
                if (userFound) {
                    userFound.banned = false;
                    yield userFound.save();
                }
            }
            console.log(`task complete! unbanned ${bannedUsers.length} users`);
        }));
    }
    catch (error) {
        console.log(error);
    }
};
exports.unbanningUsers = unbanningUsers;
const deleteOldReports = () => {
    try {
        node_cron_1.default.schedule("0 15 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
            const oldReports = yield report_model_1.default.findOneAndDelete({
                createdAt: { $lte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
            });
            if (!oldReports)
                return console.log("no reports to delete");
        }));
    }
    catch (error) {
        console.log(error);
    }
};
exports.deleteOldReports = deleteOldReports;
