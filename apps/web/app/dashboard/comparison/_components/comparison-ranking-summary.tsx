import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type {
  ComparisonResponse,
  Market,
  SummaryMetricId,
} from '@sama-energy/contracts';

type ComparisonRankingSummaryProps = {
  rankings: ComparisonResponse['rankings'];
  markets: Market[];
};

const metricLabels: Record<SummaryMetricId, string> = {
  'avg-revenue': 'Avg Revenue',
  'volatility-index': 'Volatility',
  utilization: 'Utilization',
  'spread-peak': 'Spread Peak',
};

const metricOrder: SummaryMetricId[] = [
  'avg-revenue',
  'utilization',
  'spread-peak',
  'volatility-index',
];

export default function ComparisonRankingSummary({
  rankings,
  markets,
}: ComparisonRankingSummaryProps) {
  const marketNames = new Map(markets.map((market) => [market.code, market.name]));

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 1.25,
        gridTemplateColumns: {
          xs: '1fr',
          md: 'repeat(2, minmax(0, 1fr))',
        },
      }}
    >
      {metricOrder.map((metricId) => (
        <Stack
          key={metricId}
          spacing={1}
          sx={(theme) => ({
            borderRadius: `${theme.sama.radius.lg}px`,
            border: `1px solid ${theme.sama.border.subtle}`,
            backgroundColor: theme.sama.surface.subtle,
            p: 1.5,
          })}
        >
          <Typography sx={(theme) => ({ color: theme.sama.text.primary, fontSize: '0.95rem', fontWeight: 700 })}>
            {metricLabels[metricId]}
          </Typography>
          <Typography sx={(theme) => ({ color: theme.sama.text.secondary, fontSize: '0.88rem', fontWeight: 600 })}>
            Highest: {rankings[metricId].bestMarkets.map((market) => marketNames.get(market) ?? market).join(', ')}
          </Typography>
          <Typography sx={(theme) => ({ color: theme.sama.text.muted, fontSize: '0.84rem', fontWeight: 600 })}>
            Lowest: {rankings[metricId].worstMarkets.map((market) => marketNames.get(market) ?? market).join(', ')}
          </Typography>
        </Stack>
      ))}
    </Box>
  );
}
