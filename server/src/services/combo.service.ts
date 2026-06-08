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

  async actualizarCombo(id: number, datos: CrearComboDTO): Promise<ComboResponseDTO> {
    const comboRecuperado = await this.comboRepository.findById(id);
    if (!comboRecuperado) {
      throw new NotFoundError("No se encontró el combo a actualizar");
    }
    comboRecuperado.nombre = datos.nombre;
    comboRecuperado.precio = datos.precio;
    const idsProductosActualizados = datos.items.map((i) => i.productoId);
    const productosActualizados = await this.productoRepository.findByIds(idsProductosActualizados);
    if (productosActualizados.length !== idsProductosActualizados.length) {
      const encontrados = new Set(productosActualizados.map((p) => p.id));
      const faltante = idsProductosActualizados.find((id) => !encontrados.has(id));
      throw new NotFoundError(`No se encontró el producto con id ${faltante}`);
    }
    comboRecuperado.actualizarCantidadesSegun(productosActualizados, datos.items);
    await this.comboRepository.save(comboRecuperado);
    return {
      id: comboRecuperado.id,
      nombre: comboRecuperado.nombre,
      precio: Number(comboRecuperado.precio),
      stock: comboRecuperado.calcularStock(),
      items: comboRecuperado.items.map((item) => ({
        producto: {
          id: item.producto.id,
          nombre: item.producto.nombre,
        },
        cantidad: item.cantidad,
      })),
    };
  }

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
      ComboItem.crear(combo, productosMap.get(productoId)!, cantidad),
    );
    const comboGuardado = await this.comboRepository.save(combo);
    return {
      id: comboGuardado.id,
      nombre: comboGuardado.nombre,
      precio: Number(comboGuardado.precio),
      stock: combo.calcularStock(),
      items: comboGuardado.items.map((item) => ({
        producto: {
          id: item.producto.id,
          nombre: item.producto.nombre,
        },
        cantidad: item.cantidad,
      })),
    };
  }

  async listarCombos(): Promise<ComboResponseDTO[]> {
    const combos = await this.comboRepository.findAllWithItems();
    return combos.map((combo) => ({
      id: combo.id,
      nombre: combo.nombre,
      precio: Number(combo.precio),
      stock: combo.calcularStock(),
      items: combo.items.map((item) => ({
        producto: {
          id: item.producto.id,
          nombre: item.producto.nombre,
        },
        cantidad: item.cantidad,
      })),
    }));
  }
}
