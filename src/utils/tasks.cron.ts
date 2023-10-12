import cron from "node-cron";
import User from "../models/user.model";
import Report from "../models/report.model";
import Ban from "../models/ban.model";

export const unverifiedUsers = () => {
  try {
    cron.schedule("0 0 * * *", async () => {
      const currentTime = new Date();
      const nextTask = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000);
      currentTime.setHours(currentTime.getHours() - 2);

      const deletedUsers = await User.deleteMany({
        verified: false,
        createdAt: { $lt: currentTime },
      });

      console.log(`Task completed at ${new Date()}`);
      console.log(`Deleted ${deletedUsers.deletedCount} unverified users.`);
      console.log(`Next check at ${nextTask}`);
    });
  } catch (error) {
    console.log(error);
  }
};

export const unbanningUsers = () => {
  try {
    cron.schedule("0 20 * * *", async () => {
      const bannedUsers = await Ban.find({
        createdAt: { $lte: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
      });
      if (bannedUsers.length === 0)
        return console.log("No banned users to unban, task complete!");

      for (const bannedUser of bannedUsers) {
        const userFound = await User.findOne({ user: bannedUser.user });
        if (userFound) {
          userFound.banned = false;
          await userFound.save();
        }
      }
      console.log(`task complete! unbanned ${bannedUsers.length} users`);
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteOldReports = () => {
  try {
    cron.schedule("0 15 * * *", async () => {
      const oldReports = await Report.findOneAndDelete({
        createdAt: { $lte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      });
      if (!oldReports) return console.log("no reports to delete");
    });
  } catch (error) {
    console.log(error);
  }
};
