'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

type ChartTooltipSurfaceProps = Readonly<{
  children: React.ReactNode;
  minWidth?: number;
  title?: string;
}>;

export function ChartTooltipSurface({
  children,
  minWidth = 196,
  title,
}: ChartTooltipSurfaceProps) {
  return (
    <Box
      sx={(theme) => ({
        minWidth,
        borderRadius: `${theme.sama.radius.lg}px`,
        border: `1px solid ${theme.sama.chart.tooltipBorder}`,
        backgroundColor: theme.sama.chart.tooltipSurface,
        boxShadow: theme.sama.elevation.overlay,
        px: 1.75,
        py: 1.5,
      })}
    >
      {title ? (
        <Typography
          sx={(theme) => ({
            color: theme.sama.text.primary,
            fontSize: '0.9rem',
            fontWeight: 700,
            mb: 1.1,
          })}
        >
          {title}
        </Typography>
      ) : null}
      {children}
    </Box>
  );
}
