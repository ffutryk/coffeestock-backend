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
      const nuevaVenta = Venta.crear(MedioDePago.EFECTIVO);

      expect(nuevaVenta.medioDePago).toBe(MedioDePago.EFECTIVO);
      expect(nuevaVenta.items).toHaveLength(0);
      expect(nuevaVenta.items).toEqual([]);
    });

    it("debería crear venta con diferentes medios de pago", () => {
      const ventaEfectivo = Venta.crear(MedioDePago.EFECTIVO);
      const ventaTarjeta = Venta.crear(MedioDePago.TARJETA_DEBITO);

      expect(ventaEfectivo.medioDePago).toBe(MedioDePago.EFECTIVO);
      expect(ventaTarjeta.medioDePago).toBe(MedioDePago.TARJETA_DEBITO);
    });
  });

  describe("agregarItem()", () => {
    it("debería agregar item a la venta y decrementar stock directo", () => {
      const stockInicial = producto.stock;

      venta.agregarItem(producto, 2);

      expect(venta.items).toHaveLength(1);
      expect(venta.items[0].producto).toBe(producto);
      expect(venta.items[0].cantidad).toBe(2);
      expect(producto.stock).toBe(stockInicial - 2);
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
      mp.marca = "Nestle";
      const inv = new Inventario();
      inv.stockActual = 100;
      inv.materiaPrima = mp;
      mp.inventario = inv;

      const receta = new Receta();
      receta.materiaPrima = mp;
      receta.cantidad = 10;

      producto.recetas = [receta];

      venta.agregarItem(producto, 2);

      expect(inv.stockActual).toBe(80);
    });
  });

  describe("revertirItem()", () => {
    it("debería remover item de la venta e incrementar el stock", () => {
      const stockInicial = producto.stock;
      venta.agregarItem(producto, 3);
      expect(producto.stock).toBe(stockInicial - 3);

      const item = venta.items[0];
      venta.revertirItem(item);

      expect(venta.items).toHaveLength(0);
      expect(producto.stock).toBe(stockInicial);
    });

    it("debería revertir insumos si el producto tiene receta", () => {
      const mp = new MateriaPrima();
      mp.id = 1;
      mp.nombre = "Café";
      const inv = new Inventario();
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
  });
});
