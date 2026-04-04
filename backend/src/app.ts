import Fastify from 'fastify'
import cors from '@fastify/cors'
import sensible from '@fastify/sensible'
import * as ed from '@noble/ed25519'
import { sign as solidusJwtSign, verify as solidusJwtVerify } from '@solidus/jwt'
import type { JWTPayload, SignOptions } from '@solidus/jwt'
import type { FastifyRequest, FastifyReply } from 'fastify'
import { config } from './config.js'
import { errorHandlerPlugin } from './plugins/error-handler.js'
import { authRoutes } from './modules/auth/routes.js'
import { onboardingRoutes } from './modules/onboarding/routes.js'
import { userRoutes } from './modules/users/routes.js'
import { credentialRoutes } from './modules/credentials/routes.js'
import { sharingRoutes } from './modules/sharing/routes.js'
import { trustScoreRoutes } from './modules/trust-score/routes.js'
import { activityRoutes } from './modules/activity/routes.js'
import { notificationsRoutes } from './modules/notifications/routes.js'
import { inboxRoutes } from './modules/inbox/routes.js'
import { settingsRoutes } from './modules/settings/routes.js'
import { qrRoutes } from './modules/qr/routes.js'

declare module 'fastify' {
  interface FastifyInstance {
    signToken(payload: JWTPayload, options?: SignOptions): Promise<string>
    verifyToken(token: string): Promise<JWTPayload>
    authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>
  }
}

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: config.NODE_ENV === 'test' ? 'silent' : 'info',
      redact: ['req.headers.authorization'],
    },
  })

  await app.register(sensible)
  await app.register(cors, {
    origin: config.NODE_ENV === 'production'
      ? ['https://identity.solidus.network']
      : true,
    credentials: true,
  })

  const sessionPrivateKey = new Uint8Array(Buffer.from(config.SESSION_PRIVATE_KEY, 'hex'))
  const sessionPublicKey = await ed.getPublicKeyAsync(sessionPrivateKey)

  app.decorate(
    'signToken',
    (payload: JWTPayload, options?: SignOptions) =>
      solidusJwtSign(payload, sessionPrivateKey, options),
  )
  app.decorate(
    'verifyToken',
    (token: string) => solidusJwtVerify(token, sessionPublicKey),
  )
  app.decorate(
    'authenticate',
    async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      const auth = request.headers.authorization
      if (!auth?.startsWith('Bearer ')) {
        return reply.code(401).send({ error: 'Unauthorized' })
      }
      try {
        const payload = await app.verifyToken(auth.slice(7))
        ;(request as FastifyRequest & { user: { sub: string; did: string } }).user = {
          sub: payload.sub,
          did: payload['did'] as string,
        }
      } catch {
        return reply.code(401).send({ error: 'Invalid or expired token' })
      }
    },
  )

  await app.register(errorHandlerPlugin)

  app.get('/health', async () => ({ status: 'ok', ts: new Date().toISOString() }))

  await app.register(authRoutes, { prefix: '/v1/auth' })
  await app.register(onboardingRoutes, { prefix: '/v1/onboarding' })
  await app.register(userRoutes, { prefix: '/v1/users' })
  await app.register(credentialRoutes, { prefix: '/v1/credentials' })
  await app.register(sharingRoutes, { prefix: '/v1/sharing' })
  await app.register(trustScoreRoutes,    { prefix: '/v1/trust-score' })
  await app.register(activityRoutes,      { prefix: '/v1/activity' })
  await app.register(notificationsRoutes, { prefix: '/v1/notifications' })
  await app.register(inboxRoutes,         { prefix: '/v1/inbox' })
  await app.register(settingsRoutes,      { prefix: '/v1/settings' })
  await app.register(qrRoutes,            { prefix: '/v1/qr' })

  return app
}
