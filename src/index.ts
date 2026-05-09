import express, { type Request, type Response } from "express";
import cors from "cors";
import morgan from "morgan";
import { DEBUG, PORT } from "./config/envs.js";
import { AppDataSource } from "./config/data-source.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import productoRouter from "./routes/product.routes.js";

const app = express();

app.use(morgan(DEBUG ? "dev" : "combined"));
app.use(express.json());
app.use(cors());
app.use("/productos", productoRouter);

app.get("/", (req: Request, res: Response) => {
  res.sendStatus(200);
});

app.use(errorHandler);

try {
  await AppDataSource.initialize();
  app.listen(PORT, () => console.log(`Ready, ${PORT}`));
} catch (err) {
  console.error("Error al conectar la base de datos:", err);
  process.exit(1);
}
