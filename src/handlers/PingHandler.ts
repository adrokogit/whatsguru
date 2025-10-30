import { MessageHandler } from "../core/MessageHandler";
import { MessageContext } from "../core/MessageContext";

export class PingHandler implements MessageHandler {
  canHandle(ctx: MessageContext): boolean {
    return ctx.body.trim().toLowerCase() === "!!ping";
  }

  async handle(ctx: MessageContext): Promise<void> {
    await ctx.reply("pong 🏓");
  }

  getHelpMessage(): string {
    return "(!!ping) responde con pong";
  }
}
