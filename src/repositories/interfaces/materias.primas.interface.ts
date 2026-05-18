import { MateriaPrima } from "../../models/entities/materiaPrima";
import { BaseRepository } from "./base.interface";

export interface MateriasPrimasRepository extends BaseRepository<MateriaPrima> {
  findByNameAndBrand(nameAndBrand: { nombre: string; marca: string }): Promise<MateriaPrima | null>;
}
