import { Router } from "express";
import { auth } from "../middlewares/auth";
import { roles } from "../middlewares/role";
import { RolUsuario } from "../models/enums/rol-usuario";
import MateriasPrimasController from "../controllers/materias.primas.controller";
import { validateBody } from "../middlewares/validate";
import { CrearMateriaPrimaSchema } from "../dtos/materiasPrimas/crear.dto";
import { materiaPrimaService } from "../container/di";

const router = Router();

const materiasPrimasController = new MateriasPrimasController(materiaPrimaService);

router.post(
  "/",
  auth,
  roles([RolUsuario.EMPLEADO, RolUsuario.GERENTE]),
  validateBody(CrearMateriaPrimaSchema),
  materiasPrimasController.crearMateriaPrima,
);

export default router;
