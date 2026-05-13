import { Router } from "express";
import { UsuarioService } from "../services/usuario.service";
import { UsuarioController } from "../controllers/usuario.controller";
import { TypeOrmUsuarioRepository } from "../repositories/typeorm/usuario.repository";
import { verificarRol } from "../middlewares/auth";
import { RolUsuario } from "../models/enums/rol-usuario";

const router = Router();
const usuarioDao = new TypeOrmUsuarioRepository();
const usuarioService = new UsuarioService(usuarioDao);
const usuarioController = new UsuarioController(usuarioService);

// Ruta para ver listado de usuarios, restringida a GERENTE
router.get("/", verificarRol(RolUsuario.GERENTE), usuarioController.listar);

export default router;
