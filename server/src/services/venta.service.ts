import { Venta } from "../models/entities/venta";
import { NotFoundError } from "../errors";
import { ResultadoPaginado } from "../models/types/resultado-paginado";
import type { VentaRepository } from "../repositories/interfaces/venta.interface";
import type { ProductoRepository } from "../repositories/interfaces/producto.interface";
import type { ActualizarVentaDTO } from "../dtos/venta/actualizar.dto";
import type { CrearVentaDTO } from "../dtos/venta/crear.dto";
import { PaginacionDTO } from "../dtos/paginacion.dto";
import { Transactional } from "../decorators/transactional.decorator";
import type { MovimientoInventarioRepository } from "../repositories/interfaces/movimiento.interface";

@Transactional()
export class VentaService {
  constructor(
    private readonly ventaRepository: VentaRepository,
    private readonly productoRepository: ProductoRepository,
    private readonly movimientosRepository: MovimientoInventarioRepository,
  ) {}

  async crearVenta(datos: CrearVentaDTO): Promise<Venta> {
    const idsUnicos = [...new Set(datos.items.map((i) => i.productoId))];
    const productos = await this.productoRepository.findWithInventarios(idsUnicos);
    if (productos.length !== idsUnicos.length)
      throw new NotFoundError("Uno o más productos no existen");

    const productosMap = new Map(productos.map((p) => [p.id, p]));
    const venta = Venta.crear(datos.medioDePago, datos.descuentoTipo, datos.descuentoValor);

    const itemsAgrupados = new Map<number, number>();
    for (const { productoId, cantidad } of datos.items) {
      itemsAgrupados.set(productoId, (itemsAgrupados.get(productoId) || 0) + cantidad);
    }
    for (const [productoId, cantidad] of itemsAgrupados) {
      venta.agregarItem(productosMap.get(productoId)!, cantidad);
    }

    const ventaGuardada = await this.ventaRepository.save(venta);

    return ventaGuardada;
  }

  async actualizarVenta(id: number, datos: ActualizarVentaDTO): Promise<Venta> {
    const ventaExistente = await this.ventaRepository.findByIdWithInventories(id);
    if (!ventaExistente) throw new NotFoundError("Venta no encontrada");

    if (datos.medioDePago) {
      ventaExistente.medioDePago = datos.medioDePago;
    }

    if (datos.items?.length) {
      const productosARevertir = ventaExistente.items
        .filter((item) => item.producto)
        .map((item) => {
          ventaExistente.revertirItem(item);
          return item.producto; // guardar referencia antes de filtrar
        });

      // Persistir reversión de stock
      await this.productoRepository.save(productosARevertir);
      await this.ventaRepository.deleteItems(id);

      const idsUnicos = [...new Set(datos.items.map((i) => i.productoId))];
      const productos = await this.productoRepository.findWithInventarios(idsUnicos);
      if (productos.length !== idsUnicos.length)
        throw new NotFoundError("Uno o más productos no existen");

      const productosMap = new Map(productos.map((p) => [p.id, p]));
      const itemsAgrupados = new Map<number, number>();
      for (const { productoId, cantidad } of datos.items) {
        itemsAgrupados.set(productoId, (itemsAgrupados.get(productoId) || 0) + cantidad);
      }
      for (const [productoId, cantidad] of itemsAgrupados) {
        ventaExistente.agregarItem(productosMap.get(productoId)!, cantidad);
      }

      // Persistir nuevo descuento de stock
      await this.productoRepository.save([...productosMap.values()]);
    }

    return await this.ventaRepository.save(ventaExistente);
  }

  async obtenerMuchas(paginacion: PaginacionDTO): Promise<ResultadoPaginado<Venta>> {
    if (paginacion.rango === "24h") {
      const fechaDesde = new Date();
      fechaDesde.setHours(fechaDesde.getHours() - 24);
      return this.ventaRepository.findManyWithItems(paginacion, fechaDesde);
    }
    return this.ventaRepository.findManyWithItems(paginacion);
  }

  async eliminar(id: number): Promise<boolean> {
    const venta = await this.ventaRepository.findById(id);

    if (!venta) {
      throw new NotFoundError("No se pudo encontrar la venta");
    }

    return await this.ventaRepository.delete(id);
  }

  async obtenerUna(id: number): Promise<Venta> {
    const venta = await this.ventaRepository.findByIdWithInventories(id);
    if (!venta) {
      throw new NotFoundError("Venta no encontrada");
    }
    return venta;
  }
}
