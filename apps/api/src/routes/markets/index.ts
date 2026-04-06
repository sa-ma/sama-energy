import type { FastifyPluginAsync } from 'fastify';

import { MarketsResponseSchema } from '@sama-energy/contracts';

import { listMarkets } from '../../services/markets-service.js';

const marketsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    '/markets',
    {
      schema: {
        response: {
          200: MarketsResponseSchema,
        },
      },
    },
    async () => listMarkets(),
  );
};

export default marketsRoutes;
