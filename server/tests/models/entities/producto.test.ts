import { describe, it, expect } from "vitest";
import { Producto } from "../../../src/models/entities/producto";
import { Receta } from "../../../src/models/entities/receta";
import { MateriaPrima } from "../../../src/models/entities/materia-prima";
import { Inventario } from "../../../src/models/entities/inventario";
import { MotivoMovimiento } from "../../../src/models/enums/motivo-movimiento";
import { StockInsuficienteError } from "../../../src/errors";

describe("Producto", () => {
  describe("serVendido", () => {
    it("debería restar stock directamente si el producto NO tiene receta", () => {
      const producto = new Producto();
      producto.nombre = "Pitusas";
      producto.stock = 10;
      producto.recetas = [];

      producto.serVendido(3);

      expect(producto.stock).toBe(7);
    });

    it("debería lanzar error si el stock es insuficiente (sin receta)", () => {
      const producto = new Producto();
      producto.stock = 2;
      producto.recetas = [];

      expect(() => producto.serVendido(5)).toThrow(StockInsuficienteError);
    });

    it("debería retornar resultado vacío para producto sin receta", () => {
      const producto = new Producto();
      producto.stock = 10;
      producto.recetas = [];

      const resultado = producto.serVendido(2);

      expect(resultado.inventariosModificados).toHaveLength(0);
      expect(resultado.movimientosGenerados).toHaveLength(0);
    });

    it("debería consumir materia prima si el producto TIENE receta", () => {
      const mp = new MateriaPrima();
      mp.id = 1;
      mp.nombre = "Café";
      mp.marca = "Nestle";

      const inv = new Inventario();
      inv.id = 1;
      inv.stockActual = 100;
      inv.materiaPrima = mp;
      mp.inventario = inv;

      const receta = new Receta();
      receta.materiaPrima = mp;
      receta.cantidad = 10;

      const producto = new Producto();
      producto.id = 1;
      producto.recetas = [receta];

      const resultado = producto.serVendido(2);

      expect(inv.stockActual).toBe(80);
      expect(resultado.movimientosGenerados).toHaveLength(1);
      expect(resultado.inventariosModificados).toHaveLength(1);
      expect(resultado.movimientosGenerados[0].motivo).toBe(MotivoMovimiento.VENTA);
    });

    it("debería fallar si uno de los insumos de la receta no alcanza", () => {
      const mp = new MateriaPrima();
      mp.nombre = "Café";

      const inv = new Inventario();
      inv.stockActual = 5;
      inv.materiaPrima = mp;
      mp.inventario = inv;

      const receta = new Receta();
      receta.materiaPrima = mp;
      receta.cantidad = 10;

      const producto = new Producto();
      producto.recetas = [receta];

      expect(() => producto.serVendido(1)).toThrow(StockInsuficienteError);
    });

    it("debería procesar múltiples recetas", () => {
      const mp1 = new MateriaPrima();
      mp1.id = 1;
      mp1.nombre = "Café";
      const inv1 = new Inventario();
      inv1.id = 1;
      inv1.stockActual = 100;
      inv1.materiaPrima = mp1;
      mp1.inventario = inv1;

      const receta1 = new Receta();
      receta1.materiaPrima = mp1;
      receta1.cantidad = 5;

      const mp2 = new MateriaPrima();
      mp2.id = 2;
      mp2.nombre = "Leche";
      const inv2 = new Inventario();
      inv2.id = 2;
      inv2.stockActual = 50;
      inv2.materiaPrima = mp2;
      mp2.inventario = inv2;

      const receta2 = new Receta();
      receta2.materiaPrima = mp2;
      receta2.cantidad = 3;

      const producto = new Producto();
      producto.recetas = [receta1, receta2];

      const resultado = producto.serVendido(2);

      expect(inv1.stockActual).toBe(90);
      expect(inv2.stockActual).toBe(44);
      expect(resultado.movimientosGenerados).toHaveLength(2);
      expect(resultado.inventariosModificados).toHaveLength(2);
    });
  });

  describe("revertirVenta", () => {
    it("debería aumentar stock directamente si el producto NO tiene receta", () => {
      const producto = new Producto();
      producto.nombre = "Pitusas";
      producto.stock = 10;
      producto.recetas = [];

      const resultado = producto.revertirVenta(3);

      expect(producto.stock).toBe(13);
      expect(resultado.inventariosModificados).toHaveLength(0);
      expect(resultado.movimientosGenerados).toHaveLength(0);
    });

    it("debería devolver materia prima si el producto TIENE receta", () => {
      const mp = new MateriaPrima();
      mp.id = 1;
      mp.nombre = "Café";

      const inv = new Inventario();
      inv.id = 1;
      inv.stockActual = 50;
      inv.materiaPrima = mp;
      mp.inventario = inv;

      const receta = new Receta();
      receta.materiaPrima = mp;
      receta.cantidad = 10;

      const producto = new Producto();
      producto.recetas = [receta];

      const resultado = producto.revertirVenta(2);

      expect(inv.stockActual).toBe(70);
      expect(resultado.movimientosGenerados).toHaveLength(1);
      expect(resultado.movimientosGenerados[0].motivo).toBe(MotivoMovimiento.CORRECCION);
    });

    it("debería incluir nota en movimientos de corrección", () => {
      const mp = new MateriaPrima();
      mp.id = 1;
      mp.nombre = "Café";

      const inv = new Inventario();
      inv.id = 1;
      inv.stockActual = 50;
      inv.materiaPrima = mp;
      mp.inventario = inv;

      const receta = new Receta();
      receta.materiaPrima = mp;
      receta.cantidad = 10;

      const producto = new Producto();
      producto.recetas = [receta];

      const nota = "Reversión de venta #42 - Item: Café Espresso";
      const resultado = producto.revertirVenta(2, nota);

      expect(resultado.movimientosGenerados[0].nota).toBe(nota);
    });

    it("debería procesar reversión de múltiples recetas", () => {
      const mp1 = new MateriaPrima();
      mp1.id = 1;
      mp1.nombre = "Café";
      const inv1 = new Inventario();
      inv1.id = 1;
      inv1.stockActual = 50;
      inv1.materiaPrima = mp1;
      mp1.inventario = inv1;

      const receta1 = new Receta();
      receta1.materiaPrima = mp1;
      receta1.cantidad = 5;

      const mp2 = new MateriaPrima();
      mp2.id = 2;
      mp2.nombre = "Leche";
      const inv2 = new Inventario();
      inv2.id = 2;
      inv2.stockActual = 30;
      inv2.materiaPrima = mp2;
      mp2.inventario = inv2;

      const receta2 = new Receta();
      receta2.materiaPrima = mp2;
      receta2.cantidad = 3;

      const producto = new Producto();
      producto.recetas = [receta1, receta2];

      const resultado = producto.revertirVenta(2);

      expect(inv1.stockActual).toBe(60);
      expect(inv2.stockActual).toBe(36);
      expect(resultado.movimientosGenerados).toHaveLength(2);
    });

    it("debería revertir completamente una venta anterior", () => {
      const mp = new MateriaPrima();
      mp.id = 1;
      mp.nombre = "Café";

      const inv = new Inventario();
      inv.id = 1;
      inv.stockActual = 100;
      inv.materiaPrima = mp;
      mp.inventario = inv;

      const receta = new Receta();
      receta.materiaPrima = mp;
      receta.cantidad = 10;

      const producto = new Producto();
      producto.recetas = [receta];

      producto.serVendido(3);
      expect(inv.stockActual).toBe(70);

      producto.revertirVenta(3);
      expect(inv.stockActual).toBe(100);
    });
  });

  describe("tieneReceta", () => {
    it("debería retornar false si no hay recetas", () => {
      const producto = new Producto();
      producto.recetas = [];

      expect(producto.tieneReceta()).toBe(false);
    });

    it("debería retornar true si hay al menos una receta", () => {
      const receta = new Receta();
      const producto = new Producto();
      producto.recetas = [receta];

      expect(producto.tieneReceta()).toBe(true);
    });
  });

  describe("insumosPara", () => {
    it("debería calcular insumos correctamente", () => {
      const mp1 = new MateriaPrima();
      mp1.id = 1;
      const mp2 = new MateriaPrima();
      mp2.id = 2;

      const receta1 = new Receta();
      receta1.materiaPrima = mp1;
      receta1.cantidad = 5;

      const receta2 = new Receta();
      receta2.materiaPrima = mp2;
      receta2.cantidad = 10;

      const producto = new Producto();
      producto.recetas = [receta1, receta2];

      const insumos = producto.insumosPara(2);

      expect(insumos).toEqual([
        { id: 1, cantidad: 10 },
        { id: 2, cantidad: 20 },
      ]);
    });

    it("debería calcular cero para cantidad cero", () => {
      const mp = new MateriaPrima();
      mp.id = 1;

      const receta = new Receta();
      receta.materiaPrima = mp;
      receta.cantidad = 5;

      const producto = new Producto();
      producto.recetas = [receta];

      const insumos = producto.insumosPara(0);

      expect(insumos[0].cantidad).toBe(0);
    });
  });
});
