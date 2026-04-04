import { getSql } from '../../db/index.js'
import { config } from '../../config.js'
import { createSdk } from '@solidus/sdk'
import { conflict } from '../../plugins/error-handler.js'

const sdk = createSdk({ mode: config.SOLIDUS_SDK_MODE })

export async function registerUser(
  publicKey: string,
  displayName?: string,
): Promise<{ id: string; did: string }> {
  const sql = getSql()

  // Register DID via SDK
  const didObj = await sdk.did.create(publicKey)

  // Insert user — conflict on duplicate DID
  let rows: { id: string }[]
  try {
    rows = await sql<{ id: string }[]>`
      INSERT INTO users (did, public_key, display_name)
      VALUES (${didObj.id}, ${publicKey}, ${displayName ?? ''})
      RETURNING id
    `
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      (err as { code: string }).code === '23505'
    ) {
      throw conflict('A user with this DID already exists')
    }
    throw err
  }

  const row = rows[0]
  if (!row) throw new Error('INSERT returned no row')

  return { id: row.id, did: didObj.id }
}
