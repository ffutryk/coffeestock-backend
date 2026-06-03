import { Alerta } from "../models/entities/alerta";
import { MateriaPrima } from "../models/entities/materia-prima";
import { GravedadAlerta } from "../models/enums/gravedad-alerta";
import { MovimientoInventarioEventPayload, StockBajoAlertaEventPayload } from "../models/events";
import { Event } from "../models/events/event";
import { EmitirAlertaStockBajoPolicy } from "../models/policies/alerta-stock-bajo.policy";
import { AlertaPayload, SocketEvent } from "../models/types/websocket.types";
import { AlertaRepository } from "../repositories/interfaces/alerta.interface";
import { MovimientoInventarioRepository } from "../repositories/interfaces/movimiento.interface";
import { IWebSocketService } from "../services/interfaces/websocket.service";
import { Handler } from "./handler.interface";

export class StockBajoAlertaEventHandler implements Handler {
  constructor(
    private readonly alertaRepository: AlertaRepository,
    private readonly wsService: IWebSocketService,
  ) {}

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

    const alertaGuardada = await this.alertaRepository.save(alerta);

    const notification: SocketEvent<AlertaPayload> = {
      type: "ALERTA_STOCK_BAJO",
      payload: {
        id: alertaGuardada.id,
        mensaje: `El stock de ${materiaPrima.nombre} se encuentra bajo el mínimo establecido`,
        gravedad: this.gravedadAlerta(materiaPrima),
        createdAt: alertaGuardada.createdAt,
      },
    };

    this.wsService.broadcast(notification);
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
