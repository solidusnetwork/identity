import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { badRequest } from '../../plugins/error-handler.js'
import * as onboardingService from './service.js'
import { writeActivity } from '../activity/writer.js'

const RegisterBody = z.object({
  publicKey: z.string().length(64),  // hex-encoded 32-byte Ed25519 public key
  displayName: z.string().max(120).optional(),
})

async function onboardingRoutesPlugin(app: FastifyInstance): Promise<void> {
  app.post('/register', async (request, reply) => {
    const result = RegisterBody.safeParse(request.body)
    if (!result.success) {
      throw badRequest(result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '))
    }

    const user = await onboardingService.registerUser(
      result.data.publicKey,
      result.data.displayName,
    )

    void writeActivity(user.id, 'did.registered', 'DID registered on-chain', undefined, { did: user.did })

    return reply.code(201).send(user)
  })
}

export const onboardingRoutes = onboardingRoutesPlugin
