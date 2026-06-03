import { describe, it, expect } from "vitest";
import { ItemVenta } from "../../../src/models/entities/item-venta";
import { Producto } from "../../../src/models/entities/producto";
import { Venta } from "../../../src/models/entities/venta";
import { TipoItemVenta } from "../../../src/models/enums/tipo-item-venta";
import { MedioDePago } from "../../../src/models/enums/medio-de-pago";

describe("ItemVenta", () => {
  describe("create()", () => {
    it("debería mapear correctamente los datos del producto y vincular la venta", () => {
      const producto = new Producto();
      producto.id = 15;
      producto.nombre = "Cheesecake";
      producto.precio = 5.5;
      producto.tipo = TipoItemVenta.PRODUCTO;

      const venta = new Venta();
      venta.id = 100;
      venta.medioDePago = MedioDePago.TARJETA_CREDITO;

      const cantidad = 2;

      const item = ItemVenta.create(producto, cantidad, venta);

      expect(item).toBeInstanceOf(ItemVenta);
      expect(item.nombre).toBe("Cheesecake");
      expect(item.precio).toBe(5.5);
      expect(item.tipo).toBe(TipoItemVenta.PRODUCTO);
      expect(item.cantidad).toBe(2);

      expect(item.producto).toBe(producto);
      expect(item.venta).toBe(venta);
    });
  });
});
