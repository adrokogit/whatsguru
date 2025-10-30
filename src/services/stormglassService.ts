// src/services/stormglassService.ts
// si usas Node < 18: import fetch from "node-fetch";

const STORMGLASS_BASE = "https://api.stormglass.io/v2/weather/point";

const DEFAULT_PARAMS = [
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

export async function getStormglassPoint(lat: number, lng: number) {
  const apiKey = process.env.STORMGLASS_API_KEY;
  if (!apiKey) {
    throw new Error("STORMGLASS_API_KEY not set");
  }

  const url = `${STORMGLASS_BASE}?lat=${lat}&lng=${lng}&params=${DEFAULT_PARAMS}&source=noaa`;

  const res = await fetch(url, {
    headers: { Authorization: apiKey },
  });

  if (!res.ok) {
    throw new Error("Stormglass request failed");
  }

  const data = await res.json();
  return data as any;
}
