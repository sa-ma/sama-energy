import { Suspense } from 'react';

import OverviewLoadingShell from './_components/overview-loading-shell';
import OverviewDashboard from './_components/overview-dashboard';

export default function DashboardOverviewPage() {
  return (
    <Suspense fallback={<OverviewLoadingShell />}>
      <OverviewDashboard />
    </Suspense>
  );
}
