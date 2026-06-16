import { TypeOrmVentaRepository } from "../repositories/typeorm/venta.repository";
import { TypeOrmProductoRepository } from "../repositories/typeorm/producto.repository";
import { TypeOrmInventarioRepository } from "../repositories/typeorm/inventario.repository";
import { TypeORMMovimientoRepository } from "../repositories/typeorm/movimiento.repository";
import { VentaService } from "../services/venta.service";
import { TypeORMEstadisticaRepository } from "../repositories/typeorm/estadistica.repository";
import { TypeOrmMateriasPrimasRepository } from "../repositories/typeorm/materias.primas.repository";
import { TypeOrmRecetaRepository } from "../repositories/typeorm/receta.repository";
import { TypeOrmUsuarioRepository } from "../repositories/typeorm/usuario.repository";
import AuthService from "../services/auth.service";
import TokenService from "../services/token.service";
import { EstadisticaService } from "../services/estadistica.service";
import { InventarioService } from "../services/inventario.service";
import MateriasPrimasService from "../services/materias.primas.service";
import { ProductoService } from "../services/producto.service";
import { RecetaService } from "../services/receta.service";
import { UsuarioService } from "../services/usuario.service";
import { MovimientoInventarioEventHandler, StockBajoAlertaEventHandler } from "../handlers";
import { eventBus } from "../models/events/event-bus";
import { TypeOrmAlertaRepository } from "../repositories/typeorm/alerta.repository";
import { WebsocketService } from "../services/websocket.service";
import { TypeOrmComboRepository } from "../repositories/typeorm/combo.repository";
import { ComboService } from "../services/combo.service";

const estadisticasRepository = new TypeORMEstadisticaRepository();
const inventariosRepository = new TypeOrmInventarioRepository();
const materiasPrimasRepository = new TypeOrmMateriasPrimasRepository();
const movimientosRepository = new TypeORMMovimientoRepository();
const productosRepository = new TypeOrmProductoRepository();
const recetasRepository = new TypeOrmRecetaRepository();
const usuariosRepository = new TypeOrmUsuarioRepository();
const ventasRepository = new TypeOrmVentaRepository();
const alertaRepository = new TypeOrmAlertaRepository();
const combosRepository = new TypeOrmComboRepository();

export const tokenService = new TokenService();
export const authService = new AuthService(tokenService, usuariosRepository);
export const estadisticaService = new EstadisticaService(estadisticasRepository);
export const inventarioService = new InventarioService(
  inventariosRepository,
  movimientosRepository,
);
export const materiaPrimaService = new MateriasPrimasService(materiasPrimasRepository);
export const productoService = new ProductoService(productosRepository);
export const recetaService = new RecetaService(
  recetasRepository,
  productosRepository,
  materiasPrimasRepository,
);
export const usuarioService = new UsuarioService(usuariosRepository);
export const ventaService = new VentaService(
  ventasRepository,
  productosRepository,
  movimientosRepository,
);
export const comboService = new ComboService(
  combosRepository,
  productosRepository
);

export const wsService = WebsocketService.getInstance();

const stockBajoAlertaEventHandler = new StockBajoAlertaEventHandler(alertaRepository, wsService);
const movimientoInventarioEventHandler = new MovimientoInventarioEventHandler(
  movimientosRepository,
);
eventBus.subscribe("StockBajoAlertaEvent", stockBajoAlertaEventHandler);
eventBus.subscribe("MovimientoInventarioEvent", movimientoInventarioEventHandler);
