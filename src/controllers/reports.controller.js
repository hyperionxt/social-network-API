import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Community from "../models/community.model.js";
import Report from "../models/report.model.js";

export const getReports = async (req, res) => {
  try {
    const reportsFound = await Report.find();
    if (!reportsFound)
      return res.status(200).json({ message: "no reports yet" });
    res.json(reportsFound);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getReportsById = async (req, res) => {
  try {
    const reportsFound = await Report.findById(req.params.id);
    if (reportsFound.length === 0)
      return res.status(200).json({ message: "this user has not reports" });
    res.json(reportsFound);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const createReport = async (req, res) => {
  try {
    const { context } = req.body;
    const userFound = await User.findById(req.params.id);
    if (!userFound || userFound.verified === false)
      return res.status(400).json({ message: "invalid user" });

    let elementFound;

    elementFound = await Post.findOne({ _id: req.params.element });
    if (!elementFound) {
      elementFound = await Comment.findOne({ _id: req.params.element });
    }
    if (!elementFound) {
      elementFound = await Community.findOne({ _id: req.params.element });
    }

    if (!elementFound) {
      return res.status(404).json({ message: "Object not found or invalid" });
    }
    const newReport = new Report({
      userReported: { username: userFound.username, id: userFound._id },
      reportedBy: req.user.id,
      context,
      elementsReported: {
        id: elementFound._id,
        text: elementFound.text,
        title: elementFound.title,
      }, //saving text or title in cases when users delete the prof and then admin cant find it.
    });
    await newReport.save();

    return res.status(200).json(newReport);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteOneReport = async (req, res) => {
  try {
    const reportFound = await Report.findByIdAndDelete(req.params.id);
    if (!reportFound)
      return res.status(404).json({ message: "report not found or invalid" });
    return res.status(200).json({ message: "report deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteAllReportsByUserId = async (req, res) => {
  try {
    const reportsFound = await Report.deleteMany({
      userReported: req.params.id,
    });
    if (!reportsFound)
      return res.status(404).json({ message: "this user has not reports" });
    return res.status(200).json({ message: "all reports deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
