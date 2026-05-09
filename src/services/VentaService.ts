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
  async crearVenta(datos: CrearVentaDTO/*, userId: number*/): Promise<Venta> {
    const ids = datos.items.map(item => item.productoId);
    const productosEnDB = await this.productoDao.findByIds(ids);
    
    if (productosEnDB.length !== ids.length) {
      throw new Error("Uno o más productos solicitados no existen en el catálogo");
    }

    const productosMap = new Map(productosEnDB.map(p => [p.id, p]));

    const nuevaVenta = new Venta();
    nuevaVenta.medioDePago = datos.medioDePago;
    nuevaVenta.createdBy = 1; // BORRAR CUANDO SE IMPLEMENTE AUTENTICACIÓN

    nuevaVenta.items = datos.items.map(itemDto => {
      const productoInfo = productosMap.get(itemDto.productoId)!;

      const item = new ItemVenta();
      item.nombre = productoInfo.nombre;
      item.precio = productoInfo.precio;
      item.tipo = productoInfo.tipo;
      item.cantidad = itemDto.cantidad;
      item.producto = productoInfo; 
      item.venta = nuevaVenta;
      
      return item;
    });

    return await this.ventaDao.save(nuevaVenta);
  }
}