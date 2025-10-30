import { MessageHandler } from "../core/MessageHandler";
import { MessageContext } from "../core/MessageContext";
import { HandlerRegistry } from "../core/HandlerRegistry";

export class HelpHandler implements MessageHandler {
  constructor(private registry: HandlerRegistry) {}

  canHandle(ctx: MessageContext): boolean {
    return ctx.body.trim() === "!!help";
  }

  async handle(ctx: MessageContext): Promise<void> {
    const help = this.registry.getHelp();
    await ctx.reply(help || "No hay comandos disponibles.");
  }

  getHelpMessage(): string {
    return "(!!help) muestra la ayuda de todos los comandos";
  }
}
