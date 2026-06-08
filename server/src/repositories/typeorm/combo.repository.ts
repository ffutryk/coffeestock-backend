import { Combo } from "../../models/entities/combo";
import { ComboRepository } from "../interfaces/combo.interface";
import { TypeOrmBaseRepository } from "./base.repository";

export class TypeOrmComboRepository extends TypeOrmBaseRepository<Combo> implements ComboRepository {
    constructor() { super(Combo); }
    async findByNombre(nombre: string): Promise<Combo | null> {
        return await this.repository.findOne({where: { nombre }});
    }
    async findAllWithItems(): Promise<Combo[]> {
        return await this.repository.find({relations: ["items", "items.producto"]});
    }
}