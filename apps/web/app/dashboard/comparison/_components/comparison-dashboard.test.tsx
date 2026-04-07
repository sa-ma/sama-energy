import type { ComparisonRequest } from '@sama-energy/contracts';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { buildComparisonResponse } from '@/test/fixtures/dashboard-data';
import { server } from '@/test/msw-server';
import { renderWithProviders } from '@/test/render-with-providers';
import { dashboardQueryKeys } from '@/lib/query-keys';

import ComparisonDashboard from './comparison-dashboard';

function parseComparisonQuery(request: Request): ComparisonRequest {
  const url = new URL(request.url);

  return {
    markets: (url.searchParams.get('markets') ?? '').split(',').filter(Boolean) as ComparisonRequest['markets'],
    durationHours: Number(url.searchParams.get('durationHours')) as ComparisonRequest['durationHours'],
    dateRange: (url.searchParams.get('dateRange') ?? '12M') as ComparisonRequest['dateRange'],
  };
}

function latestSearchParams(updates: string[]) {
  return new URLSearchParams((updates.at(-1) ?? '').replace(/^\?/, ''));
}

async function openMarketsMenu(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'Markets' }));
}

async function closeOpenMenu(user: ReturnType<typeof userEvent.setup>) {
  await user.keyboard('{Escape}');
}

describe('ComparisonDashboard', () => {
  it('renders a valid comparison from URL params', async () => {
    renderWithProviders(<ComparisonDashboard />, {
      searchParams: '?markets=GB,DE&durationHours=4&dateRange=6M',
    });

    expect(
      await screen.findByRole('heading', { name: 'Market Comparison' }),
    ).toBeInTheDocument();
    expect(await screen.findByText('£53,700')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '4h' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByLabelText('Date Range')).toHaveTextContent('Last 6 months');
    expect(screen.getByText('GB')).toBeInTheDocument();
    expect(screen.getByText('DE')).toBeInTheDocument();
  });

  it('enforces the 2-to-3 market rules through the filter interaction', async () => {
    const user = userEvent.setup();
    const urlUpdates: string[] = [];

    renderWithProviders(<ComparisonDashboard />, {
      onUrlUpdate: ({ queryString }) => urlUpdates.push(queryString),
      searchParams: '?markets=GB,DE&durationHours=2&dateRange=12M',
    });

    await screen.findByText('£45,200');
    expect(
      screen.queryByRole('button', { name: 'Remove Great Britain' }),
    ).not.toBeInTheDocument();

    await openMarketsMenu(user);
    await user.click(await screen.findByRole('menuitem', { name: 'ERCOT' }));
    await closeOpenMenu(user);

    await waitFor(() => {
      expect(latestSearchParams(urlUpdates).get('markets')).toBe('GB,DE,ERCOT');
    });
    expect(
      await screen.findByRole('button', { name: 'Remove Great Britain' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Remove Germany' }));

    await waitFor(() => {
      expect(latestSearchParams(urlUpdates).get('markets')).toBeNull();
    });
    expect(
      screen.queryByRole('button', { name: 'Remove Great Britain' }),
    ).not.toBeInTheDocument();
  });

  it('coerces duration to the shared intersection when markets change', async () => {
    const user = userEvent.setup();
    const urlUpdates: string[] = [];

    renderWithProviders(<ComparisonDashboard />, {
      onUrlUpdate: ({ queryString }) => urlUpdates.push(queryString),
      searchParams: '?markets=GB,DE&durationHours=4&dateRange=12M',
    });

    await screen.findByText('£53,100');

    await openMarketsMenu(user);
    await user.click(await screen.findByRole('menuitem', { name: 'ERCOT' }));
    await closeOpenMenu(user);

    await waitFor(() => {
      const params = latestSearchParams(urlUpdates);

      expect(params.get('markets')).toBe('GB,DE,ERCOT');
      expect(params.get('durationHours')).toBe('1');
    });
    expect(screen.getByRole('button', { name: '1h' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('shows the error panel on initial failure and recovers on retry', async () => {
    const user = userEvent.setup();
    let shouldFail = true;

    server.use(
      http.get(/\/comparison$/, ({ request }) => {
        if (shouldFail) {
          shouldFail = false;

          return HttpResponse.json(
            { message: 'Comparison request failed' },
            { status: 500 },
          );
        }

        return HttpResponse.json(buildComparisonResponse(parseComparisonQuery(request)));
      }),
    );

    renderWithProviders(<ComparisonDashboard />, {
      searchParams: '?markets=GB,DE&durationHours=2&dateRange=12M',
    });

    expect(
      await screen.findByText(
        'The comparison data could not be loaded. Check the API and try again.',
      ),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByText('£45,200')).toBeInTheDocument();
  });

  it('shows a warning and preserves prior data when a comparison refetch fails', async () => {
    const { queryClient } = renderWithProviders(<ComparisonDashboard />, {
      searchParams: '?markets=GB,DE&durationHours=2&dateRange=12M',
    });

    await screen.findByText('£45,200');
    server.use(
      http.get(/\/comparison$/, () =>
        HttpResponse.json(
          { message: 'Latest comparison refresh failed' },
          { status: 500 },
        ),
      ),
    );

    await queryClient.refetchQueries({
      queryKey: dashboardQueryKeys.comparison({
        markets: ['GB', 'DE'],
        durationHours: 2,
        dateRange: '12M',
      }),
    });

    expect(
      await screen.findByText(
        'Latest comparison refresh failed. Showing the previous successful response.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('£45,200')).toBeInTheDocument();
  });
});
