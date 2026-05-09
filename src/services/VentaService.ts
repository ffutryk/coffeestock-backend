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

  async crearVenta(datos: CrearVentaDTO): Promise<Venta> {
    const nuevaVenta = new Venta();
    nuevaVenta.medioDePago = datos.medioDePago;
    nuevaVenta.createdBy = datos.createdBy;

    const ids = datos.items.map(item => item.productoId);

    const productosEnDB = await this.productoDao.findByIds(ids);

    nuevaVenta.items = datos.items.map(itemDto => {
      const productoInfo = productosEnDB.find(p => p.id === itemDto.productoId);

      if (!productoInfo) {
        throw new Error(`Producto con ID ${itemDto.productoId} no existe`);
      }

      const item = new ItemVenta();
      item.nombre = productoInfo.nombre;
      item.precio = productoInfo.precio;
      item.tipo = productoInfo.tipo;
      item.cantidad = itemDto.cantidad;
      item.venta = nuevaVenta;
      
      return item;
    });

    return await this.ventaDao.save(nuevaVenta);
  }
}