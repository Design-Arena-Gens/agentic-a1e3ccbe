import { DeityMotif, HINDU_DEITIES, HinduDeity } from "@/data/gods";

export interface GodVideoPlan {
  id: string;
  deity: HinduDeity;
  palette: [string, string, string];
  motif: DeityMotif;
  focusQuality: string;
  mantraLines: string[];
  aura: string;
  durationMs: number;
  rotationSpeed: number;
  sparkCount: number;
  waveFrequency: number;
  gradientShift: number;
}

function cyrb128(str: string): [number, number, number, number] {
  let h1 = 1779033703,
    h2 = 3144134277,
    h3 = 1013904242,
    h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  return [
    (h1 ^ h2 ^ h3 ^ h4) >>> 0,
    (h2 ^ h1) >>> 0,
    (h3 ^ h1) >>> 0,
    (h4 ^ h1) >>> 0,
  ];
}

function sfc32(a: number, b: number, c: number, d: number) {
  return function () {
    a >>>= 0;
    b >>>= 0;
    c >>>= 0;
    d >>>= 0;
    const t = (a + b) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    d = (d + 1) | 0;
    const res = (t + d) | 0;
    c = (c + res) | 0;
    return (res >>> 0) / 4294967296;
  };
}

function seededRandom(source: string) {
  const seed = cyrb128(source);
  return sfc32(seed[0], seed[1], seed[2], seed[3]);
}

function pick<T>(items: T[], rand: () => number): T {
  return items[Math.floor(rand() * items.length)];
}

function pickUnique<T>(items: T[], count: number, rand: () => number): T[] {
  const clone = [...items];
  for (let i = clone.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone.slice(0, count);
}

export function createDateKey(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function buildDailyPlans(dateKey: string): GodVideoPlan[] {
  const rand = seededRandom(`daily-${dateKey}`);
  const selected = pickUnique(HINDU_DEITIES, 3, rand);

  return selected.map((deity, index) => {
    const palette = pick(deity.palettes, rand);
    const motif = pick(deity.motifs, rand);
    const focusQuality = pick(deity.qualities, rand);
    const auraSource = Math.floor(rand() * palette.length);
    const aura = palette[auraSource];
    const durationMs = 7000 + Math.floor(rand() * 2000);
    const rotationSpeed = 0.4 + rand() * 0.8;
    const sparkCount = 24 + Math.floor(rand() * 24);
    const waveFrequency = 1.6 + rand() * 1.4;
    const gradientShift = rand();

    return {
      id: `${dateKey}-${index}-${deity.id}`,
      deity,
      palette,
      motif,
      focusQuality,
      mantraLines: deity.mantra,
      aura,
      durationMs,
      rotationSpeed,
      sparkCount,
      waveFrequency,
      gradientShift,
    };
  });
}
