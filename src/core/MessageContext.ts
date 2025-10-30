import { Message } from "whatsapp-web.js";
import { client } from "../whatsapp/client";

export class MessageContext {
  constructor(public message: Message) {}

  get from() {
    return this.message.from;
  }

  get body() {
    return this.message.body;
  }

  async reply(text: string) {
    await this.message.reply(text);
  }

  async sendTo(to: string, text: string) {
    await client.sendMessage(to, text);
  }
  async getSenderName(): Promise<string> {
    const contact = await this.message.getContact();
    // pushname es el nombre que el usuario muestra en WhatsApp
    // name suele ser el alias guardado en tu lista de contactos (si existe)
    return contact.pushname || contact.name || contact.number;
  }
}
