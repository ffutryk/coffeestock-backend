import { Venta } from "../models/Venta.js";
import { ItemVenta } from "../models/ItemVenta.js";
import type { CrearVentaDTO, CrearItemVentaDTO } from "../dtos/venta.dto.js";

export class VentaService {
  // Supongamos que recibes el DAO por constructor o lo tienes definido
  // constructor(private readonly ventaDao: VentaDao) {}

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

    // return await this.ventaDao.save(nuevaVenta);
    
    console.log("Venta y productos listos para persistir en cascada");
    return nuevaVenta;
  }
}