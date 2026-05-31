import { CrearRecetaDTO } from "../dtos/receta/crear.dto";
import { BadRequestError, NotFoundError } from "../errors";
import { ProductoRepository } from "../repositories/interfaces/producto.interface";
import { MateriasPrimasRepository } from "../repositories/interfaces/materias.primas.interface";
import { RecetaRepository } from "../repositories/interfaces/receta.interface";
import { Receta } from "../models/entities/receta";
import { RecetaResponseDTO } from "../dtos/receta/response.dto";

export class RecetaService {

    constructor(
        private readonly recetaRepository: RecetaRepository,
        private readonly productoRepository: ProductoRepository,
        private readonly materiaPrimaRepository: MateriasPrimasRepository,
    ) {}

    async crearReceta(datos: CrearRecetaDTO): Promise<RecetaResponseDTO> {
        const producto = await this.productoRepository.findById(datos.idProducto);
        if (!producto) {
            throw new NotFoundError("No se encontró el producto");
        }
        // validar ingredientes duplicados
        const ids = datos.ingredientes.map(ingrediente => ingrediente.idMateriaPrima);
        const idsUnicos = new Set(ids);
        if (ids.length !== idsUnicos.size) {
            throw new BadRequestError("Hay ingredientes duplicados en la receta");
        }
        const recetasGuardadas: Receta[] = [];
        for (const ingrediente of datos.ingredientes) {
            const materiaPrima = await this.materiaPrimaRepository.findById(ingrediente.idMateriaPrima);
            if (!materiaPrima) {
                throw new NotFoundError(`No se encontró la materia prima con id ${ingrediente.idMateriaPrima}`);
            }
            const receta = new Receta();
            receta.producto = producto;
            receta.materiaPrima = materiaPrima;
            receta.cantidad = ingrediente.cantidad;
            const guardada = await this.recetaRepository.save(receta);
            recetasGuardadas.push(guardada);
        }
        return {
            producto: {
                id: producto.id,
                nombre: producto.nombre
            },
            ingredientes: recetasGuardadas.map(receta => ({
                materiaPrima: {
                    id: receta.materiaPrima.id,
                    nombre: receta.materiaPrima.nombre
                },
                cantidad: receta.cantidad
            }))
        };
    }
}