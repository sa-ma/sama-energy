import type { MarketsResponse } from '@sama-energy/contracts';

import { markets } from '../data/mock/markets.js';

export function listMarkets(): MarketsResponse {
  return {
    markets,
  };
}
