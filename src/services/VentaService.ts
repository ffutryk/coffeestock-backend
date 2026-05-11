import { AppDataSource } from "../config/data-source";
import { Venta } from "../models/entities/venta";
import { ItemVenta } from "../models/entities/item-venta";
import { VentaDao } from "../daos/VentaDao";
import { ProductoDao } from "../daos/ProductoDao";
import { CrearVentaDTO } from "../dtos/venta.dto";
import { BadRequestError, NotFoundError } from "../errors";
import { Paginacion } from "../models/types/paginacion";
import { ResultadoPaginado } from "../models/types/resultado-paginado";
import { Producto } from "../models/entities/producto";
import { ActualizarVentaDTO } from "../dtos/venta.dto";

export class VentaService {
  constructor(
    private readonly ventaDao: VentaDao,
    private readonly productoDao: ProductoDao,
  ) {}

  private async procesarYValidarItems(
    itemsDto: { productoId: number; cantidad: number }[],
    venta: Venta,
  ): Promise<ItemVenta[]> {
    const ids = itemsDto.map((i) => i.productoId);

    const productosEnDB = await this.productoDao.findByIds(ids);
    if (productosEnDB.length !== ids.length) {
      throw new NotFoundError("Uno o más productos no existen");
    }

    const productosMap = new Map(productosEnDB.map((p) => [p.id, p]));

    return itemsDto.map((itemDto) => {
      const producto = productosMap.get(itemDto.productoId)!;

      if (producto.stock !== null && producto.stock < itemDto.cantidad) {
        throw new BadRequestError(`Stock insuficiente para: ${producto.nombre}`);
      }

      if (producto.stock !== null) producto.stock -= itemDto.cantidad;

      return ItemVenta.create(producto, itemDto.cantidad, venta);
    });
  }

  async crearVenta(datos: CrearVentaDTO, createdBy_id: number): Promise<Venta> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const nuevaVenta = new Venta();
      nuevaVenta.medioDePago = datos.medioDePago;
      nuevaVenta.createdBy = createdBy_id;

      nuevaVenta.items = await this.procesarYValidarItems(datos.items, nuevaVenta);

      const productosAActualizar = nuevaVenta.items.map((i) => i.producto);

      await queryRunner.manager.save(productosAActualizar);
      const ventaGuardada = await queryRunner.manager.save(nuevaVenta);

      await queryRunner.commitTransaction();
      return ventaGuardada;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async actualizarVenta(id: number, datos: ActualizarVentaDTO, updatedBy: number): Promise<Venta> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const ventaExistente = await queryRunner.manager.findOne(Venta, {
        where: { id },
        relations: ["items", "items.producto"],
      });

      if (!ventaExistente) throw new NotFoundError("Venta no encontrada");

      const productosAfectados = new Set<Producto>();

      for (const item of ventaExistente.items) {
        if (item.producto && item.producto.stock !== null) {
          item.producto.stock += item.cantidad;
          productosAfectados.add(item.producto);
        }
      }

      if (datos.medioDePago) ventaExistente.medioDePago = datos.medioDePago;
      ventaExistente.updatedBy = updatedBy;

      if (datos.items) {
        await queryRunner.manager.remove(ventaExistente.items);

        const nuevosItems = await this.procesarYValidarItems(datos.items, ventaExistente);
        ventaExistente.items = nuevosItems;

        nuevosItems.forEach((item) => productosAfectados.add(item.producto));
      }

      if (productosAfectados.size > 0) {
        await queryRunner.manager.save(Array.from(productosAfectados));
      }

      const ventaActualizada = await queryRunner.manager.save(ventaExistente);

      await queryRunner.commitTransaction();
      return ventaActualizada;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async obtenerMuchas(paginacion: Paginacion): Promise<ResultadoPaginado<Venta>> {
    return this.ventaDao.findManyWithItems(paginacion);
  }

  async eliminar(id: number, deletedBy: number): Promise<boolean> {
    const venta = await this.ventaDao.findById(id);

    if (!venta) {
      throw new NotFoundError("No se pudo encontrar la venta");
    }

    venta.deletedBy = deletedBy;
    await this.ventaDao.save(venta);

    return await this.ventaDao.delete(id);
  }
}
