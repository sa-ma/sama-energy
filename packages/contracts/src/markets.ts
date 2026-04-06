import { Type, type Static } from '@sinclair/typebox';

import { DurationHoursSchema, MarketCodeSchema } from './common';

export const MarketSchema = Type.Object(
  {
    code: MarketCodeSchema,
    name: Type.String(),
    currency: Type.String(),
    timezone: Type.String(),
    supportedDurations: Type.Array(DurationHoursSchema, { minItems: 1 }),
  },
  { $id: 'Market', additionalProperties: false },
);

export type Market = Static<typeof MarketSchema>;

export const MarketsResponseSchema = Type.Object(
  {
    markets: Type.Array(MarketSchema, { minItems: 1 }),
  },
  { $id: 'MarketsResponse', additionalProperties: false },
);

export type MarketsResponse = Static<typeof MarketsResponseSchema>;
