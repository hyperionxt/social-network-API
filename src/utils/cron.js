import cron from "node-cron";
import User from "../models/user.model.js";
import Ban from "../models/ban.model.js";

export const unverifiedUsers = () => {
  try {
    cron.schedule("0 0 * * *", async () => {
      const currentTime = new Date();
      const nextTask = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000);
      currentTime.setHours(currentTime.getHours() - 2);

      const users = await User.deleteMany({
        verified: false,
        createdAt: { $lt: currentTime },
      });

      console.log(`Task completed at ${new Date()}`);
      console.log(`Deleted ${users.length} unverified users.`);
      console.log(`Next check at ${nextTask}`);
    });
  } catch (error) {
    console.log(error);
  }
};

export const bannedUsers = () => {
  try {
    cron.schedule("0 0 * * *", async () => {
      const bannedUsers = await Ban.find({
        createdAt: { $lte: new Date() - 5 * 24 * 60 * 60 * 1000 },
      });
      if (bannedUsers.length === 0)
        return console.log("No banned users to unban, task complete!");

      for (const bannedUser of bannedUsers) {
        const userFound = await User.findById(bannedUser.user);
        userFound.banned = false;
        await userFound.save();
      }
      console.log(`task complete! unbanned ${bannedUsers.length} users`);
    });
  } catch (error) {
    console.log(error);
  }
};
