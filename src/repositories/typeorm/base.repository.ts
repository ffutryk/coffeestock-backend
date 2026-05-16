import { Repository, ObjectLiteral, FindOptionsWhere, EntityTarget } from "typeorm";
import { BaseRepository } from "../interfaces/base.interface";
import { AppDataSource } from "../../config/data-source";
import { Paginacion } from "../../models/types/paginacion";
import { ResultadoPaginado } from "../../models/types/resultado-paginado";

interface WithId {
  id: number;
}

export abstract class TypeOrmBaseRepository<T extends ObjectLiteral & WithId> implements BaseRepository<T> {
  protected repository: Repository<T>;

  constructor(entity: EntityTarget<T>) {
    this.repository = AppDataSource.getRepository(entity);
  }

  async findById(id: number): Promise<T | null> {
    return await this.repository.findOneBy({ id } as FindOptionsWhere<T>);
  }

  async findAll(): Promise<T[]> {
    return await this.repository.find();
  }

  async findAllPaginated(paginacion: Paginacion): Promise<ResultadoPaginado<T>> {
    const { page, limit } = paginacion;
    const skip = (page - 1) * limit;
    const [data, total] = await this.repository.findAndCount({
      skip,
      take: limit,
    });
    return { data, total };
  }

  async save(entity: T): Promise<T> {
    return await this.repository.save(entity);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.softDelete(id);
    return (result.affected ?? 0) > 0;
  }
}
