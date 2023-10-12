"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBanSchema = void 0;
const zod_1 = require("zod");
exports.createBanSchema = zod_1.z.object({
    reason: zod_1.z.string({
        required_error: "Reason is required",
    }),
});
