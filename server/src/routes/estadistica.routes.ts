import { Router } from "express";
import { EstadisticaController } from "../controllers/estadistica.controller";
import { EstadisticaService } from "../services/estadistica.service";
import { TypeORMEstadisticaRepository } from "../repositories/typeorm/estadistica.repository";
import { RolUsuario } from "../models/enums/rol-usuario";
import { validateQuery } from "../middlewares/validate";
import { FiltrarEstadisticasVentasSchema } from "../dtos/estadistica/filtrar-ventas.dto";
import { roles } from "../middlewares/role";
import { auth } from "../middlewares/auth";

const router = Router();

const estadisticaRepository = new TypeORMEstadisticaRepository();
const estadisticaService = new EstadisticaService(estadisticaRepository);
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
  estadisticaController.obtenerEstadisticasProductos,
);

export default router;
