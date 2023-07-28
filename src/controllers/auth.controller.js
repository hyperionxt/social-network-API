import { createAccessToken } from "../libs/jwt.js";
import User from "../models/user.model.js";
//to encrypt the password
import bcryptjs from "bcryptjs";



export const signUp = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    const emailFound = await User.findOne({ email });

    if (emailFound)
      return res.status(400).json({ message: "Email already exists" });

    const usernameFound = await User.findOne({ username });
    if (usernameFound)
      return res.status(400).json({ message: "Username already exists" });

    const passHash = await bcryptjs.hash(password, 10);

    const newUser = new User({
      email,
      password: passHash,
      username,
    });

    const userCreated = await newUser.save();
    const token = await createAccessToken({ id: userCreated._id });

    res.cookie("token", token);

    res.json({
      id: userCreated._id,
      username: userCreated.username,
      email: userCreated.email,
      createdAt: userCreated.createdAt,
    });
    console.log("new user created successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userFound = await User.findOne({ email });
    if (!userFound) return res.status(400).json({ message: "User not found" });

    const match = await bcryptjs.compare(password, userFound.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    const token = await createAccessToken({ id: userFound._id });
    res.cookie("token", token);
    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
    });
    console.log("Welcome, " + userFound.username);
  } catch (error) {
    console.log({ message: error.message });
  }
};
export const signOut = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  console.log("Bye");
  return res.sendStatus(200);
};

export const profile = async (req, res) => {
  const userFound = await User.findById(req.user.id);

  if (!userFound)
    return res.status(404).json({ message: "User does not exist" });

  return res.json({
    username: userFound.username,
    email: userFound.email,
    createdAt: userFound.createdAt,
    description: userFound.description,
    password: userFound.password,
  });
};

export const updateProfile = async (req, res) => {
  try {
    const { password, ...userData } = req.body;
    if (password) {
      const hashedPassword = await bcryptjs.hash(password, 10);
      userData.password = hashedPassword;
    }

    const userFound = await User.findByIdAndUpdate(req.params.id, userData, {
      new: true,
    });

    if (!userFound) return res.status(404).json({ message: "User not found" });

    res.json(userFound);
    console.log("Profile updated successfully");
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
