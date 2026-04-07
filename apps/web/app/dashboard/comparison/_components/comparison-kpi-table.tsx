import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import type {
  ComparisonResponse,
  Market,
} from '@sama-energy/contracts';

import { formatCurrencyValue } from '@/lib/currency-format';

function formatValue(value: number, unit: string) {
  if (unit.endsWith('/month')) {
    const currency = unit.replace('/month', '');

    return formatCurrencyValue(value, currency);
  }

  if (unit === '%') {
    return `${Math.round(value)}%`;
  }

  if (unit === 'index') {
    return new Intl.NumberFormat('en-GB', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value);
  }

  return formatCurrencyValue(value, unit);
}

type ComparisonKpiTableProps = {
  markets: Market[];
  rows: ComparisonResponse['rows'];
  rankings: ComparisonResponse['rankings'];
};

export default function ComparisonKpiTable({
  markets,
  rows,
  rankings,
}: ComparisonKpiTableProps) {
  return (
    <TableContainer>
      <Table sx={{ minWidth: 560 }}>
        <TableHead>
          <TableRow>
            <TableCell
            >
              Metric
            </TableCell>
            {markets.map((market) => (
              <TableCell
                key={market.code}
                align="right"
              >
                {market.code}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.metricId}>
              <TableCell
                sx={{ py: 1.4 }}
              >
                <Typography sx={(theme) => ({ color: theme.sama.text.primary, fontWeight: 700 })}>
                  {row.label}
                </Typography>
                <Typography sx={(theme) => ({ color: theme.sama.text.muted, fontSize: '0.82rem' })}>
                  {row.unit}
                </Typography>
              </TableCell>
              {row.values.map((value, index) => {
                const market = markets[index];

                if (!market) {
                  return null;
                }

                const isBest = rankings[row.metricId].bestMarkets.includes(market.code);

                return (
                  <TableCell
                    key={`${row.metricId}-${market.code}`}
                    align="right"
                    sx={{ py: 1.4 }}
                  >
                    <Typography
                      component="span"
                      sx={(theme) => ({
                        display: 'inline-flex',
                        alignItems: 'center',
                        borderRadius: `${theme.sama.radius.pill}px`,
                        px: isBest ? 1.15 : 0,
                        py: isBest ? 0.55 : 0,
                        color: isBest ? theme.sama.status.positive.fg : theme.sama.text.secondary,
                        backgroundColor: isBest ? theme.sama.status.positive.surface : 'transparent',
                        border: isBest
                          ? `1px solid ${theme.sama.status.positive.border}`
                          : '1px solid transparent',
                        fontWeight: isBest ? 700 : 600,
                      })}
                    >
                      {formatValue(value, row.unit)}
                    </Typography>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
