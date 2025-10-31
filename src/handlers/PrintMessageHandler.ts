import { MessageHandler } from "../core/MessageHandler";
import { MessageContext } from "../core/MessageContext";
import { logger } from "../utils/logger";

export class PrintMessageHandler implements MessageHandler {
  canHandle(ctx: MessageContext): boolean {
    return true;
  }

  async handle(ctx: MessageContext): Promise<void> {
    const name = await ctx.getSenderName();
    logger.info("📥 mensaje recibido", { from: name, body: ctx.body });
  }
  getHelpMessage(): string {
    return "";
  }
}
