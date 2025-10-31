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

let surfCache: Map<string, { json: any; date: Date }> = new Map();
const THRESHOLD_TIME = 30 * 60 * 1000;

export async function getStormglassPoint(lat: number, lng: number) {
  const apiKey = process.env.STORMGLASS_API_KEY;
  if (!apiKey) {
    throw new Error("STORMGLASS_API_KEY not set");
  }

  const key = getCoordsKey(lat, lng);
  if (checkCache(key)) {
    return surfCache.get(key).json;
  }

  const url = `${STORMGLASS_BASE}?lat=${lat}&lng=${lng}&params=${DEFAULT_PARAMS}&source=noaa`;

  const res = await fetch(url, {
    headers: { Authorization: apiKey },
  });

  if (!res.ok) {
    throw new Error("Stormglass request failed");
  }

  const data = await res.json();
  surfCache.set(key, { json: data, date: new Date() });
  return data as any;
}

function checkCache(coords: string) {
  if (surfCache.has(coords)) {
    if (lessThanThresholdTime(surfCache.get(coords).date)) {
      return true;
    } else {
      surfCache.delete(coords);
      return false;
    }
  }
  return false;
}

function lessThanThresholdTime(fecha: Date): boolean {
  const now = new Date();
  const timeMillis = now.getTime() - fecha.getTime();
  return timeMillis < THRESHOLD_TIME;
}

function getCoordsKey(lat: number, lng: number) {
  return `${lat},${lng}`;
}
