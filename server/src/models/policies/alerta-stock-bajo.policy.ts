import { Alerta } from "../entities/alerta";
import { GravedadAlerta } from "../enums/gravedad-alerta";

export class EmitirAlertaStockBajoPolicy {
  private static readonly REMINDER_COOLDOWN_MS = 24 * 60 * 60 * 1000;
  private static readonly PERSISTENT_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;

  static canEmit(ultima: Alerta | null, gravedad: GravedadAlerta, stockActual: number): boolean {
    if (!ultima) return true;

    if (this.aumentoLaGravedad(ultima.gravedad, gravedad)) return true;

    if (stockActual === 0) return true;

    const fechaReferencia = ultima.updatedAt || ultima.createdAt;
    const elapsed = Date.now() - fechaReferencia.getTime();

    return !ultima.seen
      ? elapsed >= this.REMINDER_COOLDOWN_MS
      : elapsed >= this.PERSISTENT_COOLDOWN_MS;
  }

  private static aumentoLaGravedad(anterior: GravedadAlerta, nueva: GravedadAlerta): boolean {
    const orden = {
      [GravedadAlerta.BAJA]: 1,
      [GravedadAlerta.MEDIA]: 2,
      [GravedadAlerta.ALTA]: 3,
      [GravedadAlerta.CRITICA]: 4,
    };

    return orden[nueva] > orden[anterior];
  }
}
