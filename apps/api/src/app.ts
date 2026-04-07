import Fastify, { type FastifyInstance } from 'fastify';
import cors from '@fastify/cors';

import { getConfig } from './lib/config.js';
import { AppError } from './lib/errors.js';
import comparisonRoutes from './routes/comparison/index.js';
import forecastRoutes from './routes/forecast/index.js';
import marketsRoutes from './routes/markets/index.js';

interface CreateAppOptions {
  logger?: boolean;
}

export async function createApp(
  options: CreateAppOptions = {},
): Promise<FastifyInstance> {
  const config = getConfig();
  const app = Fastify({
    logger: options.logger ?? true,
  });

  await app.register(cors, {
    origin: config.webOrigin,
  });

  app.setErrorHandler((error, request, reply) => {
    if (typeof error === 'object' && error !== null && 'validation' in error) {
      const validationError = error as {
        validation?: Array<{ message?: string }>;
      };
      const details = Array.isArray(validationError.validation)
        ? validationError.validation.map(
            (entry) => entry.message ?? 'Invalid request',
          )
        : undefined;

      reply.status(400).send({
        code: 'validation_error',
        message: 'Request validation failed',
        details,
      });
      return;
    }

    if (error instanceof AppError) {
      reply.status(error.statusCode).send({
        code: error.code,
        message: error.message,
        details: error.details,
      });
      return;
    }

    request.log.error(error);
    reply.status(500).send({
      code: 'internal_error',
      message: 'Unexpected server error',
    });
  });

  await app.register(marketsRoutes);
  await app.register(comparisonRoutes);
  await app.register(forecastRoutes, { prefix: '/forecast' });

  return app;
}
