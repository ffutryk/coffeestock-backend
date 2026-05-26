import { Router } from "express";
import { validateBody } from "../middlewares/validate";
import { CrearRecetaSchema } from "../dtos/receta/crear.dto";
import { RecetaController } from "../controllers/receta.controller";
import { RecetaService } from "../services/receta.service";
import { TypeOrmRecetaRepository } from "../repositories/typeorm/receta.repository"
import { TypeOrmProductoRepository } from "../repositories/typeorm/producto.repository";
import { TypeOrmMateriasPrimasRepository } from "../repositories/typeorm/materias.primas.repository";
import { verificarRol } from "../middlewares/auth";
import { RolUsuario } from "../models/enums/rol-usuario";

const router = Router();

const recetaRepository = new TypeOrmRecetaRepository();

const productoRepository = new TypeOrmProductoRepository();

const materiaPrimaRepository = new TypeOrmMateriasPrimasRepository();

const recetaService = new RecetaService(recetaRepository, productoRepository, materiaPrimaRepository);

const recetaController = new RecetaController(recetaService);

router.post("/", validateBody(CrearRecetaSchema), 
    verificarRol([RolUsuario.EMPLEADO, RolUsuario.GERENTE]),
    recetaController.crear
);

export default router;