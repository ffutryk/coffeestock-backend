import { Router } from "express";
import { EstadisticaController } from "../controllers/estadistica.controller";
import { EstadisticaService } from "../services/estadistica.service";
import { TypeORMEstadisticaRepository } from "../repositories/typeorm/estadistica.repository";
import { esGerente } from "../middlewares/role.middleware";
// despues se deberia importar la verificacion de autenticidad que se usa en el login

const router = Router();

const estadisticaRepository = new TypeORMEstadisticaRepository();
const estadisticaService = new EstadisticaService(estadisticaRepository);
const estadisticaController = new EstadisticaController(estadisticaService);

router.get(
  "/productos",
  // verificarAuth,
  esGerente,
  estadisticaController.obtenerEstadisticasProductos
);

export default router;
