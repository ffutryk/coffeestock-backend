import { Router } from "express";
import { VentaController } from "../controllers/VentaController.js";
import { VentaService } from "../services/VentaService.js";
import { TypeOrmVentaDao } from "../repositories/TypeORMVentaDAO.js";

const router = Router();
const ventaDao = new TypeOrmVentaDao();
const ventaService = new VentaService(ventaDao);
const ventaController = new VentaController(ventaService);

router.post("/ventas/crear", ventaController.crear);

export default router;