'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

type DashboardPageHeaderProps = Readonly<{
  eyebrow?: string;
  title: string;
  subtitle: string;
}>;

export function DashboardPageHeader({
  eyebrow,
  title,
  subtitle,
}: DashboardPageHeaderProps) {
  return (
    <Box
      sx={{
        maxWidth: 960,
        pt: { xs: 1, md: 1.5 },
      }}
    >
      <Stack spacing={0.35} sx={{ maxWidth: 820 }}>
        {eyebrow ? (
          <Typography
            variant="overline"
            sx={(theme) => ({
              color: theme.palette.primary.main,
              letterSpacing: '0.16em',
              opacity: 0.9,
            })}
          >
            {eyebrow}
          </Typography>
        ) : null}
        <Typography
          component="h1"
          sx={(theme) => ({
            color: theme.sama.text.primary,
            fontSize: { xs: '1.95rem', md: '2.2rem' },
            fontWeight: 800,
            letterSpacing: '-0.055em',
            lineHeight: 1.02,
            textWrap: 'balance',
          })}
        >
          {title}
        </Typography>
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
    </Box>
  );
}
