// src/services/surfFormatter.ts
export function formatSurfMessage(
  rawName: string,
  alias: string | undefined,
  lat: number,
  lng: number,
  stormData: any
): string {
  const hours = Array.isArray(stormData.hours) ? stormData.hours : [];
  if (!hours.length) {
    return "⚠️ No hay datos disponibles ahora mismo para esa playa.";
  }

  const first = hours[0];

  const waveHeight = first.waveHeight?.noaa;
  const waveDirection = first.waveDirection?.noaa;
  const wavePeriod = first.wavePeriod?.noaa;
  const windSpeed = first.windSpeed?.noaa;
  const windDirection = first.windDirection?.noaa;
  const waterTemp = first.waterTemperature?.noaa;

  const lines: string[] = [];
  lines.push(`🌊 *WhatsGuru* — ${alias ?? rawName}`);
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

  return lines.join("\n");
}
