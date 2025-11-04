// Epsilon-greedy offer picker with safe in-memory stats.
// Variants: credit_299, deposit_199, split_2x159

export type OfferVariant = 'credit_299' | 'deposit_199' | 'split_2x159';

type Stats = { shown: number; won: number };
const stats: Record<OfferVariant, Stats> = {
  credit_299: { shown: 0, won: 0 },
  deposit_199: { shown: 0, won: 0 },
  split_2x159: { shown: 0, won: 0 },
};

const ALL: OfferVariant[] = ['credit_299', 'deposit_199', 'split_2x159'];

export function pickOffer(epsilon = 0.1): OfferVariant {
  if (Math.random() < epsilon) {
    const v = ALL[Math.floor(Math.random() * ALL.length)];
    stats[v].shown++;
    return v;
  }
  // exploit: pick best observed conversion so far; if none, default to credit_299
  let best: OfferVariant = 'credit_299';
  let bestRate = -1;
  for (const v of ALL) {
    const { shown, won } = stats[v];
    const rate = shown > 0 ? won / shown : 0;
    if (rate > bestRate) {
      bestRate = rate;
      best = v as OfferVariant;
    }
  }
  stats[best].shown++;
  return best;
}

export function recordWin(variant: OfferVariant) {
  stats[variant].won++;
}

export function getStats() {
  return { ...stats };
}
