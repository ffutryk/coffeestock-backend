import { Router } from "express";
import { InventarioController } from "../controllers/inventario.controller";
import { validateBody } from "../middlewares/validate";
import { RegistrarMovimientoInventario } from "../dtos/inventario/registrar-movimiento.dto";
import { RolUsuario } from "../models/enums/rol-usuario";
import { roles } from "../middlewares/role";
import { auth } from "../middlewares/auth";
import { inventarioService } from "../container/di";

const router = Router();

const inventarioController = new InventarioController(inventarioService);

router.get(
  "/",
  auth,
  roles([RolUsuario.GERENTE, RolUsuario.EMPLEADO]),
  inventarioController.obtenerInventario,
);

router.post(
  "/movimientos",
  auth,
  validateBody(RegistrarMovimientoInventario),
  inventarioController.registrarMovimiento,
);

router.get(
  "/movimientos",
  auth,
  roles([RolUsuario.GERENTE, RolUsuario.EMPLEADO]),
  inventarioController.obtenerHistorial,
);

export default router;
