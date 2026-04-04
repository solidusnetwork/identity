import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { badRequest } from '../../plugins/error-handler.js'
import * as userService from './service.js'

const DidParams = z.object({
  did: z.string().min(1),
})

async function userRoutesPlugin(app: FastifyInstance): Promise<void> {
  // GET /:did — public profile
  app.get('/:did', async (request, reply) => {
    const result = DidParams.safeParse(request.params)
    if (!result.success) {
      throw badRequest('Invalid DID')
    }

    // URL-decode the DID (colons may be encoded)
    const did = decodeURIComponent(result.data.did)
    const user = await userService.getUserByDid(did)
    return reply.send(user)
  })
}

export const userRoutes = userRoutesPlugin
