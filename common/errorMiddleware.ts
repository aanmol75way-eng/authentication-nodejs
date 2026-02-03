import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("ERROR ", err);
 
   if (err instanceof ZodError || err?.name === "ZodError") {
    const errors = Array.isArray(err.errors)
      ? err.errors.map((e: any) => ({
          path: e.path?.join(".") || "",
          message: e.message || "Invalid value",
        }))
      : [];

    return res.status(400).json({
      status: "fail",
      errors,
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Email already exists",
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: Object.values(err.errors)
        .map((e: any) => e.message)
        .join(", "),
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format",
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired",
    });
  }

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
