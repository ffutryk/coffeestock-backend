import { Router } from "express";
import { auth } from "../middlewares/auth";
import { roles } from "../middlewares/role";
import { RolUsuario } from "../models/enums/rol-usuario";
import MateriasPrimasController from "../controllers/materias.primas.controller";
import { TypeOrmMateriasPrimasRepository } from "../repositories/typeorm/materias.primas.repository";
import { validateBody } from "../middlewares/validate";
import { CrearMateriaPrimaSchema } from "../dtos/materiasPrimas/crear.dto";
import MateriasPrimasService from "../services/materias.primas.service";
import { TypeORMInventarioRepository } from "../repositories/typeorm/inventario.repository";
const router = Router();

const materiasPrimasRepository = new TypeOrmMateriasPrimasRepository();
const inventarioRepository = new TypeORMInventarioRepository();
const materiasPrimasService = new MateriasPrimasService(
  materiasPrimasRepository,
  inventarioRepository,
);
const materiasPrimasController = new MateriasPrimasController(materiasPrimasService);

router.post(
  "/",
  auth,
  roles([RolUsuario.EMPLEADO, RolUsuario.GERENTE]),
  validateBody(CrearMateriaPrimaSchema),
  materiasPrimasController.crearMateriaPrima,
);

export default router;
