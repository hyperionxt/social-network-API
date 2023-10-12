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
exports.PostSchema = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const user_model_1 = require("./user.model");
const category_model_1 = require("./category.model");
const community_model_1 = require("./community.model");
let PostSchema = class PostSchema {
};
exports.PostSchema = PostSchema;
__decorate([
    (0, typegoose_1.prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], PostSchema.prototype, "title", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: false, trim: true }),
    __metadata("design:type", String)
], PostSchema.prototype, "text", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => user_model_1.UserSchema, required: true }),
    __metadata("design:type", Object)
], PostSchema.prototype, "user", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => category_model_1.CategorySchema, required: true }),
    __metadata("design:type", Array)
], PostSchema.prototype, "category", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => community_model_1.CommunitySchema, required: true }),
    __metadata("design:type", Object)
], PostSchema.prototype, "community", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Object)
], PostSchema.prototype, "image", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: false }),
    __metadata("design:type", Boolean)
], PostSchema.prototype, "edited", void 0);
exports.PostSchema = PostSchema = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            timestamps: true,
        },
    })
], PostSchema);
exports.default = (0, typegoose_1.getModelForClass)(PostSchema);
