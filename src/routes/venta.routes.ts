import { Router } from "express";
import { VentaController } from "../controllers/VentaController";
import { VentaService } from "../services/VentaService";
import { TypeOrmVentaDao } from "../repositories/TypeORMVentaDAO";

const router = Router();
const ventaDao = new TypeOrmVentaDao();
const ventaService = new VentaService(ventaDao);
const ventaController = new VentaController(ventaService);

router.post("/crear", ventaController.crear);

export default router;