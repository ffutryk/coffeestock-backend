import { Router } from "express";
import { VentaController } from "../controllers/VentaController";
import { VentaService } from "../services/VentaService";
import { TypeOrmVentaDao } from "../repositories/TypeORMVentaDAO";
import { validateBody, validateQuery } from "../middlewares/validate"; // Importa el middleware
import { CrearVentaSchema } from "../dtos/venta.dto";    // Importa tu Schema
import { TypeOrmProductoDao } from "../repositories/TypeORMProductoDAO";
import { PaginacionQuerySchema } from "../schemas/paginacion.schema";

const router = Router();
const ventaDao = new TypeOrmVentaDao();
const productoDao = new TypeOrmProductoDao();
const ventaService = new VentaService(ventaDao, productoDao);
const ventaController = new VentaController(ventaService);

router.post("/", validateBody(CrearVentaSchema), ventaController.crear);
router.get("/", validateQuery(PaginacionQuerySchema), ventaController.obtenerMuchas);

export default router;