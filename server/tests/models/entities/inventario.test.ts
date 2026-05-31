import { describe, it, expect, beforeEach } from "vitest";
import { Inventario } from "../../../src/models/entities/inventario";
import { MateriaPrima } from "../../../src/models/entities/materia-prima";
import { MotivoMovimiento } from "../../../src/models/enums/motivo-movimiento";
import { StockInsuficienteError } from "../../../src/errors";

describe("Inventario", () => {
  let inventario: Inventario;
  let materiaPrima: MateriaPrima;

  beforeEach(() => {
    inventario = new Inventario();
    inventario.id = 1;
    inventario.stockActual = 100;
    inventario.stockMinimo = 10;

    materiaPrima = new MateriaPrima();
    materiaPrima.id = 1;
    materiaPrima.nombre = "Café";
    materiaPrima.marca = "Nestle";
    materiaPrima.inventario = inventario;
  });

  describe("consumir()", () => {
    it("debería disminuir el stock correctamente", () => {
      const movimiento = inventario.consumir(30, materiaPrima);

      expect(inventario.stockActual).toBe(70);
      expect(movimiento.cantidad).toBe(-30);
      expect(movimiento.motivo).toBe(MotivoMovimiento.VENTA);
      expect(movimiento.materiaPrima).toBe(materiaPrima);
    });

    it("debería generar movimiento de venta", () => {
      const movimiento = inventario.consumir(25, materiaPrima);

      expect(movimiento.motivo).toBe(MotivoMovimiento.VENTA);
      expect(movimiento.cantidad).toBe(-25);
    });

    it("debería lanzar error si stock es insuficiente", () => {
      expect(() => inventario.consumir(150, materiaPrima)).toThrow(StockInsuficienteError);
      expect(inventario.stockActual).toBe(100);
    });

    it("debería lanzar error con nombre y marca de materia prima", () => {
      expect(() => inventario.consumir(200, materiaPrima)).toThrow(/Café marca Nestle/);
    });

    it("debería permitir consumir exactamente el stock disponible", () => {
      const movimiento = inventario.consumir(100, materiaPrima);

      expect(inventario.stockActual).toBe(0);
      expect(movimiento.cantidad).toBe(-100);
    });

    it("debería permitir consumir cantidad decimal", () => {
      inventario.stockActual = 10.5;
      const movimiento = inventario.consumir(2.5, materiaPrima);

      expect(inventario.stockActual).toBe(8);
      expect(movimiento.cantidad).toBe(-2.5);
    });
  });

  describe("devolverStock()", () => {
    it("debería aumentar el stock correctamente", () => {
      const movimiento = inventario.devolverStock(20, materiaPrima);

      expect(inventario.stockActual).toBe(120);
      expect(movimiento.cantidad).toBe(20);
      expect(movimiento.motivo).toBe(MotivoMovimiento.CORRECCION);
    });

    it("debería generar movimiento de corrección", () => {
      const movimiento = inventario.devolverStock(15, materiaPrima);

      expect(movimiento.motivo).toBe(MotivoMovimiento.CORRECCION);
      expect(movimiento.cantidad).toBe(15);
      expect(movimiento.materiaPrima).toBe(materiaPrima);
    });

    it("debería aceptar nota opcional", () => {
      const nota = "Reversión de venta #42";
      const movimiento = inventario.devolverStock(10, materiaPrima, nota);

      expect(movimiento.nota).toBe(nota);
    });

    it("debería funcionar sin nota", () => {
      const movimiento = inventario.devolverStock(10, materiaPrima);

      expect(movimiento.nota).toBeUndefined();
    });

    it("debería permitir devolver cantidad decimal", () => {
      inventario.stockActual = 50;
      const movimiento = inventario.devolverStock(5.5, materiaPrima);

      expect(inventario.stockActual).toBe(55.5);
      expect(movimiento.cantidad).toBe(5.5);
    });

    it("debería permitir devolver stock a inventario con stock cero", () => {
      inventario.stockActual = 0;
      const movimiento = inventario.devolverStock(50, materiaPrima);

      expect(inventario.stockActual).toBe(50);
      expect(movimiento.cantidad).toBe(50);
    });
  });

  describe("ciclo completo consumir + devolverStock", () => {
    it("debería revertir el estado después de consumir", () => {
      const stockInicial = inventario.stockActual;

      inventario.consumir(30, materiaPrima);
      expect(inventario.stockActual).toBe(stockInicial - 30);

      inventario.devolverStock(30, materiaPrima);
      expect(inventario.stockActual).toBe(stockInicial);
    });

    it("debería generar movimientos opuestos", () => {
      const movVenta = inventario.consumir(25, materiaPrima);
      const movCorreccion = inventario.devolverStock(25, materiaPrima);

      expect(movVenta.cantidad).toBe(-25);
      expect(movCorreccion.cantidad).toBe(25);
      expect(movVenta.motivo).toBe(MotivoMovimiento.VENTA);
      expect(movCorreccion.motivo).toBe(MotivoMovimiento.CORRECCION);
    });
  });
});
