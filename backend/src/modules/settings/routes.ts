import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { badRequest } from '../../plugins/error-handler.js'
import * as settingsService from './service.js'

const ProfilePatch = z.object({
  displayName: z.string().max(120).optional(),
  bio:         z.string().max(500).optional(),
}).refine((d) => d.displayName !== undefined || d.bio !== undefined, {
  message: 'At least one of displayName or bio must be provided',
})

const PrefsPut = z.object({
  language:        z.string().max(10).optional(),
  theme:           z.enum(['dark', 'light']).optional(),
  notifExpiry:     z.boolean().optional(),
  notifRequests:   z.boolean().optional(),
  notifSuspicious: z.boolean().optional(),
  notifIssuance:   z.boolean().optional(),
  notifDigest:     z.boolean().optional(),
})

export async function settingsRoutes(app: FastifyInstance) {
  // PATCH /profile — update display name and/or bio
  app.patch('/profile', {
    preHandler: app.authenticate,
    handler: async (request, reply) => {
      const body = ProfilePatch.safeParse(request.body)
      if (!body.success) throw badRequest(body.error.issues.map(i => `${i.path}: ${i.message}`).join('; '))
      const patch: { displayName?: string; bio?: string } = {}
      if (body.data.displayName !== undefined) patch.displayName = body.data.displayName
      if (body.data.bio !== undefined) patch.bio = body.data.bio
      await settingsService.updateProfile(request.user.sub, patch)
      return reply.code(204).send()
    },
  })

  // GET /preferences
  app.get('/preferences', {
    preHandler: app.authenticate,
    handler: async (request) => settingsService.getPreferences(request.user.sub),
  })

  // PUT /preferences
  app.put('/preferences', {
    preHandler: app.authenticate,
    handler: async (request, reply) => {
      const body = PrefsPut.safeParse(request.body)
      if (!body.success) throw badRequest(body.error.issues.map(i => `${i.path}: ${i.message}`).join('; '))
      const prefs: Parameters<typeof settingsService.updatePreferences>[1] = {}
      if (body.data.language !== undefined)        prefs.language        = body.data.language
      if (body.data.theme !== undefined)           prefs.theme           = body.data.theme
      if (body.data.notifExpiry !== undefined)     prefs.notifExpiry     = body.data.notifExpiry
      if (body.data.notifRequests !== undefined)   prefs.notifRequests   = body.data.notifRequests
      if (body.data.notifSuspicious !== undefined) prefs.notifSuspicious = body.data.notifSuspicious
      if (body.data.notifIssuance !== undefined)   prefs.notifIssuance   = body.data.notifIssuance
      if (body.data.notifDigest !== undefined)     prefs.notifDigest     = body.data.notifDigest
      await settingsService.updatePreferences(request.user.sub, prefs)
      return reply.code(204).send()
    },
  })
}
