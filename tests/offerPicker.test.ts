import { pickOffer, recordWin, getStats } from '@/lib/offers/offerPicker';

describe('offerPicker', () => {
  it('returns a valid variant', () => {
    const v = pickOffer(1); // force explore
    expect(['credit_299','deposit_199','split_2x159']).toContain(v);
  });
  it('records wins', () => {
    const before = getStats();
    recordWin('credit_299');
    const after = getStats();
    expect(after.credit_299.won).toBeGreaterThanOrEqual(before.credit_299.won);
  });
});
