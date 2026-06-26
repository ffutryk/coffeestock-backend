import { describe, it, expect, beforeEach, vi } from "vitest";
import { MateriaPrima } from "../../../src/models/entities/materia-prima";
import { UnidadDeMedida } from "../../../src/models/enums/unidad-de-medida";
import { StockInsuficienteError } from "../../../src/errors";
import { eventBus } from "../../../src/models/events/event-bus";
import { MovimientoInventarioEvent, StockBajoAlertaEvent } from "../../../src/models/events";
import { MovimientoInventario } from "../../../src/models/entities/movimiento-inventario";

vi.mock("../../../src/models/events/event-bus", () => ({
  eventBus: {
    publish: vi.fn(),
  },
}));

describe("MateriaPrima", () => {
  let materiaPrima: MateriaPrima;

  beforeEach(() => {
    vi.clearAllMocks();

    materiaPrima = MateriaPrima.crear("Café", "Nestle", UnidadDeMedida.KG, 1, true);
    materiaPrima.id = 1;
    materiaPrima.inventario.stockActual = 100;
    materiaPrima.inventario.stockMinimo = 10;
  });

  describe("crear()", () => {
    it("debería crear una instancia válida con su inventario asociado real", () => {
      const mp = MateriaPrima.crear("Leche", "La Serenísima", UnidadDeMedida.L, 1);

      expect(mp.nombre).toBe("Leche");
      expect(mp.marca).toBe("La Serenísima");
      expect(mp.unidad).toBe(UnidadDeMedida.L);
      expect(mp.cantidad_unidad).toBe(1);
      expect(mp.esSinTacc).toBe(false);

      expect(mp.inventario).toBeDefined();
    });
  });

  describe("consumir()", () => {
    it("debería descontar el stock real y publicar el evento de movimiento", () => {
      materiaPrima.consumir(20);

      expect(materiaPrima.inventario.stockActual).toBe(80);

      expect(eventBus.publish).toHaveBeenCalledTimes(1);
      const eventoPublicado = vi.mocked(eventBus.publish).mock
        .calls[0][0] as MovimientoInventarioEvent;

      expect(eventoPublicado).toBeInstanceOf(MovimientoInventarioEvent);

      const movimientoGenerado = eventoPublicado.payload.movimiento;
      expect(movimientoGenerado).toBeInstanceOf(MovimientoInventario);

      expect(movimientoGenerado.materiaPrima).toBe(materiaPrima);
      expect(movimientoGenerado.cantidad).toBe(-20);
    });

    it("debería lanzar StockInsuficienteError si no alcanza el stock e incluir nombre y marca", () => {
      expect(() => materiaPrima.consumir(150)).toThrow(StockInsuficienteError);
      expect(() => materiaPrima.consumir(150)).toThrow("Stock insuficiente de Café marca Nestle");

      expect(materiaPrima.inventario.stockActual).toBe(100);
      expect(eventBus.publish).not.toHaveBeenCalled();
    });

    it("debería publicar StockBajoAlertaEvent si el stock cae por debajo del mínimo", () => {
      materiaPrima.consumir(95);

      expect(materiaPrima.inventario.stockActual).toBe(5);
      expect(eventBus.publish).toHaveBeenCalledTimes(2);

      const eventoMovimiento = vi.mocked(eventBus.publish).mock.calls[0][0];
      const eventoAlerta = vi.mocked(eventBus.publish).mock.calls[1][0] as StockBajoAlertaEvent;

      expect(eventoMovimiento).toBeInstanceOf(MovimientoInventarioEvent);
      expect(eventoAlerta).toBeInstanceOf(StockBajoAlertaEvent);
      expect(eventoAlerta.payload.materiaPrima).toBe(materiaPrima);
    });
  });

  describe("devolver()", () => {
    it("debería aumentar el stock real y publicar el evento de corrección", () => {
      materiaPrima.devolver(15, "Sobrante de turno");

      expect(materiaPrima.inventario.stockActual).toBe(115);

      expect(eventBus.publish).toHaveBeenCalledTimes(1);
      const eventoPublicado = vi.mocked(eventBus.publish).mock
        .calls[0][0] as MovimientoInventarioEvent;

      expect(eventoPublicado).toBeInstanceOf(MovimientoInventarioEvent);

      const movimientoGenerado = eventoPublicado.payload.movimiento;
      expect(movimientoGenerado).toBeInstanceOf(MovimientoInventario);
      expect(movimientoGenerado.cantidad).toBe(15);
      expect(movimientoGenerado.nota).toBe("Sobrante de turno");
    });

    it("debería funcionar correctamente sin nota opcional", () => {
      materiaPrima.devolver(5);

      const eventoPublicado = vi.mocked(eventBus.publish).mock
        .calls[0][0] as MovimientoInventarioEvent;
      const movimientoGenerado = eventoPublicado.payload.movimiento;

      expect(movimientoGenerado.cantidad).toBe(5);
      expect(movimientoGenerado.nota).toBeUndefined();
    });
  });
});
