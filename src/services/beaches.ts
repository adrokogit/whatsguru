export type Beach = { lat: number; lng: number; alias?: string };

const BEACHES: Record<string, Beach> = {
  salinas: { lat: 43.5756, lng: -5.9455, alias: "Playa de Salinas" },
  rodiles: { lat: 43.5246, lng: -5.3953, alias: "Playa de Rodiles" },
  gijon: { lat: 43.5453, lng: -5.6615, alias: "Playa de San Lorenzo (Gijón)" },
  sanlorezo: {
    lat: 43.5453,
    lng: -5.6615,
    alias: "Playa de San Lorenzo (Gijón)",
  },
  tapia: { lat: 43.5691, lng: -6.9454, alias: "Playa de Tapia" },
  quebrantos: { lat: 43.5651, lng: -6.0633, alias: "Playa de Los Quebrantos" },
  playondebayas: { lat: 43.5747, lng: -6.0424, alias: "Playón de Bayas" },
  bahinas: { lat: 43.5783, lng: -6.0063, alias: "Playa de Bahínas" },
  sanjuandenieva: {
    lat: 43.5873,
    lng: -5.9391,
    alias: "Playa de San Juan de Nieva",
  },
  xivares: { lat: 43.5694, lng: -5.7218, alias: "Playa de Xivares" },
  playaespana: { lat: 43.546, lng: -5.5297, alias: "Playa de España" },
  playadevega: { lat: 43.4798, lng: -5.1355, alias: "Playa de Vega" },
  playaderibadesella: {
    lat: 43.468,
    lng: -5.045,
    alias: "Playa de Ribadesella",
  },
  riaderodiles: {
    lat: 43.5246,
    lng: -5.3953,
    alias: "Ría de Rodiles / Playa de Rodiles",
  },
};

export function listBeaches(): string[] {
  return Object.keys(BEACHES);
}

export function findBeachByName(name: string): Beach | null {
  const key = normalize(name);

  // 1. intento exacto
  if (BEACHES[key]) {
    return BEACHES[key];
  }

  // 2. intento difuso
  let bestMatch: { key: string; distance: number } | null = null;

  for (const beachKey of Object.keys(BEACHES)) {
    const d = levenshtein(key, beachKey);
    if (!bestMatch || d < bestMatch.distance) {
      bestMatch = { key: beachKey, distance: d };
    }
  }

  // umbral: ajusta a tu gusto
  // idea: permitir hasta 2–3 errores para nombres cortos
  const THRESHOLD = Math.max(2, Math.floor(key.length * 0.3));

  if (bestMatch && bestMatch.distance <= THRESHOLD) {
    return BEACHES[bestMatch.key];
  }

  return null;
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // borrar
        dp[i][j - 1] + 1, // insertar
        dp[i - 1][j - 1] + cost // sustituir
      );
    }
  }

  return dp[m][n];
}
function normalize(s: string) {
  return s
    .trim()
    .toLowerCase()
    .replace(/á/g, "a")
    .replace(/é/g, "e")
    .replace(/í/g, "i")
    .replace(/ó/g, "o")
    .replace(/ú/g, "u")
    .replace(/ü/g, "u")
    .replace(/[^a-z0-9]+/g, " "); // o quitar espacios del todo
}
