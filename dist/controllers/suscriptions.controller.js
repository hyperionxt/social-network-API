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
exports.deleteSuscription = exports.createSuscription = exports.getSuscriptions = void 0;
const suscriptions_model_1 = __importDefault(require("../models/suscriptions.model"));
const community_model_1 = __importDefault(require("../models/community.model"));
const redis_1 = require("../utils/redis");
//suscriptions that belongs to the user.
const getSuscriptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reply = yield redis_1.redisClient.get("suscriptions");
        if (reply)
            return res.json(JSON.parse(reply));
        const suscriptionsFound = yield suscriptions_model_1.default.find({
            user: req.user.id,
        }).populate("community", "title");
        yield redis_1.redisClient.set("suscriptions", JSON.stringify(suscriptionsFound));
        yield redis_1.redisClient.expire("suscriptions", 15);
        res.json(suscriptionsFound);
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.getSuscriptions = getSuscriptions;
const createSuscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const suscriptionFound = yield suscriptions_model_1.default.findOne({
            community: req.params.id,
            user: req.user.id,
        });
        if (suscriptionFound)
            return res.status(400).json({ message: "you are already suscribed" });
        const newSuscription = new suscriptions_model_1.default({
            community: req.params.id,
            user: req.user.id,
        });
        const communityFound = yield community_model_1.default.findById(req.params.id);
        if (!communityFound)
            return res.status(400).json({ message: "community not found" });
        communityFound.members += 1;
        yield communityFound.save();
        yield newSuscription.save();
        return res.status(201).json({ message: "suscription created" });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.createSuscription = createSuscription;
const deleteSuscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const suscriptionFound = yield suscriptions_model_1.default.findOneAndDelete({
            community: req.params.id,
            user: req.user.id,
        });
        if (!suscriptionFound)
            return res.status(400).json({ message: "suscription not found" });
        const communityFound = yield community_model_1.default.findById(req.params.id);
        if (!communityFound)
            return res.status(400).json({ message: "community not found" });
        communityFound.members -= 1;
        return res.status(204).json({ message: "suscription deleted" });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.deleteSuscription = deleteSuscription;
