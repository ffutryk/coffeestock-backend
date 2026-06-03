import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/envs";
import { UnauthorizedError } from "../errors";
import { TokenPayload } from "../models/types/token-payload";
import { AuthContext } from "../context/auth.context";
import { usuarioService } from "../container/di";

// A futuro deberiamos crear containers para no repetir la creacion e inyección de servicios, así de paso se utiliza la misma instancia y configuración

export const auth = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) throw new UnauthorizedError("Token no proporcionado");

    if (!authHeader.startsWith("Bearer ")) throw new UnauthorizedError("Token inválido");

    const token = authHeader.split(" ")[1];

    if (!token) throw new UnauthorizedError("Token no proporcionado");

    const { userId } = jwt.verify(token, JWT_SECRET) as TokenPayload;

    const usuario = await usuarioService.recuperarPorId(userId);

    if (!usuario) throw new UnauthorizedError("No estás autorizado a realizar esta acción");

    req.user = { id: usuario.id, rol: usuario.rol };

    return AuthContext.run(usuario.id, next);
  } catch (err) {
    next(err);
  }
};
