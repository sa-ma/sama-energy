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

function formatValue(value: number, unit: string) {
  if (unit.endsWith('/month')) {
    const currency = unit.replace('/month', '');

    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value);
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

  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: unit,
    maximumFractionDigits: 0,
  }).format(value);
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
              sx={{
                color: '#334155',
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                borderBottomColor: 'rgba(203, 213, 225, 0.98)',
              }}
            >
              Metric
            </TableCell>
            {markets.map((market) => (
              <TableCell
                key={market.code}
                align="right"
                sx={{
                  color: '#334155',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  borderBottomColor: 'rgba(203, 213, 225, 0.98)',
                }}
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
                sx={{
                  borderBottomColor: 'rgba(226, 232, 240, 0.95)',
                  py: 1.4,
                }}
              >
                <Typography sx={{ color: '#0f172a', fontWeight: 700 }}>
                  {row.label}
                </Typography>
                <Typography sx={{ color: '#64748b', fontSize: '0.82rem' }}>
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
                      borderBottomColor: 'rgba(226, 232, 240, 0.95)',
                      py: 1.4,
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        borderRadius: 999,
                        px: isBest ? 1.15 : 0,
                        py: isBest ? 0.55 : 0,
                        color: isBest ? '#166534' : '#334155',
                        backgroundColor: isBest ? 'rgba(220, 252, 231, 0.78)' : 'transparent',
                        border: isBest ? '1px solid rgba(134, 239, 172, 0.72)' : '1px solid transparent',
                        fontWeight: isBest ? 700 : 600,
                      }}
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
