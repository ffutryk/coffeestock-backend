import { Alerta } from "../entities/alerta";
import { MateriaPrima } from "../entities/materia-prima";

export class EmitirAlertaStockBajoPolicy {
  private static readonly REMINDER_COOLDOWN_MS = 24 * 60 * 60 * 1000;
  private static readonly PERSISTENT_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;

  static canEmit(ultima: Alerta | null, materiaPrima: MateriaPrima): boolean {
    const { stockActual } = materiaPrima.inventario;

    if (!ultima) return true;

    if (
      stockActual !== undefined &&
      ultima.metadata &&
      typeof ultima.metadata.stockActual === "number"
    ) {
      const stockAnterior = ultima.metadata.stockActual;

      if (stockActual === 0 && stockAnterior > 0) return true;

      if (stockActual <= stockAnterior / 2) return true;
    }

    const fechaReferencia = ultima.updatedAt || ultima.createdAt;
    const elapsed = Date.now() - fechaReferencia.getTime();

    if (!ultima.seen) {
      return elapsed >= this.REMINDER_COOLDOWN_MS;
    }

    return elapsed >= this.PERSISTENT_COOLDOWN_MS;
  }
}
