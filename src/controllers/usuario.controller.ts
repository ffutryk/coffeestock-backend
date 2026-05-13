import type { NextFunction, Request, Response } from "express";
import type { UsuarioService } from "../services/usuario.service";

export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  listar = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const usuarios = await this.usuarioService.listarUsuarios();
      return res.status(200).json(usuarios);
    } catch (err) {
      next(err);
    }
  };
}
