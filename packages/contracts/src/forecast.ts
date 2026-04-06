import { Type, type Static } from '@sinclair/typebox';

import {
  DateRangeSchema,
  DurationHoursSchema,
  MarketCodeSchema,
} from './common';

export const ForecastOverviewQuerySchema = Type.Object(
  {
    market: MarketCodeSchema,
    durationHours: DurationHoursSchema,
    dateRange: DateRangeSchema,
  },
  { $id: 'ForecastOverviewQuery', additionalProperties: false },
);

export type ForecastOverviewQuery = Static<typeof ForecastOverviewQuerySchema>;

export const ForecastFiltersSchema = Type.Object(
  {
    market: MarketCodeSchema,
    durationHours: DurationHoursSchema,
    dateRange: DateRangeSchema,
  },
  { additionalProperties: false },
);

export const SummaryMetricSchema = Type.Object(
  {
    id: Type.String(),
    label: Type.String(),
    value: Type.Number(),
    unit: Type.String(),
    changePct: Type.Number(),
  },
  { additionalProperties: false },
);

export const TrendPointSchema = Type.Object(
  {
    date: Type.String({ format: 'date' }),
    revenue: Type.Number(),
    priceSpread: Type.Number(),
    utilization: Type.Number(),
  },
  { additionalProperties: false },
);

export const ForecastPreviewPointSchema = Type.Object(
  {
    date: Type.String({ format: 'date' }),
    base: Type.Number(),
    low: Type.Number(),
    high: Type.Number(),
  },
  { additionalProperties: false },
);

export const ForecastOverviewResponseSchema = Type.Object(
  {
    filters: ForecastFiltersSchema,
    summaryMetrics: Type.Array(SummaryMetricSchema, { minItems: 1 }),
    trendData: Type.Array(TrendPointSchema, { minItems: 1 }),
    forecastPreview: Type.Array(ForecastPreviewPointSchema, { minItems: 1 }),
  },
  { $id: 'ForecastOverviewResponse', additionalProperties: false },
);

export type ForecastOverviewResponse = Static<typeof ForecastOverviewResponseSchema>;
