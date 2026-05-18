import type { NextFunction, Request, Response } from "express";
import type { UsuarioService } from "../services/usuario.service";
import { PaginacionQuerySchema } from "../dtos/paginacion.dto";

export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  crear = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const creado = await this.usuarioService.crearUsuario(req.body);
            return res.status(201).json({success: true, message: "Empleado registrado exitosamente", data: creado});
        } catch (err) {
            next(err);
        }
    };

  listar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paginacion = PaginacionQuerySchema.parse(req.query);
      const usuariosPaginados = await this.usuarioService.listarUsuarios(paginacion);

      if (usuariosPaginados.data.length === 0) {
        return res.status(200).json({
          data: [],
          total: 0,
          message: "No hay usuarios registrados",
        });
      }

      return res.status(200).json(usuariosPaginados);
    } catch (err) {
      next(err);
    }
  };
}