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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var UserSchema_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const role_models_1 = require("./role.models");
let UserSchema = UserSchema_1 = class UserSchema {
    static findByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.find({ username });
        });
    }
};
exports.UserSchema = UserSchema;
__decorate([
    (0, typegoose_1.prop)({ required: true, unique: true, trim: true }),
    __metadata("design:type", String)
], UserSchema.prototype, "username", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, unique: true, trim: true }),
    __metadata("design:type", String)
], UserSchema.prototype, "email", void 0);
__decorate([
    (0, typegoose_1.prop)({ trim: true }),
    __metadata("design:type", String)
], UserSchema.prototype, "password", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: false, default: "" }),
    __metadata("design:type", String)
], UserSchema.prototype, "description", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => role_models_1.RoleSchema, required: true }),
    __metadata("design:type", Object)
], UserSchema.prototype, "role", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: false }),
    __metadata("design:type", Boolean)
], UserSchema.prototype, "verified", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], UserSchema.prototype, "googleId", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Object)
], UserSchema.prototype, "image", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: false }),
    __metadata("design:type", Boolean)
], UserSchema.prototype, "banned", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Date)
], UserSchema.prototype, "createdAt", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Date)
], UserSchema.prototype, "updatedAt", void 0);
exports.UserSchema = UserSchema = UserSchema_1 = __decorate([
    (0, typegoose_1.pre)("save", function (next) {
        const now = new Date();
        this.updatedAt = now;
        if (!this.createdAt) {
            this.createdAt = now;
        }
        next();
    })
], UserSchema);
exports.default = (0, typegoose_1.getModelForClass)(UserSchema);
