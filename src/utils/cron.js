import cron from "node-cron";
import User from "../models/user.model.js";

export const cronFunction = () => {
  try {
    cron.schedule("*/30 * * * *", async () => {
      const localTime = new Date();
      localTime.setHours(localTime.getHours() - 2);

      await User.deleteMany({
        confirmed: false,
        createdAt: { $lt: localTime },
      });

      console.log("Delete expired documents(User) task completed!");
      console.log("Next task in 30 minutes")
    });
  } catch (error) {
    console.log(error);
  }
};
