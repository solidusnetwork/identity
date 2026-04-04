import type { FastifyInstance, FastifyError } from 'fastify'

export interface ProblemDetails {
  type: string
  title: string
  status: number
  detail?: string
  instance?: string
  [key: string]: unknown
}

export class ApiError extends Error {
  status: number
  type: string
  detail?: string

  constructor(status: number, title: string, detail?: string, type?: string) {
    super(title)
    this.status = status
    this.type = type ?? `https://solidus.network/errors/${status}`
    if (detail !== undefined) this.detail = detail
  }
}

export function badRequest(detail?: string) {
  return new ApiError(400, 'Bad Request', detail)
}
export function unauthorized(detail?: string) {
  return new ApiError(401, 'Unauthorized', detail, 'https://solidus.network/errors/unauthorized')
}
export function forbidden(detail?: string) {
  return new ApiError(403, 'Forbidden', detail)
}
export function notFound(resource?: string) {
  return new ApiError(404, 'Not Found', resource ? `${resource} not found` : undefined)
}
export function conflict(detail?: string) {
  return new ApiError(409, 'Conflict', detail)
}

export async function errorHandlerPlugin(app: FastifyInstance): Promise<void> {
  app.setErrorHandler<FastifyError>((error, request, reply) => {
    if (error instanceof ApiError) {
      const body: ProblemDetails = {
        type: error.type,
        title: error.message,
        status: error.status,
        instance: request.url,
      }
      if (error.detail) body.detail = error.detail
      return reply
        .code(error.status)
        .header('Content-Type', 'application/problem+json')
        .send(body)
    }

    if (error.validation) {
      return reply
        .code(400)
        .header('Content-Type', 'application/problem+json')
        .send({
          type: 'https://solidus.network/errors/validation',
          title: 'Validation Error',
          status: 400,
          detail: error.message,
          instance: request.url,
        } satisfies ProblemDetails)
    }

    app.log.error({ err: error, url: request.url }, 'Unhandled error')
    return reply
      .code(500)
      .header('Content-Type', 'application/problem+json')
      .send({
        type: 'https://solidus.network/errors/internal',
        title: 'Internal Server Error',
        status: 500,
        instance: request.url,
      } satisfies ProblemDetails)
  })
}
