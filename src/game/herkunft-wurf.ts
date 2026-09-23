import { mulberry32 } from "./intro-zug.ts";

/** Eine Eigenschaft: 2W6−2. Spanne 0 bis 10. */
export function wurf2w6minus2(zufall: () => number): number {
  const w6 = () => Math.floor(zufall() * 6) + 1;
  return w6() + w6() - 2;
}

/** Stärke, Geschick, Charisma je einmal. Dieselbe Saat, dieselben Würfe. */
export function grundwerteAusSaat(saat: number): { staerke: number; geschick: number; charisma: number } {
  const zufall = mulberry32(saat);
  return {
    staerke: wurf2w6minus2(zufall),
    geschick: wurf2w6minus2(zufall),
    charisma: wurf2w6minus2(zufall),
  };
}
