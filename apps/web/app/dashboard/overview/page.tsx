import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';

import OverviewDashboard from './_components/overview-dashboard';
import {
  getForecastOverview,
  getMarkets,
} from '@/lib/api-client';
import {
  fallbackMarkets,
  getEffectiveOverviewFilters,
  parseOverviewSearchParams,
} from '@/lib/dashboard-filters';
import { dashboardQueryKeys } from '@/lib/query-keys';

type DashboardOverviewPageProps = Readonly<{
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}>;

export default async function DashboardOverviewPage({
  searchParams,
}: DashboardOverviewPageProps) {
  const queryClient = new QueryClient();
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const initialFilters = getEffectiveOverviewFilters(
    parseOverviewSearchParams(resolvedSearchParams),
    fallbackMarkets,
  );

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: dashboardQueryKeys.markets,
      queryFn: getMarkets,
      staleTime: 5 * 60 * 1000,
    }),
    queryClient.prefetchQuery({
      queryKey: dashboardQueryKeys.overview(initialFilters),
      queryFn: () => getForecastOverview(initialFilters),
      staleTime: 30 * 1000,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OverviewDashboard />
    </HydrationBoundary>
  );
}
