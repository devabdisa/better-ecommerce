import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import asyncHandler from "../middlewares/asyncHandler.js";
import User, { IUser } from "../models/userModel.js";
import createToken from "../utils/createToken.js";

const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password } = req.body as {
    username: string;
    email: string;
    password: string;
  };

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please fill all the inputs.");
  }

  const userExists: IUser | null = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  await newUser.save();

  // Create JWT and set cookie
  createToken(res, newUser._id.toString());

  res.status(201).json({
    _id: newUser._id,
    username: newUser.username,
    email: newUser.email,
    isAdmin: newUser.isAdmin,
  });
});

export { createUser };
