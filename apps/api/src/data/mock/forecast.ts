import type {
  DateRange,
  DurationHours,
  ForecastOverviewResponse,
  MarketCode,
} from '@sama-energy/contracts';

interface OverviewSeed {
  avgRevenue: number;
  avgRevenueChangePct: number;
  utilization: number;
  utilizationChangePct: number;
  spreadPeak: number;
  spreadPeakChangePct: number;
  forecastBase: number;
  trendSlope: number;
}

type MarketDurationSeeds = Partial<Record<DurationHours, OverviewSeed>>;

const overviewSeeds: Record<MarketCode, MarketDurationSeeds> = {
  GB: {
    1: {
      avgRevenue: 38100,
      avgRevenueChangePct: 6.7,
      utilization: 89,
      utilizationChangePct: 2.4,
      spreadPeak: 96,
      spreadPeakChangePct: 4.1,
      forecastBase: 41800,
      trendSlope: 700,
    },
    2: {
      avgRevenue: 45200,
      avgRevenueChangePct: 8.4,
      utilization: 85,
      utilizationChangePct: 3.2,
      spreadPeak: 112,
      spreadPeakChangePct: 5.8,
      forecastBase: 49000,
      trendSlope: 850,
    },
    4: {
      avgRevenue: 53100,
      avgRevenueChangePct: 9.1,
      utilization: 79,
      utilizationChangePct: 2.7,
      spreadPeak: 129,
      spreadPeakChangePct: 6.4,
      forecastBase: 56200,
      trendSlope: 1025,
    },
  },
  ERCOT: {
    1: {
      avgRevenue: 42900,
      avgRevenueChangePct: 7.9,
      utilization: 86,
      utilizationChangePct: 2.9,
      spreadPeak: 108,
      spreadPeakChangePct: 5.3,
      forecastBase: 45500,
      trendSlope: 780,
    },
    2: {
      avgRevenue: 49800,
      avgRevenueChangePct: 9.2,
      utilization: 81,
      utilizationChangePct: 2.1,
      spreadPeak: 128,
      spreadPeakChangePct: 6.1,
      forecastBase: 52400,
      trendSlope: 940,
    },
  },
};

const rangeMonthCount: Record<DateRange, number> = {
  '3M': 3,
  '6M': 6,
  '12M': 12,
};

const rangeRevenueAdjustment: Record<DateRange, number> = {
  '3M': 1200,
  '6M': 600,
  '12M': 0,
};

const trendEndDate = new Date('2026-03-01T00:00:00Z');
const forecastStartDate = new Date('2026-04-01T00:00:00Z');

function formatMonth(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function shiftMonth(start: Date, monthOffset: number): Date {
  return new Date(
    Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + monthOffset, 1),
  );
}

function round(value: number): number {
  return Math.round(value);
}

export function hasOverviewSeed(
  market: MarketCode,
  durationHours: DurationHours,
): boolean {
  return durationHours in overviewSeeds[market];
}

export function buildOverviewFixture(
  market: MarketCode,
  durationHours: DurationHours,
  dateRange: DateRange,
  currency: string,
): ForecastOverviewResponse {
  const seed = overviewSeeds[market][durationHours];

  if (!seed) {
    throw new Error(`Missing overview seed for ${market}:${durationHours}`);
  }

  const monthCount = rangeMonthCount[dateRange];
  const revenueBaseline = seed.avgRevenue + rangeRevenueAdjustment[dateRange];

  const trendData = Array.from({ length: monthCount }, (_, index) => {
    const monthsFromStart = monthCount - index - 1;
    const seasonalOffset = ((index % 4) - 1.5) * 420;
    const date = shiftMonth(trendEndDate, -monthsFromStart);

    return {
      date: formatMonth(date),
      revenue: round(revenueBaseline - seed.trendSlope + index * seed.trendSlope + seasonalOffset),
      priceSpread: round(seed.spreadPeak - 18 + index * 2 + (index % 3) * 3),
      utilization: round(seed.utilization - 5 + index + (index % 2)),
    };
  });

  const forecastPreview = Array.from({ length: 3 }, (_, index) => {
    const date = shiftMonth(forecastStartDate, index);
    const base = round(seed.forecastBase + index * 1800);

    return {
      date: formatMonth(date),
      base,
      low: round(base * 0.86),
      high: round(base * 1.14),
    };
  });

  return {
    filters: {
      market,
      durationHours,
      dateRange,
    },
    summaryMetrics: [
      {
        id: 'avg-revenue',
        label: 'Avg Revenue',
        value: revenueBaseline,
        unit: `${currency}/month`,
        changePct: seed.avgRevenueChangePct,
      },
      {
        id: 'utilization',
        label: 'Utilization',
        value: seed.utilization,
        unit: '%',
        changePct: seed.utilizationChangePct,
      },
      {
        id: 'spread-peak',
        label: 'Spread Peak',
        value: seed.spreadPeak,
        unit: currency,
        changePct: seed.spreadPeakChangePct,
      },
    ],
    trendData,
    forecastPreview,
  };
}
