import { describe, it, expect, beforeEach } from "vitest";
import { Venta } from "../../../src/models/entities/venta";
import { Producto } from "../../../src/models/entities/producto";
import { MateriaPrima } from "../../../src/models/entities/materia-prima";
import { Receta } from "../../../src/models/entities/receta";
import { Inventario } from "../../../src/models/entities/inventario";
import { MedioDePago } from "../../../src/models/enums/medio-de-pago";
import { TipoItemVenta } from "../../../src/models/enums/tipo-item-venta";

describe("Venta", () => {
  let venta: Venta;
  let producto: Producto;

  beforeEach(() => {
    venta = new Venta();
    venta.id = 1;
    venta.medioDePago = MedioDePago.EFECTIVO;
    venta.items = [];

    producto = new Producto();
    producto.id = 1;
    producto.nombre = "Café Negro";
    producto.precio = 3.5;
    producto.tipo = TipoItemVenta.PRODUCTO;
    producto.stock = 50;
    producto.recetas = [];
  });

  describe("crear()", () => {
    it("debería crear una venta con items vacío", () => {
      const venta = Venta.crear(MedioDePago.EFECTIVO);

      expect(venta.medioDePago).toBe(MedioDePago.EFECTIVO);
      expect(venta.items).toHaveLength(0);
      expect(venta.items).toEqual([]);
    });

    it("debería crear venta con diferentes medios de pago", () => {
      const ventaEfectivo = Venta.crear(MedioDePago.EFECTIVO);
      const ventaTarjeta = Venta.crear(MedioDePago.TARJETA_DEBITO);

      expect(ventaEfectivo.medioDePago).toBe(MedioDePago.EFECTIVO);
      expect(ventaTarjeta.medioDePago).toBe(MedioDePago.TARJETA_DEBITO);
    });
  });

  describe("agregarItem()", () => {
    it("debería agregar item a la venta", () => {
      venta.agregarItem(producto, 2);

      expect(venta.items).toHaveLength(1);
      expect(venta.items[0].producto).toBe(producto);
      expect(venta.items[0].cantidad).toBe(2);
      expect(venta.items[0].precio).toBe(producto.precio);
    });

    it("debería decrementar stock del producto sin receta", () => {
      const stockInicial = producto.stock;
      venta.agregarItem(producto, 5);

      expect(producto.stock).toBe(stockInicial - 5);
    });

    it("debería retornar efectos de la venta", () => {
      const resultado = venta.agregarItem(producto, 3);

      expect(resultado.inventariosModificados).toHaveLength(0);
      expect(resultado.movimientosGenerados).toHaveLength(0);
    });

    it("debería agregar múltiples items a la venta", () => {
      const producto2 = new Producto();
      producto2.id = 2;
      producto2.nombre = "Té";
      producto2.stock = 30;
      producto2.recetas = [];

      venta.agregarItem(producto, 2);
      venta.agregarItem(producto2, 3);

      expect(venta.items).toHaveLength(2);
      expect(venta.items[0].producto.id).toBe(1);
      expect(venta.items[1].producto.id).toBe(2);
    });

    it("debería procesar insumos si el producto tiene receta", () => {
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

      producto.recetas = [receta];

      const resultado = venta.agregarItem(producto, 2);

      expect(inv.stockActual).toBe(80);
      expect(resultado.movimientosGenerados).toHaveLength(1);
      expect(resultado.inventariosModificados).toHaveLength(1);
    });
  });

  describe("revertirItem()", () => {
    it("debería remover item de la venta", () => {
      venta.agregarItem(producto, 2);
      expect(venta.items).toHaveLength(1);

      const item = venta.items[0];
      venta.revertirItem(item);

      expect(venta.items).toHaveLength(0);
    });

    it("debería incrementar stock al revertir", () => {
      const stockInicial = producto.stock;
      venta.agregarItem(producto, 3);
      expect(producto.stock).toBe(stockInicial - 3);

      const item = venta.items[0];
      venta.revertirItem(item);

      expect(producto.stock).toBe(stockInicial);
    });

    it("debería generar movimiento de corrección con nota", () => {
      venta.agregarItem(producto, 2);
      const item = venta.items[0];

      const resultado = venta.revertirItem(item);

      expect(resultado.movimientosGenerados).toHaveLength(0);
    });

    it("debería crear nota con información de la venta", () => {
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

      producto.recetas = [receta];

      venta.agregarItem(producto, 2);
      const item = venta.items[0];

      const resultado = venta.revertirItem(item);

      const nota = resultado.movimientosGenerados[0].nota;
      expect(nota).toContain("Reversión de venta #1");
      expect(nota).toContain("Café Negro");
    });

    it("debería revertir insumos si el producto tiene receta", () => {
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

      producto.recetas = [receta];

      venta.agregarItem(producto, 2);
      expect(inv.stockActual).toBe(80);

      const item = venta.items[0];
      venta.revertirItem(item);

      expect(inv.stockActual).toBe(100);
      expect(venta.items).toHaveLength(0);
    });

    it("debería solo remover el item especificado", () => {
      const producto2 = new Producto();
      producto2.id = 2;
      producto2.nombre = "Té";
      producto2.stock = 30;
      producto2.recetas = [];

      venta.agregarItem(producto, 2);
      venta.agregarItem(producto2, 3);
      expect(venta.items).toHaveLength(2);

      const item1 = venta.items[0];
      venta.revertirItem(item1);

      expect(venta.items).toHaveLength(1);
      expect(venta.items[0].producto.id).toBe(2);
    });
  });

  describe("getPrecioTotal()", () => {
    it("debería retornar 0 para venta sin items", () => {
      expect(venta.getPrecioTotal()).toBe(0);
    });

    it("debería calcular precio total de un item", () => {
      venta.agregarItem(producto, 2);

      expect(venta.getPrecioTotal()).toBe(7);
    });

    it("debería calcular precio total de múltiples items", () => {
      const producto2 = new Producto();
      producto2.id = 2;
      producto2.nombre = "Té";
      producto2.precio = 2.5;
      producto2.stock = 30;
      producto2.recetas = [];

      venta.agregarItem(producto, 2);
      venta.agregarItem(producto2, 3);

      expect(venta.getPrecioTotal()).toBe(14.5);
    });

    it("debería redondear correctamente en operaciones decimal", () => {
      const producto2 = new Producto();
      producto2.id = 2;
      producto2.nombre = "Medialuna";
      producto2.precio = 1.33;
      producto2.stock = 10;
      producto2.recetas = [];

      venta.agregarItem(producto, 1);
      venta.agregarItem(producto2, 3);

      const total = venta.getPrecioTotal();
      expect(total).toBeCloseTo(7.49, 1);
    });
  });

  describe("ciclo completo de venta", () => {
    it("debería crear venta, agregar item, y revertir correctamente", () => {
      const venta = Venta.crear(MedioDePago.EFECTIVO);
      const stockInicial = producto.stock;

      venta.agregarItem(producto, 3);
      expect(producto.stock).toBe(stockInicial - 3);
      expect(venta.getPrecioTotal()).toBe(10.5);

      const item = venta.items[0];
      venta.revertirItem(item);
      expect(producto.stock).toBe(stockInicial);
      expect(venta.items).toHaveLength(0);
    });

    it("debería manejar múltiples items en ciclo completo", () => {
      const venta = Venta.crear(MedioDePago.TARJETA_DEBITO);
      const producto2 = new Producto();
      producto2.id = 2;
      producto2.nombre = "Té";
      producto2.precio = 2.5;
      producto2.stock = 30;
      producto2.recetas = [];

      const stockInicial1 = producto.stock;
      const stockInicial2 = producto2.stock;

      venta.agregarItem(producto, 2);
      venta.agregarItem(producto2, 4);

      expect(producto.stock).toBe(stockInicial1 - 2);
      expect(producto2.stock).toBe(stockInicial2 - 4);
      expect(venta.getPrecioTotal()).toBe(17);

      venta.revertirItem(venta.items[0]);
      expect(venta.items).toHaveLength(1);
      expect(producto.stock).toBe(stockInicial1);
      expect(producto2.stock).toBe(stockInicial2 - 4);

      venta.revertirItem(venta.items[0]);
      expect(venta.items).toHaveLength(0);
      expect(producto2.stock).toBe(stockInicial2);
    });
  });
});
