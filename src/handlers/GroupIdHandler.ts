import { MessageHandler } from "../core/MessageHandler";
import { MessageContext } from "../core/MessageContext";

export class GroupIdHandler implements MessageHandler {
  canHandle(ctx: MessageContext): boolean {
    return ctx.body.trim() === "!!group-id";
  }

  async handle(ctx: MessageContext): Promise<void> {
    const msg = ctx.message;
    // Si lo envías tú mismo (fromMe === true), el grupo está en msg.to
    const groupId = msg.fromMe ? msg.to : msg.from;

    if (!groupId.endsWith("@g.us")) {
      await ctx.reply("❌ Este comando solo funciona dentro de grupos.");
      return;
    }

    await ctx.reply(`🆔 ID del grupo:\n${groupId}`);
  }

  getHelpMessage(): string {
    return "(!!group-id) muestra el ID del grupo actual";
  }
}
