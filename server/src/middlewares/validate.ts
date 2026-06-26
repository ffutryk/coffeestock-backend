import { z } from "zod";
import type { Request, Response, NextFunction } from "express";

type BodySchema = z.ZodTypeAny;
type QuerySchema = z.ZodTypeAny;

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

export function validateQuery(schema: QuerySchema) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const result = await schema.safeParseAsync(req.query);

    if (!result.success) {
      return next(result.error);
    }

    req.validatedQuery = result.data;

    next();
  };
}
