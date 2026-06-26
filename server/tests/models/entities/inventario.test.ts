import { describe, it, expect, beforeEach } from "vitest";
import { Inventario } from "../../../src/models/entities/inventario";

describe("Inventario", () => {
  let inventario: Inventario;

  beforeEach(() => {
    inventario = new Inventario();
    inventario.id = 1;
    inventario.stockActual = 100;
    inventario.stockMinimo = 10;
  });

  describe("consumir()", () => {
    it("debería disminuir el stock correctamente", () => {
      inventario.consumir(30);

      expect(inventario.stockActual).toBe(70);
    });

    it("debería permitir consumir exactamente el stock disponible", () => {
      inventario.consumir(100);

      expect(inventario.stockActual).toBe(0);
    });

    it("debería permitir consumir cantidad decimal", () => {
      inventario.stockActual = 10.5;
      inventario.consumir(2.5);

      expect(inventario.stockActual).toBe(8);
    });
  });

  describe("devolverStock()", () => {
    it("debería aumentar el stock correctamente", () => {
      inventario.devolverStock(20);

      expect(inventario.stockActual).toBe(120);
    });

    it("debería permitir devolver cantidad decimal", () => {
      inventario.stockActual = 50;
      inventario.devolverStock(5.5);

      expect(inventario.stockActual).toBe(55.5);
    });

    it("debería permitir devolver stock a inventario con stock cero", () => {
      inventario.stockActual = 0;
      inventario.devolverStock(50);

      expect(inventario.stockActual).toBe(50);
    });
  });

  describe("ciclo completo consumir + devolverStock", () => {
    it("debería revertir el estado después de consumir", () => {
      const stockInicial = inventario.stockActual;

      inventario.consumir(30);
      expect(inventario.stockActual).toBe(stockInicial - 30);

      inventario.devolverStock(30);
      expect(inventario.stockActual).toBe(stockInicial);
    });
  });
});
