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
exports.deleteAllReportsByUserId = exports.deleteOneReport = exports.createReport = exports.getReportsById = exports.getReports = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const post_model_1 = __importDefault(require("../models/post.model"));
const community_model_1 = __importDefault(require("../models/community.model"));
const comments_model_1 = __importDefault(require("../models/comments.model"));
const report_model_1 = __importDefault(require("../models/report.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const getReports = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reportsFound = yield report_model_1.default.find();
        if (!reportsFound)
            return res.status(200).json({ message: "no reports yet" });
        res.json(reportsFound);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.getReports = getReports;
const getReportsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reportsFound = yield report_model_1.default.findById(req.params.id);
        if (!reportsFound)
            return res.status(200).json({ message: "this user has not reports" });
        res.json(reportsFound);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.getReportsById = getReportsById;
const createReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const { context } = req.body;
        const userFound = yield user_model_1.default.findById(req.params.userId);
        if (!userFound || userFound.verified === false) {
            yield session.endSession();
            yield session.abortTransaction();
            return res.status(400).json({ message: "Not found or invalid" });
        }
        let elementFound;
        elementFound = yield post_model_1.default.findById(req.params.elementId);
        if (!elementFound) {
            elementFound = yield comments_model_1.default.findById(req.params.elementId);
        }
        if (!elementFound) {
            elementFound = yield community_model_1.default.findById(req.params.elementId);
        }
        if (!elementFound) {
            yield session.endSession();
            yield session.abortTransaction();
            return res.status(404).json({ message: "Object not found or invalid" });
        }
        const newReport = new report_model_1.default({
            userReported: { username: userFound.username, id: userFound._id },
            reportedBy: req.user.id,
            context,
            elementsReported: {
                id: elementFound._id,
                text: elementFound.text,
            }, //saving text or title in cases when user deletes the prof and admin cant find it.
        });
        yield newReport.save({ session });
        yield session.commitTransaction();
        yield session.endSession();
        return res.status(200).json(newReport);
    }
    catch (error) {
        yield session.endSession();
        return res.status(500).json({ message: error.message });
    }
});
exports.createReport = createReport;
const deleteOneReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reportFound = yield report_model_1.default.findByIdAndDelete(req.params.id);
        if (!reportFound)
            return res.status(404).json({ message: "report not found or invalid" });
        return res.status(200).json({ message: "report deleted" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.deleteOneReport = deleteOneReport;
const deleteAllReportsByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reportsFound = yield report_model_1.default.deleteMany({
            userReported: req.params.id,
        });
        if (!reportsFound)
            return res.status(404).json({ message: "this user has not reports" });
        return res.status(200).json({ message: "all reports deleted" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.deleteAllReportsByUserId = deleteAllReportsByUserId;
