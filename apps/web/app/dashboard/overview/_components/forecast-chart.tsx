'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
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

function ForecastTooltip({
  active,
  payload,
  label,
  currency,
}: ForecastTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const orderedSeries = [
    { key: 'base', label: 'Base Case', color: '#163759', dashed: false },
    { key: 'high', label: 'High Case', color: '#8ea5b8', dashed: false },
    { key: 'low', label: 'Low Case', color: '#b7c4cf', dashed: true },
  ] as const;

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
                <Typography sx={{ color: '#475569', fontSize: '0.85rem', fontWeight: 500 }}>
                  {series.label}
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

export default function ForecastChart({ currency, data }: ForecastChartProps) {
  return (
    <Box sx={{ height: 1, minHeight: 280 }}>
      <ResponsiveContainer height="100%" width="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 8 }}>
          <CartesianGrid stroke="rgba(148, 163, 184, 0.24)" vertical={false} />
          <XAxis
            axisLine={false}
            dataKey="date"
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
            content={<ForecastTooltip currency={currency} />}
            cursor={{
              stroke: 'rgba(15, 23, 42, 0.12)',
              strokeWidth: 1,
            }}
          />
          <Legend
            iconSize={10}
            wrapperStyle={{
              fontSize: '12px',
              color: '#475569',
              paddingTop: 12,
            }}
          />
          <Line
            activeDot={{
              fill: '#b7c4cf',
              r: 4,
              stroke: '#ffffff',
              strokeWidth: 2,
            }}
            dataKey="low"
            dot={false}
            name="Low Case"
            stroke="#b7c4cf"
            strokeDasharray="4 4"
            strokeWidth={2}
            type="monotone"
          />
          <Line
            activeDot={{
              fill: '#163759',
              r: 5,
              stroke: '#ffffff',
              strokeWidth: 2,
            }}
            dataKey="base"
            dot={false}
            name="Base Case"
            stroke="#163759"
            strokeWidth={3.2}
            type="monotone"
          />
          <Line
            activeDot={{
              fill: '#8ea5b8',
              r: 4,
              stroke: '#ffffff',
              strokeWidth: 2,
            }}
            dataKey="high"
            dot={false}
            name="High Case"
            stroke="#8ea5b8"
            strokeWidth={2}
            type="monotone"
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
