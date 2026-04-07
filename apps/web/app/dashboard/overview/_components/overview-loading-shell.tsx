import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import {
  DashboardPageHeader,
  FilterRail,
  MetricTile,
  MetricTileGrid,
  SectionPanel,
} from '@sama-energy/ui';

export default function OverviewLoadingShell() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 3, md: 4 } }}>
      <DashboardPageHeader
        subtitle="Explore battery market performance, trends, and forecast signals"
      />

      <FilterRail variant="flat">
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
      </FilterRail>

      <MetricTileGrid>
        {Array.from({ length: 4 }, (_, index) => (
          <MetricTile
            key={`metric-loading-${index + 1}`}
            caption="Loading metric"
            label="Loading"
            loading
          />
        ))}
      </MetricTileGrid>

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
          minHeight={300}
        >
          <Skeleton sx={{ flex: 1, minHeight: 240 }} variant="rounded" />
        </SectionPanel>

        <SectionPanel
          title="Forecast Preview"
          subtitle="Base, low, and high case outlook"
          minHeight={300}
        >
          <Skeleton sx={{ flex: 1, minHeight: 240 }} variant="rounded" />
        </SectionPanel>
      </Box>
    </Box>
  );
}
