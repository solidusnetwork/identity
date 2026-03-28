import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { badRequest } from '../../plugins/error-handler.js'
import * as sharingService from './service.js'
import { writeActivity } from '../activity/writer.js'

declare module 'fastify' {
  interface FastifyRequest {
    user: { sub: string; did: string }
  }
}

const RespondBody = z.object({
  action: z.enum(['approve', 'deny']),
  credentialId: z.string().optional(),
  sharedClaims: z.array(z.string()).optional(),
})

const ShareIdParams = z.object({
  shareId: z.string().uuid(),
})

const RequestIdParams = z.object({
  requestId: z.string().uuid(),
})

async function sharingRoutesPlugin(app: FastifyInstance): Promise<void> {
  // GET /requests — list share requests
  app.get(
    '/requests',
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const requests = await sharingService.listRequests(request.user.sub)
      return reply.send(requests)
    },
  )

  // POST /requests/:requestId/respond — approve or deny a request
  app.post(
    '/requests/:requestId/respond',
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const params = RequestIdParams.safeParse(request.params)
      if (!params.success) throw badRequest('Invalid request ID')

      const body = RespondBody.safeParse(request.body)
      if (!body.success) throw badRequest(body.error.issues.map(i => `${i.path}: ${i.message}`).join('; '))

      const result = await sharingService.respondToRequest(
        request.user.sub,
        params.data.requestId,
        body.data.action,
        body.data.credentialId,
        body.data.sharedClaims,
      )

      if (body.data.action === 'approve') {
        void writeActivity(request.user.sub, 'credential.shared', 'Credential shared', undefined, {
          requestId: params.data.requestId,
          credentialId: body.data.credentialId,
        })
      }

      return reply.send(result)
    },
  )

  // GET /active — list active shares
  app.get(
    '/active',
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const shares = await sharingService.listShares(request.user.sub)
      return reply.send(shares)
    },
  )

  // DELETE /active/:shareId — revoke a share
  app.delete(
    '/active/:shareId',
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const params = ShareIdParams.safeParse(request.params)
      if (!params.success) throw badRequest('Invalid share ID')

      await sharingService.revokeShare(request.user.sub, params.data.shareId)
      return reply.code(204).send()
    },
  )
}

export const sharingRoutes = sharingRoutesPlugin
