import { Router } from "express";
import { VentaController } from "../controllers/VentaController";
import { VentaService } from "../services/VentaService";
import { TypeOrmVentaDao } from "../repositories/TypeORMVentaDAO";
import { validateBody } from "../middlewares/validate"; // Importa el middleware
import { CrearVentaSchema } from "../dtos/venta.dto";    // Importa tu Schema
import { TypeOrmProductoDao } from "../repositories/TypeORMProductoDAO";

const router = Router();
const ventaDao = new TypeOrmVentaDao();
const productoDao = new TypeOrmProductoDao();
const ventaService = new VentaService(ventaDao, productoDao);
const ventaController = new VentaController(ventaService);

router.post(
  "/crear",
  validateBody(CrearVentaSchema),
  ventaController.crear
);

export default router;