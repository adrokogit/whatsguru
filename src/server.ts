// src/server.ts
import express from "express";
import morgan from "morgan";
import { schedulerRouter } from "./api/schedulerApi";
import { logger } from "./utils/logger";

const app = express();

// logs de cada request
app.use(morgan("dev"));

app.use(express.json());
app.use("/api/schedules", schedulerRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`🌐 API escuchando en puerto ${PORT}`);
});
