import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { badRequest } from '../../plugins/error-handler.js'
import * as authService from './service.js'
import { writeActivity, writeNotification } from '../activity/writer.js'

declare module 'fastify' {
  interface FastifyRequest {
    user: { sub: string; did: string }
  }
}

const ChallengeBody = z.object({
  did: z.string().min(1),
})

const VerifyBody = z.object({
  challengeId: z.string().uuid(),
  presentation: z.object({
    '@context': z.array(z.string()),
    type: z.array(z.string()),
    holder: z.string(),
    verifiableCredential: z.array(z.unknown()).optional(),
    proof: z.object({
      type: z.string(),
      created: z.string(),
      challenge: z.string(),
      proofPurpose: z.string(),
      verificationMethod: z.string(),
      jws: z.string(),
    }),
  }),
})

async function authRoutesPlugin(app: FastifyInstance): Promise<void> {
  // POST /challenge — issue a DID auth challenge
  app.post('/challenge', async (request, reply) => {
    const result = ChallengeBody.safeParse(request.body)
    if (!result.success) {
      throw badRequest(result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '))
    }

    const challenge = await authService.challengeAuth(result.data.did)
    return reply.send(challenge)
  })

  // POST /verify — verify signed presentation, issue JWT
  app.post('/verify', async (request, reply) => {
    const result = VerifyBody.safeParse(request.body)
    if (!result.success) {
      throw badRequest(result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '))
    }

    const { userId, did } = await authService.verifyAuth(
      result.data.challengeId,
      result.data.presentation,
    )

    const token = await app.signToken(
      { sub: userId, did, type: 'access' },
      { expiresIn: '24h' },
    )

    // Side effects — non-fatal
    void writeActivity(userId, 'auth.login', 'Signed in')
    void writeNotification(userId, 'auth.new_session', 'New sign-in', 'A new session was started')

    return reply.send({ token })
  })

  // GET /me — authenticated user profile
  app.get(
    '/me',
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const user = await authService.getUser(request.user.sub)
      return reply.send(user)
    },
  )
}

export const authRoutes = authRoutesPlugin
