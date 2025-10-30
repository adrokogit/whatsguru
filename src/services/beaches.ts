// src/services/beaches.ts
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
  "san lorenzo": {
    lat: 43.5453,
    lng: -5.6615,
    alias: "Playa de San Lorenzo (Gijón)",
  },
  tapia: { lat: 43.5691, lng: -6.9454, alias: "Playa de Tapia" },
};

export function findBeachByName(name: string): Beach | null {
  const key = name.trim().toLowerCase();
  return BEACHES[key] ?? null;
}

export function listBeaches(): string[] {
  return Object.keys(BEACHES);
}
