import { RequestHandler } from "express";

const asyncHandler = <T extends RequestHandler>(fn: T): T =>
  ((req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      res.status(500).json({ message: (error as Error).message });
    });
  }) as T;

  export default asyncHandler;