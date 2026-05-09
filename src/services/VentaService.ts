import { Venta } from "../models/Venta";
import { ItemVenta } from "../models/ItemVenta";
import type { CrearVentaDTO, CrearItemVentaDTO } from "../dtos/venta.dto";
import type { VentaDao } from "../daos/VentaDao";

export class VentaService {
  constructor(private readonly ventaDao: VentaDao) {}

  async crearVenta(datos: CrearVentaDTO): Promise<Venta> {
    const nuevaVenta = new Venta();
    nuevaVenta.medioDePago = datos.medioDePago;
    nuevaVenta.createdBy = datos.createdBy;
    nuevaVenta.items = datos.items.map((prodDto: CrearItemVentaDTO) => {
      const item = new ItemVenta();
      item.nombre = prodDto.nombre;
      item.cantidad = prodDto.cantidad;
      item.precio = prodDto.precio;
      item.tipo = prodDto.tipo;
      
      item.venta = nuevaVenta; 
      
      return item;
    });

    return await this.ventaDao.save(nuevaVenta);
  }
}