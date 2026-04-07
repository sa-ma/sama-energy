import type { ReactElement, ReactNode } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SamaThemeProvider } from '@sama-energy/ui';
import {
  NuqsTestingAdapter,
  type OnUrlUpdateFunction,
} from 'nuqs/adapters/testing';

type RenderWithProvidersOptions = Omit<RenderOptions, 'wrapper'> & {
  hasMemory?: boolean;
  onUrlUpdate?: OnUrlUpdateFunction;
  queryClient?: QueryClient;
  searchParams?: string | Record<string, string> | URLSearchParams;
};

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 0,
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  });
}

export function renderWithProviders(
  ui: ReactElement,
  {
    hasMemory = true,
    onUrlUpdate,
    queryClient = createTestQueryClient(),
    searchParams,
    ...renderOptions
  }: RenderWithProvidersOptions = {},
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <SamaThemeProvider>
        <NuqsTestingAdapter
          hasMemory={hasMemory}
          onUrlUpdate={onUrlUpdate}
          searchParams={searchParams}
        >
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </NuqsTestingAdapter>
      </SamaThemeProvider>
    );
  }

  return {
    queryClient,
    ...render(ui, {
      wrapper: Wrapper,
      ...renderOptions,
    }),
  };
}
