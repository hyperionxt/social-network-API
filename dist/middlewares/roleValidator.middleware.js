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
Object.defineProperty(exports, "__esModule", { value: true });
exports.moderatorOrAdmin = exports.adminRequired = void 0;
const adminRequired = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRole = req.user.role.title;
        if (userRole !== "admin")
            return res.status(403).json({ message: "not authorized" });
        next();
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.adminRequired = adminRequired;
const moderatorOrAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRole = req.user.role;
        if (userRole.title !== "moderator" && userRole.title !== "admin")
            return res.status(403).json({ message: "not authorized" });
        next();
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.moderatorOrAdmin = moderatorOrAdmin;
