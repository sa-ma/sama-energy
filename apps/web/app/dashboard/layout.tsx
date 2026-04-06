import Box from '@mui/material/Box';

import DashboardHeader from './_components/dashboard-header';

type DashboardLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f3f5f7',
        backgroundImage:
          'linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(243, 245, 247, 1) 100%)',
      }}
    >
      <Box
        sx={{
          px: { xs: 2.5, sm: 4, lg: 5 },
          pt: { xs: 1.5, sm: 2, lg: 2.5 },
        }}
      >
        <DashboardHeader />
      </Box>

      <Box
        sx={{
          mx: 'auto',
          maxWidth: 1440,
          px: { xs: 2.5, sm: 4, lg: 5 },
          pt: { xs: 2, sm: 2.5, lg: 3 },
          pb: { xs: 3, sm: 4, lg: 5 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
