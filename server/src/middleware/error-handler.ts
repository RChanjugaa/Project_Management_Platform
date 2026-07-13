import type { ErrorRequestHandler } from "express";
import { Prisma } from "@prisma/client";
import { AppError } from "../utils/app-error.js";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const statusCode = error.code === "P2002" ? 409 : error.code === "P2025" ? 404 : 400;
    const message = error.code === "P2002" ? "A record with this unique value already exists." : error.code === "P2025" ? "Record not found." : "Database request failed.";

    res.status(statusCode).json({
      success: false,
      message,
      data: null
    });
    return;
  }

  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const message = error instanceof AppError ? error.message : "Internal server error.";

  res.status(statusCode).json({
    success: false,
    message,
    data: error instanceof AppError ? error.details ?? null : null
  });
};
