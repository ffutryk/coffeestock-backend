import { Router } from "express";
import { validateBody } from "../middlewares/validate";
import { CrearUsuarioSchema } from "../dtos/usuario/crear.dto";
import { UsuarioService } from "../services/usuario.service";
import { TypeOrmUsuarioRepository } from "../repositories/typeorm/usuario.repository";
import { UsuarioController } from "../controllers/usuario.controller";

const router = Router();
const usuarioRepository = new TypeOrmUsuarioRepository();
const usuarioService = new UsuarioService(usuarioRepository);
const usuarioController = new UsuarioController(usuarioService);

router.post("/", validateBody(CrearUsuarioSchema), usuarioController.crear);
// router.get("/", verificarRol(RolUsuario.GERENTE), usuarioController.listar); DESCOMENTAR CUANDO SE IMPLEMENTE LA AUTENTICACIÓN
router.get("/", usuarioController.listar); // BORRAR CUANDO SE IMPLEMENTE LA AUTENTICACIÓN

export default router;