import { ProductService } from "../services/ProductService";
import { ProductController } from "../controllers/ProductController";
import { validateBody } from "../middlewares/validate";
import { ActualizarProductoSchema } from "../dtos/product.dto";
import { TypeOrmProductoDao } from "../repositories/TypeORMProductoDAO";
import { Router } from "express";

const router = Router();
const productoDao = new TypeOrmProductoDao();
const productService = new ProductService(productoDao);
const productController = new ProductController(productService);

router.put("/:id", validateBody(ActualizarProductoSchema), productController.actualizar,);
router.delete("/:id", productController.eliminar);

export default router;
