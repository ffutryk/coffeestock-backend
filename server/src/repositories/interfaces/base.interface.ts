import { Paginacion } from "../../models/types/paginacion";
import { ResultadoPaginado } from "../../models/types/resultado-paginado";

export interface BaseRepository<T> {
  findById(id: number): Promise<T | null>;
  findByIdWithDeleted(id: number): Promise<T | null>;
  findAll(): Promise<T[]>;
  findAllPaginated(paginacion: Paginacion): Promise<ResultadoPaginado<T>>;
  save(entity: T): Promise<T>;
  save(entities: T[]): Promise<T[]>;
  delete(id: number): Promise<boolean>;
  restore(id: number): Promise<boolean>;
}
