import { Combo } from "../../models/entities/combo";
import { BaseRepository } from "./base.interface";

export interface ComboRepository extends BaseRepository<Combo> {
    findByNombre(nombre: string): Promise<Combo | null>;
    findAllWithItems(): Promise<Combo[]>;
}