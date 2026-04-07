'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  ChartTooltipSurface,
  useSamaChartTheme,
} from '@sama-energy/ui';
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

type ForecastChartProps = {
  currency: string;
  data: Array<{
    date: string;
    base: number;
    low: number;
    high: number;
  }>;
};

type ForecastTooltipProps = {
  active?: boolean;
  label?: string | number;
  currency: string;
  payload?: Array<{
    dataKey?: string | number;
    value?: number | string;
  }>;
};

function formatMonth(date: string) {
  return new Intl.DateTimeFormat('en-GB', {
    month: 'short',
    year: '2-digit',
  }).format(new Date(date));
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

function ForecastTooltip({
  active,
  payload,
  label,
  currency,
}: ForecastTooltipProps) {
  const chartTheme = useSamaChartTheme();

  if (!active || !payload?.length) {
    return null;
  }

  const orderedSeries = [
    { key: 'base', label: 'Base Case', color: chartTheme.series[0], dashed: false },
    { key: 'high', label: 'High Case', color: chartTheme.series[2], dashed: false },
    { key: 'low', label: 'Low Case', color: chartTheme.series[1], dashed: true },
  ] as const;

  return (
    <ChartTooltipSurface title={formatMonth(String(label))}>
      <Stack spacing={0.95}>
        {orderedSeries.map((series) => {
          const entry = payload.find((item) => item.dataKey === series.key);

          if (!entry) {
            return null;
          }

          return (
            <Stack
              key={series.key}
              alignItems="center"
              direction="row"
              justifyContent="space-between"
              spacing={1.25}
            >
              <Stack alignItems="center" direction="row" spacing={0.75}>
                <Box
                  sx={{
                    width: 10,
                    height: 3,
                    borderRadius: 999,
                    backgroundColor: series.color,
                    ...(series.dashed
                      ? {
                          backgroundImage:
                            'repeating-linear-gradient(90deg, currentColor 0 5px, transparent 5px 8px)',
                          backgroundColor: 'transparent',
                          color: series.color,
                        }
                      : null),
                  }}
                />
                <Typography
                  sx={(theme) => ({
                    color: theme.sama.chart.axisText,
                    fontSize: '0.85rem',
                    fontWeight: 500,
                  })}
                >
                  {series.label}
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

export default function ForecastChart({ currency, data }: ForecastChartProps) {
  const chartHeight = 300;
  const chartTheme = useSamaChartTheme();

  return (
    <Box
      sx={{
        width: 1,
        minWidth: 0,
        height: chartHeight,
      }}
    >
      <ResponsiveContainer height={chartHeight} width="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke={chartTheme.gridStroke} vertical={false} />
          <XAxis
            axisLine={false}
            dataKey="date"
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
            content={<ForecastTooltip currency={currency} />}
            cursor={chartTheme.cursorLine}
          />
          <Legend
            iconSize={10}
            wrapperStyle={{ ...chartTheme.legendText, paddingTop: 12 }}
          />
          <Line
            activeDot={chartTheme.activeDot(chartTheme.series[1])}
            dataKey="low"
            dot={false}
            name="Low Case"
            stroke={chartTheme.series[1]}
            strokeDasharray="4 4"
            strokeWidth={2}
            type="monotone"
          />
          <Line
            activeDot={chartTheme.activeDot(chartTheme.series[0], 5)}
            dataKey="base"
            dot={false}
            name="Base Case"
            stroke={chartTheme.series[0]}
            strokeWidth={3.2}
            type="monotone"
          />
          <Line
            activeDot={chartTheme.activeDot(chartTheme.series[2])}
            dataKey="high"
            dot={false}
            name="High Case"
            stroke={chartTheme.series[2]}
            strokeWidth={2}
            type="monotone"
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
