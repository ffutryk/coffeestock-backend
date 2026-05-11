import { ProductService } from "../services/producto.service";
import { ProductController } from "../controllers/producto.controller";
import { validateBody } from "../middlewares/validate";
import { ActualizarProductoSchema } from "../dtos/producto/actualizar.dto";
import { CrearProductoSchema } from "../dtos/producto/crear.dto";
import { TypeOrmProductoRepository } from "../repositories/typeorm/producto.repository";
import { Router } from "express";

const router = Router();
const productoDao = new TypeOrmProductoRepository();
const productService = new ProductService(productoDao);
const productController = new ProductController(productService);

// ruta para crear
router.post("/", validateBody(CrearProductoSchema), productController.crear);

// ruta para ver listado de productos
router.get("/", productController.listar);

// ruta para ver un producto
router.get("/:id", productController.ver);

// Ruta para actualizar
router.put("/:id", validateBody(ActualizarProductoSchema), productController.actualizar);

// ruta para eiminar
router.delete("/:id", productController.eliminar);

export default router;
