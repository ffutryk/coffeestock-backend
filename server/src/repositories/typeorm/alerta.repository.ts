import { TypeOrmBaseRepository } from "./base.repository";
import { Alerta } from "../../models/entities/alerta";
import { AlertaRepository } from "../interfaces/alerta.interface";

export class TypeOrmAlertaRepository
  extends TypeOrmBaseRepository<Alerta>
  implements AlertaRepository
{
  constructor() {
    super(Alerta);
  }
}
