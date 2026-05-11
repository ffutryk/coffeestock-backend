import { Router } from "express";
import { VentaController } from "../controllers/VentaController";
import { VentaService } from "../services/VentaService";
import { TypeOrmVentaDao } from "../repositories/typeorm/venta.repository";
import { validateBody, validateQuery } from "../middlewares/validate";
import { CrearVentaSchema, ActualizarVentaSchema } from "../dtos/venta.dto";
import { TypeOrmProductoDao } from "../repositories/typeorm/producto.repository";
import { PaginacionQuerySchema } from "../schemas/paginacion.schema";

const router = Router();
const ventaDao = new TypeOrmVentaDao();
const productoDao = new TypeOrmProductoDao();
const ventaService = new VentaService(ventaDao, productoDao);
const ventaController = new VentaController(ventaService);

router.post("/", validateBody(CrearVentaSchema), ventaController.crear);
router.put("/:id", validateBody(ActualizarVentaSchema), ventaController.actualizar);
router.get("/", validateQuery(PaginacionQuerySchema), ventaController.obtenerMuchas);
router.delete("/:id", ventaController.eliminar);

export default router;
