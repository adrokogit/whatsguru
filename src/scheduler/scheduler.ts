// src/scheduler/scheduler.ts
import * as cron from "node-cron";
import { client } from "../whatsapp/client";
import { logger } from "../utils/logger";

export type ScheduleType = "cron" | "once";

export interface ScheduledMessage {
  id: string;
  to: string;
  text: string;
  type: ScheduleType;
  cronExpr?: string;
  runAt?: Date;
}

const SCHEDULES = new Map<string, ScheduledMessage>();
const JOBS = new Map<string, cron.ScheduledTask>();

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export function createCronMessage(
  to: string,
  text: string,
  cronExpr: string
): ScheduledMessage {
  if (!cron.validate(cronExpr)) {
    logger.warn("Expresión cron inválida", { cronExpr, to });
    throw new Error("Expresión cron inválida");
  }

  const id = generateId();
  const data: ScheduledMessage = { id, to, text, type: "cron", cronExpr };
  SCHEDULES.set(id, data);

  const task = cron.schedule(cronExpr, async () => {
    try {
      await client.sendMessage(to, text);
      logger.info(`[scheduler] enviado ${id} a ${to}`);
    } catch (e) {
      logger.error(`[scheduler] error en ${id}`, e);
    }
  });

  JOBS.set(id, task);
  return data;
}

export function createOneTimeMessage(
  to: string,
  text: string,
  runAt: Date
): ScheduledMessage {
  const id = generateId();
  const data: ScheduledMessage = { id, to, text, type: "once", runAt };
  SCHEDULES.set(id, data);

  const delay = runAt.getTime() - Date.now();
  const send = async () => {
    try {
      await client.sendMessage(to, text);
      logger.info(`[scheduler] enviado (once) ${id} a ${to}`);
    } catch (e) {
      logger.error(`[scheduler] error (once) ${id}`, e);
    } finally {
      SCHEDULES.delete(id);
    }
  };

  if (delay <= 0) {
    void send();
  } else {
    setTimeout(send, delay);
  }

  return data;
}

export function listSchedules(): ScheduledMessage[] {
  return Array.from(SCHEDULES.values());
}

export function getSchedule(id: string): ScheduledMessage | undefined {
  return SCHEDULES.get(id);
}

export function deleteSchedule(id: string): boolean {
  const job = JOBS.get(id);
  if (job) {
    job.stop();
    JOBS.delete(id);
  }
  return SCHEDULES.delete(id);
}

// actualización solo para cron
export function updateCronMessage(
  id: string,
  fields: Partial<Pick<ScheduledMessage, "to" | "text" | "cronExpr">>
): ScheduledMessage | null {
  const current = SCHEDULES.get(id);
  if (!current || current.type !== "cron") return null;

  // parar el job actual si existe
  const job = JOBS.get(id);
  if (job) {
    job.stop();
    JOBS.delete(id);
  }

  const updated: ScheduledMessage = {
    ...current,
    ...fields,
  };

  SCHEDULES.set(id, updated);

  // si sigue siendo cron, reprogramamos
  if (updated.cronExpr) {
    const task = cron.schedule(updated.cronExpr, async () => {
      try {
        await client.sendMessage(updated.to, updated.text);
      } catch (e) {
        console.error(`[scheduler] error en ${id}`, e);
      }
    });
    JOBS.set(id, task);
  }

  return updated;
}
