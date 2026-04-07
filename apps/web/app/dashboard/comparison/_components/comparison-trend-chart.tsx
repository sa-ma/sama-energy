'use client';

import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  ChartTooltipSurface,
  useSamaChartTheme,
} from '@sama-energy/ui';
import type {
  ComparisonResponse,
  Market,
} from '@sama-energy/contracts';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { formatCurrencyValue } from '@/lib/currency-format';

type ComparisonTrendChartProps = {
  markets: Market[];
  series: ComparisonResponse['chartSeries'];
  currency: string;
};

type TooltipPayloadEntry = {
  color?: string;
  dataKey?: string | number;
  value?: number | string;
};

type RevenueTooltipProps = {
  active?: boolean;
  label?: string | number;
  payload?: TooltipPayloadEntry[];
  currency: string;
  markets: Market[];
};

function formatMonth(date: string) {
  const [year, month] = date.split('-').map(Number);

  if (!year || !month) {
    return date;
  }

  return new Intl.DateTimeFormat('en-GB', {
    month: 'short',
    year: '2-digit',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

function formatCompactCurrency(value: number, currency: string) {
  return formatCurrencyValue(value, currency, {
    notation: 'compact',
    maximumFractionDigits: 1,
  });
}

function formatCurrency(value: number, currency: string) {
  return formatCurrencyValue(value, currency);
}

function RevenueTooltip({
  active,
  label,
  payload,
  currency,
  markets,
}: RevenueTooltipProps) {
  const chartTheme = useSamaChartTheme();

  if (!active || !payload?.length) {
    return null;
  }

  return (
    <ChartTooltipSurface minWidth={220} title={formatMonth(String(label))}>
      <Stack spacing={0.9}>
        {markets.map((market) => {
          const entry = payload.find((item) => item.dataKey === market.code);

          if (!entry) {
            return null;
          }

          return (
            <Stack
              key={market.code}
              alignItems="center"
              direction="row"
              justifyContent="space-between"
              spacing={1.25}
            >
              <Stack alignItems="center" direction="row" spacing={0.75}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    backgroundColor: entry.color ?? chartTheme.series[0],
                  }}
                />
                <Typography
                  sx={(theme) => ({
                    color: theme.sama.chart.axisText,
                    fontSize: '0.85rem',
                    fontWeight: 500,
                  })}
                >
                  {market.name}
                </Typography>
              </Stack>
              <Typography
                sx={(theme) => ({
                  color: theme.sama.text.primary,
                  fontSize: '0.9rem',
                  fontWeight: 700,
                })}
              >
                {formatCurrency(Number(entry.value), currency)}
              </Typography>
            </Stack>
          );
        })}
      </Stack>
    </ChartTooltipSurface>
  );
}

export default function ComparisonTrendChart({
  markets,
  series,
  currency,
}: ComparisonTrendChartProps) {
  const chartHeight = 320;
  const chartTheme = useSamaChartTheme();
  const chartData = useMemo(() => {
    const rows = new Map<string, Record<string, number | string>>();

    series.forEach((entry) => {
      entry.points.forEach((point) => {
        const current = rows.get(point.date) ?? { date: point.date };
        current[entry.market] = point.value;
        rows.set(point.date, current);
      });
    });

    return Array.from(rows.values());
  }, [series]);

  return (
    <Box
      sx={{
        width: 1,
        minWidth: 0,
        height: chartHeight,
      }}
    >
      <ResponsiveContainer height={chartHeight} width="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 16, left: -12, bottom: 8 }}>
          <CartesianGrid stroke={chartTheme.gridStroke} vertical={false} />
          <XAxis
            axisLine={false}
            dataKey="date"
            minTickGap={28}
            tick={chartTheme.axisTick}
            tickFormatter={formatMonth}
            tickLine={false}
          />
          <YAxis
            axisLine={false}
            tick={chartTheme.axisTick}
            tickFormatter={(value: number) => formatCompactCurrency(value, currency)}
            tickLine={false}
          />
          <Tooltip
            content={<RevenueTooltip currency={currency} markets={markets} />}
            cursor={chartTheme.cursorDashedLine}
          />
          <Legend
            formatter={(_, entry) => (
              <Typography component="span" sx={chartTheme.legendText}>
                {entry.value}
              </Typography>
            )}
          />
          {series.map((entry, index) => (
            <Line
              key={entry.market}
              activeDot={chartTheme.activeDot(chartTheme.series[index])}
              dataKey={entry.market}
              dot={false}
              name={entry.label}
              stroke={chartTheme.series[index]}
              strokeWidth={3}
              type="monotone"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
