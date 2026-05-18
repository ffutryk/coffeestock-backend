import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/envs";
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

      let payload: any;
      try {
        const secret: string = JWT_SECRET ?? "default_secret";
        payload = jwt.verify(token!, secret);
      } catch (err) {
        throw new UnauthorizedError("Token inválido");
      }

      const userId = payload.userId;

      if (!userId) {
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
