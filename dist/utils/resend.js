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
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
const resend_1 = require("resend");
const config_1 = require("../config");
const emailService = (email, url, subject) => __awaiter(void 0, void 0, void 0, function* () {
    if (!config_1.DOMAIN)
        throw new Error("DOMAIN IS REQUIRED");
    try {
        const resend = new resend_1.Resend(config_1.RESEND_API_KEY);
        yield resend.emails.send({
            from: config_1.DOMAIN,
            to: email,
            subject: subject,
            text: url,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.emailService = emailService;
