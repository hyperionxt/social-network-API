"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReportSchema = void 0;
const zod_1 = require("zod");
exports.createReportSchema = zod_1.z.object({
    context: zod_1.z.string({
        required_error: "Context is required",
    }),
});
