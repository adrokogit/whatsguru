import cron from "node-cron";
import { client } from "../whatsapp/client";

// 1) Ejemplo: todos los días a las 10:00
export function initScheduler() {
  // formato cron: segundo (opcional) minuto hora díaMes mes díaSemana
  cron.schedule("0 10 * * *", async () => {
    // aquí puedes obtener destinatarios de BBDD
    const to = "34600111222@c.us"; // número en formato WhatsApp
    await client.sendMessage(to, "Buenos días 👋");
  });

  // 2) Si quieres programar algo una vez:
  // scheduleAt(new Date('2025-10-31T15:30:00'), '34600111222@c.us', 'Hola futuro!');
}

export function scheduleAt(date: Date, to: string, message: string) {
  const diff = date.getTime() - Date.now();
  if (diff <= 0) return;

  setTimeout(async () => {
    await client.sendMessage(to, message);
  }, diff);
}
