import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { badRequest } from '../../plugins/error-handler.js'
import * as credentialService from './service.js'

declare module 'fastify' {
  interface FastifyRequest {
    user: { sub: string; did: string }
  }
}

const VcIdParams = z.object({
  vcId: z.string().min(1),
})

async function credentialRoutesPlugin(app: FastifyInstance): Promise<void> {
  // GET /  — list my credentials
  app.get(
    '/',
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const credentials = await credentialService.listCredentials(request.user.did)
      return reply.send(credentials)
    },
  )

  // GET /:vcId  — get credential detail + verification
  app.get(
    '/:vcId',
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const result = VcIdParams.safeParse(request.params)
      if (!result.success) throw badRequest('Invalid credential ID')

      const credential = await credentialService.getCredential(
        decodeURIComponent(result.data.vcId),
        request.user.did,
      )

      return reply.send(credential)
    },
  )
}

export const credentialRoutes = credentialRoutesPlugin
