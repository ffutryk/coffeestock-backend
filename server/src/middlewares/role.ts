import type { Request, Response, NextFunction } from "express";
import { RolUsuario } from "../models/enums/rol-usuario";

/**
 * Middleware que verifica si el usuario tiene alguno de los roles permitidos.
 *
 * TIENE QUE SER ENCADENADO DESPUES DEL MIDDLEWARE DE AUTENTICACIÓN.
 */
export const roles = (rolesPermitidos: RolUsuario[]) => {
  return function (req: Request, res: Response, next: NextFunction) {
    const usuario = req.user;

    if (!rolesPermitidos.includes(usuario!.rol as RolUsuario)) {
      return res.status(403).json({
        message: `Se requieren permisos de ${rolesPermitidos.map((rol) => rol.toLowerCase()).join(", ")}`,
      });
    }

    next();
  };
};
