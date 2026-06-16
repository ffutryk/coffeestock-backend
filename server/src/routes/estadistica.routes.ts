import { Router } from "express";
import { EstadisticaController } from "../controllers/estadistica.controller";
import { RolUsuario } from "../models/enums/rol-usuario";
import { validateQuery } from "../middlewares/validate";
import { FiltrarEstadisticasVentasSchema } from "../dtos/estadistica/filtrar-ventas.dto";
import { roles } from "../middlewares/role";
import { auth } from "../middlewares/auth";
import { estadisticaService } from "../container/di";

const router = Router();

const estadisticaController = new EstadisticaController(estadisticaService);

router.get(
  "/ventas",
  auth,
  roles([RolUsuario.GERENTE]),
  validateQuery(FiltrarEstadisticasVentasSchema),
  estadisticaController.obtenerEstadisticasVentas,
);
router.get(
  "/productos",
  auth,
  roles([RolUsuario.GERENTE]),
  validateQuery(FiltrarEstadisticasVentasSchema),
  estadisticaController.obtenerEstadisticasProductos,
);
router.get(
  "/empleados",
  auth,
  roles([RolUsuario.GERENTE]),
  estadisticaController.obtenerEstadisticasEmpleados,
);

export default router;
