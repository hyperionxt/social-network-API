import Post from "../models/post.model.js";
import Community from "../models/community.model.js";
import { redisClient } from "../utils/redis.js";

export const searchPostOrCommunities = async (req, res) => {
  try {
    const reply = await redisClient.get(req.query.value);
    if (reply) return res.json(JSON.parse(reply));

    const postsFound = await Post.find({
      title: { $regex: req.query.value, $options: "i" },
    }).populate("community", "title");
    const communitiesFound = await Community.find({
      title: { $regex: req.query.value, $options: "i" },
    });

    const results = {
      posts: postsFound,
      communities: communitiesFound,
    };
    await redisClient.set(req.query.value, JSON.stringify(results));
    await redisClient.expire(req.query.value, 15);
    res.json(results);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
