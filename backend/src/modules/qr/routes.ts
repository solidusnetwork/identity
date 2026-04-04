import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { badRequest } from '../../plugins/error-handler.js'
import * as qrService from './service.js'

const ValidateBody = z.object({
  payload: z.string().min(1),
})

export async function qrRoutes(app: FastifyInstance) {
  // POST /validate — parse QR payload, create share_request, return request details
  app.post('/validate', {
    preHandler: app.authenticate,
    handler: async (request) => {
      const body = ValidateBody.safeParse(request.body)
      if (!body.success) throw badRequest('payload is required')
      return qrService.validateQr(request.user.sub, body.data.payload)
    },
  })
}
