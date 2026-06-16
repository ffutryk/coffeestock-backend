import { Producto } from "../../models/entities/producto";
import { Paginacion } from "../../models/types/paginacion";
import { ResultadoPaginado } from "../../models/types/resultado-paginado";
import { ProductoRepository } from "../interfaces/producto.interface";
import { TypeOrmBaseRepository } from "./base.repository";
import { In } from "typeorm";

export class TypeOrmProductoRepository
  extends TypeOrmBaseRepository<Producto>
  implements ProductoRepository
{
  constructor() {
    super(Producto);
  }

  async findByIds(ids: number[]): Promise<Producto[]> {
    return await this.repository.findBy({ id: In(ids) });
  }

  async findWithInventarios(ids: number[]): Promise<Producto[]> {
    return await this.repository.find({
      where: { id: In(ids) },
      relations: ["recetas", "recetas.materiaPrima", "recetas.materiaPrima.inventario"],
    });
  }

  async findByIdWithRecipes(id: number): Promise<Producto | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ["recetas", "recetas.materiaPrima"],
    });
  }

  async findAll(): Promise<Producto[]> {
    return await this.repository.find({ relations: ["recetas", "recetas.materiaPrima"] });
  }

  async findAllPaginated(paginacion: Paginacion): Promise<ResultadoPaginado<Producto>> {
    const { page, limit } = paginacion;
    const skip = (page - 1) * limit;
    const [data, total] = await this.repository.findAndCount({
      skip,
      take: limit,
      relations: ["recetas", "recetas.materiaPrima"],
    });
    return { data, total };
  }
}
