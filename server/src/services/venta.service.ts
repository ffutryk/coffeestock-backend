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
    const inventarios: Inventario[] = [];
    const movimientos: MovimientoInventario[] = [];

    for (const { productoId, cantidad } of datos.items) {
      const efectos = venta.agregarItem(productosMap.get(productoId)!, cantidad);
      inventarios.push(...efectos.inventariosModificados);
      movimientos.push(...efectos.movimientosGenerados);
    }

    const ventaGuardada = await this.ventaRepository.save(venta);
    await this.inventarioRepository.save(inventarios);
    await this.movimientosRepository.save(movimientos);
    return ventaGuardada;
  }

  async actualizarVenta(id: number, datos: ActualizarVentaDTO): Promise<Venta> {
    const ventaExistente = await this.ventaRepository.findByIdWithInventories(id);
    if (!ventaExistente) throw new NotFoundError("Venta no encontrada");

    const inventarios: Inventario[] = [];
    const movimientos: MovimientoInventario[] = [];

    for (const item of [...ventaExistente.items]) {
      if (item.producto) {
        const efectos = ventaExistente.revertirItem(item);
        inventarios.push(...efectos.inventariosModificados);
        movimientos.push(...efectos.movimientosGenerados);
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
        const efectos = ventaExistente.agregarItem(productosMap.get(productoId)!, cantidad);
        inventarios.push(...efectos.inventariosModificados);
        movimientos.push(...efectos.movimientosGenerados);
      }
    }

    const ventaActualizada = await this.ventaRepository.save(ventaExistente);
    await this.inventarioRepository.save(inventarios);
    await this.movimientosRepository.save(movimientos);
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
