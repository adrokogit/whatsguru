import { MessageHandler } from "../core/MessageHandler";
import { MessageContext } from "../core/MessageContext";

/**
 * Envuelve otro handler y solo lo ejecuta si el mensaje
 * proviene de un grupo concreto.
 */
export class GroupWrapperHandler implements MessageHandler {
  constructor(
    private readonly wrapped: MessageHandler,
    private readonly allowedGroupId: string // ej: "1234567890-1234567890@g.us"
  ) {}

  async canHandle(ctx: MessageContext): Promise<boolean> {
    // si el mensaje NO es de ese grupo, fuera
    if (ctx.message.from !== this.allowedGroupId) return false;

    // si es del grupo correcto, delegamos en el handler real
    return await this.wrapped.canHandle(ctx);
  }

  async handle(ctx: MessageContext): Promise<void> {
    await this.wrapped.handle(ctx);
  }

  getHelpMessage(): string {
    return `${this.wrapped.getHelpMessage()} (solo en grupo ${
      this.allowedGroupId
    })`;
  }
}
