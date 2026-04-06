import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

import MetricCard from './metric-card';
import OverviewHeader from './overview-header';
import SectionPanel from './section-panel';

const summaryBorderColor = 'rgba(226, 232, 240, 0.95)';

export default function OverviewLoadingShell() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 3, md: 4 } }}>
      <OverviewHeader
        subtitle="Explore battery market performance, trends, and forecast signals"
      />

      <Card
        sx={{
          borderRadius: 3,
          border: '1px solid rgba(226, 232, 240, 0.95)',
          boxShadow: 'none',
          backgroundColor: '#f6f8fb',
        }}
      >
        <CardContent sx={{ p: { xs: 1.25, sm: 1.5 }, '&:last-child': { pb: { xs: 1.25, sm: 1.5 } } }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            spacing={1.25}
          >
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1.25,
              }}
            >
              <Skeleton
                height={42}
                sx={{ borderRadius: 3, width: { xs: '100%', md: 180 } }}
                variant="rounded"
              />
              <Skeleton
                height={42}
                sx={{ borderRadius: 3, width: { xs: '100%', md: 210 } }}
                variant="rounded"
              />
            </Box>
            <Skeleton
              height={42}
              sx={{ borderRadius: 2.5, width: { xs: '100%', md: 170 } }}
              variant="rounded"
            />
          </Stack>
        </CardContent>
      </Card>

      <Box
        sx={{
          display: 'grid',
          overflow: 'hidden',
          borderRadius: 3,
          border: '1px solid',
          borderColor: summaryBorderColor,
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            xl: 'repeat(4, minmax(0, 1fr))',
          },
        }}
      >
        {Array.from({ length: 4 }, (_, index) => (
          <MetricCard
            key={`metric-loading-${index + 1}`}
            caption="Loading metric"
            label="Loading"
            loading
            sx={{
              borderRight: {
                xs: 'none',
                sm: index % 2 === 0 ? `1px solid ${summaryBorderColor}` : 'none',
                xl: index < 3 ? `1px solid ${summaryBorderColor}` : 'none',
              },
              borderBottom: {
                xs: index < 3 ? `1px solid ${summaryBorderColor}` : 'none',
                sm: index < 2 ? `1px solid ${summaryBorderColor}` : 'none',
                xl: 'none',
              },
            }}
          />
        ))}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            lg: 'minmax(0, 1.7fr) minmax(320px, 1fr)',
          },
        }}
      >
        <SectionPanel
          title="Revenue & Price Trends"
          subtitle="Historical market performance over the selected period"
          minHeight={360}
        >
          <Skeleton sx={{ flex: 1, minHeight: 280 }} variant="rounded" />
        </SectionPanel>

        <SectionPanel
          title="Forecast Preview"
          subtitle="Base, low, and high case outlook"
          minHeight={360}
        >
          <Skeleton sx={{ flex: 1, minHeight: 280 }} variant="rounded" />
        </SectionPanel>
      </Box>
    </Box>
  );
}
