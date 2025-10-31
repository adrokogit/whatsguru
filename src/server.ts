import express from "express";
import { schedulerRouter } from "./api/schedulerApi";

const app = express();
app.use(express.json());

app.use("/api/schedules", schedulerRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🌐 API escuchando en puerto", PORT);
});
