// GET /v1/auth/me response
export interface UserProfile {
  id: string
  did: string
  displayName: string
  avatarUrl: string | null
  createdAt: string
}

// POST /v1/auth/challenge response
export interface AuthChallenge {
  id: string
  did: string
  nonce: string
  issuedAt: string
  expiresAt: string
}

// POST /v1/auth/verify response
export interface AuthVerifyResponse {
  token: string
}

// POST /v1/onboarding/register response
export interface RegisterResponse {
  id: string
  did: string
}

// GET /v1/users/:did response (public)
export interface PublicProfile {
  did: string
  displayName: string
  avatarUrl: string | null
  createdAt: string
}

// GET /v1/credentials/ list item
export interface Credential {
  id: string
  type: string[]
  issuerDid: string
  claims: Record<string, unknown>
  issuedAt: string
  expiresAt: string | null
}

// GET /v1/sharing/requests list item
export interface ShareRequest {
  id: string
  requesterName: string
  requesterDomain: string | null
  requestedClaims: string[]
  status: 'pending' | 'approved' | 'denied' | 'expired'
  createdAt: string
}

// GET /v1/sharing/active list item
export interface ActiveShare {
  id: string
  credentialId: string
  sharedClaims: string[]
  recipientName: string
  recipientDomain: string | null
  expiresAt: string | null
  revokedAt: string | null
  createdAt: string
}

// GET /v1/activity
export interface ActivityItem {
  id: string
  eventType: string
  description: string
  party: string | null
  metadata: Record<string, unknown>
  createdAt: string
}

// GET /v1/notifications
export interface NotificationItem {
  id: string
  type: string
  title: string
  subtitle: string | null
  unread: boolean
  actionUrl: string | null
  createdAt: string
  group: 'TODAY' | 'YESTERDAY' | 'EARLIER'
}

// GET /v1/inbox
export interface OfferItem {
  id: string
  title: string
  issuerName: string
  issuerDid: string | null
  offeredClaims: string[]
  expiresAt: string | null
  status: 'pending' | 'accepted' | 'declined'
  credentialId: string | null
  receivedAt: string
}

// GET /v1/settings/preferences
export interface UserPreferences {
  language: string
  theme: string
  notifExpiry: boolean
  notifRequests: boolean
  notifSuspicious: boolean
  notifIssuance: boolean
  notifDigest: boolean
}

// POST /v1/qr/validate
export interface QrValidateResult {
  requestId: string
  requesterDid: string
  requesterName: string
  requesterDomain: string | null
  requestedType: string
  requestedClaims: string[]
  isVerified: boolean
}

// GET /v1/trust-score
export interface TrustScore {
  score: number
  label: string
  description: string
  updatedAt: string
  categories: {
    Identity:     { current: number; max: number }
    Professional: { current: number; max: number }
    Social:       { current: number; max: number }
    Financial:    { current: number; max: number }
  }
  contributions: Array<{
    name: string
    category: string
    points: number
    status: 'active' | 'missing'
  }>
  improvements: Array<{
    name: string
    category: string
    points: number
  }>
  history: Array<{ month: string; score: number }>
}

// GET /v1/credentials/:vcId detail
export interface CredentialDetail extends Credential {
  subjectDid: string
  valid: boolean
  checks: {
    signature: boolean
    expiry: boolean
    revocation: boolean
  }
}
