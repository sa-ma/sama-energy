import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  ApiClientError,
  getComparison,
  getMarkets,
} from './api-client';

function createComparisonResponse() {
  return {
    filters: {
      markets: ['GB', 'DE'] as const,
      durationHours: 2 as const,
      dateRange: '6M' as const,
      comparisonCurrency: 'GBP',
    },
    rows: [],
    chartSeries: [],
    rankings: {
      'avg-revenue': { bestMarkets: ['GB'], worstMarkets: ['DE'] },
      'volatility-index': { bestMarkets: ['DE'], worstMarkets: ['GB'] },
      utilization: { bestMarkets: ['GB'], worstMarkets: ['DE'] },
      'spread-peak': { bestMarkets: ['GB'], worstMarkets: ['DE'] },
    },
  };
}

describe('api client', () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    fetchMock.mockReset();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('serializes query params and respects NEXT_PUBLIC_API_BASE_URL', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'https://api.example.com/base');
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify(createComparisonResponse()), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }),
    );

    await getComparison({
      markets: ['GB', 'DE'],
      durationHours: 2,
      dateRange: '6M',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.com/comparison?markets=GB%2CDE&durationHours=2&dateRange=6M',
      {
        headers: {
          Accept: 'application/json',
        },
      },
    );
  });

  it('throws ApiClientError with status, code, and details from JSON errors', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          message: 'Select between 2 and 3 markets for comparison',
          code: 'invalid_markets',
          details: ['Choose at least two markets'],
        }),
        {
          headers: { 'Content-Type': 'application/json' },
          status: 400,
        },
      ),
    );

    await expect(getMarkets()).rejects.toEqual(
      new ApiClientError('Select between 2 and 3 markets for comparison', {
        status: 400,
        code: 'invalid_markets',
        details: ['Choose at least two markets'],
      }),
    );
  });

  it('falls back to a generic message for non-JSON failures', async () => {
    fetchMock.mockResolvedValue(
      new Response('gateway timeout', {
        headers: { 'Content-Type': 'text/plain' },
        status: 504,
      }),
    );

    await expect(getMarkets()).rejects.toMatchObject({
      message: 'Request failed',
      status: 504,
    });
  });
});
