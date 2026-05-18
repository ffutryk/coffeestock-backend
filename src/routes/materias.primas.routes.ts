import { Router } from "express";
import { verificarRol } from "../middlewares/auth";
import { RolUsuario } from "../models/enums/rol-usuario";
import MateriasPrimasController from "../controllers/materias.primas.controller";
import MateriasPrimasService from "../services/materias.primas.service";
import MateriasPrimasRepository from "../repositories/typeorm/materias.primas.repository";
import { validateBody, validateQuery } from "../middlewares/validate";
import { CrearMateriaPrimaSchema } from "../dtos/materiasPrimas/crear.dto";
const router = Router();

const materiasPrimasRepository = new MateriasPrimasRepository();
const materiasPrimasService = new MateriasPrimasService(materiasPrimasRepository);
const materiasPrimasController = new MateriasPrimasController(materiasPrimasService);

router.post(
  "/",
  validateBody(CrearMateriaPrimaSchema),
  verificarRol([RolUsuario.EMPLEADO, RolUsuario.GERENTE]),
  materiasPrimasController.crearMateriaPrima,
);
