import { getSql } from '../../db/index.js'
import { notFound } from '../../plugins/error-handler.js'

type NotifRow = {
  id: string
  type: string
  title: string
  subtitle: string | null
  unread: boolean
  action_url: string | null
  created_at: Date
}

type Group = 'TODAY' | 'YESTERDAY' | 'EARLIER'

function getGroup(createdAt: Date): Group {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 86_400_000)

  if (createdAt >= today) return 'TODAY'
  if (createdAt >= yesterday) return 'YESTERDAY'
  return 'EARLIER'
}

export async function listNotifications(userId: string): Promise<{
  items: Array<{
    id: string
    type: string
    title: string
    subtitle: string | null
    unread: boolean
    actionUrl: string | null
    createdAt: string
    group: Group
  }>
  unreadCount: number
}> {
  const sql = getSql()
  const rows = await sql<NotifRow[]>`
    SELECT id, type, title, subtitle, unread, action_url, created_at
    FROM notifications
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
    LIMIT 100
  `

  const items = rows.map((r) => ({
    id: r.id,
    type: r.type,
    title: r.title,
    subtitle: r.subtitle,
    unread: r.unread,
    actionUrl: r.action_url,
    createdAt: r.created_at.toISOString(),
    group: getGroup(r.created_at),
  }))

  const unreadCount = items.filter((i) => i.unread).length

  return { items, unreadCount }
}

export async function markAllRead(userId: string): Promise<void> {
  const sql = getSql()
  await sql`UPDATE notifications SET unread = false WHERE user_id = ${userId} AND unread = true`
}

export async function markOneRead(userId: string, notificationId: string): Promise<void> {
  const sql = getSql()
  const rows = await sql<{ id: string }[]>`
    SELECT id FROM notifications WHERE id = ${notificationId} AND user_id = ${userId} LIMIT 1
  `
  if (rows.length === 0) throw notFound('Notification')
  await sql`UPDATE notifications SET unread = false WHERE id = ${notificationId}`
}
