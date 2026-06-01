import { Repository, ObjectLiteral, FindOptionsWhere, EntityTarget } from "typeorm";
import { BaseRepository } from "../interfaces/base.interface";
import { AppDataSource } from "../../config/data-source";
import { Paginacion } from "../../models/types/paginacion";
import { ResultadoPaginado } from "../../models/types/resultado-paginado";
import { Auditable } from "../../models/base/auditable";
import { AuthContext } from "../../context/auth.context";

export abstract class TypeOrmBaseRepository<T extends ObjectLiteral> implements BaseRepository<T> {
  protected repository: Repository<T>;

  constructor(entity: EntityTarget<T>) {
    this.repository = AppDataSource.getRepository(entity);
  }

  // eslint-disable-next-line
  async findById(id: any): Promise<T | null> {
    return await this.repository.findOne({
      where: { id } as FindOptionsWhere<T>,
    });
  }

  // eslint-disable-next-line
  async findByIdWithDeleted(id: any): Promise<T | null> {
    return await this.repository.findOne({
      where: { id } as FindOptionsWhere<T>,
      withDeleted: true,
    });
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

  private audit(entity: T) {
    if (entity instanceof Auditable) {
      const modifiedBy = AuthContext.getUserId();
      entity.createdBy = modifiedBy;
      entity.updatedBy = modifiedBy;
    }
  }

  async save(entity: T): Promise<T>;
  async save(entities: T[]): Promise<T[]>;
  async save(entityOrEntities: T | T[]): Promise<T | T[]> {
    if (Array.isArray(entityOrEntities)) {
      entityOrEntities.forEach((e) => this.audit(e));
      return this.repository.save(entityOrEntities);
    }

    this.audit(entityOrEntities);
    return this.repository.save(entityOrEntities);
  }

  // eslint-disable-next-line
  async delete(id: any): Promise<boolean> {
    const entity = await this.repository.findOne({ where: { id } as FindOptionsWhere<T> });

    if (!entity) return false;

    if (entity instanceof Auditable) {
      entity.deletedBy = AuthContext.getUserId();
      await this.repository.save(entity);
    }

    await this.repository.softRemove(entity);
    return true;
  }

  async restore(id: number): Promise<boolean> {
    const result = await this.repository.restore(id);
    return (result.affected ?? 0) > 0;
  }
}
