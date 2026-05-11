import { ProductoService } from "../services/producto.service";
import { ProductoController } from "../controllers/producto.controller";
import { validateBody } from "../middlewares/validate";
import { ActualizarProductoSchema } from "../dtos/producto/actualizar.dto";
import { CrearProductoSchema } from "../dtos/producto/crear.dto";
import { TypeOrmProductoRepository } from "../repositories/typeorm/producto.repository";
import { Router } from "express";

const router = Router();
const productoDao = new TypeOrmProductoRepository();
const productoService = new ProductoService(productoDao);
const productoController = new ProductoController(productoService);

// ruta para crear
router.post("/", validateBody(CrearProductoSchema), productoController.crear);

// ruta para ver listado de productos
router.get("/", productoController.listar);

// ruta para ver un producto
router.get("/:id", productoController.ver);

// Ruta para actualizar
router.put("/:id", validateBody(ActualizarProductoSchema), productoController.actualizar);

// ruta para eiminar
router.delete("/:id", productoController.eliminar);

export default router;
