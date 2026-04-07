'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

type SectionPanelProps = Readonly<{
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  minHeight?: number;
  contentPadding?: { xs: number; sm: number; md: number };
  headerSpacing?: number;
  contentGap?: number;
}>;

export function SectionPanel({
  children,
  title,
  subtitle,
  minHeight = 320,
  contentPadding = { xs: 2, sm: 2.5, md: 3 },
  headerSpacing = 0.75,
  contentGap = 2.5,
}: SectionPanelProps) {
  return (
    <Card
      sx={(theme) => ({
        height: 1,
        border: `1px solid ${theme.sama.border.strong}`,
      })}
    >
      <CardContent
        sx={{
          height: 1,
          p: contentPadding,
          display: 'flex',
          flexDirection: 'column',
          gap: contentGap,
          '&:last-child': { pb: contentPadding },
        }}
      >
        <Stack spacing={headerSpacing}>
          <Typography
            component="h2"
            sx={(theme) => ({
              fontSize: { xs: '1.1rem', sm: theme.typography.h2.fontSize },
              fontWeight: theme.typography.h2.fontWeight,
              color: theme.sama.text.primary,
            })}
          >
            {title}
          </Typography>
          {subtitle ? (
            <Typography
              variant="body2"
              sx={(theme) => ({
                color: theme.sama.text.secondary,
                lineHeight: 1.4,
              })}
            >
              {subtitle}
            </Typography>
          ) : null}
        </Stack>

        <Stack sx={{ flex: 1, minHeight }}>{children}</Stack>
      </CardContent>
    </Card>
  );
}
