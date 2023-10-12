"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUploadMiddleware = void 0;
const express_fileupload_1 = __importDefault(require("express-fileupload"));
exports.fileUploadMiddleware = (0, express_fileupload_1.default)({
    useTempFiles: true,
    tempFileDir: "./src/uploads",
});
