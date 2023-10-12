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
exports.CommunitySchema = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const user_model_1 = require("./user.model");
const category_model_1 = require("./category.model");
let CommunitySchema = class CommunitySchema {
};
exports.CommunitySchema = CommunitySchema;
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], CommunitySchema.prototype, "title", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], CommunitySchema.prototype, "text", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => user_model_1.UserSchema, required: true }),
    __metadata("design:type", Object)
], CommunitySchema.prototype, "user", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => category_model_1.CategorySchema, required: true }),
    __metadata("design:type", Array)
], CommunitySchema.prototype, "category", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: 0 }),
    __metadata("design:type", Number)
], CommunitySchema.prototype, "members", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: false }),
    __metadata("design:type", String)
], CommunitySchema.prototype, "edited", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Object)
], CommunitySchema.prototype, "image", void 0);
exports.CommunitySchema = CommunitySchema = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            timestamps: true,
        },
    })
], CommunitySchema);
exports.default = (0, typegoose_1.getModelForClass)(CommunitySchema);
