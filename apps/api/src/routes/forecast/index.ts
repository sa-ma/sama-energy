import type { FastifyPluginAsync } from 'fastify';

import {
  ApiErrorSchema,
  ForecastOverviewQuerySchema,
  ForecastOverviewResponseSchema,
  type ForecastOverviewQuery,
  type ForecastOverviewResponse,
} from '@sama-energy/contracts';

import { getForecastOverview } from '../../services/forecast-service.js';

const forecastRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get<{
    Querystring: ForecastOverviewQuery;
    Reply: ForecastOverviewResponse;
  }>(
    '/overview',
    {
      schema: {
        querystring: ForecastOverviewQuerySchema,
        response: {
          200: ForecastOverviewResponseSchema,
          400: ApiErrorSchema,
        },
      },
    },
    async (request) => getForecastOverview(request.query),
  );
};

export default forecastRoutes;
