import Role from "../models/role.models.js";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import chalk from "chalk";

export const createRoles = async () => {
  try {
    const elements = await Role.estimatedDocumentCount();
    if (elements > 0) return;

    const roles = await Promise.all([
      new Role({ title: "regular" }).save(),
      new Role({ title: "moderator" }).save(),
      new Role({ title: "admin" }).save(),
    ]);
    console.log("regular, moderator and admin roles created successfully");
  } catch (error) {
    console.error(error);
  }
};

export const createAdminProfile = async () => {
  try {
    const adminRole = await Role.findOne({ title: "admin" });
    const adminFound = await User.findOne({ role: adminRole._id });
    if (adminFound) return;

    const username = "admin";
    const email = "admin@potato.com";
    const password = "adminpassword";
    const hashedPassword = await bcryptjs.hash(password, 10);

    const newAdmin = new User({
      username,
      email,
      password: hashedPassword,
      role: adminRole._id,
      verified: true,
    });
    await newAdmin.save();

    console.log("\n")
    console.log(chalk.cyan("Username: ", username));
    console.log(chalk.cyan("Email: ", email));
    console.log(chalk.cyan("Password: ", password));
    console.log(chalk.green("Admin profile created successfully!"));
    console.log('Login with this credentials and go to this endpoint to change it using PUT method: http://localhost:3000/api/profile');
  } catch (error) {
    console.error(error);
  }
};
