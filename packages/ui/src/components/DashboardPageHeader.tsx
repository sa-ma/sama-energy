'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

type DashboardPageHeaderProps = Readonly<{
  eyebrow?: string;
  title?: string;
  subtitle: string;
}>;

export function DashboardPageHeader({
  eyebrow = 'Dashboard Overview',
  title,
  subtitle,
}: DashboardPageHeaderProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'flex-start', md: 'flex-end' },
        justifyContent: 'space-between',
        gap: 2.5,
      }}
    >
      <Stack spacing={0.6} sx={{ maxWidth: 760 }}>
        <Typography
          variant="overline"
          sx={{
            color: 'text.secondary',
          }}
        >
          {eyebrow}
        </Typography>
        {title ? (
          <Typography
            component="h1"
            sx={(theme) => ({
              fontSize: { xs: '2rem', md: theme.typography.h1.fontSize },
              fontWeight: theme.typography.h1.fontWeight,
              lineHeight: theme.typography.h1.lineHeight,
              letterSpacing: theme.typography.h1.letterSpacing,
              color: theme.sama.text.primary,
            })}
          >
            {title}
          </Typography>
        ) : null}
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '0.92rem', md: '0.95rem' },
            lineHeight: 1.45,
            maxWidth: 640,
          }}
        >
          {subtitle}
        </Typography>
      </Stack>

      <Box
        aria-hidden="true"
        sx={{
          display: { xs: 'none', md: 'block' },
          flexShrink: 0,
          width: 200,
          minHeight: 56,
        }}
      />
    </Box>
  );
}
