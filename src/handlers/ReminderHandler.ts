import { MessageHandler } from "../core/MessageHandler";
import { MessageContext } from "../core/MessageContext";
import { createOneTimeMessage } from "../scheduler/scheduler";

export class ReminderHandler implements MessageHandler {
  canHandle(ctx: MessageContext): boolean {
    return ctx.body.startsWith("!!recordar ");
  }

  async handle(ctx: MessageContext): Promise<void> {
    // ej: "recordar 2025-10-31 15:30 Hola"
    const [, dateStr, timeStr, ...rest] = ctx.body.split(" ");
    const msg = rest.join(" ") || "Recordatorio";
    const date = new Date(`${dateStr}T${timeStr}:00`);

    // programamos
    createOneTimeMessage(ctx.from, msg, date);

    await ctx.reply("📆 Recordatorio programado.");
  }

  getHelpMessage(): string {
    return "(!!recordar fecha hora texto) Para programar un mensaje Ejemplo: !!recordar 2025-10-31 15:30 Hola";
  }
}
