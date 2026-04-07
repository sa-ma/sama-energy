import { setupServer } from 'msw/node';

import { createDefaultHandlers } from './msw-handlers';

export const server = setupServer(...createDefaultHandlers());
