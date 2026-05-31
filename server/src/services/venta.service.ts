import { AppDataSource } from "../config/data-source";
import { Venta } from "../models/entities/venta";
import { ItemVenta } from "../models/entities/item-venta";
import { BadRequestError, NotFoundError } from "../errors";
import { ResultadoPaginado } from "../models/types/resultado-paginado";
import { Producto } from "../models/entities/producto";
import { VentaRepository } from "../repositories/interfaces/venta.interface";
import { ProductoRepository } from "../repositories/interfaces/producto.interface";
import type { ActualizarVentaDTO } from "../dtos/venta/actualizar.dto";
import type { CrearVentaDTO } from "../dtos/venta/crear.dto";
import { PaginacionDTO } from "../dtos/paginacion.dto";
import { Inventario } from "../models/entities/inventario";
import { MovimientoInventario } from "../models/entities/movimiento-inventario";

export class VentaService {
  constructor(
    private readonly ventaRepository: VentaRepository,
    private readonly productoRepository: ProductoRepository,
  ) {}
  async crearVenta(datos: CrearVentaDTO): Promise<Venta> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const manager = queryRunner.manager;
      const ids = datos.items.map((i) => i.productoId);
      const productos = await this.productoRepository.findWithInventarios(ids);

      if (productos.length !== ids.length)
        throw new NotFoundError("Uno o más productos no existen");

      const productosMap = new Map(productos.map((p) => [p.id, p]));

      const venta = Venta.crear(datos.medioDePago);

      const inventarios: Inventario[] = [];
      const movimientos: MovimientoInventario[] = [];

      for (const { productoId, cantidad } of datos.items) {
        const efectos = venta.agregarItem(productosMap.get(productoId)!, cantidad);

        inventarios.push(...efectos.inventariosModificados);
        movimientos.push(...efectos.movimientosGenerados);
      }

      await manager.save(inventarios);
      await manager.save(movimientos);
      const ventaGuardada = await manager.save(venta);

      await queryRunner.commitTransaction();
      return ventaGuardada;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async actualizarVenta(id: number, datos: ActualizarVentaDTO): Promise<Venta> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const manager = queryRunner.manager;
      const ventaExistente = await this.ventaRepository.findByIdWithInventories(id);

      if (!ventaExistente) throw new NotFoundError("Venta no encontrada");

      const inventarios: Inventario[] = [];
      const movimientos: MovimientoInventario[] = [];

      for (const item of ventaExistente.items) {
        if (item.producto) {
          const efectos = ventaExistente.revertirItem(item);

          inventarios.push(...efectos.inventariosModificados);
          movimientos.push(...efectos.movimientosGenerados);
        }
      }

      if (datos.medioDePago) {
        ventaExistente.medioDePago = datos.medioDePago;
      }

      if (datos.items && datos.items.length > 0) {
        const ids = datos.items.map((i) => i.productoId);
        const productos = await this.productoRepository.findWithInventarios(ids);

        if (productos.length !== ids.length) {
          throw new NotFoundError("Uno o más productos no existen");
        }

        const productosMap = new Map(productos.map((p) => [p.id, p]));

        for (const { productoId, cantidad } of datos.items) {
          const efectos = ventaExistente.agregarItem(productosMap.get(productoId)!, cantidad);
          inventarios.push(...efectos.inventariosModificados);
          movimientos.push(...efectos.movimientosGenerados);
        }
      }

      await manager.save(inventarios);
      await manager.save(movimientos);
      const ventaActualizada = await manager.save(ventaExistente);

      await queryRunner.commitTransaction();
      return ventaActualizada;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
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
