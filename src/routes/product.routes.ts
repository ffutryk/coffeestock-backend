import { Router, type Request, type Response } from "express";
import { ProductService } from "../services/ProductService.js";
import { ProductController } from "../controllers/ProductController.js";
import { validateBody } from "../middlewares/validate.js";
import { ActualizarProductoSchema } from "../dtos/product.dto.js";
import { TypeOrmProductoDao } from "../repositories/TypeORMProductoDAO.js";


const router = Router();
const productoDao = new TypeOrmProductoDao();
const productService = new ProductService(productoDao);
const productController = new ProductController(productService);

// Ruta para actualizar
router.put(
  "/:id",
  validateBody(ActualizarProductoSchema),
  productController.actualizar,
);

// ruta para eiminar
router.delete("/:id", productController.eliminar);

export default router;
