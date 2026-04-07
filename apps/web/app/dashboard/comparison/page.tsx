import { Suspense } from 'react';

import ComparisonDashboard from './_components/comparison-dashboard';
import ComparisonLoadingShell from './_components/comparison-loading-shell';

export default function DashboardComparisonPage() {
  return (
    <Suspense fallback={<ComparisonLoadingShell />}>
      <ComparisonDashboard />
    </Suspense>
  );
}
