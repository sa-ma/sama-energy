'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  ChartTooltipSurface,
  useSamaChartTheme,
} from '@sama-energy/ui';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { formatCurrencyValue } from '@/lib/currency-format';

type TrendChartProps = {
  currency: string;
  data: Array<{
    date: string;
    revenue: number;
    priceSpread: number;
    utilization: number;
  }>;
};

type TrendTooltipProps = {
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

function TrendTooltip({
  active,
  payload,
  label,
  currency,
}: TrendTooltipProps) {
  const chartTheme = useSamaChartTheme();

  if (!active || !payload?.length) {
    return null;
  }

  const revenueEntry = payload.find((entry) => entry.dataKey === 'revenue');
  const spreadEntry = payload.find((entry) => entry.dataKey === 'priceSpread');

  return (
    <ChartTooltipSurface title={formatMonth(String(label))}>
      <Stack spacing={0.95}>
        {revenueEntry ? (
          <Stack
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
                  borderRadius: 0.75,
                  backgroundColor: chartTheme.revenueBarActive.fill,
                }}
              />
              <Typography
                sx={(theme) => ({
                  color: theme.sama.chart.axisText,
                  fontSize: '0.85rem',
                  fontWeight: 500,
                })}
              >
                Revenue
              </Typography>
            </Stack>
            <Typography
              sx={(theme) => ({
                color: theme.sama.text.primary,
                fontSize: '0.9rem',
                fontWeight: 700,
              })}
            >
              {formatCurrency(Number(revenueEntry.value), currency)}
            </Typography>
          </Stack>
        ) : null}

        {spreadEntry ? (
          <Stack
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
                  backgroundColor: chartTheme.series[0],
                }}
              />
              <Typography
                sx={(theme) => ({
                  color: theme.sama.chart.axisText,
                  fontSize: '0.85rem',
                  fontWeight: 500,
                })}
              >
                Price Spread
              </Typography>
            </Stack>
            <Typography
              sx={(theme) => ({
                color: theme.sama.text.primary,
                fontSize: '0.9rem',
                fontWeight: 700,
              })}
            >
              {formatCurrency(Number(spreadEntry.value), currency)}
            </Typography>
          </Stack>
        ) : null}
      </Stack>
    </ChartTooltipSurface>
  );
}

export default function TrendChart({ currency, data }: TrendChartProps) {
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
        <ComposedChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
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
          <YAxis
            axisLine={false}
            orientation="right"
            tick={chartTheme.axisTick}
            tickFormatter={(value: number) => formatCurrency(value, currency)}
            tickLine={false}
            yAxisId="spread"
          />
          <Tooltip
            content={<TrendTooltip currency={currency} />}
            cursor={chartTheme.cursorFill}
          />
          <Bar
            activeBar={
              <Rectangle
                fill={chartTheme.revenueBarActive.fill}
                fillOpacity={chartTheme.revenueBarActive.fillOpacity}
                radius={[2, 2, 0, 0]}
                stroke={chartTheme.revenueBarActive.stroke}
                strokeWidth={chartTheme.revenueBarActive.strokeWidth}
              />
            }
            dataKey="revenue"
            fill={chartTheme.revenueBar.fill}
            fillOpacity={chartTheme.revenueBar.fillOpacity}
            maxBarSize={28}
            name="Revenue"
            radius={[2, 2, 0, 0]}
          />
          <Line
            activeDot={chartTheme.activeDot(chartTheme.series[0])}
            dataKey="priceSpread"
            dot={false}
            name="Price Spread"
            stroke={chartTheme.series[0]}
            strokeWidth={3}
            type="monotone"
            yAxisId="spread"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );
}
