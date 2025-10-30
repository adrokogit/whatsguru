import { MessageHandler } from "../core/MessageHandler";
import { MessageContext } from "../core/MessageContext";

/**
 * Envuelve otro handler y solo lo ejecuta si el mensaje
 * proviene del número autorizado.
 */
export class PrivateWrapperHandler implements MessageHandler {
  constructor(
    private readonly wrapped: MessageHandler,
    private readonly userNumber: string // formato "34600111222"
  ) {
    userNumber += "@c.us";
  }

  async canHandle(ctx: MessageContext): Promise<boolean> {
    // Solo evalúa el handler interno si el mensaje es del usuario autorizado
    if (ctx.from !== this.userNumber) return false;

    // Reutiliza la lógica del handler original
    return await this.wrapped.canHandle(ctx);
  }

  async handle(ctx: MessageContext): Promise<void> {
    await this.wrapped.handle(ctx);
  }

  getHelpMessage(): string {
    return "";
  }
}
