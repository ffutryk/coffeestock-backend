import { Router } from "express";
import { InventarioController } from "../controllers/inventario.controller";
import { InventarioService } from "../services/inventario.service";
import { TypeORMInventarioRepository } from "../repositories/typeorm/inventario.repository";

import { validateBody } from "../middlewares/validate";
import { RegistrarMovimientoInventario } from "../dtos/inventario/registrar-movimiento.dto";
import { TypeORMMovimientoRepository } from "../repositories/typeorm/movimiento.repository";
import { RolUsuario } from "../models/enums/rol-usuario";
import { verificarRol } from "../middlewares/auth";

const router = Router();

const inventarioDAO = new TypeORMInventarioRepository()
const movimientoDAO = new TypeORMMovimientoRepository();
const inventarioService = new InventarioService(inventarioDAO, movimientoDAO);
const inventarioController = new InventarioController(inventarioService);

router.get("/", verificarRol([RolUsuario.GERENTE, RolUsuario.EMPLEADO]), inventarioController.obtenerInventario);

router.post("/movimientos", validateBody(RegistrarMovimientoInventario), inventarioController.registrarMovimiento);

export default router;
