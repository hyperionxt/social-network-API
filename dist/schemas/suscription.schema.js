"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSuscriptionSchema = void 0;
const zod_1 = require("zod");
exports.createSuscriptionSchema = zod_1.z.object({
    community: zod_1.z.string({
        required_error: "community is required",
    }),
});
