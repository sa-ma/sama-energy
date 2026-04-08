'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

type ResponsiveBleed = boolean | Partial<Record<'xs' | 'sm' | 'md', boolean>>;

type SectionPanelProps = Readonly<{
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  variant?: 'plain' | 'outlined';
  minHeight?: number;
  contentPadding?: { xs: number; sm: number; md: number };
  bleedContentX?: ResponsiveBleed;
  headerSpacing?: number;
  contentGap?: number;
}>;

export function SectionPanel({
  children,
  title,
  subtitle,
  variant = 'plain',
  minHeight = 320,
  contentPadding = { xs: 2, sm: 2.5, md: 3 },
  bleedContentX = false,
  headerSpacing = 0.75,
  contentGap = 2.5,
}: SectionPanelProps) {
  const bleedByBreakpoint =
    typeof bleedContentX === 'boolean'
      ? {
          xs: bleedContentX,
          sm: bleedContentX,
          md: bleedContentX,
        }
      : {
          xs: bleedContentX?.xs ?? false,
          sm: bleedContentX?.sm ?? false,
          md: bleedContentX?.md ?? false,
        };

  return (
    <Card
      sx={(theme) => ({
        height: 1,
        border: variant === 'outlined' ? `1px solid ${theme.sama.border.strong}` : 'none',
        backgroundColor: variant === 'plain' ? 'transparent' : undefined,
        boxShadow: 'none',
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

        <Stack
          sx={{
            flex: 1,
            minHeight,
            ...(bleedByBreakpoint.xs || bleedByBreakpoint.sm || bleedByBreakpoint.md
              ? {
                  mx: {
                    xs: bleedByBreakpoint.xs ? -contentPadding.xs : 0,
                    sm: bleedByBreakpoint.sm ? -contentPadding.sm : 0,
                    md: bleedByBreakpoint.md ? -contentPadding.md : 0,
                  },
                }
              : null),
          }}
        >
          {children}
        </Stack>
      </CardContent>
    </Card>
  );
}
