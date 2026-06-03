import express, { type Request, type Response } from "express";
import cors from "cors";
import morgan from "morgan";
import { DEBUG, PORT } from "./config/envs";
import { AppDataSource } from "./config/data-source";
import { errorHandler } from "./middlewares/error-handler";
import productoRouter from "./routes/producto.routes";
import ventaRouter from "./routes/venta.routes";
import usuarioRouter from "./routes/usuario.routes";
import estadisticaRoutes from "./routes/estadistica.routes";
import inventarioRouter from "./routes/inventario.routes";
import materiasPrimasRouter from "./routes/materias.primas.routes";
import recetaRoutes from "./routes/receta.routes";
import http from "http";
import { wsService } from "./container/di";

const app = express();
const server = http.createServer(app);

app.use(morgan(DEBUG ? "dev" : "combined"));
app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.sendStatus(200);
});

app.use("/productos", productoRouter);
app.use("/ventas", ventaRouter);
app.use("/usuarios", usuarioRouter);
app.use("/materias-primas", materiasPrimasRouter);
app.use("/estadisticas", estadisticaRoutes);
app.use("/inventario", inventarioRouter);
app.use("/recetas", recetaRoutes);

app.use(errorHandler);

async function main() {
  try {
    await AppDataSource.initialize();

    wsService.init(server);
    server.listen(PORT, () => console.log(`Ready, ${PORT}`));
  } catch (err) {
    console.error("Error al conectar la base de datos:", err);
    process.exit(1);
  }
}

main();
