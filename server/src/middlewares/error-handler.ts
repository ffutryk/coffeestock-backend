import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AppError } from "../errors/app-error";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof z.ZodError) {
    res
      .status(400)
      .json({ success: false, error: "ValidationFailed", issues: z.flattenError(err) });
    return;
  }

  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json({ success: false, error: err.name, message: err.message });
  }

  console.error(err);
  res.status(500).json({ success: false, error: "Internal server error" });
}
