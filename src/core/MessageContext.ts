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
    // en grupos el "remitente real" puede venir en author
    const senderId = this.message.from || (this.message as any).author;
    if (!senderId) {
      return "Desconocido";
    }

    try {
      // este es el camino “bueno” que ya tenías
      const contact = await this.message.getContact();
      return contact.pushname || contact.name || contact.number || senderId;
    } catch (err) {
      // si falla getContact (lo que te estaba pasando)
      try {
        const contact = await client.getContactById(senderId);
        return (
          contact.pushname ||
          contact.name ||
          (contact as any).number ||
          senderId
        );
      } catch {
        return senderId;
      }
    }
  }
}
