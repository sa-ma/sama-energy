'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
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

function TrendTooltip({
  active,
  payload,
  label,
  currency,
}: TrendTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const revenueEntry = payload.find((entry) => entry.dataKey === 'revenue');
  const spreadEntry = payload.find((entry) => entry.dataKey === 'priceSpread');

  return (
    <Box
      sx={{
        minWidth: 196,
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
                  backgroundColor: '#3b82f6',
                }}
              />
              <Typography sx={{ color: '#475569', fontSize: '0.85rem', fontWeight: 500 }}>
                Revenue
              </Typography>
            </Stack>
            <Typography sx={{ color: '#0f172a', fontSize: '0.9rem', fontWeight: 700 }}>
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
                  backgroundColor: '#2563eb',
                }}
              />
              <Typography sx={{ color: '#475569', fontSize: '0.85rem', fontWeight: 500 }}>
                Price Spread
              </Typography>
            </Stack>
            <Typography sx={{ color: '#0f172a', fontSize: '0.9rem', fontWeight: 700 }}>
              {formatCurrency(Number(spreadEntry.value), currency)}
            </Typography>
          </Stack>
        ) : null}
      </Stack>
    </Box>
  );
}

export default function TrendChart({ currency, data }: TrendChartProps) {
  const chartHeight = 300;

  return (
    <Box
      sx={{
        width: 1,
        minWidth: 0,
        height: chartHeight,
      }}
    >
      <ResponsiveContainer height={chartHeight} width="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 8 }}>
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
          <YAxis
            axisLine={false}
            orientation="right"
            tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }}
            tickFormatter={(value: number) => formatCurrency(value, currency)}
            tickLine={false}
            yAxisId="spread"
          />
          <Tooltip
            content={<TrendTooltip currency={currency} />}
            cursor={{
              fill: 'rgba(15, 23, 42, 0.04)',
              radius: 6,
            }}
          />
          <Bar
            activeBar={
              <Rectangle
                fill="#60a5fa"
                fillOpacity={0.96}
                radius={[2, 2, 0, 0]}
                stroke="rgba(37, 99, 235, 0.18)"
                strokeWidth={1}
              />
            }
            dataKey="revenue"
            fill="#93c5fd"
            fillOpacity={0.88}
            maxBarSize={28}
            name="Revenue"
            radius={[2, 2, 0, 0]}
          />
          <Line
            activeDot={{
              fill: '#2563eb',
              r: 4,
              stroke: '#ffffff',
              strokeWidth: 2,
            }}
            dataKey="priceSpread"
            dot={false}
            name="Price Spread"
            stroke="#2563eb"
            strokeWidth={3}
            type="monotone"
            yAxisId="spread"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );
}
