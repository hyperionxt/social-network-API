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
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../config");
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!config_1.MONGODB_URI)
            throw new Error("MONGODB_URI is undefined");
        const db = yield mongoose_1.default.connect(config_1.MONGODB_URI);
        console.log(`>>>> Connection established to ${db.connection.db.databaseName} database on MongoDb Atlas (4/4)`);
    }
    catch (error) {
        if (error instanceof Error)
            console.log(error.message);
    }
});
exports.connectDB = connectDB;
