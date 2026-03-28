import { config } from '../../config.js'
import { createSdk } from '@solidus/sdk'
import type { VerifiableCredential } from '@solidus/sdk'
import { notFound } from '../../plugins/error-handler.js'

const sdk = createSdk({ mode: config.SOLIDUS_SDK_MODE })

// ---------------------------------------------------------------------------
// listCredentials — get all VCs for a user's DID
// ---------------------------------------------------------------------------

export async function listCredentials(subjectDid: string): Promise<Array<{
  id: string
  type: string[]
  issuerDid: string
  claims: Record<string, unknown>
  issuedAt: string
  expiresAt: string | null
}>> {
  const vcs = await sdk.credentials.query(subjectDid)

  return vcs.map((vc) => ({
    id: vc.id,
    type: vc.type,
    issuerDid: vc.issuer,
    claims: vc.credentialSubject,
    issuedAt: vc.issuanceDate,
    expiresAt: vc.expirationDate ?? null,
  }))
}

// ---------------------------------------------------------------------------
// getCredential — get a single VC detail + verification status
// ---------------------------------------------------------------------------

export async function getCredential(vcId: string, subjectDid: string): Promise<{
  id: string
  type: string[]
  issuerDid: string
  subjectDid: string
  claims: Record<string, unknown>
  issuedAt: string
  expiresAt: string | null
  valid: boolean
  checks: { signature: boolean; expiry: boolean; revocation: boolean }
}> {
  // Get the credential from the user's list
  const vcs = await sdk.credentials.query(subjectDid)
  const vc = vcs.find((v) => v.id === vcId)
  if (!vc) throw notFound('Credential')

  // Verify it
  const result = await sdk.credentials.verify(vcId)

  return {
    id: vc.id,
    type: vc.type,
    issuerDid: vc.issuer,
    subjectDid: vc.credentialSubject.id,
    claims: vc.credentialSubject,
    issuedAt: vc.issuanceDate,
    expiresAt: vc.expirationDate ?? null,
    valid: result.valid,
    checks: result.checks,
  }
}
