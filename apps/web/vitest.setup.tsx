import type { ReactNode } from 'react';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import {
  afterAll,
  afterEach,
  beforeAll,
  vi,
} from 'vitest';

import { server } from './test/msw-server';

vi.mock('recharts', async () => {
  const actual = await vi.importActual<typeof import('recharts')>('recharts');

  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
  };
});

class ResizeObserverMock {
  observe() {}

  unobserve() {}

  disconnect() {}
}

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
  vi.stubGlobal('ResizeObserver', ResizeObserverMock);
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      addEventListener: vi.fn(),
      addListener: vi.fn(),
      dispatchEvent: vi.fn(),
      matches: false,
      media: query,
      onchange: null,
      removeEventListener: vi.fn(),
      removeListener: vi.fn(),
    })),
  );
  vi.stubGlobal('scrollTo', vi.fn());
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
