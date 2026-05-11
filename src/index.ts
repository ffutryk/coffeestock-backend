import express, { type Request, type Response } from "express";
import cors from "cors";
import morgan from "morgan";
import { DEBUG, PORT } from "./config/envs";
import { AppDataSource } from "./config/data-source";
import { errorHandler } from "./middlewares/error-handler";
import productoRouter from "./routes/product.routes";
import ventaRouter from "./routes/venta.routes";

const app = express();

app.use(morgan(DEBUG ? "dev" : "combined"));
app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.sendStatus(200);
});

app.use("/productos", productoRouter);
app.use("/ventas", ventaRouter);

app.use(errorHandler);

async function main() {
  try {
    await AppDataSource.initialize();
    app.listen(PORT, () => console.log(`Ready, ${PORT}`));
  } catch (err) {
    console.error("Error al conectar la base de datos:", err);
    process.exit(1);
  }
}

main();
