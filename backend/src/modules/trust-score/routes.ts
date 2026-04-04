import type { FastifyInstance } from 'fastify'
import * as trustScoreService from './service.js'

declare module 'fastify' {
  interface FastifyRequest {
    user: { sub: string; did: string }
  }
}

export async function trustScoreRoutes(app: FastifyInstance) {
  // GET /v1/trust-score — compute trust score for the authenticated user
  app.get('/', {
    preHandler: app.authenticate,
    handler: async (request) => {
      return trustScoreService.getTrustScore(request.user.did)
    },
  })
}
