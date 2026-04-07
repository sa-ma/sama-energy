import { describe, expect, it } from 'vitest';

import { formatCurrencyValue } from './currency-format';

describe('formatCurrencyValue', () => {
  it('uses the preferred narrow symbol for known currencies', () => {
    expect(formatCurrencyValue(45_200, 'gbp')).toBe('£45,200');
  });

  it('supports compact notation with preferred symbols', () => {
    expect(
      formatCurrencyValue(45_200, 'USD', {
        notation: 'compact',
        maximumFractionDigits: 1,
      }),
    ).toBe('$45.2K');
  });
});
