import Mash from "./mash.js";



export type AleaState = readonly [
  s0: number,
  s1: number,
  s2: number,
  c: number,
];

export interface AleaRandom {
  (): number;
  uint32(): number;
  fract53(): number;
  readonly version: string;
  readonly args: readonly unknown[];
}
interface MutableAleaRandom {
  (): number;
  uint32(): number;
  fract53(): number;
  version: string;
  args: readonly unknown[];
}

export const ALEA_VERSION = "Alea 0.9" as const;

const MULTIPLIER = 2091639;
const INV_2_32 = 2.3283064365386963e-10;
const INV_2_53 = 1.1102230246251565e-16;

function seedState(seeds: readonly unknown[]): AleaState {
  const mash = Mash();

  let s0 = mash(" ");
  let s1 = mash(" ");
  let s2 = mash(" ");

  for (const seed of seeds) {
    s0 -= mash(seed);
    if (s0 < 0) s0 += 1;
    s1 -= mash(seed);
    if (s1 < 0) s1 += 1;
    s2 -= mash(seed);
    if (s2 < 0) s2 += 1;
  }

  return [s0, s1, s2, 1];
}
export default function Alea(...seeds: unknown[]): AleaRandom {
  const effectiveSeeds: readonly unknown[] =
    seeds.length === 0 ? [Date.now()] : seeds;

  let [s0, s1, s2, c] = seedState(effectiveSeeds);

  const random = function(): number {
    const t = MULTIPLIER * s0 + c * INV_2_32;
    s0 = s1;
    s1 = s2;
    c = t | 0;
    return (s2 = t - c);
  } as MutableAleaRandom;

  random.uint32 = (): number => random() * 0x100000000;

  random.fract53 = (): number =>
    random() + ((random() * 0x200000) | 0) * INV_2_53;

  random.version = ALEA_VERSION;
  random.args = effectiveSeeds;

  return random;
}
