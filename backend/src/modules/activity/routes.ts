import type { FastifyInstance } from 'fastify'
import * as activityService from './service.js'

export async function activityRoutes(app: FastifyInstance) {
  // GET / — list activity log, optional ?type= filter
  app.get('/', {
    preHandler: app.authenticate,
    handler: async (request) => {
      const query = request.query as { type?: string }
      return activityService.listActivity(request.user.sub, query.type)
    },
  })
}
