declare global {
  namespace Express {
    interface Request {
      validatedQuery?: unknown;
      user?: { id: number; rol: string };
    }
  }
}

export {};
