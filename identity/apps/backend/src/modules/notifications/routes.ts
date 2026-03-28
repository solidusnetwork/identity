import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { badRequest } from '../../plugins/error-handler.js'
import * as notificationsService from './service.js'

const NotifIdParams = z.object({ notificationId: z.string().uuid() })

export async function notificationsRoutes(app: FastifyInstance) {
  // GET / — list notifications with unread count
  app.get('/', {
    preHandler: app.authenticate,
    handler: async (request) => notificationsService.listNotifications(request.user.sub),
  })

  // POST /read-all — mark all notifications as read
  app.post('/read-all', {
    preHandler: app.authenticate,
    handler: async (request, reply) => {
      await notificationsService.markAllRead(request.user.sub)
      return reply.code(204).send()
    },
  })

  // PUT /:notificationId/read — mark one as read
  app.put('/:notificationId/read', {
    preHandler: app.authenticate,
    handler: async (request, reply) => {
      const params = NotifIdParams.safeParse(request.params)
      if (!params.success) throw badRequest('Invalid notification ID')
      await notificationsService.markOneRead(request.user.sub, params.data.notificationId)
      return reply.code(204).send()
    },
  })
}
