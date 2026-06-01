import { Inventario } from "../models/entities/inventario";
import { RegistrarMovimientoDTO } from "../dtos/inventario/registrar-movimiento.dto";
import { InventarioDao } from "../repositories/interfaces/inventario.interface";
import { MovimientoInventarioRepository } from "../repositories/interfaces/movimiento.interface";
import { AppDataSource } from "../config/data-source";
import { MovimientoInventario } from "../models/entities/movimiento-inventario";
import { BadRequestError, NotFoundError } from "../errors";
import { EntityManager } from "typeorm";
import { MotivoMovimiento } from "../models/enums/motivo-movimiento";

export class InventarioService {
  constructor(
    private readonly inventarioDao: InventarioDao,
    private readonly movimientoDao: MovimientoInventarioRepository,
  ) {}

  async obtenerInventario() {
    return await this.inventarioDao.findAllWithDetails();
  }

  async registrarMovimiento(datos: RegistrarMovimientoDTO) {
    const inventario = await this.inventarioDao.findById(datos.idMateriaPrima);
    if (!inventario) {
      throw new NotFoundError("No se encontró el inventario para la materia prima.");
    }

    let impactoStock = datos.cantidad;

    if (datos.motivo == MotivoMovimiento.USO || datos.motivo == MotivoMovimiento.DESCARTE) {
      if (inventario.stockActual < datos.cantidad) {
        throw new BadRequestError("Stock insuficiente para realizar el movimiento");
      }
      impactoStock = -datos.cantidad;
    }

    if (datos.motivo == MotivoMovimiento.CORRECCION) {
      if (!datos.nota || datos.nota.trim() === "") {
        throw new BadRequestError("Debe ingresar una nota justificando la corrección.");
      }
      impactoStock = datos.cantidad;
    }

    return await AppDataSource.transaction(async (transactionalEntityManager) => {
      const movimiento = new MovimientoInventario();

      movimiento.materiaPrima = inventario.materiaPrima;
      movimiento.cantidad = impactoStock;
      movimiento.motivo = datos.motivo;

      if (datos.nota) movimiento.nota = datos.nota;

      await transactionalEntityManager.save(movimiento);

      inventario.stockActual += impactoStock;

      await transactionalEntityManager.save(Inventario, inventario);

      return inventario;
    });
  }
}
