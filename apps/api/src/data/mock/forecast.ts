import type {
  DateRange,
  DurationHours,
  ForecastOverviewResponse,
  MarketCode,
} from '@sama-energy/contracts';

interface OverviewSeed {
  avgRevenue: number;
  avgRevenueChangePct: number;
  volatilityIndex: number;
  volatilityIndexChangePct: number;
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
      volatilityIndex: 18.4,
      volatilityIndexChangePct: 1.8,
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
      volatilityIndex: 22.6,
      volatilityIndexChangePct: 2.3,
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
      volatilityIndex: 26.9,
      volatilityIndexChangePct: 2.7,
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
      volatilityIndex: 20.1,
      volatilityIndexChangePct: 2.1,
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
      volatilityIndex: 24.8,
      volatilityIndexChangePct: 2.5,
      utilization: 81,
      utilizationChangePct: 2.1,
      spreadPeak: 128,
      spreadPeakChangePct: 6.1,
      forecastBase: 52400,
      trendSlope: 940,
    },
  },
  DE: {
    1: {
      avgRevenue: 44600,
      avgRevenueChangePct: 7.1,
      volatilityIndex: 19.3,
      volatilityIndexChangePct: 1.9,
      utilization: 84,
      utilizationChangePct: 2.2,
      spreadPeak: 104,
      spreadPeakChangePct: 4.9,
      forecastBase: 47100,
      trendSlope: 760,
    },
    2: {
      avgRevenue: 51800,
      avgRevenueChangePct: 8.7,
      volatilityIndex: 23.1,
      volatilityIndexChangePct: 2.4,
      utilization: 80,
      utilizationChangePct: 2.8,
      spreadPeak: 121,
      spreadPeakChangePct: 5.7,
      forecastBase: 54800,
      trendSlope: 910,
    },
    4: {
      avgRevenue: 57900,
      avgRevenueChangePct: 8.9,
      volatilityIndex: 25.8,
      volatilityIndexChangePct: 2.6,
      utilization: 74,
      utilizationChangePct: 2.3,
      spreadPeak: 138,
      spreadPeakChangePct: 6.2,
      forecastBase: 60300,
      trendSlope: 1040,
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

const rangeVolatilityAdjustment: Record<DateRange, number> = {
  '3M': 1.8,
  '6M': 0.9,
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

function roundToSingleDecimal(value: number): number {
  return Math.round(value * 10) / 10;
}

function buildRecentSummaryRow({
  metric,
  latest,
  prior,
  unit,
}: {
  metric: string;
  latest: number;
  prior: number;
  unit: string;
}) {
  const safePrior = prior === 0 ? 1 : prior;
  const changePct = ((latest - prior) / safePrior) * 100;

  return {
    metric,
    latest,
    prior,
    changePct: roundToSingleDecimal(changePct),
    unit,
  };
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
  const volatilityBaseline = round(
    (seed.volatilityIndex + rangeVolatilityAdjustment[dateRange]) * 10,
  ) / 10;

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

  const latestTrendPoint = trendData[trendData.length - 1];
  const priorTrendPoint = trendData[Math.max(trendData.length - 2, 0)];
  const volatilityPrior = roundToSingleDecimal(
    volatilityBaseline / (1 + seed.volatilityIndexChangePct / 100),
  );

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
        id: 'volatility-index',
        label: 'Volatility Index',
        value: volatilityBaseline,
        unit: 'index',
        changePct: seed.volatilityIndexChangePct,
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
    recentSummary: [
      buildRecentSummaryRow({
        metric: 'Avg Revenue',
        latest: latestTrendPoint.revenue,
        prior: priorTrendPoint.revenue,
        unit: `${currency}/month`,
      }),
      buildRecentSummaryRow({
        metric: 'Price Spread',
        latest: latestTrendPoint.priceSpread,
        prior: priorTrendPoint.priceSpread,
        unit: currency,
      }),
      buildRecentSummaryRow({
        metric: 'Utilization',
        latest: latestTrendPoint.utilization,
        prior: priorTrendPoint.utilization,
        unit: '%',
      }),
      buildRecentSummaryRow({
        metric: 'Volatility Index',
        latest: volatilityBaseline,
        prior: volatilityPrior,
        unit: 'index',
      }),
    ],
  };
}
