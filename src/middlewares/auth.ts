import type { Request, Response, NextFunction } from "express";
import type { RolUsuario } from "../models/enums/rol-usuario";
import { UnauthorizedError, ForbiddenError } from "../errors";
import { TypeOrmUsuarioRepository } from "../repositories/typeorm/usuario.repository";

export const verificarRol = (rolEsperado: RolUsuario) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthorizedError("Token no proporcionado");
      }

      const token = authHeader.split(" ")[1];

      // Reemplazar la conversión a número por jwt.verify cuando se implemente JWT.
      const userId = Number(token);

      if (isNaN(userId)) {
        throw new UnauthorizedError("Token inválido");
      }

      const usuarioRepo = new TypeOrmUsuarioRepository();
      const usuario = await usuarioRepo.findById(userId);

      if (!usuario) {
        throw new UnauthorizedError("Usuario no encontrado");
      }

      if (usuario.rol !== rolEsperado) {
        throw new ForbiddenError("No tienes permisos para realizar esta acción");
      }

      req.user = { id: usuario.id, rol: usuario.rol };
      next();
    } catch (err) {
      next(err);
    }
  };
};
