import { Venta } from "../../models/entities/venta";

export class VentaResponseDTO {
  id: number;
  medioDePago: string;
  total: number;
  items: {
    productoId: number;
    nombre: string;
    cantidad: number;
    precio: number;
    tipo: string;
  }[];
  createdAt: Date;

  constructor(venta: Venta) {
    this.id = venta.id;
    this.medioDePago = venta.medioDePago;
    this.total = venta.getPrecioTotal();
    this.createdAt = venta.createdAt;
    this.items = venta.items.map((item) => ({
      productoId: item.productoId,
      nombre: item.nombre,
      cantidad: item.cantidad,
      precio: Number(item.precio),
      tipo: item.tipo,
    }));
  }
}
