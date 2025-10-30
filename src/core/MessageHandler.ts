import { MessageContext } from "./MessageContext";

export interface MessageHandler {
  // si devuelve true, significa "yo ya lo gestioné"
  canHandle(ctx: MessageContext): boolean | Promise<boolean>;
  handle(ctx: MessageContext): void | Promise<void>;
  getHelpMessage(): string;
}
