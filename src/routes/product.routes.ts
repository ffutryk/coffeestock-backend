import { ProductService } from "../services/ProductService";
import { ProductController } from "../controllers/ProductController";
import { validateBody } from "../middlewares/validate";
import { ActualizarProductoSchema, CrearProductoSchema } from "../dtos/product.dto";
import { TypeOrmProductoDao } from "../repositories/TypeORMProductoDAO";
import { Router } from "express";

const router = Router();
const productoDao = new TypeOrmProductoDao();
const productService = new ProductService(productoDao);
const productController = new ProductController(productService);

// ruta para crear
router.post("/", validateBody(CrearProductoSchema), productController.crear,);

// ruta para ver
router.get("/:id", productController.ver);

// Ruta para actualizar
router.put("/:id", validateBody(ActualizarProductoSchema), productController.actualizar,);

// ruta para eiminar
router.delete("/:id", productController.eliminar);

export default router;
