import { Router } from "express";
import { validateBody } from "../middlewares/validate";
import { CrearUsuarioSchema } from "../dtos/usuario/crear.dto";
import { IngresarUsuarioSchema } from "../dtos/usuario/ingresar.dto";
import UsuarioController from "../controllers/usuario.controller";
import { ActualizarUsuarioSchema } from "../dtos/usuario/actualizar.dto";
import { RolUsuario } from "../models/enums/rol-usuario";
import { roles } from "../middlewares/role";
import { auth } from "../middlewares/auth";
import { authService, usuarioService } from "../container/di";

const router = Router();

const usuarioController = new UsuarioController(usuarioService, authService);

router.post(
  "/crear",
  auth,
  roles([RolUsuario.GERENTE]),
  validateBody(CrearUsuarioSchema),
  usuarioController.crear,
);
router.post("/ingresar", validateBody(IngresarUsuarioSchema), usuarioController.ingresar);

router.post(
  "/",
  auth,
  roles([RolUsuario.GERENTE]),
  validateBody(CrearUsuarioSchema),
  usuarioController.crear,
);
router.get("/", auth, roles([RolUsuario.GERENTE]), usuarioController.listar);
router.get("/", auth, roles([RolUsuario.GERENTE]), usuarioController.listar);
router.put("/:id", auth, validateBody(ActualizarUsuarioSchema), usuarioController.actualizar);

router.delete("/:id", auth, roles([RolUsuario.GERENTE]), usuarioController.eliminar);
router.post("/:id/restaurar", auth, roles([RolUsuario.GERENTE]), usuarioController.restaurar);

export default router;
