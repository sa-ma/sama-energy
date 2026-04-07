import type { ForecastOverviewQuery } from '@sama-energy/contracts';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  delay,
  http,
  HttpResponse,
} from 'msw';
import { describe, expect, it } from 'vitest';

import { server } from '@/test/msw-server';
import { buildOverviewResponse } from '@/test/fixtures/dashboard-data';
import { renderWithProviders } from '@/test/render-with-providers';
import { dashboardQueryKeys } from '@/lib/query-keys';

import OverviewDashboard from './overview-dashboard';

function parseOverviewQuery(request: Request): ForecastOverviewQuery {
  const url = new URL(request.url);

  return {
    market: (url.searchParams.get('market') ?? 'GB') as ForecastOverviewQuery['market'],
    durationHours: Number(url.searchParams.get('durationHours')) as ForecastOverviewQuery['durationHours'],
    dateRange: (url.searchParams.get('dateRange') ?? '12M') as ForecastOverviewQuery['dateRange'],
  };
}

function latestSearchParams(updates: string[]) {
  return new URLSearchParams((updates.at(-1) ?? '').replace(/^\?/, ''));
}

async function selectSingleValue(
  user: ReturnType<typeof userEvent.setup>,
  label: string,
  option: string,
) {
  await user.click(screen.getByLabelText(label));
  await user.click(await screen.findByRole('option', { name: option }));
}

describe('OverviewDashboard', () => {
  it('renders the initial overview state from URL params', async () => {
    renderWithProviders(<OverviewDashboard />, {
      searchParams: '?market=DE&durationHours=4&dateRange=6M',
    });

    expect(
      await screen.findByRole('heading', { name: 'Market Overview' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Market')).toHaveTextContent('Germany');
    expect(screen.getByRole('button', { name: '4h' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByLabelText('Date Range')).toHaveTextContent('Last 6 months');
    expect(await screen.findByText('€58,500')).toBeInTheDocument();
  });

  it('updates the URL and coerces duration when the selected market changes', async () => {
    const user = userEvent.setup();
    const urlUpdates: string[] = [];

    renderWithProviders(<OverviewDashboard />, {
      onUrlUpdate: ({ queryString }) => urlUpdates.push(queryString),
      searchParams: '?market=DE&durationHours=4&dateRange=6M',
    });

    await screen.findByText('€58,500');

    await selectSingleValue(user, 'Market', 'ERCOT');

    await waitFor(() => {
      const params = latestSearchParams(urlUpdates);

      expect(params.get('market')).toBe('ERCOT');
      expect(params.get('durationHours')).toBe('1');
      expect(params.get('dateRange')).toBe('6M');
    });
    expect(screen.getByRole('button', { name: '1h' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('shows updating status during refetch and swaps in the refreshed data', async () => {
    const user = userEvent.setup();

    server.use(
      http.get(/\/forecast\/overview$/, async ({ request }) => {
        const query = parseOverviewQuery(request);

        if (query.dateRange === '3M') {
          await delay(150);
        }

        return HttpResponse.json(buildOverviewResponse(query));
      }),
    );

    renderWithProviders(<OverviewDashboard />, {
      searchParams: '?market=GB&durationHours=2&dateRange=12M',
    });

    await screen.findByText('£45,200');

    await selectSingleValue(user, 'Date Range', 'Last 3 months');

    expect(await screen.findByRole('status')).toBeInTheDocument();
    expect(screen.getByText('£45,200')).toBeInTheDocument();
    expect(await screen.findByText('£46,400')).toBeInTheDocument();
  });

  it('shows the full error panel on initial failure and recovers on retry', async () => {
    const user = userEvent.setup();
    let shouldFail = true;

    server.use(
      http.get(/\/forecast\/overview$/, ({ request }) => {
        if (shouldFail) {
          shouldFail = false;

          return HttpResponse.json(
            { message: 'Overview request failed' },
            { status: 500 },
          );
        }

        return HttpResponse.json(buildOverviewResponse(parseOverviewQuery(request)));
      }),
    );

    renderWithProviders(<OverviewDashboard />, {
      searchParams: '?market=GB&durationHours=2&dateRange=12M',
    });

    expect(
      await screen.findByText(
        'The dashboard data could not be loaded. Check the API and try again.',
      ),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByText('£45,200')).toBeInTheDocument();
  });

  it('shows a warning and preserves prior data when a refetch fails', async () => {
    const { queryClient } = renderWithProviders(<OverviewDashboard />, {
      searchParams: '?market=GB&durationHours=2&dateRange=12M',
    });

    await screen.findByText('£45,200');
    server.use(
      http.get(/\/forecast\/overview$/, () =>
        HttpResponse.json(
          { message: 'Latest data refresh failed' },
          { status: 500 },
        ),
      ),
    );

    await queryClient.refetchQueries({
      queryKey: dashboardQueryKeys.overview({
        market: 'GB',
        durationHours: 2,
        dateRange: '12M',
      }),
    });

    expect(
      await screen.findByText(
        'Latest data refresh failed. Showing the previous successful response.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('£45,200')).toBeInTheDocument();
  });
});
