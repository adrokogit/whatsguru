import { MessageContext } from "./MessageContext";

export interface MessageHandler {
  canHandle(ctx: MessageContext): boolean | Promise<boolean>;
  handle(ctx: MessageContext): void | Promise<void>;
  getHelpMessage(): string;
}
