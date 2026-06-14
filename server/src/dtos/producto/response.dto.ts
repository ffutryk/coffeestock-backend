import { TipoItemVenta } from "../../models/enums/tipo-item-venta";
import { Producto } from "../../models/entities/producto";
import { RecetaResponseDTO } from "../receta/response.dto";

export class ProductoResponseDTO {
  id!: number;
  nombre!: string;
  descripcion?: string;
  precio!: number;
  tipo!: TipoItemVenta;
  sinTacc!: boolean;
  stock!: number;
  tieneReceta!: boolean;
  ingredientes!: RecetaResponseDTO[];

  static from(producto: Producto): ProductoResponseDTO {
    const dto = new ProductoResponseDTO();

    dto.id = producto.id;
    dto.nombre = producto.nombre;
    dto.descripcion = producto.descripcion ?? "";
    dto.precio = Number(producto.precio);
    dto.tipo = producto.tipo;
    dto.sinTacc = producto.sinTacc;
    dto.stock = producto.stock;
    dto.tieneReceta = producto.tieneReceta();
    dto.ingredientes = (producto.recetas ?? []).map(RecetaResponseDTO.from);

    return dto;
  }

  static fromMany(productos: Producto[]): ProductoResponseDTO[] {
    return productos.map(ProductoResponseDTO.from);
  }
}
