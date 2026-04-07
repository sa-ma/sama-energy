'use client';

import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
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

const seriesColors = ['#2563eb', '#dc2626', '#16a34a'] as const;

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
  return new Intl.NumberFormat('en-GB', {
    notation: 'compact',
    maximumFractionDigits: 1,
    style: 'currency',
    currency,
  }).format(value);
}

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function RevenueTooltip({
  active,
  label,
  payload,
  currency,
  markets,
}: RevenueTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <Box
      sx={{
        minWidth: 220,
        borderRadius: 3,
        border: '1px solid rgba(203, 213, 225, 0.92)',
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        boxShadow: '0 18px 40px rgba(15, 23, 42, 0.1)',
        px: 1.75,
        py: 1.5,
      }}
    >
      <Typography
        sx={{
          color: '#0f172a',
          fontSize: '0.9rem',
          fontWeight: 700,
          mb: 1.1,
        }}
      >
        {formatMonth(String(label))}
      </Typography>

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
                    backgroundColor: entry.color ?? '#163759',
                  }}
                />
                <Typography sx={{ color: '#475569', fontSize: '0.85rem', fontWeight: 500 }}>
                  {market.name}
                </Typography>
              </Stack>
              <Typography sx={{ color: '#0f172a', fontSize: '0.9rem', fontWeight: 700 }}>
                {formatCurrency(Number(entry.value), currency)}
              </Typography>
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
}

export default function ComparisonTrendChart({
  markets,
  series,
  currency,
}: ComparisonTrendChartProps) {
  const chartHeight = 320;
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
          <CartesianGrid stroke="rgba(148, 163, 184, 0.24)" vertical={false} />
          <XAxis
            axisLine={false}
            dataKey="date"
            minTickGap={28}
            tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }}
            tickFormatter={formatMonth}
            tickLine={false}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }}
            tickFormatter={(value: number) => formatCompactCurrency(value, currency)}
            tickLine={false}
          />
          <Tooltip
            content={<RevenueTooltip currency={currency} markets={markets} />}
            cursor={{
              stroke: 'rgba(15, 23, 42, 0.12)',
              strokeDasharray: '4 4',
            }}
          />
          <Legend
            formatter={(_, entry) => (
              <Typography component="span" sx={{ color: '#334155', fontSize: '0.84rem', fontWeight: 600 }}>
                {entry.value}
              </Typography>
            )}
          />
          {series.map((entry, index) => (
            <Line
              key={entry.market}
              activeDot={{
                fill: seriesColors[index],
                r: 4,
                stroke: '#ffffff',
                strokeWidth: 2,
              }}
              dataKey={entry.market}
              dot={false}
              name={entry.label}
              stroke={seriesColors[index]}
              strokeWidth={3}
              type="monotone"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
