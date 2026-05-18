import type { NextFunction, Request, Response } from "express";
import type { IUsuarioService } from "../services/interfaces/usuario.service";
import type { IAuthService } from "../services/interfaces/auth.service";
import type { UsuarioService } from "../services/usuario.service";
import { PaginacionQuerySchema } from "../dtos/paginacion.dto";
import { BadRequestError } from "../errors";
import { UsuarioResponseDTO } from "../dtos/usuario/response.dto";

export default class UsuarioController {
  constructor(
    private readonly usuarioService: IUsuarioService,
    private readonly authService: IAuthService,
  ) {}
  
  crear = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const creado = await this.usuarioService.crearUsuario(req.body);
      const respuesta = new UsuarioResponseDTO(creado);
      return res
        .status(201)
        .json({ success: true, message: "Empleado registrado exitosamente", data: respuesta });
    } catch (err) {
      next(err);
    }
  };

  ingresar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = await this.authService.ingresarUsuario(req.body);
      res.status(200).send(token);
    } catch(err) {
      next(err);
    }
  };
  
  actualizar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: idParam } = req.params;
      if (!idParam || typeof idParam !== "string") {
        throw new BadRequestError("ID inválido");
      }
      const id = parseInt(idParam);
      if (Number.isNaN(id)) {
        throw new BadRequestError("ID inválido");
      }
      const actualizado = await this.usuarioService.actualizarUsuario(id, req.body);
      const respuesta = new UsuarioResponseDTO(actualizado);
      return res.status(200).json({ success: true, data: respuesta });
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