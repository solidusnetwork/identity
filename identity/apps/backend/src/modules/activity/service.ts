import { getSql } from '../../db/index.js'

type ActivityRow = {
  id: string
  event_type: string
  description: string
  party: string | null
  metadata: Record<string, unknown>
  created_at: Date
}

export async function listActivity(
  userId: string,
  eventType?: string,
): Promise<{ items: Array<{
  id: string
  eventType: string
  description: string
  party: string | null
  metadata: Record<string, unknown>
  createdAt: string
}>; total: number }> {
  const sql = getSql()

  const rows = eventType
    ? await sql<ActivityRow[]>`
        SELECT id, event_type, description, party, metadata, created_at
        FROM activity_log
        WHERE user_id = ${userId} AND event_type = ${eventType}
        ORDER BY created_at DESC
        LIMIT 100
      `
    : await sql<ActivityRow[]>`
        SELECT id, event_type, description, party, metadata, created_at
        FROM activity_log
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
        LIMIT 100
      `

  const items = rows.map((r) => ({
    id: r.id,
    eventType: r.event_type,
    description: r.description,
    party: r.party,
    metadata: r.metadata,
    createdAt: r.created_at.toISOString(),
  }))

  return { items, total: items.length }
}
