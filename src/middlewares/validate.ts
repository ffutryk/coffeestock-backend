import { z } from "zod";
import type { Request, Response, NextFunction } from "express";

type BodySchema = z.ZodTypeAny;

export function validateBody(schema: BodySchema) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const result = await schema.safeParseAsync(req.body);

    if (!result.success) {
      return next(result.error);
    }

    req.body = result.data;

    next();
  };
}
