import { Alerta } from "../../models/entities/alerta";
import { MateriaPrima } from "../../models/entities/materia-prima";
import { GravedadAlerta } from "../../models/enums/gravedad-alerta";
import { MovimientoInventarioEventPayload, StockBajoAlertaEventPayload } from "../../models/events";
import { Event } from "../../models/events/event";
import { AlertaRepository } from "../../repositories/interfaces/alerta.interface";
import { MovimientoInventarioRepository } from "../../repositories/interfaces/movimiento.interface";
import { Handler } from "./handler";

export class StockBajoAlertaEventHandler implements Handler {
  constructor(private readonly alertaRepository: AlertaRepository) {}

  async handle(event: Event<StockBajoAlertaEventPayload>): Promise<void> {
    const mensaje = `Stock (${event.payload.materiaPrima.inventario.stockActual}) bajo para: ${event.payload.materiaPrima.nombre}`;
    const alerta = Alerta.crear(mensaje, this.gravedadAlerta(event.payload.materiaPrima));

    await this.alertaRepository.save(alerta);
  }

  private gravedadAlerta(materiaPrima: MateriaPrima): GravedadAlerta {
    const ratio = materiaPrima.inventario.stockActual / materiaPrima.inventario.stockMinimo;

    if (ratio < 0.25) return GravedadAlerta.CRITICA;
    if (ratio < 0.5) return GravedadAlerta.ALTA;
    if (ratio < 0.75) return GravedadAlerta.MEDIA;

    return GravedadAlerta.BAJA;
  }
}

export class MovimientoInventarioEventHandler implements Handler {
  constructor(private readonly movimientoRepository: MovimientoInventarioRepository) {}

  async handle(event: Event<MovimientoInventarioEventPayload>): Promise<void> {
    const { movimiento } = event.payload;

    await this.movimientoRepository.save(movimiento);
  }
}
