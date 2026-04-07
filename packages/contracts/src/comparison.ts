import { Type, type Static } from '@sinclair/typebox';

import {
  DateRangeSchema,
  DurationHoursSchema,
  MarketCodeSchema,
} from './common';
import { SummaryMetricIdSchema } from './forecast';

export const ComparisonQuerySchema = Type.Object(
  {
    markets: Type.String({ minLength: 1 }),
    durationHours: DurationHoursSchema,
    dateRange: DateRangeSchema,
  },
  { $id: 'ComparisonQuery', additionalProperties: false },
);

export type ComparisonQuery = Static<typeof ComparisonQuerySchema>;

export const ComparisonRequestSchema = Type.Object(
  {
    markets: Type.Array(MarketCodeSchema, {
      minItems: 2,
      maxItems: 3,
      uniqueItems: true,
    }),
    durationHours: DurationHoursSchema,
    dateRange: DateRangeSchema,
  },
  { $id: 'ComparisonRequest', additionalProperties: false },
);

export type ComparisonRequest = Static<typeof ComparisonRequestSchema>;

export const ComparisonFiltersSchema = Type.Object(
  {
    markets: Type.Array(MarketCodeSchema, {
      minItems: 2,
      maxItems: 3,
      uniqueItems: true,
    }),
    durationHours: DurationHoursSchema,
    dateRange: DateRangeSchema,
    comparisonCurrency: Type.String(),
  },
  { additionalProperties: false },
);

export const ComparisonRowSchema = Type.Object(
  {
    metricId: SummaryMetricIdSchema,
    label: Type.String(),
    unit: Type.String(),
    values: Type.Array(Type.Number(), { minItems: 2, maxItems: 3 }),
  },
  { additionalProperties: false },
);

export type ComparisonRow = Static<typeof ComparisonRowSchema>;

export const ComparisonSeriesPointSchema = Type.Object(
  {
    date: Type.String({ format: 'date' }),
    value: Type.Number(),
  },
  { additionalProperties: false },
);

export const ComparisonSeriesSchema = Type.Object(
  {
    market: MarketCodeSchema,
    label: Type.String(),
    unit: Type.String(),
    points: Type.Array(ComparisonSeriesPointSchema, { minItems: 1 }),
  },
  { additionalProperties: false },
);

export type ComparisonSeries = Static<typeof ComparisonSeriesSchema>;

export const ComparisonRankingEntrySchema = Type.Object(
  {
    bestMarkets: Type.Array(MarketCodeSchema, { minItems: 1, maxItems: 3 }),
    worstMarkets: Type.Array(MarketCodeSchema, { minItems: 1, maxItems: 3 }),
  },
  { additionalProperties: false },
);

export type ComparisonRankingEntry = Static<typeof ComparisonRankingEntrySchema>;

export const ComparisonRankingsSchema = Type.Object(
  {
    'avg-revenue': ComparisonRankingEntrySchema,
    'volatility-index': ComparisonRankingEntrySchema,
    utilization: ComparisonRankingEntrySchema,
    'spread-peak': ComparisonRankingEntrySchema,
  },
  { additionalProperties: false },
);

export type ComparisonRankings = Static<typeof ComparisonRankingsSchema>;

export const ComparisonResponseSchema = Type.Object(
  {
    filters: ComparisonFiltersSchema,
    rows: Type.Array(ComparisonRowSchema, { minItems: 4, maxItems: 4 }),
    chartSeries: Type.Array(ComparisonSeriesSchema, { minItems: 2, maxItems: 3 }),
    rankings: ComparisonRankingsSchema,
  },
  { $id: 'ComparisonResponse', additionalProperties: false },
);

export type ComparisonResponse = Static<typeof ComparisonResponseSchema>;
