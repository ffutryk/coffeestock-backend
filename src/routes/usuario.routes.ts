import { Router } from "express";
import { validateBody } from "../middlewares/validate";
import { CrearUsuarioSchema } from "../dtos/usuario/crear.dto";
import { IngresarUsuarioSchema } from "../dtos/usuario/ingresar.dto";
import { UsuarioService } from "../services/usuario.service";
import { TypeOrmUsuarioRepository } from "../repositories/typeorm/usuario.repository";
import UsuarioController from "../controllers/usuario.controller";
import TokenService from "../services/token.service";
import AuthService from "../services/auth.service";
import { ActualizarUsuarioSchema } from "../dtos/usuario/actualizar.dto";
import { verificarRol } from "../middlewares/auth";
import { RolUsuario } from "../models/enums/rol-usuario";

const router = Router();
const usuarioRepository = new TypeOrmUsuarioRepository();
const usuarioService = new UsuarioService(usuarioRepository);
const tokenService = new TokenService();
const authService = new AuthService(tokenService, usuarioRepository);

const usuarioController = new UsuarioController(usuarioService, authService);

router.post("/crear", verificarRol(RolUsuario.GERENTE), validateBody(CrearUsuarioSchema), usuarioController.crear);
router.post("/ingresar", validateBody(IngresarUsuarioSchema), usuarioController.ingresar);

router.post("/", verificarRol(RolUsuario.GERENTE), validateBody(CrearUsuarioSchema), usuarioController.crear);
router.get("/", verificarRol(RolUsuario.GERENTE), usuarioController.listar);

router.put("/:id", validateBody(ActualizarUsuarioSchema), usuarioController.actualizar);

router.delete("/:id", verificarRol(RolUsuario.GERENTE), usuarioController.eliminar);
router.post("/:id/restaurar", verificarRol(RolUsuario.GERENTE), usuarioController.restaurar);

export default router;
