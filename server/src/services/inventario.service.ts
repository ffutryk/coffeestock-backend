import {Inventario} from "../models/entities/inventario";
import { RegistrarMovimientoDTO } from "../dtos/inventario/registrar-movimiento.dto";
import { InventarioDao } from "../repositories/interfaces/inventario.interface";
import { MovimientoInventarioDao } from "../repositories/interfaces/movimiento.interface";
import { AppDataSource } from "../config/data-source";
import { MovimientoInventario } from "../models/entities/movimiento-inventario";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../errors";

export class InventarioService {
  constructor(
    private readonly inventarioDao: InventarioDao,
    private readonly movimientoDao: MovimientoInventarioDao,
  ) {}

  async obtenerInventario() {
    return await this.inventarioDao.findAllWithDetails();
  }

  async registrarMovimiento(datos: RegistrarMovimientoDTO, user: string) {
    // Hay que verificar tambien que el usuario este autenticado
    if (!user) throw new UnauthorizedError("Usuario no autenticado");

    const inventario = await this.inventarioDao.findById(datos.idMateriaPrima);
    if (!inventario) {
      throw new NotFoundError("No se encontró el inventario para la materia prima.");
    }

    let impactoStock = datos.cantidad;

    if(datos.motivo == "uso" || datos.motivo == "descarte") {
      if(inventario.stockActual < datos.cantidad){
        throw new BadRequestError("Stock insuficiente para realizar el movimiento");
      }
      impactoStock = - datos.cantidad;
    }

    if (datos.motivo == "correccion") {
      if (!datos.nota || datos.nota.trim() === "") {
        throw new BadRequestError("Debe ingresar una nota justificando la corrección.");
      }
      impactoStock = datos.cantidad;
    }

    return await AppDataSource.transaction(async (transactionalEntityManager) => {
      const movimiento = {
        idMateriaPrima: datos.idMateriaPrima,
        cantidad: impactoStock,
        motivo: datos.motivo,
        ...(datos.nota !== undefined ? { nota: datos.nota } : {}), // es horrible, pero sino me tira error porque nota puede ser undefined
        createdBy: user,
      };

      await transactionalEntityManager.save(MovimientoInventario, movimiento);

      inventario.stockActual += impactoStock;
      inventario.updatedBy = user;

      await transactionalEntityManager.save(Inventario, inventario);

      return inventario;
    });
  }
}