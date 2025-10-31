import express, { Request, Response } from "express";
import {
  createCronMessage,
  createOneTimeMessage,
  listSchedules,
  getSchedule,
  deleteSchedule,
  updateCronMessage,
} from "../scheduler/scheduler";

export const schedulerRouter = express.Router();

/**
 * GET /api/schedules
 * lista todos
 */
schedulerRouter.get("/", (req: Request, res: Response) => {
  const data = listSchedules();
  res.json(data);
});

/**
 * GET /api/schedules/:id
 * obtiene uno
 */
schedulerRouter.get("/:id", (req: Request, res: Response) => {
  const item = getSchedule(req.params.id);
  if (!item) return res.status(404).json({ error: "not found" });
  res.json(item);
});

/**
 * POST /api/schedules
 * crea uno
 * body:
 * {
 *   "to": "34600....@c.us",
 *   "text": "hola",
 *   "type": "cron" | "once",
 *   "cronExpr": "* * * * * *",
 *   "runAt": "2025-11-01T10:00:00Z"
 * }
 */
schedulerRouter.post("/", (req: Request, res: Response) => {
  const { to, text, type, cronExpr, runAt } = req.body || {};

  if (!to || !text || !type) {
    return res.status(400).json({ error: "to, text y type son obligatorios" });
  }

  try {
    if (type === "cron") {
      if (!cronExpr) {
        return res
          .status(400)
          .json({ error: "cronExpr es obligatorio para type=cron" });
      }
      const created = createCronMessage(to, text, cronExpr);
      return res.status(201).json(created);
    } else if (type === "once") {
      if (!runAt) {
        return res
          .status(400)
          .json({ error: "runAt es obligatorio para type=once" });
      }
      const date = new Date(runAt);
      const created = createOneTimeMessage(to, text, date);
      return res.status(201).json(created);
    } else {
      return res.status(400).json({ error: "type debe ser 'cron' o 'once'" });
    }
  } catch (e: any) {
    return res
      .status(400)
      .json({ error: e?.message || "error creando schedule" });
  }
});

/**
 * PUT /api/schedules/:id
 * actualiza (solo cron en este ejemplo)
 */
schedulerRouter.put("/:id", (req: Request, res: Response) => {
  const { to, text, cronExpr } = req.body || {};
  const id = req.params.id;

  const updated = updateCronMessage(id, { to, text, cronExpr });

  if (!updated) {
    return res.status(404).json({ error: "not found or not a cron job" });
  }

  res.json(updated);
});

/**
 * DELETE /api/schedules/:id
 * borra
 */
schedulerRouter.delete("/:id", (req: Request, res: Response) => {
  const ok = deleteSchedule(req.params.id);
  if (!ok) return res.status(404).json({ error: "not found" });
  res.status(204).send();
});
