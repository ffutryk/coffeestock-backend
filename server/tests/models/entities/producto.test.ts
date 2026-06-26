import { describe, it, expect, beforeEach, vi } from "vitest";
import { Producto } from "../../../src/models/entities/producto";
import { MateriaPrima } from "../../../src/models/entities/materia-prima";
import { Receta } from "../../../src/models/entities/receta";
import { TipoItemVenta } from "../../../src/models/enums/tipo-item-venta";
import { UnidadDeMedida } from "../../../src/models/enums/unidad-de-medida";
import {
  StockInsuficienteError,
  RecetaFaltanteError,
  IngredientesDuplicadosError,
} from "../../../src/errors";

vi.mock("../../../src/models/events/event-bus", () => ({
  eventBus: {
    publish: vi.fn(),
  },
}));

describe("Producto", () => {
  let productoSinReceta: Producto;
  let productoConReceta: Producto;
  let materiaPrima1: MateriaPrima;
  let materiaPrima2: MateriaPrima;

  beforeEach(() => {
    vi.clearAllMocks();

    productoSinReceta = Producto.crear("Pitusas", "Galletitas", 500, TipoItemVenta.PRODUCTO, false);
    productoSinReceta.id = 1;
    productoSinReceta.stock = 10;
    productoSinReceta.recetas = [];

    productoConReceta = Producto.crear(
      "Café con Leche",
      "Doble",
      1500,
      TipoItemVenta.PRODUCTO,
      true,
    );
    productoConReceta.id = 2;
    productoConReceta.stock = 0;

    materiaPrima1 = MateriaPrima.crear("Café", "Nestle", UnidadDeMedida.KG, 1);
    materiaPrima1.id = 1;
    materiaPrima1.inventario.stockActual = 100;

    materiaPrima2 = MateriaPrima.crear("Leche", "Serenísima", UnidadDeMedida.L, 1);
    materiaPrima2.id = 2;
    materiaPrima2.inventario.stockActual = 50;

    const receta1 = Receta.crear(productoConReceta, materiaPrima1, 10);
    const receta2 = Receta.crear(productoConReceta, materiaPrima2, 5);
    productoConReceta.recetas = [receta1, receta2];
  });

  describe("crear()", () => {
    it("debería crear un producto con los atributos correctos", () => {
      const nuevoProducto = Producto.crear("Té", "Té verde", 300, TipoItemVenta.PRODUCTO);

      expect(nuevoProducto.nombre).toBe("Té");
      expect(nuevoProducto.descripcion).toBe("Té verde");
      expect(nuevoProducto.precio).toBe(300);
      expect(nuevoProducto.tipo).toBe(TipoItemVenta.PRODUCTO);
      expect(nuevoProducto.sinTacc).toBe(false);
    });

    it("debería asignar sinTacc si se provee explícitamente", () => {
      const nuevoProducto = Producto.crear("Alfajor", "Maicena", 400, TipoItemVenta.PRODUCTO, true);
      expect(nuevoProducto.sinTacc).toBe(true);
    });
  });

  describe("tieneReceta()", () => {
    it("debería retornar false si el array de recetas está vacío o es undefined", () => {
      expect(productoSinReceta.tieneReceta()).toBe(false);

      const productoVacio = new Producto();
      expect(productoVacio.tieneReceta()).toBe(false);
    });

    it("debería retornar true si tiene al menos una receta", () => {
      expect(productoConReceta.tieneReceta()).toBe(true);
    });
  });

  describe("decrementarStock()", () => {
    it("debería restar stock si no tiene receta y el stock es suficiente", () => {
      productoSinReceta.decrementarStock(3);
      expect(productoSinReceta.stock).toBe(7);
    });

    it("debería lanzar StockInsuficienteError si no alcanza el stock", () => {
      expect(() => productoSinReceta.decrementarStock(15)).toThrow(StockInsuficienteError);
      expect(() => productoSinReceta.decrementarStock(15)).toThrow("Pitusas");
      expect(productoSinReceta.stock).toBe(10); // No debió modificarse
    });
  });

  describe("serVendido()", () => {
    it("debería lanzar RecetaFaltanteError si no tiene receta y su stock es falsy (0 o undefined)", () => {
      productoSinReceta.stock = 0;
      expect(() => productoSinReceta.serVendido(1)).toThrow(RecetaFaltanteError);
      expect(() => productoSinReceta.serVendido(1)).toThrow("Pitusas");
    });

    it("debería decrementar su propio stock si NO tiene receta", () => {
      productoSinReceta.serVendido(4);
      expect(productoSinReceta.stock).toBe(6);
    });

    it("debería consumir materia prima de todas sus recetas si TIENE receta", () => {
      productoConReceta.serVendido(2);

      expect(materiaPrima1.inventario.stockActual).toBe(80);
      expect(materiaPrima2.inventario.stockActual).toBe(40);
    });

    it("debería fallar si alguna materia prima no alcanza, sin alterar las posteriores", () => {
      materiaPrima2.inventario.stockActual = 2;

      expect(() => productoConReceta.serVendido(1)).toThrow(StockInsuficienteError);

      expect(materiaPrima1.inventario.stockActual).toBe(90);
      expect(materiaPrima2.inventario.stockActual).toBe(2);
    });
  });

  describe("revertirVenta()", () => {
    it("debería aumentar su propio stock si NO tiene receta", () => {
      productoSinReceta.revertirVenta(3);
      expect(productoSinReceta.stock).toBe(13);
    });

    it("debería devolver stock a todas las materias primas si TIENE receta", () => {
      productoConReceta.revertirVenta(2, "Venta cancelada");

      expect(materiaPrima1.inventario.stockActual).toBe(120);
      expect(materiaPrima2.inventario.stockActual).toBe(60);
    });
  });

  describe("construirReceta()", () => {
    it("debería crear un array de recetas válido a partir de ingredientes", () => {
      const ingredientes = [
        { materiaPrima: materiaPrima1, cantidad: 15 },
        { materiaPrima: materiaPrima2, cantidad: 20 },
      ];

      const nuevasRecetas = productoSinReceta.construirReceta(ingredientes);

      expect(nuevasRecetas).toHaveLength(2);
      expect(nuevasRecetas[0].producto).toBe(productoSinReceta);
      expect(nuevasRecetas[0].materiaPrima).toBe(materiaPrima1);
      expect(nuevasRecetas[0].cantidad).toBe(15);

      expect(nuevasRecetas[1].producto).toBe(productoSinReceta);
      expect(nuevasRecetas[1].materiaPrima).toBe(materiaPrima2);
      expect(nuevasRecetas[1].cantidad).toBe(20);
    });

    it("debería lanzar IngredientesDuplicadosError si se pasa la misma materia prima varias veces", () => {
      const ingredientes = [
        { materiaPrima: materiaPrima1, cantidad: 10 },
        { materiaPrima: materiaPrima1, cantidad: 5 },
      ];

      expect(() => productoSinReceta.construirReceta(ingredientes)).toThrow(
        IngredientesDuplicadosError,
      );
    });
  });
});
