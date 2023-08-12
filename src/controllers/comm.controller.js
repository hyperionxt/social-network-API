import Community from "../models/community.model.js";
import fs from "fs-extra";
import { uploadImage, deleteImage } from "../utils/cloudinary.js";

export const getCommunities = async (req, res) => {
  try {
    const communities = await Community.find();
    res.json(communities);
  } catch (err) {
    return res.status(500).json({ message: "something went wrong" });
  }
};
export const getCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community)
      return res.status(404).json({ message: "community not found" });
    res.json(community);
  } catch (err) {
    return res.status(404).json({ message: "community not found" });
  }
};
export const createCommunity = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const newCommunity = new Community({
      title,
      description,
      category,
      user: req.user.id,
    });

    if (req.files?.image) {
      const result = await uploadImage(req.files.image.tempFilePath);
      newCommunity.image = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };

      await fs.unlinkSync(req.files.image.tempFilePath);
    }
    await newCommunity.save();
    res.json(newCommunity);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};
//superuser can delete any community
export const deleteCommunity = async (req, res) => {
  try {
    if (req.user.superuser == true) {
      const community = await Community.findByIdAndDelete(req.params.id);

      if (!community)
        return res.status(404).json({ message: "community not found" });

      if (community.image?.public_id) {
        await deleteImage(community.image.public_id);
      }
      res.status(204).json({ message: "community deleted successfully" });
    } else {
      const community = await Community.findOneAndDelete({
        _id: req.params.id,
        user: req.user.id,
      });
      if (!community)
        return res.status(404).json({ message: "community not found" });
      if (community.image?.public_id) {
        await deleteImage(community.image.public_id);
      }
      res.status(204).json({ message: "community deleted successfully" });
    }
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};

//superuser can update any community
export const updateCommunity = async (req, res) => {
  try {
    if (req.user.superuser == true) {
      const community = await Community.findByIdAndUpdate(
        req.params.id,
        { ...req.body, edited: true },
        { new: true }
      );

      if (!community)
        return res.status(500).json({ message: "community not found" });
      if (req.files?.image) {
        if (community.image?.public_id) {
          await deleteImage(community.image.public_id);
        }
        const result = await uploadImage(req.files.image.tempFilePath);
        community.image = {
          public_id: result.public_id,
          secure_url: result.secure_url,
        };
        await fs.unlinkSync(req.files.image.tempFilePath);
      }
      console.log("community updated successfully by superuser");
      res.json(community);
    } else {
      const community = await Community.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
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
      res.json({
        title: community.title,
        description: community.description,
      });
    }
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};
