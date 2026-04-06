import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

type SectionPanelProps = Readonly<{
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  minHeight?: number;
}>;

export default function SectionPanel({
  children,
  title,
  subtitle,
  minHeight = 320,
}: SectionPanelProps) {
  return (
    <Card
      sx={{
        height: 1,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'rgba(203, 213, 225, 0.98)',
        boxShadow: 'none',
        backgroundColor: 'rgba(255, 255, 255, 0.94)',
      }}
    >
      <CardContent
        sx={{
          height: 1,
          p: { xs: 2, sm: 2.5, md: 3 },
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
          '&:last-child': { pb: { xs: 2, sm: 2.5, md: 3 } },
        }}
      >
        <Stack spacing={0.75}>
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: '1.1rem', sm: '1.22rem' },
              fontWeight: 700,
              color: '#0f172a',
            }}
          >
            {title}
          </Typography>
          {subtitle ? (
            <Typography variant="body2" sx={{ color: '#4b5563' }}>
              {subtitle}
            </Typography>
          ) : null}
        </Stack>

        <Stack sx={{ flex: 1, minHeight }}>{children}</Stack>
      </CardContent>
    </Card>
  );
}
