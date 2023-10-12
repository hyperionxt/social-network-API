"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdminProfile = exports.createRoles = void 0;
const role_models_1 = __importDefault(require("../models/role.models"));
const user_model_1 = __importDefault(require("../models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const createRoles = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const elements = yield role_models_1.default.estimatedDocumentCount();
        if (elements > 0)
            return;
        yield Promise.all([
            new role_models_1.default({ title: "regular" }).save(),
            new role_models_1.default({ title: "moderator" }).save(),
            new role_models_1.default({ title: "admin" }).save(),
        ]);
        console.log("regular, moderator and admin roles created successfully");
    }
    catch (error) {
        console.log(error);
    }
});
exports.createRoles = createRoles;
const createAdminProfile = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminRole = yield role_models_1.default.findOne({ title: "admin" });
        if (!adminRole) {
            return console.log("Admin role not found");
        }
        const adminFound = yield user_model_1.default.findOne({ role: adminRole._id });
        if (adminFound)
            return;
        const username = "admin";
        const email = "admin@potato.com";
        const password = "adminpassword";
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newAdmin = new user_model_1.default({
            username,
            email,
            password: hashedPassword,
            role: adminRole._id,
            verified: true,
        });
        yield newAdmin.save();
        console.log("\n");
        console.log("Username: ", username);
        console.log("Email: ", email);
        console.log("Password: ", password);
        console.log("Admin profile created successfully!");
        console.log(`Login with this credentials`);
    }
    catch (error) {
        console.error(error);
    }
});
exports.createAdminProfile = createAdminProfile;
