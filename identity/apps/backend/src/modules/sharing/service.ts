import { getSql } from '../../db/index.js'
import { notFound, conflict } from '../../plugins/error-handler.js'

// ---------------------------------------------------------------------------
// Share Requests
// ---------------------------------------------------------------------------

export async function listRequests(userId: string): Promise<Array<{
  id: string
  requesterName: string
  requesterDomain: string | null
  requestedClaims: string[]
  status: string
  createdAt: string
}>> {
  const sql = getSql()
  const rows = await sql<{
    id: string
    requester_name: string
    requester_domain: string | null
    requested_claims: string[]
    status: string
    created_at: Date
  }[]>`
    SELECT id, requester_name, requester_domain, requested_claims, status, created_at
    FROM share_requests
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `
  return rows.map((r) => ({
    id: r.id,
    requesterName: r.requester_name,
    requesterDomain: r.requester_domain,
    requestedClaims: r.requested_claims,
    status: r.status,
    createdAt: r.created_at.toISOString(),
  }))
}

export async function respondToRequest(
  userId: string,
  requestId: string,
  action: 'approve' | 'deny',
  credentialId?: string,
  sharedClaims?: string[],
): Promise<{ status: string }> {
  const sql = getSql()

  const rows = await sql<{ id: string; status: string; requester_name: string; requester_domain: string | null }[]>`
    SELECT id, status, requester_name, requester_domain FROM share_requests
    WHERE id = ${requestId} AND user_id = ${userId} LIMIT 1
  `
  const req = rows[0]
  if (!req) throw notFound('Share request')
  if (req.status !== 'pending') throw conflict('Request is no longer pending')

  await sql`UPDATE share_requests SET status = ${action === 'approve' ? 'approved' : 'denied'}, updated_at = now() WHERE id = ${requestId}`

  if (action === 'approve' && credentialId && sharedClaims && sharedClaims.length > 0) {
    await sql`
      INSERT INTO active_shares (user_id, request_id, credential_id, shared_claims, recipient_name, recipient_domain, expires_at)
      VALUES (
        ${userId}, ${requestId}, ${credentialId}, ${sql.array(sharedClaims)},
        ${req.requester_name}, ${req.requester_domain},
        now() + INTERVAL '30 days'
      )
    `
  }

  return { status: action === 'approve' ? 'approved' : 'denied' }
}

// ---------------------------------------------------------------------------
// Active Shares
// ---------------------------------------------------------------------------

export async function listShares(userId: string): Promise<Array<{
  id: string
  credentialId: string
  sharedClaims: string[]
  recipientName: string
  recipientDomain: string | null
  expiresAt: string | null
  revokedAt: string | null
  createdAt: string
}>> {
  const sql = getSql()
  const rows = await sql<{
    id: string
    credential_id: string
    shared_claims: string[]
    recipient_name: string
    recipient_domain: string | null
    expires_at: Date | null
    revoked_at: Date | null
    created_at: Date
  }[]>`
    SELECT id, credential_id, shared_claims, recipient_name, recipient_domain,
           expires_at, revoked_at, created_at
    FROM active_shares
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `
  return rows.map((r) => ({
    id: r.id,
    credentialId: r.credential_id,
    sharedClaims: r.shared_claims,
    recipientName: r.recipient_name,
    recipientDomain: r.recipient_domain,
    expiresAt: r.expires_at?.toISOString() ?? null,
    revokedAt: r.revoked_at?.toISOString() ?? null,
    createdAt: r.created_at.toISOString(),
  }))
}

export async function revokeShare(userId: string, shareId: string): Promise<void> {
  const sql = getSql()
  const rows = await sql<{ id: string }[]>`
    SELECT id FROM active_shares WHERE id = ${shareId} AND user_id = ${userId} LIMIT 1
  `
  if (rows.length === 0) throw notFound('Share')

  await sql`UPDATE active_shares SET revoked_at = now() WHERE id = ${shareId}`
}
