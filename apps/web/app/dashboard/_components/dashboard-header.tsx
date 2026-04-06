import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function DashboardHeader() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        minHeight: 32,
      }}
    >
      <Typography
        component="div"
        sx={{
          color: '#0f172a',
          fontSize: '0.95rem',
          fontWeight: 800,
          letterSpacing: '0.16em',
          lineHeight: 1,
        }}
      >
        SAMA ENERGY
      </Typography>
    </Box>
  );
}
