import { MessageHandler } from "./MessageHandler";
import { MessageContext } from "./MessageContext";

export class HandlerRegistry {
  private handlers: MessageHandler[] = [];

  register(handler: MessageHandler) {
    this.handlers.push(handler);
  }

  async process(ctx: MessageContext) {
    for (const handler of this.handlers) {
      const can = await handler.canHandle(ctx);
      if (can) {
        await handler.handle(ctx);
      }
    }
  }

  getHelp(): string {
    return this.handlers
      .map((h) => h.getHelpMessage())
      .filter(Boolean)
      .join("\n");
  }
}
