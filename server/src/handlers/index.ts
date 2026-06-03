import { Alerta } from "../models/entities/alerta";
import { MateriaPrima } from "../models/entities/materia-prima";
import { GravedadAlerta } from "../models/enums/gravedad-alerta";
import { MovimientoInventarioEventPayload, StockBajoAlertaEventPayload } from "../models/events";
import { Event } from "../models/events/event";
import { EmitirAlertaStockBajoPolicy } from "../models/policies/alerta-stock-bajo.policy";
import { AlertaRepository } from "../repositories/interfaces/alerta.interface";
import { MovimientoInventarioRepository } from "../repositories/interfaces/movimiento.interface";
import { Handler } from "./handler.interface";

export class StockBajoAlertaEventHandler implements Handler {
  constructor(private readonly alertaRepository: AlertaRepository) {}

  async handle(event: Event<StockBajoAlertaEventPayload>): Promise<void> {
    const materiaPrima = event.payload.materiaPrima;
    const ultima = await this.alertaRepository.findLatestStockBajoAlertByMateriaPrimaId(
      materiaPrima.id,
    );

    if (
      !EmitirAlertaStockBajoPolicy.canEmit(
        ultima,
        this.gravedadAlerta(materiaPrima),
        materiaPrima.inventario.stockActual,
      )
    )
      return;

    const mensaje = `Stock (${materiaPrima.inventario.stockActual}) bajo para: ${materiaPrima.nombre}`;
    const alerta = Alerta.crear(mensaje, this.gravedadAlerta(materiaPrima));

    alerta.metadata = {
      materiaPrimaId: materiaPrima.id,
      reason: "STOCK_BAJO",
      stockActual: materiaPrima.inventario.stockActual,
    };

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
