import type { Market } from '@sama-energy/contracts';

export const markets: Market[] = [
  {
    code: 'GB',
    name: 'Great Britain',
    currency: 'GBP',
    timezone: 'Europe/London',
    supportedDurations: [1, 2, 4],
  },
  {
    code: 'ERCOT',
    name: 'ERCOT',
    currency: 'USD',
    timezone: 'America/Chicago',
    supportedDurations: [1, 2],
  },
];
