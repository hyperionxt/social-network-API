import Community from "../models/community.model.js";

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
      author: req.user.id,
    });
    await newCommunity.save();
    res.json(newCommunity);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};
export const deleteCommunity = async (req, res) => {
  try {
    const community = await Community.findByIdAndDelete(req.params.id);
    if (!community)
      return res.status(404).json({ message: "community not found" });
    res.status(204).json({ message: "community deleted successfully" });
  } catch (err) {
    return res.stauts(404).json({ message: "community not found" });
  }
};
export const updateCommunity = async (req, res) => {
  try {
    const community = await Community.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!community) return res.status(404).json({ message: "task not found" });
    res.json(community);
  } catch (err) {
    return res.status(404).json({ message: message.err });
  }
};
