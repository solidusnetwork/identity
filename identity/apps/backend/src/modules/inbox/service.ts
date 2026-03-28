import { getSql } from '../../db/index.js'
import { notFound, conflict } from '../../plugins/error-handler.js'
import { writeNotification } from '../activity/writer.js'

type OfferRow = {
  id: string
  title: string
  issuer_name: string
  issuer_did: string | null
  offered_claims: string[]
  expires_at: Date | null
  status: string
  credential_id: string | null
  received_at: Date
}

export async function listOffers(
  userId: string,
  status?: string,
): Promise<Array<{
  id: string
  title: string
  issuerName: string
  issuerDid: string | null
  offeredClaims: string[]
  expiresAt: string | null
  status: string
  credentialId: string | null
  receivedAt: string
}>> {
  const sql = getSql()
  const rows = status
    ? await sql<OfferRow[]>`
        SELECT id, title, issuer_name, issuer_did, offered_claims, expires_at, status, credential_id, received_at
        FROM credential_offers
        WHERE user_id = ${userId} AND status = ${status}
        ORDER BY received_at DESC
      `
    : await sql<OfferRow[]>`
        SELECT id, title, issuer_name, issuer_did, offered_claims, expires_at, status, credential_id, received_at
        FROM credential_offers
        WHERE user_id = ${userId}
        ORDER BY received_at DESC
      `

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    issuerName: r.issuer_name,
    issuerDid: r.issuer_did,
    offeredClaims: r.offered_claims,
    expiresAt: r.expires_at?.toISOString() ?? null,
    status: r.status,
    credentialId: r.credential_id,
    receivedAt: r.received_at.toISOString(),
  }))
}

export async function acceptOffer(userId: string, offerId: string): Promise<{ status: string }> {
  const sql = getSql()
  const rows = await sql<{ id: string; status: string; title: string; issuer_name: string }[]>`
    SELECT id, status, title, issuer_name FROM credential_offers
    WHERE id = ${offerId} AND user_id = ${userId} LIMIT 1
  `
  const offer = rows[0]
  if (!offer) throw notFound('Credential offer')
  if (offer.status !== 'pending') throw conflict('Offer is no longer pending')

  await sql`UPDATE credential_offers SET status = 'accepted' WHERE id = ${offerId}`

  await writeNotification(
    userId,
    'credential.offer.accepted',
    `Accepted: ${offer.title}`,
    `Issued by ${offer.issuer_name}`,
    '/my-credentials',
  )

  return { status: 'accepted' }
}

export async function declineOffer(userId: string, offerId: string): Promise<{ status: string }> {
  const sql = getSql()
  const rows = await sql<{ id: string; status: string }[]>`
    SELECT id, status FROM credential_offers WHERE id = ${offerId} AND user_id = ${userId} LIMIT 1
  `
  if (!rows[0]) throw notFound('Credential offer')
  if (rows[0].status !== 'pending') throw conflict('Offer is no longer pending')

  await sql`UPDATE credential_offers SET status = 'declined' WHERE id = ${offerId}`

  return { status: 'declined' }
}
