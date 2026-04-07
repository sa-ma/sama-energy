'use client';

import { Children } from 'react';
import Box from '@mui/material/Box';

type MetricTileGridProps = Readonly<{
  children: React.ReactNode;
}>;

export function MetricTileGrid({ children }: MetricTileGridProps) {
  const tileChildren = Children.toArray(children);

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 1.5,
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, minmax(0, 1fr))',
          xl: `repeat(${Math.max(tileChildren.length, 1)}, minmax(0, 1fr))`,
        },
      }}
    >
      {tileChildren.map((child: React.ReactNode, index: number) => (
        <Box
          key={index}
          sx={{ minWidth: 0 }}
        >
          {child}
        </Box>
      ))}
    </Box>
  );
}
