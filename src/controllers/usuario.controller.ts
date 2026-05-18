import type { NextFunction, Request, Response } from "express";
import type { IUsuarioService } from "../services/interfaces/usuario.service";
import type { IAuthService } from "../services/interfaces/auth.service";

export default class UsuarioController {
  constructor(
    private readonly usuarioService: IUsuarioService,
    private readonly authService: IAuthService,
  ) {}

  crear = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const creado = await this.usuarioService.crearUsuario(req.body);
      return res
        .status(201)
        .json({ success: true, message: "Empleado registrado exitosamente", data: creado });
    } catch (err) {
      next(err);
    }
  };

  ingresar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = await this.authService.ingresarUsuario(req.body);
      res.status(200).send(token);
    } catch (err) {
      next(err);
    }
  };
}
