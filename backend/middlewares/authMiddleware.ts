import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/userModel.js";
import asyncHandler from "./asyncHandler.js";

interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

//  Protect routes
const authenticate = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.jwt;

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token.");
    }

    try {
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
        userId: string;
      };

      // Attach user to request object without password
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed.");
    }
  },
);


const authorizeAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: "Not authorized as an admin." });
  }
};

export { authenticate, authorizeAdmin };
