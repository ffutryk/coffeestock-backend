import type {NextFunction, Request, Response,} from "express";
import { UsuarioService } from "../services/usuario.service";
import { BadRequestError } from "../errors";
import { UsuarioResponseDTO } from "../dtos/usuario/response.dto";

export default class UsuarioController {

    constructor(private readonly usuarioService: UsuarioService) {}

    crear = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const creado = await this.usuarioService.crearUsuario(req.body);
            const respuesta = new UsuarioResponseDTO(creado);
            return res.status(201).json({success: true, message: "Empleado registrado exitosamente", data: respuesta});
        } catch (err) {
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
            return res.status(200).json({success: true, data: respuesta});
        } catch (err) {
            next(err);
        }
    };
}