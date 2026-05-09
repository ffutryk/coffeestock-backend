import { AppDataSource } from "../config/data-source";
import { Venta } from "../models/Venta";
import { ItemVenta } from "../models/ItemVenta";
import { VentaDao } from "../daos/VentaDao";
import { ProductoDao } from "../daos/ProductoDao";
import { CrearVentaDTO } from "../dtos/venta.dto";

export class VentaService {
  constructor(
    private readonly ventaDao: VentaDao,
    private readonly productoDao: ProductoDao
  ) {}

  // DESCOMENTAR CUANDO SE IMPLEMENTE AUTENTICACIÓN
  async crearVenta(datos: CrearVentaDTO/*, createdBy_id: number*/): Promise<Venta> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const ids = datos.items.map(item => item.productoId);
        const productosEnDB = await this.productoDao.findByIds(ids);
        
        if (productosEnDB.length !== new Set(ids).size) {
            throw new Error("Uno o más productos no existen");
        }

        const productosMap = new Map(productosEnDB.map(p => [p.id, p]));
        const nuevaVenta = new Venta();
        nuevaVenta.medioDePago = datos.medioDePago;
        nuevaVenta.createdBy = 1; // BORRAR CUANDO SE IMPLEMENTE AUTENTICACIÓN
        // nuevaVenta.createdBy = createdBy_id; DESCOMENTAR CUANDO SE IMPLEMENTE AUTENTICACIÓN

        nuevaVenta.items = datos.items.map(itemDto => {
            const producto = productosMap.get(itemDto.productoId)!;
            
            if (producto.stock < itemDto.cantidad) {
                throw new Error(`Stock insuficiente para el producto: ${producto.nombre}`);
            }
            producto.stock -= itemDto.cantidad;

            return ItemVenta.create(producto, itemDto.cantidad, nuevaVenta);
        });
        await queryRunner.manager.save(productosEnDB);
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
}