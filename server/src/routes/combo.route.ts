import { Router } from "express";
import { validateBody } from "../middlewares/validate";
import { CrearComboSchema } from "../dtos/combo/crear.dto";
import { ComboController } from "../controllers/combo.controller";
import { RolUsuario } from "../models/enums/rol-usuario";
import { roles } from "../middlewares/role";
import { auth } from "../middlewares/auth";
import { comboService } from "../container/di";

const router = Router();
const comboController = new ComboController(comboService);

router.post(
  "/",
  auth,
  roles([RolUsuario.EMPLEADO, RolUsuario.GERENTE]),
  validateBody(CrearComboSchema),
  comboController.crear,
);

router.get("/", auth, roles([RolUsuario.EMPLEADO, RolUsuario.GERENTE]), comboController.listar);

router.put(
  "/:id",
  auth,
  roles([RolUsuario.EMPLEADO, RolUsuario.GERENTE]),
  validateBody(CrearComboSchema),
  comboController.actualizar,
);

export default router;
