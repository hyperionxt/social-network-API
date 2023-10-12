import Community from "../models/community.model";
import fs from "fs-extra";
import { uploadImage, deleteImage } from "../utils/cloudinary";
import { redisClient } from "../utils/redis";
import { Response, Request } from "express";

export const getCommunities = async (req: Request, res: Response) => {
  try {
    const reply = await redisClient.get("communities");
    if (reply) return res.json(JSON.parse(reply));
    const communities = await Community.find()
      .populate("user", "username")
      .populate("category", "title");

    await redisClient.set("communities", JSON.stringify(communities));
    await redisClient.expire("communities", 15);
    res.json(communities);
  } catch (err: any) {
    return res.status(500).json({ message: "something went wrong" });
  }
};
export const getCommunity = async (req: Request, res: Response) => {
  try {
    const reply = await redisClient.get(req.params.id);
    if (reply) return res.json(JSON.parse(reply));
    const community = await Community.findById(req.params.id)
      .populate("user", "username")
      .populate("category", "title");
    await redisClient.set(req.params.id, JSON.stringify(community));
    await redisClient.expire(req.params.id, 15);
    if (!community)
      return res.status(404).json({ message: "community not found" });
    res.json(community);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
export const createCommunity = async (req: Request, res: Response) => {
  try {
    const { title, description, category } = req.body;
    const newCommunity = new Community({
      title,
      description,
      category,
      user: req.user.id,
    });

    if (req.files?.image && "tempFilePath" in req.files.image) {
      const result = await uploadImage(req.files.image.tempFilePath);
      newCommunity.image = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };

      await fs.unlinkSync(req.files.image.tempFilePath);
    }
    await newCommunity.save();
    res.json(newCommunity);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
//superuser can delete any community
export const deleteCommunity = async (req: Request, res: Response) => {
  try {
    const community = await Community.findByIdAndDelete(req.params.id);
    if (!community)
      return res.status(404).json({ message: "community not found" });
    if (community.image?.public_id) {
      await deleteImage(community.image.public_id);
    }
    res.status(204).json({ message: "community deleted successfully" });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateCommunity = async (req: Request, res: Response) => {
  try {
    const community = await Community.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          edited: true,
        },
      },
      { new: true }
    );

    if (!community)
      return res.status(404).json({ message: "community not found" });
    console.log("community updated successfully by its author");
    if (req.files?.image && "tempFilePath" in req.files.image) {
      if (community.image?.public_id) {
        await deleteImage(community.image.public_id);
      }
      const result = await uploadImage(req.files.image.tempFilePath);
      community.image = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };
      await fs.unlinkSync(req.files.image.tempFilePath);

      const isObjectChanged = await Community.exists({
        _id: community.id,
        __v: community.__v,
      });

      if (isObjectChanged)
        return res
          .status(409)
          .json({ message: "community was updated by another user" });
    }
    res.json({
      title: community.title,
      description: community.text,
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
