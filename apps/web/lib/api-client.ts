import type {
  ApiError,
  ForecastOverviewQuery,
  ForecastOverviewResponse,
  MarketsResponse,
} from '@sama-energy/contracts';

const DEFAULT_API_BASE_URL = 'http://localhost:3001';

export class ApiClientError extends Error {
  status: number;

  code?: string;

  details?: string[];

  constructor(
    message: string,
    { status, code, details }: { status: number; code?: string; details?: string[] },
  ) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL;
}

async function requestJson<T>(path: string, searchParams?: Record<string, string | number>) {
  const url = new URL(path, getApiBaseUrl());

  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });
  }

  const response = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    let payload: ApiError | undefined;

    try {
      payload = (await response.json()) as ApiError;
    } catch {
      payload = undefined;
    }

    throw new ApiClientError(payload?.message ?? 'Request failed', {
      status: response.status,
      code: payload?.code,
      details: payload?.details,
    });
  }

  return (await response.json()) as T;
}

export function getMarkets() {
  return requestJson<MarketsResponse>('/markets');
}

export function getForecastOverview(query: ForecastOverviewQuery) {
  return requestJson<ForecastOverviewResponse>('/forecast/overview', query);
}
