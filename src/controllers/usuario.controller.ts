import type { NextFunction, Request, Response } from "express";
import { UsuarioService } from "../services/usuario.service";

export default class UsuarioController {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly tokenService: TokenService,
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
      const { nombre, apellido, rol } = await this.usuarioService.recuperarPorEmail(req.body);
      const token = await this.tokenService.generarToken({ nombre, apellido, rol });
      res.set("Authorization", `Bearer ${token}`);
      return res.send({ nombre, apellido, rol }); // En caso de que necesitemos los datos desde el front...
    } catch (err) {
      next(err);
    }
  };
}
