import { Router, type Request, type Response } from "express";
import { ProductService } from "../services/ProductService.js";

const router = Router();
const productService = new ProductService();

// Ruta para actualizar
router.put("/:id", async (req: Request, res: Response) => {

  const { id: idParam } = req.params;
  if (!idParam || typeof idParam !== 'string') {
    return res.status(400).json({ message: "El ID proporcionado no es válido" });
  }

  const id = parseInt(idParam);
  const actualizado = await productService.actualizarProducto(id, req.body);

  if (!actualizado) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }

  res.json(actualizado);
});

// Ruta para eliminar
router.delete("/:id", async (req: Request, res: Response) => {
  const { id: idParam } = req.params;
  if (!idParam || typeof idParam !== "string") {
    return res.status(400).json({ message: "El ID proporcionado no es válido" });
  }

  const id = parseInt(idParam);
  const eliminado = await productService.eliminarProducto(id);

  if (!eliminado) {
    return res.status(404).json({ message: "No se pudo eliminar el producto" });
  }

  res.status(204).send();
});

export default router;
