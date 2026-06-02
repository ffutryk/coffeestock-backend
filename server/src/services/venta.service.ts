import { Venta } from "../models/entities/venta";
import { NotFoundError } from "../errors";
import { ResultadoPaginado } from "../models/types/resultado-paginado";
import type { VentaRepository } from "../repositories/interfaces/venta.interface";
import type { ProductoRepository } from "../repositories/interfaces/producto.interface";
import type { ActualizarVentaDTO } from "../dtos/venta/actualizar.dto";
import type { CrearVentaDTO } from "../dtos/venta/crear.dto";
import { PaginacionDTO } from "../dtos/paginacion.dto";
import { Inventario } from "../models/entities/inventario";
import { MovimientoInventario } from "../models/entities/movimiento-inventario";
import { Transactional } from "../decorators/transactional.decorator";
import type { InventarioRepository } from "../repositories/interfaces/inventario.interface";
import type { MovimientoInventarioRepository } from "../repositories/interfaces/movimiento.interface";

@Transactional()
export class VentaService {
  constructor(
    private readonly ventaRepository: VentaRepository,
    private readonly productoRepository: ProductoRepository,
    private readonly inventarioRepository: InventarioRepository,
    private readonly movimientosRepository: MovimientoInventarioRepository,
  ) {}

  async crearVenta(datos: CrearVentaDTO): Promise<Venta> {
    const ids = datos.items.map((i) => i.productoId);
    const productos = await this.productoRepository.findWithInventarios(ids);
    if (productos.length !== ids.length) throw new NotFoundError("Uno o más productos no existen");

    const productosMap = new Map(productos.map((p) => [p.id, p]));
    const venta = Venta.crear(datos.medioDePago);

    for (const { productoId, cantidad } of datos.items) {
      venta.agregarItem(productosMap.get(productoId)!, cantidad);
    }

    const ventaGuardada = await this.ventaRepository.save(venta);

    return ventaGuardada;
  }

  async actualizarVenta(id: number, datos: ActualizarVentaDTO): Promise<Venta> {
    const ventaExistente = await this.ventaRepository.findByIdWithInventories(id);
    if (!ventaExistente) throw new NotFoundError("Venta no encontrada");

    for (const item of [...ventaExistente.items]) {
      if (item.producto) {
        ventaExistente.revertirItem(item);
      }
    }

    if (datos.medioDePago) ventaExistente.medioDePago = datos.medioDePago;

    if (datos.items?.length) {
      const ids = datos.items.map((i) => i.productoId);
      const productos = await this.productoRepository.findWithInventarios(ids);
      if (productos.length !== ids.length)
        throw new NotFoundError("Uno o más productos no existen");

      const productosMap = new Map(productos.map((p) => [p.id, p]));
      for (const { productoId, cantidad } of datos.items) {
        ventaExistente.agregarItem(productosMap.get(productoId)!, cantidad);
      }
    }

    const ventaActualizada = await this.ventaRepository.save(ventaExistente);

    return ventaActualizada;
  }

  async obtenerMuchas(paginacion: PaginacionDTO): Promise<ResultadoPaginado<Venta>> {
    return this.ventaRepository.findManyWithItems(paginacion);
  }

  async eliminar(id: number): Promise<boolean> {
    const venta = await this.ventaRepository.findById(id);

    if (!venta) {
      throw new NotFoundError("No se pudo encontrar la venta");
    }

    return await this.ventaRepository.delete(id);
  }
}
