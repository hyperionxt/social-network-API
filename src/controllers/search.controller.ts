import Post from "../models/post.model";
import Community from "../models/community.model";
import { redisClient } from "../utils/redis";
import { Response, Request } from "express";

export const searchPostOrCommunities = async (req: Request, res: Response) => {
  try {
    const reply = await redisClient.get(req.query.value as string);
    if (reply) return res.json(JSON.parse(reply));

    const postsFound = await Post.find({
      title: { $regex: req.query.value as string, $options: "i" },
    }).populate("community", "title");
    const communitiesFound = await Community.find({
      title: { $regex: req.query.value as string, $options: "i" },
    });

    const results = {
      posts: postsFound,
      communities: communitiesFound,
    };
    await redisClient.set(req.query.value as string, JSON.stringify(results));
    await redisClient.expire(req.query.value as string, 15);
    res.json(results);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
