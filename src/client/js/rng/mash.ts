export interface MashHash {
    (data: unknown): number;
}

const MIX = 0.02519603282416938;

const INV_2_32 = 2.3283064365386963e-10;

const SEED = 0xefc8249d;

export default function Mash(): MashHash {
    let n = SEED;

    const mash = (data: unknown): number => {
        const s = (data as { toString(): string }).toString();

        for (let i = 0; i < s.length; i++) {
            n += s.charCodeAt(i);

            let h = MIX * n;
            n = h >>> 0;
            h -= n;
            h *= n;
            n = h >>> 0;
            h -= n;
            n += h * 0x100000000;
        }

        return (n >>> 0) * INV_2_32;
    };

    return mash;
}
