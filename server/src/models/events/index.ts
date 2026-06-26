import { Event } from "./event";
import { MateriaPrima } from "../entities/materia-prima";
import { MovimientoInventario } from "../entities/movimiento-inventario";

export type StockBajoAlertaEventPayload = {
  materiaPrima: MateriaPrima;
};

export class StockBajoAlertaEvent extends Event<StockBajoAlertaEventPayload> {
  constructor(payload: StockBajoAlertaEventPayload) {
    super(payload);
    this.type = this.constructor.name;
  }
}

export type MovimientoInventarioEventPayload = {
  movimiento: MovimientoInventario;
};

export class MovimientoInventarioEvent extends Event<MovimientoInventarioEventPayload> {
  constructor(payload: MovimientoInventarioEventPayload) {
    super(payload);
    this.type = this.constructor.name;
  }
}
