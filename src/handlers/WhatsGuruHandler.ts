import { MessageHandler } from "../core/MessageHandler";
import { MessageContext } from "../core/MessageContext";
import { findBeachByName, listBeaches } from "../services/beaches";
import { getStormglassPoint } from "../services/stormglassService";
import { formatSurfMessage } from "../services/surfFormatter";

export class WhatsGuruHandler implements MessageHandler {
  canHandle(ctx: MessageContext): boolean {
    return ctx.body.trim().toLowerCase().startsWith("!!whatsguru ");
  }

  async handle(ctx: MessageContext): Promise<void> {
    // 1. parsear comando
    const raw = ctx.body.trim().slice("!!whatsguru".length).trim();
    if (!raw) {
      await ctx.reply(
        "❗ Uso: !!whatsguru {nombre de playa}\nEj: !!whatsguru salinas"
      );
      return;
    }

    await ctx.reply("🔍 Buscando datos...");

    // 2. resolver playa
    const beach = findBeachByName(raw);
    if (!beach) {
      await ctx.reply(
        "❌ Playa no encontrada en el bot.\nPrueba una de estas:\n" +
          listBeaches()
            .map((b) => `• ${b}`)
            .join("\n")
      );
      return;
    }

    try {
      // 3. pedir datos a stormglass
      const data = await getStormglassPoint(beach.lat, beach.lng);

      // 4. formatear
      const msg = formatSurfMessage(
        raw,
        beach.alias,
        beach.lat,
        beach.lng,
        data
      );

      // 5. responder
      await ctx.reply(msg);
    } catch (err: any) {
      console.error(err);
      if (err?.message === "STORMGLASS_API_KEY not set") {
        await ctx.reply("⚠️ Falta la API key de Stormglass en el servidor.");
      } else {
        await ctx.reply("❌ Error consultando Stormglass.");
      }
    }
  }

  getHelpMessage(): string {
    return "!!whatsguru {playa} → parte de olas/viento desde Stormglass";
  }
}
