import express from "express";
import morgan from "morgan";
import { schedulerRouter } from "./api/schedulerApi";
import { apiKeyGuard } from "./middleware/apiKey";

const app = express();
app.use(morgan("dev"));
app.use(express.json());

// 🔐 proteger todas las rutas de schedules
app.use("/api/schedules", apiKeyGuard, schedulerRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 API escuchando en puerto ${PORT}`);
});
