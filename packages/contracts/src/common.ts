import { Type, type Static } from '@sinclair/typebox';

export const MarketCodeSchema = Type.Union([
  Type.Literal('GB'),
  Type.Literal('ERCOT'),
]);

export type MarketCode = Static<typeof MarketCodeSchema>;

export const DurationHoursSchema = Type.Union([
  Type.Literal(1),
  Type.Literal(2),
  Type.Literal(4),
]);

export type DurationHours = Static<typeof DurationHoursSchema>;

export const DateRangeSchema = Type.Union([
  Type.Literal('3M'),
  Type.Literal('6M'),
  Type.Literal('12M'),
]);

export type DateRange = Static<typeof DateRangeSchema>;

export const ApiErrorSchema = Type.Object(
  {
    code: Type.String(),
    message: Type.String(),
    details: Type.Optional(Type.Array(Type.String())),
  },
  { $id: 'ApiError', additionalProperties: false },
);

export type ApiError = Static<typeof ApiErrorSchema>;
