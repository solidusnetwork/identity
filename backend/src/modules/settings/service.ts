import { getSql } from '../../db/index.js'

type PrefsRow = {
  language: string
  theme: string
  notif_expiry: boolean
  notif_requests: boolean
  notif_suspicious: boolean
  notif_issuance: boolean
  notif_digest: boolean
}

export async function updateProfile(
  userId: string,
  patch: { displayName?: string; bio?: string },
): Promise<void> {
  const sql = getSql()
  if (patch.displayName !== undefined && patch.bio !== undefined) {
    await sql`
      UPDATE users SET display_name = ${patch.displayName}, bio = ${patch.bio}, updated_at = now()
      WHERE id = ${userId}
    `
  } else if (patch.displayName !== undefined) {
    await sql`UPDATE users SET display_name = ${patch.displayName}, updated_at = now() WHERE id = ${userId}`
  } else if (patch.bio !== undefined) {
    await sql`UPDATE users SET bio = ${patch.bio}, updated_at = now() WHERE id = ${userId}`
  }
}

export async function getPreferences(userId: string): Promise<{
  language: string
  theme: string
  notifExpiry: boolean
  notifRequests: boolean
  notifSuspicious: boolean
  notifIssuance: boolean
  notifDigest: boolean
}> {
  const sql = getSql()
  // Upsert default row if none exists
  await sql`
    INSERT INTO user_preferences (user_id)
    VALUES (${userId})
    ON CONFLICT (user_id) DO NOTHING
  `
  const rows = await sql<PrefsRow[]>`
    SELECT language, theme, notif_expiry, notif_requests, notif_suspicious, notif_issuance, notif_digest
    FROM user_preferences WHERE user_id = ${userId}
  `
  const r = rows[0]!
  return {
    language:       r.language,
    theme:          r.theme,
    notifExpiry:    r.notif_expiry,
    notifRequests:  r.notif_requests,
    notifSuspicious: r.notif_suspicious,
    notifIssuance:  r.notif_issuance,
    notifDigest:    r.notif_digest,
  }
}

export async function updatePreferences(
  userId: string,
  prefs: Partial<{
    language: string
    theme: string
    notifExpiry: boolean
    notifRequests: boolean
    notifSuspicious: boolean
    notifIssuance: boolean
    notifDigest: boolean
  }>,
): Promise<void> {
  const sql = getSql()
  // Upsert row then update fields
  await sql`
    INSERT INTO user_preferences (user_id)
    VALUES (${userId})
    ON CONFLICT (user_id) DO NOTHING
  `
  if (prefs.language !== undefined) {
    await sql`UPDATE user_preferences SET language = ${prefs.language}, updated_at = now() WHERE user_id = ${userId}`
  }
  if (prefs.theme !== undefined) {
    await sql`UPDATE user_preferences SET theme = ${prefs.theme}, updated_at = now() WHERE user_id = ${userId}`
  }
  if (prefs.notifExpiry !== undefined) {
    await sql`UPDATE user_preferences SET notif_expiry = ${prefs.notifExpiry}, updated_at = now() WHERE user_id = ${userId}`
  }
  if (prefs.notifRequests !== undefined) {
    await sql`UPDATE user_preferences SET notif_requests = ${prefs.notifRequests}, updated_at = now() WHERE user_id = ${userId}`
  }
  if (prefs.notifSuspicious !== undefined) {
    await sql`UPDATE user_preferences SET notif_suspicious = ${prefs.notifSuspicious}, updated_at = now() WHERE user_id = ${userId}`
  }
  if (prefs.notifIssuance !== undefined) {
    await sql`UPDATE user_preferences SET notif_issuance = ${prefs.notifIssuance}, updated_at = now() WHERE user_id = ${userId}`
  }
  if (prefs.notifDigest !== undefined) {
    await sql`UPDATE user_preferences SET notif_digest = ${prefs.notifDigest}, updated_at = now() WHERE user_id = ${userId}`
  }
}
