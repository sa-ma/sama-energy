import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { SamaThemeProvider } from '@sama-energy/ui';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import QueryProvider from '@/components/query-provider';

import './globals.css';

export const metadata: Metadata = {
  title: 'Sama Energy',
  description: 'Next.js and Material UI frontend scaffold for the monorepo',
};

const openSans = Open_Sans({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-open-sans',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={openSans.variable}>
      <body>
        <AppRouterCacheProvider>
          <SamaThemeProvider>
            <NuqsAdapter>
              <QueryProvider>{children}</QueryProvider>
            </NuqsAdapter>
          </SamaThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
