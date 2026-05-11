import { Repository, ObjectLiteral, FindOptionsWhere } from "typeorm";
import { BaseRepository } from "../interfaces/base.interface";
import { AppDataSource } from "../../config/data-source";

interface WithId {
  id: number;
}

export abstract class TypeOrmBaseRepository<
  T extends ObjectLiteral & WithId,
> implements BaseRepository<T> {
  protected repository: Repository<T>;

  constructor(entity: { new (): T }) {
    this.repository = AppDataSource.getRepository(entity);
  }

  async findById(id: number): Promise<T | null> {
    return await this.repository.findOneBy({ id } as FindOptionsWhere<T>);
  }

  async findAll(): Promise<T[]> {
    return await this.repository.find();
  }

  async save(entity: T): Promise<T> {
    return await this.repository.save(entity);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.softDelete(id);
    return (result.affected ?? 0) > 0;
  }
}
