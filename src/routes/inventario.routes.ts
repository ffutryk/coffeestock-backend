import { Router } from "express";
import { InventarioController } from "../controllers/inventario.controller";
import { InventarioService } from "../services/inventario.service";
import { TypeORMInventarioRepository } from "../repositories/typeorm/inventario.repository";

import { validateBody, validateQuery } from "../middlewares/validate";
import { RegistrarMovimientoInventario } from "../dtos/inventario/registrar-movimiento.dto";
import { TypeORMMovimientoRepository } from "../repositories/typeorm/movimiento.repository";

const router = Router();

const inventarioDAO = new TypeORMInventarioRepository()
const movimientoDAO = new TypeORMMovimientoRepository();
const inventarioService = new InventarioService(inventarioDAO, movimientoDAO);
const inventarioController = new InventarioController(inventarioService);

router.post(
  "/movimientos",
  validateBody(RegistrarMovimientoInventario),
  inventarioController.registrarMovimiento
);

export default router;
