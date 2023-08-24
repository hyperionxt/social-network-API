import cron from "node-cron";
import User from "../models/user.model.js";

export const unverifiedUsers = () => {
  try {
    cron.schedule("0 0 * * *", async () => {
      const currentTime = new Date();
      const nextTask = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000);
      currentTime.setHours(currentTime.getHours() - 2);

      const documents = await User.deleteMany({
        verified: false,
        createdAt: { $lt: currentTime },
      });

      console.log(`Task completed at ${new Date()}`);
      console.log(`Deleted ${documents.deletedCount()} unverified users.`);
      console.log(`Next check at ${nextTask}`);
    });
  } catch (error) {
    console.log(error);
  }
};
