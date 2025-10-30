import { MessageHandler } from "../core/MessageHandler";
import { MessageContext } from "../core/MessageContext";

export class PrintMessageHandler implements MessageHandler {
  canHandle(ctx: MessageContext): boolean {
    return true;
  }

  async handle(ctx: MessageContext): Promise<void> {
    const name = await ctx.getSenderName();
    console.log("From:", name);
    console.log("Body:", ctx.body);
    console.log("------------------------");
  }
  getHelpMessage(): string {
    return "";
  }
}
