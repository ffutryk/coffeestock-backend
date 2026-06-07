import { Combo } from "../models/entities/combo";
import { ComboItem } from "../models/entities/combo-item";
import { CrearComboDTO } from "../dtos/combo/crear.dto";
import { BadRequestError, NotFoundError } from "../errors";
import { Transactional } from "../decorators/transactional.decorator";
import type { ComboRepository } from "../repositories/interfaces/combo.interface";
import type { ProductoRepository } from "../repositories/interfaces/producto.interface";
import type { IComboService } from "./interfaces/combo.service";
import { ComboResponseDTO } from "../dtos/combo/response.dto";

@Transactional()
export class ComboService implements IComboService {
    constructor(
        private readonly comboRepository: ComboRepository,
        private readonly productoRepository: ProductoRepository,
    ) {}

    async crearCombo(datos: CrearComboDTO): Promise<ComboResponseDTO> {
        const ids = datos.items.map((i) => i.productoId);
        const idsUnicos = new Set(ids);
        if (ids.length !== idsUnicos.size) {
            throw new BadRequestError("Hay productos duplicados en el combo");
        }
        const comboExistente = await this.comboRepository.findByNombre(datos.nombre);
        if (comboExistente) {
            throw new BadRequestError("Ya existe un combo con ese nombre");
        }
        const productos = await this.productoRepository.findByIds(ids);
        if (productos.length !== ids.length) {
            const encontrados = new Set(productos.map((p) => p.id));
            const faltante = ids.find((id) => !encontrados.has(id));
            throw new NotFoundError(`No se encontró el producto con id ${faltante}`);
        }
        const productosMap = new Map(productos.map((p) => [p.id, p]));
        const combo = Combo.crear(datos.nombre, datos.precio);
        combo.items = datos.items.map(({ productoId, cantidad }) =>
            ComboItem.crear(combo, productosMap.get(productoId)!, cantidad));
        const comboGuardado = await this.comboRepository.save(combo);
        return {
            id: comboGuardado.id,
            nombre: comboGuardado.nombre,
            precio: Number(comboGuardado.precio),
            items: comboGuardado.items.map((item) => ({
            producto: {
                id: item.producto.id,
                nombre: item.producto.nombre,
            },
            cantidad: item.cantidad
            }))
        };
    }

    async listarCombos(): Promise<ComboResponseDTO[]> {
    const combos = await this.comboRepository.findAllWithItems();
    return combos.map((combo) => ({
        id: combo.id,
        nombre: combo.nombre,
        precio: Number(combo.precio),
        items: 
            combo.items.map((item) => ({
                producto: {
                    id: item.producto.id,
                    nombre: item.producto.nombre
                },
                cantidad: item.cantidad
            }))
        }));   
    }
}