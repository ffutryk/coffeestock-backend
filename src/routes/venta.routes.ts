import { Router } from "express";
import { VentaController } from "../controllers/venta.controller";
import { VentaService } from "../services/venta.service";
import { TypeOrmVentaDao } from "../repositories/typeorm/venta.repository";
import { validateBody, validateQuery } from "../middlewares/validate";
import { CrearVentaSchema } from "../dtos/venta/crear.dto";
import { ActualizarVentaSchema } from "../dtos/venta/actualizar.dto";
import { TypeOrmProductoDao } from "../repositories/typeorm/producto.repository";
import { PaginacionQuerySchema } from "../dtos/paginacion.dto";

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
