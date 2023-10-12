"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePostSchema = exports.createPostSchema = void 0;
const zod_1 = require("zod");
exports.createPostSchema = zod_1.z.object({
    title: zod_1.z.string({
        required_error: "title cannot be empty",
    }),
});
exports.updatePostSchema = zod_1.z.object({
    title: zod_1.z.string({
        required_error: "title cannot be empty",
    }),
    description: zod_1.z.string(),
});
