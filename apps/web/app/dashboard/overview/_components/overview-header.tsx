import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

type OverviewHeaderProps = {
  eyebrow?: string;
  title?: string;
  subtitle: string;
};

export default function OverviewHeader({
  eyebrow = 'Dashboard Overview',
  title,
  subtitle,
}: OverviewHeaderProps) {
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
            letterSpacing: '0.14em',
          }}
        >
          {eyebrow}
        </Typography>
        {title ? (
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: '#16202a',
            }}
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
