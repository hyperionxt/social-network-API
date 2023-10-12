import Suscription from "../models/suscriptions.model";
import Community from "../models/community.model";
import { redisClient } from "../utils/redis";
import { Response, Request } from "express";

//suscriptions that belongs to the user.
export const getSuscriptions = async (req: Request, res: Response) => {
  try {
    const reply = await redisClient.get("suscriptions");
    if (reply) return res.json(JSON.parse(reply));
    const suscriptionsFound = await Suscription.find({
      user: req.user.id,
    }).populate("community", "title");
    await redisClient.set("suscriptions", JSON.stringify(suscriptionsFound));
    await redisClient.expire("suscriptions", 15);
    res.json(suscriptionsFound);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
export const createSuscription = async (req: Request, res: Response) => {
  try {
    const suscriptionFound = await Suscription.findOne({
      community: req.params.id,
      user: req.user.id,
    });
    if (suscriptionFound)
      return res.status(400).json({ message: "you are already suscribed" });

    const newSuscription = new Suscription({
      community: req.params.id,
      user: req.user.id,
    });
    const communityFound = await Community.findById(req.params.id);
    if (!communityFound)
      return res.status(400).json({ message: "community not found" });
    communityFound.members += 1;
    await communityFound.save();
    await newSuscription.save();
    return res.status(201).json({ message: "suscription created" });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteSuscription = async (req: Request, res: Response) => {
  try {
    const suscriptionFound = await Suscription.findOneAndDelete({
      community: req.params.id,
      user: req.user.id,
    });
    if (!suscriptionFound)
      return res.status(400).json({ message: "suscription not found" });
    const communityFound = await Community.findById(req.params.id);
    if (!communityFound)
      return res.status(400).json({ message: "community not found" });
    communityFound.members -= 1;
    return res.status(204).json({ message: "suscription deleted" });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
