import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import {
  DashboardPageHeader,
  FilterRail,
  SectionPanel,
} from '@sama-energy/ui';

export default function ComparisonLoadingShell() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 3, md: 4 } }}>
      <DashboardPageHeader
        title="Market Comparison"
        subtitle="Compare battery market performance across selected regions"
      />

      <FilterRail variant="flat">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          spacing={1.25}
        >
          <Skeleton height={42} sx={{ borderRadius: 3, width: { xs: '100%', md: 260 } }} variant="rounded" />
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.25} sx={{ ml: { md: 'auto' } }}>
            <Skeleton height={42} sx={{ borderRadius: 3, width: { xs: '100%', md: 210 } }} variant="rounded" />
            <Skeleton height={42} sx={{ borderRadius: 3, width: { xs: '100%', md: 170 } }} variant="rounded" />
          </Stack>
        </Stack>
      </FilterRail>

      <SectionPanel
        title="KPI Comparison"
        subtitle="Compare core metrics side by side"
        minHeight={260}
      >
        <Skeleton sx={{ flex: 1, minHeight: 220 }} variant="rounded" />
      </SectionPanel>

      <SectionPanel
        title="Revenue Trend"
        subtitle="Revenue performance across the selected period"
        minHeight={320}
      >
        <Skeleton sx={{ flex: 1, minHeight: 250 }} variant="rounded" />
      </SectionPanel>

      <SectionPanel
        title="Comparison Summary"
        subtitle="Highest and lowest market for each comparison metric"
        minHeight={220}
      >
        <Skeleton sx={{ flex: 1, minHeight: 180 }} variant="rounded" />
      </SectionPanel>
    </Box>
  );
}
