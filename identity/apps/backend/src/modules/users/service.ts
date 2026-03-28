import { getSql } from '../../db/index.js'
import { notFound } from '../../plugins/error-handler.js'

export async function getUserByDid(did: string): Promise<{
  did: string
  displayName: string
  avatarUrl: string | null
  createdAt: string
}> {
  const sql = getSql()

  const rows = await sql<{
    did: string
    display_name: string
    avatar_url: string | null
    created_at: Date
  }[]>`
    SELECT did, display_name, avatar_url, created_at
    FROM users WHERE did = ${did} LIMIT 1
  `

  const row = rows[0]
  if (!row) throw notFound('User')

  return {
    did: row.did,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at.toISOString(),
  }
}
