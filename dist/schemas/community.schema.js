"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCommunitySchema = exports.createCommunitySchema = void 0;
const zod_1 = require("zod");
exports.createCommunitySchema = zod_1.z.object({
    title: zod_1.z.string({
        required_error: "Title is required, can not be empty.",
    }),
    category: zod_1.z.string({
        required_error: "Select one or more categories, please.",
    }),
});
exports.updateCommunitySchema = zod_1.z.object({
    title: zod_1.z.string({
        required_error: "Title is required, can not be empty.",
    }),
    description: zod_1.z.string(),
});
