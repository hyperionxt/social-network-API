"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentSchema = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const user_model_1 = require("./user.model");
const post_model_1 = require("./post.model");
let CommentSchema = class CommentSchema {
};
exports.CommentSchema = CommentSchema;
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], CommentSchema.prototype, "text", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => user_model_1.UserSchema, required: true }),
    __metadata("design:type", Object)
], CommentSchema.prototype, "user", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => post_model_1.PostSchema, required: true }),
    __metadata("design:type", Object)
], CommentSchema.prototype, "post", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => CommentSchema }),
    __metadata("design:type", Object)
], CommentSchema.prototype, "parentComment", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => CommentSchema }),
    __metadata("design:type", Array)
], CommentSchema.prototype, "replies", void 0);
exports.CommentSchema = CommentSchema = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            timestamps: true,
        },
    })
], CommentSchema);
exports.default = (0, typegoose_1.getModelForClass)(CommentSchema);
