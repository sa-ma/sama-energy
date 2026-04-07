import type { FastifyPluginAsync } from 'fastify';

import {
  ApiErrorSchema,
  ComparisonQuerySchema,
  ComparisonResponseSchema,
  type ComparisonQuery,
  type ComparisonResponse,
} from '@sama-energy/contracts';

import {
  getComparison,
  parseComparisonQuery,
} from '../../services/comparison-service.js';

const comparisonRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get<{
    Querystring: ComparisonQuery;
    Reply: ComparisonResponse;
  }>(
    '/comparison',
    {
      schema: {
        querystring: ComparisonQuerySchema,
        response: {
          200: ComparisonResponseSchema,
          400: ApiErrorSchema,
        },
      },
    },
    async (request) => getComparison(parseComparisonQuery(request.query)),
  );
};

export default comparisonRoutes;
