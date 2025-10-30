// src/handlers/WhatsGuruHandler.ts
import { MessageHandler } from "../core/MessageHandler";
import { MessageContext } from "../core/MessageContext";

// playas conocidas -> coords (puedes ampliar esta lista)
const BEACHES: Record<string, { lat: number; lng: number; alias?: string }> = {
  salinas: { lat: 43.5756, lng: -5.9455, alias: "Playa de Salinas" },
  rodiles: { lat: 43.5246, lng: -5.3953, alias: "Playa de Rodiles" },
  gijon: { lat: 43.5453, lng: -5.6615, alias: "Playa de San Lorenzo (Gijón)" },
  sanlorezo: {
    lat: 43.5453,
    lng: -5.6615,
    alias: "Playa de San Lorenzo (Gijón)",
  },
  "san lorenzo": {
    lat: 43.5453,
    lng: -5.6615,
    alias: "Playa de San Lorenzo (Gijón)",
  },
  tapia: { lat: 43.5691, lng: -6.9454, alias: "Playa de Tapia" },
};

export class WhatsGuruHandler implements MessageHandler {
  canHandle(ctx: MessageContext): boolean {
    return ctx.body.trim().toLowerCase().startsWith("!!whatsguru ");
  }

  async handle(ctx: MessageContext): Promise<void> {
    const apiKey = process.env.STORMGLASS_API_KEY;
    if (!apiKey) {
      await ctx.reply("⚠️ Falta la API key de Stormglass en el servidor.");
      return;
    }

    // 1. sacar nombre de playa del mensaje
    const raw = ctx.body.trim().slice("!!whatsguru".length).trim(); // lo que viene después
    if (!raw) {
      await ctx.reply(
        "❗ Uso: !!whatsguru {nombre de playa}\nEj: !!whatsguru salinas"
      );
      return;
    }

    const beachKey = raw.toLowerCase();
    const beach = BEACHES[beachKey];
    if (!beach) {
      await ctx.reply(
        "❌ Playa no encontrada en el bot.\nPrueba una de estas:\n" +
          Object.keys(BEACHES)
            .map((b) => `• ${b}`)
            .join("\n")
      );
      return;
    }

    const { lat, lng, alias } = beach;

    // 2. pedir datos a Stormglass
    // doc: https://docs.stormglass.io/
    // ejemplo:
    // GET https://api.stormglass.io/v2/weather/point?lat=58.7984&lng=17.8081&params=waveHeight,windSpeed,windDirection,waterTemperature&source=noaa
    const params = [
      "waveHeight",
      "waveDirection",
      "wavePeriod",
      "windSpeed",
      "windDirection",
      "gust",
      "waterTemperature",
      "currentSpeed",
      "currentDirection",
      "visibility",
    ].join(",");

    const url = `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${params}&source=noaa`;

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: apiKey,
        },
      });

      if (!res.ok) {
        await ctx.reply("⚠️ Stormglass no respondió correctamente.");
        return;
      }

      const json: any = await res.json();

      // estructura típica:
      // {
      //   "hours": [
      //     {
      //       "time": "2020-01-01T00:00:00+00:00",
      //       "waveHeight": { "noaa": 0.5 },
      //       ...
      //     },
      //     ...
      //   ]
      // }

      const hours = Array.isArray(json.hours) ? json.hours : [];
      if (!hours.length) {
        await ctx.reply(
          "⚠️ No hay datos disponibles ahora mismo para esa playa."
        );
        return;
      }

      // nos quedamos con la 1ª hora (la más cercana)
      const first = hours[0];

      const waveHeight = first.waveHeight?.noaa;
      const waveDirection = first.waveDirection?.noaa;
      const wavePeriod = first.wavePeriod?.noaa;
      const windSpeed = first.windSpeed?.noaa;
      const windDirection = first.windDirection?.noaa;
      const waterTemp = first.waterTemperature?.noaa;

      const lines: string[] = [];
      lines.push(`🌊 *WhatsGuru* — ${alias ?? raw}`);
      lines.push(`📍 (${lat.toFixed(4)}, ${lng.toFixed(4)})`);

      // Olas
      if (waveHeight != null) {
        lines.push(
          `🏄 Olas: ${waveHeight.toFixed(1)} m` +
            (wavePeriod ? ` · periodo ${wavePeriod.toFixed(0)} s` : "")
        );
      } else {
        lines.push("🏄 Olas: s/d");
      }

      // Dirección de ola
      if (waveDirection != null) {
        lines.push(`↪ Dirección ola: ${waveDirection.toFixed(0)}°`);
      }

      // Viento
      if (windSpeed != null) {
        lines.push(
          `💨 Viento: ${windSpeed.toFixed(0)} m/s` +
            (windDirection ? ` ${windDirection.toFixed(0)}°` : "")
        );
      }

      // Temperatura agua
      if (waterTemp != null) {
        lines.push(`🌡 Agua: ${waterTemp.toFixed(1)} °C`);
      }

      // hora del dato
      if (first.time) {
        lines.push(
          `🕒 Datos: ${new Date(first.time).toLocaleString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
          })}`
        );
      }

      // podrías añadir próximas horas:
      // hours.slice(1,4).map(...)

      await ctx.reply(lines.join("\n"));
    } catch (err) {
      console.error(err);
      await ctx.reply("❌ Error consultando Stormglass.");
    }
  }

  getHelpMessage(): string {
    return "!!whatsguru {playa} → parte de olas/viento desde Stormglass";
  }
}
