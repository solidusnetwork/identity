import { getSql } from '../../db/index.js'
import { badRequest } from '../../plugins/error-handler.js'

interface QrPayload {
  type: string
  requesterDid: string
  requesterName: string
  requesterDomain?: string
  requestedType: string
  requestedClaims: string[]
}

/**
 * Validate a QR code payload and create a pending share_request for the user.
 * Returns the parsed request details plus the new share_request ID for the
 * frontend to use when calling the sharing respond endpoint.
 */
export async function validateQr(
  userId: string,
  rawPayload: string,
): Promise<{
  requestId: string
  requesterDid: string
  requesterName: string
  requesterDomain: string | null
  requestedType: string
  requestedClaims: string[]
  isVerified: boolean
}> {
  // Parse JSON
  let payload: unknown
  try {
    payload = JSON.parse(rawPayload)
  } catch {
    throw badRequest('QR payload is not valid JSON')
  }

  // Validate shape
  if (
    typeof payload !== 'object' ||
    payload === null ||
    (payload as Record<string, unknown>)['type'] !== 'solidus-credential-request'
  ) {
    throw badRequest('QR payload is not a valid Solidus credential request')
  }

  const p = payload as Record<string, unknown>

  if (typeof p['requesterDid'] !== 'string' || !p['requesterDid'].startsWith('did:')) {
    throw badRequest('QR payload missing valid requesterDid')
  }
  if (typeof p['requesterName'] !== 'string') {
    throw badRequest('QR payload missing requesterName')
  }
  if (typeof p['requestedType'] !== 'string') {
    throw badRequest('QR payload missing requestedType')
  }

  const qr = p as unknown as QrPayload
  const requestedClaims: string[] = Array.isArray(qr.requestedClaims) ? qr.requestedClaims : []

  // Create a pending share_request so the sharing respond endpoint can be used
  const sql = getSql()
  const rows = await sql<{ id: string }[]>`
    INSERT INTO share_requests
      (user_id, requester_name, requester_domain, requested_claims, status)
    VALUES (
      ${userId}, ${qr.requesterName}, ${qr.requesterDomain ?? null},
      ${sql.array([qr.requestedType, ...requestedClaims])}, 'pending'
    )
    RETURNING id
  `
  const requestId = rows[0]!.id

  return {
    requestId,
    requesterDid:    qr.requesterDid,
    requesterName:   qr.requesterName,
    requesterDomain: qr.requesterDomain ?? null,
    requestedType:   qr.requestedType,
    requestedClaims,
    isVerified:      false, // DID document verification deferred
  }
}
