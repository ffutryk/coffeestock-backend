import type {NextFunction, Request, Response,} from "express";
import { UsuarioService } from "../services/usuario.service";

export default class UsuarioController {

    constructor(private readonly usuarioService: UsuarioService) {}

    crear = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const creado = await this.usuarioService.crearUsuario(req.body);
            return res.status(201).json({success: true, message: "Empleado registrado exitosamente", data: creado});
        } catch (err) {
            next(err);
        }
    };
}