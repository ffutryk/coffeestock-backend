import { MateriaPrima } from "../../models/entities/materiaPrima";
import { MateriasPrimasRepository } from "../interfaces/materias.primas.interface";
import { TypeOrmBaseRepository } from "./base.repository";

export class TypeOrmMateriasPrimasRepository
  extends TypeOrmBaseRepository<MateriaPrima>
  implements MateriasPrimasRepository
{
  constructor() {
    super(MateriaPrima);
  }
  async findByNameAndBrand(nameAndBrand: {
    nombre: string;
    marca: string;
  }): Promise<MateriaPrima | null> {
    return await this.repository.findOneBy(nameAndBrand);
  }
}

export default TypeOrmMateriasPrimasRepository;
