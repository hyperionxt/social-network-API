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
exports.updateCategory = exports.deleteCategory = exports.createCategory = exports.getPostsByCategory = exports.getCategories = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const category_model_1 = __importDefault(require("../models/category.model"));
const post_model_1 = __importDefault(require("../models/post.model"));
const redis_1 = require("../utils/redis");
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reply = yield redis_1.redisClient.get("categories");
        if (reply)
            return res.json(JSON.parse(reply));
        const categories = yield category_model_1.default.find();
        if (!categories)
            return res.status(404).json({ message: "No categories created yet" });
        yield redis_1.redisClient.set("categories", JSON.stringify(categories));
        yield redis_1.redisClient.expire("categories", 15);
        res.json(categories);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.getCategories = getCategories;
const getPostsByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reply = yield redis_1.redisClient.get(req.params.id);
        if (reply)
            return res.json(JSON.parse(reply));
        const postsFound = yield post_model_1.default.find({ category: req.params.id });
        if (!postsFound)
            return res.status(404).json({ message: "Not found" });
        yield redis_1.redisClient.set(req.params.id, JSON.stringify(postsFound));
        yield redis_1.redisClient.expire(req.params.id, 15);
        res.json(postsFound);
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.getPostsByCategory = getPostsByCategory;
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const { title } = req.body;
        const categoryFound = yield category_model_1.default.findOne({ title });
        if (categoryFound) {
            yield session.abortTransaction();
            yield session.endSession();
            return res.status(400).json({ message: "Category already exists" });
        }
        const newCategory = new category_model_1.default({
            title,
            author: req.user.id,
        });
        yield newCategory.save({ session });
        yield session.commitTransaction();
        yield session.endSession();
        res.json(newCategory);
    }
    catch (err) {
        yield session.endSession();
        return res.status(500).json({ message: err.message });
    }
});
exports.createCategory = createCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const category = yield category_model_1.default.findByIdAndDelete(req.params.id);
        if (!category) {
            yield session.abortTransaction();
            yield session.endSession();
            return res.status(404).json({ message: "Category not found" });
        }
        yield session.commitTransaction();
        yield session.endSession();
        return res.status(200).json({ message: "Category deleted" });
    }
    catch (err) {
        yield session.endSession();
        return res.status(500).json({ message: err.message });
    }
});
exports.deleteCategory = deleteCategory;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const category = yield category_model_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            session,
        });
        if (!category) {
            yield session.abortTransaction();
            yield session.endSession();
            return res.status(404).json({ message: "Category not found" });
        }
        yield session.commitTransaction();
        yield session.endSession();
        return res.json({ message: "category updated!" });
    }
    catch (err) {
        yield session.endSession();
        return res.status(500).json({ message: err.message });
    }
});
exports.updateCategory = updateCategory;
