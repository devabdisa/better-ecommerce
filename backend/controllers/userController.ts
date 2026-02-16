import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import asyncHandler from "../middlewares/asyncHandler.js";
import User, { IUser } from "../models/userModel.js";
import createToken from "../utils/createToken.js";

interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

interface CreateUserBody {
  username: string;
  email: string;
  password: string;
}

const createUser = asyncHandler(
  async (req: Request<any, any, CreateUserBody>, res: Response) => {
    const { username, email, password } = req.body;

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
  },
);

interface LoginUserBody {
  email: string;
  password: string;
}

const loginUser = asyncHandler(
  async (req: Request<any, any, LoginUserBody>, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Please provide both email and password.");
    }

    const existingUser: IUser | null = await User.findOne({ email });

    if (!existingUser) {
      res.status(401); // Unauthorized
      throw new Error("Invalid email or password.");
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordValid) {
      res.status(401);
      throw new Error("Invalid email or password.");
    }

    // If login successful, generate token
    createToken(res, existingUser._id.toString());

    res.status(200).json({
      _id: existingUser._id,
      username: existingUser.username,
      email: existingUser.email,
      isAdmin: existingUser.isAdmin,
    });
  },
);

const logoutCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
});

const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find({});
  res.status(200).json(users);
});

const getCurrentUserProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = await User.findById(req.user?._id);

    if (!user) {
      res.status(404);
      throw new Error("User not found.");
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  },
);

interface UpdateProfileBody {
  username?: string;
  email?: string;
  password?: string;
}

const updateCurrentUserProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = await User.findById(req.user?._id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const { username, email, password } = req.body as UpdateProfileBody;

    user.username = username || user.username;
    user.email = email || user.email;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  },
);

const deleteUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  if (user.isAdmin) {
    res.status(400);
    throw new Error("Cannot delete admin user");
  }

  await User.deleteOne({ _id: user._id });
  res.json({ message: "User removed" });
});

const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json(user);
});

interface UpdateUserBody {
  username?: string;
  email?: string;
  isAdmin?: boolean;
}

const updateUserById = asyncHandler(
  async (req: Request<any, any, UpdateUserBody>, res: Response) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  },
);

export {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
};
