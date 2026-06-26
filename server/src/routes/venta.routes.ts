import { Router } from "express";
import { VentaController } from "../controllers/venta.controller";
import { validateBody, validateQuery } from "../middlewares/validate";
import { CrearVentaSchema } from "../dtos/venta/crear.dto";
import { ActualizarVentaSchema } from "../dtos/venta/actualizar.dto";
import { PaginacionQuerySchema } from "../dtos/paginacion.dto";
import { auth } from "../middlewares/auth";
import { ventaService } from "../container/di";

const router = Router();
const ventaController = new VentaController(ventaService);

router.post("/", auth, validateBody(CrearVentaSchema), ventaController.crear);
router.put("/:id", auth, validateBody(ActualizarVentaSchema), ventaController.actualizar);
router.get("/", auth, validateQuery(PaginacionQuerySchema), ventaController.obtenerMuchas);
router.get("/:id", auth, ventaController.obtenerUna);
router.delete("/:id", auth, ventaController.eliminar);

export default router;
