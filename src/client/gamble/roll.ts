/*
 * The main premise of this game is to provide your range of accepted values,
 * you get the win rate based on range value, then 1- Edge / rv
 */

//import Alea from '#src/client/rng/alea.js';
import { HOUSE_EDGE } from '#src/client/constants.js';

export interface RollRequest {
    ammount: number;
    target: number;
    mode: RollMode;
}
export type RollMode = 'under' | 'over';

export async function Roll({ ammount, target, mode }: RollRequest) {
    // Basic checks

    const winProbability = mode === 'under' ? target / 100 : (100 - target) / 100;
    const multiplier = (100 - HOUSE_EDGE) / winProbability;

    const rn = Math.random() * 100;
    const win = mode === 'under' ? rn < target : rn > target;
    const payout = win ? ammount * multiplier : 0.0;

    return {
        rn,
        winProbability,
        multiplier,
        win,
        payout,
    };
}
