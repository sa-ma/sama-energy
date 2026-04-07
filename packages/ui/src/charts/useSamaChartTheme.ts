'use client';

import { useTheme } from '@mui/material/styles';

export function useSamaChartTheme() {
  const theme = useTheme();

  return {
    series: theme.sama.chart.series,
    axisTick: {
      fill: theme.sama.chart.axisText,
      fontSize: 12,
      fontWeight: 500,
    },
    legendText: {
      color: theme.sama.chart.legendText,
      fontSize: '12px',
      fontWeight: 600,
    },
    gridStroke: theme.sama.chart.grid,
    cursorLine: {
      stroke: theme.sama.chart.cursor,
      strokeWidth: 1,
    },
    cursorDashedLine: {
      stroke: theme.sama.chart.cursor,
      strokeDasharray: '4 4',
    },
    cursorFill: {
      fill: theme.sama.chart.cursorFill,
      radius: 6,
    },
    activeDot(fill: string, radius = 4) {
      return {
        fill,
        r: radius,
        stroke: theme.sama.chart.activeDotStroke,
        strokeWidth: 2,
      };
    },
    revenueBar: {
      fill: theme.sama.chart.revenueBar,
      fillOpacity: 0.88,
    },
    revenueBarActive: {
      fill: theme.sama.chart.revenueBarActive,
      fillOpacity: 0.96,
      stroke: theme.sama.chart.revenueBarStroke,
      strokeWidth: 1,
    },
  };
}
