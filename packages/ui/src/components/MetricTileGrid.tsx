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
      sx={(theme) => ({
        display: 'grid',
        overflow: 'hidden',
        borderRadius: `${theme.sama.radius.lg}px`,
        border: `1px solid ${theme.sama.border.strong}`,
        backgroundColor: theme.sama.surface.raised,
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, minmax(0, 1fr))',
          xl: `repeat(${Math.max(tileChildren.length, 1)}, minmax(0, 1fr))`,
        },
      })}
    >
      {tileChildren.map((child: React.ReactNode, index: number) => (
        <Box
          key={index}
          sx={(theme) => ({
            borderRight: {
              xs: 'none',
              sm:
                tileChildren.length > 1 && index % 2 === 0 && index < tileChildren.length - 1
                  ? `1px solid ${theme.sama.border.strong}`
                  : 'none',
              xl:
                index < tileChildren.length - 1
                  ? `1px solid ${theme.sama.border.strong}`
                  : 'none',
            },
            borderBottom: {
              xs:
                index < tileChildren.length - 1
                  ? `1px solid ${theme.sama.border.strong}`
                  : 'none',
              sm:
                tileChildren.length > 2 && index < 2
                  ? `1px solid ${theme.sama.border.strong}`
                  : 'none',
              xl: 'none',
            },
          })}
        >
          {child}
        </Box>
      ))}
    </Box>
  );
}
