import { DashboardShell } from '@sama-energy/ui';

import DashboardHeader from './_components/dashboard-header';

type DashboardLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return <DashboardShell header={<DashboardHeader />}>{children}</DashboardShell>;
}
