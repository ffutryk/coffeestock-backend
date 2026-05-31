import { Router } from "express";
import { validateBody } from "../middlewares/validate";
import { CrearRecetaSchema } from "../dtos/receta/crear.dto";
import { RecetaController } from "../controllers/receta.controller";
import { RecetaService } from "../services/receta.service";
import { TypeOrmRecetaRepository } from "../repositories/typeorm/receta.repository";
import { TypeOrmProductoRepository } from "../repositories/typeorm/producto.repository";
import { TypeOrmMateriasPrimasRepository } from "../repositories/typeorm/materias.primas.repository";
import { RolUsuario } from "../models/enums/rol-usuario";
import { roles } from "../middlewares/role";
import { auth } from "../middlewares/auth";

const router = Router();

const recetaRepository = new TypeOrmRecetaRepository();

const productoRepository = new TypeOrmProductoRepository();

const materiaPrimaRepository = new TypeOrmMateriasPrimasRepository();

const recetaService = new RecetaService(
  recetaRepository,
  productoRepository,
  materiaPrimaRepository,
);

const recetaController = new RecetaController(recetaService);

router.post(
  "/",
  auth,
  roles([RolUsuario.EMPLEADO, RolUsuario.GERENTE]),
  validateBody(CrearRecetaSchema),
  recetaController.crear,
);

export default router;
