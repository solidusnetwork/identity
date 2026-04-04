import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { badRequest } from '../../plugins/error-handler.js'
import * as inboxService from './service.js'

const OfferIdParams = z.object({ offerId: z.string().uuid() })

export async function inboxRoutes(app: FastifyInstance) {
  // GET / — list credential offers, optional ?status= filter
  app.get('/', {
    preHandler: app.authenticate,
    handler: async (request) => {
      const query = request.query as { status?: string }
      return inboxService.listOffers(request.user.sub, query.status)
    },
  })

  // POST /:offerId/accept
  app.post('/:offerId/accept', {
    preHandler: app.authenticate,
    handler: async (request) => {
      const params = OfferIdParams.safeParse(request.params)
      if (!params.success) throw badRequest('Invalid offer ID')
      return inboxService.acceptOffer(request.user.sub, params.data.offerId)
    },
  })

  // POST /:offerId/decline
  app.post('/:offerId/decline', {
    preHandler: app.authenticate,
    handler: async (request) => {
      const params = OfferIdParams.safeParse(request.params)
      if (!params.success) throw badRequest('Invalid offer ID')
      return inboxService.declineOffer(request.user.sub, params.data.offerId)
    },
  })
}
