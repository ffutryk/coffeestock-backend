import express, { type Request, type Response } from "express";
import { PORT } from "./config/envs.js";
import { AppDataSource } from "./config/data-source.js";

const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.sendStatus(200);
});

try {
  await AppDataSource.initialize();
  app.listen(PORT, () => console.log(`Ready, ${PORT}`));
} catch (err) {
  console.error("Error al conectar la base de datos:", err);
  process.exit(1);
}
