import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { StatusPill } from '@sama-energy/ui';
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
  const cellPaddingX = { xs: 2, sm: 2.5, md: 3 } as const;

  return (
    <TableContainer>
      <Table sx={{ minWidth: 560 }}>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{ px: cellPaddingX }}
            >
              Metric
            </TableCell>
            {markets.map((market) => (
              <TableCell
                key={market.code}
                align="right"
                sx={{ px: cellPaddingX }}
              >
                {market.code}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow
              key={row.metricId}
              sx={
                rowIndex === rows.length - 1
                  ? {
                      '& > th, & > td': {
                        borderBottom: '0 !important',
                      },
                    }
                  : undefined
              }
            >
              <TableCell
                sx={{
                  px: cellPaddingX,
                  py: 1.85,
                  borderBottom:
                    rowIndex === rows.length - 1 ? '0 !important' : undefined,
                }}
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
                    sx={{
                      px: cellPaddingX,
                      py: 1.85,
                      borderBottom:
                        rowIndex === rows.length - 1 ? '0 !important' : undefined,
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: 1,
                      }}
                    >
                      <Typography
                        component="span"
                        sx={(theme) => ({
                          color: theme.sama.text.secondary,
                          fontWeight: 600,
                          lineHeight: 1,
                        })}
                      >
                        {formatValue(value, row.unit)}
                      </Typography>
                      {isBest ? (
                        <StatusPill compact glow>
                          Best
                        </StatusPill>
                      ) : null}
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
