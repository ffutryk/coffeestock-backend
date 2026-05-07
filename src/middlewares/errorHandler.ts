import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof z.ZodError) {
    res
      .status(400)
      .json({ success: false, error: "Validation failed", issues: z.flattenError(err) });
    return;
  }

  console.error(err);
  res.status(500).json({ success: false, error: "Internal server error" });
}
