const API_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3001'

export class ApiError extends Error {
  status: number
  detail?: string

  constructor(status: number, title: string, detail?: string) {
    super(title)
    this.name = 'ApiError'
    this.status = status
    if (detail !== undefined) this.detail = detail
  }
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit & { token?: string },
): Promise<T> {
  const { token, ...fetchOptions } = options ?? {}

  const headers = new Headers(fetchOptions.headers)

  const authToken =
    token ??
    (typeof window !== 'undefined' ? localStorage.getItem('identityToken') : null)
  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken}`)
  }

  if (fetchOptions.body && !(fetchOptions.body instanceof FormData)) {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }
  }

  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, { ...fetchOptions, headers })
  } catch {
    throw new ApiError(0, 'Network error', 'Could not connect to the server')
  }

  if (!response.ok) {
    let body: Record<string, unknown> = {}
    try { body = await response.json() } catch {}

    const title =
      (body['title'] as string) ??
      (body['error'] as string) ??
      `Request failed (${response.status})`
    const detail = (body['detail'] as string) ?? undefined

    throw new ApiError(response.status, title, detail)
  }

  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export const api = {
  get: <T>(path: string) => apiFetch<T>(path, { method: 'GET' }),
  post: <T>(path: string, body?: unknown) =>
    apiFetch<T>(path, {
      method: 'POST',
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    }),
  put: <T>(path: string, body?: unknown) =>
    apiFetch<T>(path, {
      method: 'PUT',
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    }),
  patch: <T>(path: string, body?: unknown) =>
    apiFetch<T>(path, {
      method: 'PATCH',
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    }),
  delete: (path: string) => apiFetch<void>(path, { method: 'DELETE' }),
}
