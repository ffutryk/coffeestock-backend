import { Router } from "express";
import { validateBody } from "../middlewares/validate";
import { CrearRecetaSchema } from "../dtos/receta/crear.dto";
import { RecetaController } from "../controllers/receta.controller";
import { RolUsuario } from "../models/enums/rol-usuario";
import { roles } from "../middlewares/role";
import { auth } from "../middlewares/auth";
import { recetaService } from "../container/di";

const router = Router();

const recetaController = new RecetaController(recetaService);

router.post(
  "/",
  auth,
  roles([RolUsuario.EMPLEADO, RolUsuario.GERENTE]),
  validateBody(CrearRecetaSchema),
  recetaController.crear,
);

export default router;
