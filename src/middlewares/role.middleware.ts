import type { Request, Response, NextFunction } from "express";

export const esGerente = (req: Request, res: Response, next: NextFunction) => {
  const usuario = (req as any).user;

  if (!usuario || usuario.rol !== "gerente") {
    return res.status(403).json({
      message: "Acceso denegado. Se requieren permisos de gerente.",
    });
  }

  next();
};
