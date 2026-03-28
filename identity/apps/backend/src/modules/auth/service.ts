import { getSql } from '../../db/index.js'
import { config } from '../../config.js'
import { createSdk } from '@solidus/sdk'
import { createChallenge, type Challenge } from '@solidus/auth'
import { verifyPresentation, type VerifiablePresentation } from '@solidus/auth'
import { notFound, unauthorized, conflict as conflictError } from '../../plugins/error-handler.js'

const sdk = createSdk({ mode: config.SOLIDUS_SDK_MODE })

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface UserRow {
  id: string
  did: string
  public_key: string
  display_name: string
  avatar_url: string | null
  created_at: Date
  updated_at: Date
}

// ---------------------------------------------------------------------------
// challengeAuth — issue a DID auth challenge
// ---------------------------------------------------------------------------

export async function challengeAuth(did: string): Promise<Challenge> {
  const sql = getSql()

  // Verify DID exists
  const doc = await sdk.did.resolve(did)
  if (!doc) throw notFound('DID')

  // Create challenge
  const challenge = createChallenge(did)

  // Store for later verification
  await sql`
    INSERT INTO auth_challenges (id, did, nonce, expires_at)
    VALUES (${challenge.id}, ${challenge.did}, ${challenge.nonce}, ${challenge.expiresAt})
  `

  return challenge
}

// ---------------------------------------------------------------------------
// verifyAuth — verify a signed presentation and issue JWT
// ---------------------------------------------------------------------------

export async function verifyAuth(
  challengeId: string,
  presentation: VerifiablePresentation,
): Promise<{ userId: string; did: string }> {
  const sql = getSql()

  // Look up challenge
  type ChallengeRow = {
    id: string
    did: string
    nonce: string
    expires_at: Date
    used: boolean
  }

  const rows = await sql<ChallengeRow[]>`
    SELECT id, did, nonce, expires_at, used
    FROM auth_challenges WHERE id = ${challengeId} LIMIT 1
  `
  const row = rows[0]
  if (!row) throw notFound('Challenge')
  if (row.used) throw conflictError('Challenge already used')

  // Reconstruct Challenge object for @solidus/auth
  const challenge: Challenge = {
    id: row.id,
    did: row.did,
    nonce: row.nonce,
    issuedAt: row.expires_at.toISOString(), // approximate — not stored separately
    expiresAt: row.expires_at.toISOString(),
  }

  // Resolve public key from DID document
  const getPublicKey = async (verificationMethodId: string): Promise<Uint8Array> => {
    const did = verificationMethodId.split('#')[0]!
    const doc = await sdk.did.resolve(did)
    if (!doc) throw notFound('DID')

    const vm = doc.verificationMethod.find((m: { id: string }) => m.id === verificationMethodId)
    if (!vm) throw unauthorized('Verification method not found in DID document')

    // Decode multibase base58btc public key
    const { decodePublicKey } = await import('@solidus/sdk')
    const hexKey = decodePublicKey(vm.publicKeyMultibase)
    return new Uint8Array(Buffer.from(hexKey, 'hex'))
  }

  // Verify
  const result = await verifyPresentation(challenge, presentation, getPublicKey)
  if (!result.valid) {
    throw unauthorized(result.error ?? 'Verification failed')
  }

  // Mark challenge as used
  await sql`UPDATE auth_challenges SET used = true WHERE id = ${challengeId}`

  // Look up user
  const userRows = await sql<{ id: string; did: string }[]>`
    SELECT id, did FROM users WHERE did = ${presentation.holder} LIMIT 1
  `
  const user = userRows[0]
  if (!user) throw notFound('User — DID not registered. Complete onboarding first.')

  return { userId: user.id, did: user.did }
}

// ---------------------------------------------------------------------------
// getUser — get authenticated user profile
// ---------------------------------------------------------------------------

export async function getUser(userId: string): Promise<{
  id: string
  did: string
  displayName: string
  avatarUrl: string | null
  createdAt: string
}> {
  const sql = getSql()

  const rows = await sql<UserRow[]>`
    SELECT id, did, display_name, avatar_url, created_at
    FROM users WHERE id = ${userId} LIMIT 1
  `
  const row = rows[0]
  if (!row) throw notFound('User')

  return {
    id: row.id,
    did: row.did,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at.toISOString(),
  }
}
