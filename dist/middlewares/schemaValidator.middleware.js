"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaValidator = void 0;
const zod_1 = require("zod");
const schemaValidator = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            return res.status(400).json(err.errors.map((errors) => errors.message));
        }
    }
};
exports.schemaValidator = schemaValidator;
