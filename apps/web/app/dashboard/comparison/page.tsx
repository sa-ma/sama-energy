import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';

import ComparisonDashboard from './_components/comparison-dashboard';
import {
  getComparison,
  getMarkets,
} from '@/lib/api-client';
import {
  fallbackMarkets,
  getEffectiveComparisonFilters,
  parseComparisonSearchParams,
} from '@/lib/dashboard-filters';
import { dashboardQueryKeys } from '@/lib/query-keys';

type DashboardComparisonPageProps = Readonly<{
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}>;

export default async function DashboardComparisonPage({
  searchParams,
}: DashboardComparisonPageProps) {
  const queryClient = new QueryClient();
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const initialFilters = getEffectiveComparisonFilters(
    parseComparisonSearchParams(resolvedSearchParams),
    fallbackMarkets,
  );

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: dashboardQueryKeys.markets,
      queryFn: getMarkets,
      staleTime: 5 * 60 * 1000,
    }),
    queryClient.prefetchQuery({
      queryKey: dashboardQueryKeys.comparison(initialFilters),
      queryFn: () => getComparison(initialFilters),
      staleTime: 30 * 1000,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ComparisonDashboard />
    </HydrationBoundary>
  );
}
