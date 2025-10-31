import "dotenv/config";
import qrcode from "qrcode-terminal";
import { client } from "./whatsapp/client";
import { HandlerRegistry } from "./core/HandlerRegistry";
import { MessageContext } from "./core/MessageContext";
// handlers
import { PingHandler } from "./handlers/PingHandler";
import { PrintMessageHandler } from "./handlers/PrintMessageHandler";
import { HelpHandler } from "./handlers/HelpHandler";
import { ReminderHandler } from "./handlers/ReminderHandler";
import { GroupIdHandler } from "./handlers/GroupIdHandler";
import { WhatsGuruHandler } from "./handlers/WhatsGuruHandler";

// crear registry y registrar handlers
const registry = new HandlerRegistry();
registry.register(new HelpHandler(registry));
registry.register(new PingHandler());
registry.register(new ReminderHandler());
registry.register(new PrintMessageHandler());
registry.register(new GroupIdHandler());
registry.register(new WhatsGuruHandler());

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("✅ Bot listo");

  //scheduled messages aquí
  /*
  createCronMessage(
    "34633301163-1518106472@g.us",
    "⏰ Mensaje automático cada minuto",
    "* * * * *"
  );*/
});

// Mensajes de los demás
client.on("message", async (msg) => {
  const ctx = new MessageContext(msg);
  await registry.process(ctx);
});

// Mis mensajes
client.on("message_create", async (msg) => {
  if (msg.fromMe) {
    const ctx = new MessageContext(msg);
    await registry.process(ctx);
  }
});

client.initialize();

//import server.ts para api
import "./server";

// exporta el client y el registry si el scheduler los quiere usar
export { client };
