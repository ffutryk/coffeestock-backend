import { Router } from "express";
import { UsuarioService } from "../services/usuario.service";
import { UsuarioController } from "../controllers/usuario.controller";
import { TypeOrmUsuarioRepository } from "../repositories/typeorm/usuario.repository";

const router = Router();
const usuarioDao = new TypeOrmUsuarioRepository();
const usuarioService = new UsuarioService(usuarioDao);
const usuarioController = new UsuarioController(usuarioService);

// Descomentar la siguiente línea y eliminar la pública cuando se implemente la autenticación
// router.get("/", verificarRol(RolUsuario.GERENTE), usuarioController.listar);
router.get("/", usuarioController.listar);

export default router;
