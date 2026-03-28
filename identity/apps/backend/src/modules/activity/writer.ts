import { getSql } from '../../db/index.js'
import type postgres from 'postgres'

/**
 * Shared helper — write an activity log entry.
 * Called as a fire-and-forget side effect from other route handlers.
 * Never throws — errors are swallowed so they don't break the main request.
 */
export async function writeActivity(
  userId: string,
  eventType: string,
  description: string,
  party?: string,
  metadata?: Record<string, unknown>,
): Promise<void> {
  try {
    const sql = getSql()
    await sql`
      INSERT INTO activity_log (user_id, event_type, description, party, metadata)
      VALUES (
        ${userId}, ${eventType}, ${description},
        ${party ?? null},
        ${sql.json((metadata ?? {}) as postgres.JSONValue)}
      )
    `
  } catch (err) {
    // Non-fatal — log but don't propagate
    console.error('[activity.writer] Failed to write activity:', err)
  }
}

/**
 * Shared helper — write a notification entry.
 */
export async function writeNotification(
  userId: string,
  type: string,
  title: string,
  subtitle?: string,
  actionUrl?: string,
): Promise<void> {
  try {
    const sql = getSql()
    await sql`
      INSERT INTO notifications (user_id, type, title, subtitle, action_url)
      VALUES (${userId}, ${type}, ${title}, ${subtitle ?? null}, ${actionUrl ?? null})
    `
  } catch (err) {
    console.error('[activity.writer] Failed to write notification:', err)
  }
}
