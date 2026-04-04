import { createSdk } from '@solidus/sdk'
import type { VerifiableCredential } from '@solidus/sdk'
import { config } from '../../config.js'

const sdk = createSdk({ mode: config.SOLIDUS_SDK_MODE })

// ---------------------------------------------------------------------------
// Scoring model
// ---------------------------------------------------------------------------

type Category = 'Identity' | 'Professional' | 'Social' | 'Financial'

const CATEGORY_MAX: Record<Category, number> = {
  Identity:     40,
  Professional: 25,
  Social:       20,
  Financial:    15,
}

interface ScoringRule {
  name: string
  category: Category
  points: number
  /** credential type that must be present in vc.type[] */
  credType: string
  /** optional claim check — all entries must match */
  claims?: Record<string, unknown>
}

const SCORING_RULES: ScoringRule[] = [
  // Identity
  { name: 'KYC Level 1',                  category: 'Identity',     points: 10, credType: 'KYCCredential', claims: { kycLevel: 1 } },
  { name: 'KYC Level 2',                  category: 'Identity',     points: 25, credType: 'KYCCredential', claims: { kycLevel: 2 } },
  { name: 'KYC Level 3',                  category: 'Identity',     points: 35, credType: 'KYCCredential', claims: { kycLevel: 3 } },
  { name: 'Email Verified',               category: 'Identity',     points:  3, credType: 'EmailCredential' },
  { name: 'Phone Verified',               category: 'Identity',     points:  2, credType: 'PhoneCredential' },
  // Professional
  { name: 'LinkedIn Linked',              category: 'Professional', points:  8, credType: 'LinkedInCredential' },
  { name: 'Professional License',         category: 'Professional', points: 17, credType: 'ProfessionalLicenseCredential' },
  // Social
  { name: 'GitHub Linked',               category: 'Social',       points:  8, credType: 'GitHubCredential' },
  { name: 'Twitter / X Linked',          category: 'Social',       points:  6, credType: 'TwitterCredential' },
  { name: 'Discord Linked',              category: 'Social',       points:  6, credType: 'DiscordCredential' },
  // Financial
  { name: 'Financial Accreditation',     category: 'Financial',    points: 15, credType: 'FinancialCredential' },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function matchesRule(vc: VerifiableCredential, rule: ScoringRule): boolean {
  if (!vc.type.includes(rule.credType)) return false
  if (!rule.claims) return true
  for (const [k, v] of Object.entries(rule.claims)) {
    if (vc.credentialSubject[k] !== v) return false
  }
  return true
}

function computeScore(vcs: VerifiableCredential[]): {
  total: number
  categories: Record<Category, { current: number; max: number }>
  contributions: Array<{ name: string; category: Category; points: number; status: 'active' | 'missing' }>
  improvements: Array<{ name: string; category: Category; points: number }>
} {
  const catScores: Record<Category, number> = { Identity: 0, Professional: 0, Social: 0, Financial: 0 }
  const activeRuleNames = new Set<string>()

  for (const rule of SCORING_RULES) {
    const matched = vcs.find((vc) => matchesRule(vc, rule))
    if (matched) {
      activeRuleNames.add(rule.name)
      catScores[rule.category] = Math.min(
        CATEGORY_MAX[rule.category],
        catScores[rule.category] + rule.points,
      )
    }
  }

  const contributions = SCORING_RULES.map((rule) => ({
    name: rule.name,
    category: rule.category,
    points: rule.points,
    status: (activeRuleNames.has(rule.name) ? 'active' : 'missing') as 'active' | 'missing',
  }))

  // Improvements: first 3 missing rules sorted by points desc
  const improvements = SCORING_RULES
    .filter((r) => !activeRuleNames.has(r.name))
    .sort((a, b) => b.points - a.points)
    .slice(0, 3)
    .map((r) => ({ name: r.name, category: r.category, points: r.points }))

  const total = Object.values(catScores).reduce((s, v) => s + v, 0)

  return {
    total,
    categories: {
      Identity:     { current: catScores.Identity,     max: CATEGORY_MAX.Identity },
      Professional: { current: catScores.Professional, max: CATEGORY_MAX.Professional },
      Social:       { current: catScores.Social,       max: CATEGORY_MAX.Social },
      Financial:    { current: catScores.Financial,    max: CATEGORY_MAX.Financial },
    },
    contributions,
    improvements,
  }
}

function scoreLabel(total: number): { label: string; description: string } {
  if (total >= 85) return { label: 'Exceptional',       description: 'Your identity is fully verified and highly trusted across all categories.' }
  if (total >= 65) return { label: 'High Confidence',   description: 'Your identity is well-established. Adding professional credentials would improve your score further.' }
  if (total >= 45) return { label: 'Established',       description: 'Good foundation. Add more credentials to strengthen your trust profile.' }
  if (total >= 25) return { label: 'Building',          description: 'You\'re getting started. Complete KYC and link accounts to build trust.' }
  return              { label: 'Getting Started',    description: 'Complete your KYC verification to begin building your trust score.' }
}

/** Compute 6-month synthetic history from VC issuance dates */
function buildHistory(vcs: VerifiableCredential[]): Array<{ month: string; score: number }> {
  const now = new Date()
  const months: Array<{ month: string; score: number }> = []

  for (let i = 5; i >= 0; i--) {
    const cutoff = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const visibleVcs = vcs.filter((vc) => new Date(vc.issuanceDate) <= cutoff)
    const { total } = computeScore(visibleVcs)
    months.push({
      month: cutoff.toLocaleString('en-US', { month: 'short' }),
      score: total,
    })
  }

  return months
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function getTrustScore(subjectDid: string) {
  const vcs = await sdk.credentials.query(subjectDid)

  const { total, categories, contributions, improvements } = computeScore(vcs)
  const { label, description } = scoreLabel(total)
  const history = buildHistory(vcs)

  return {
    score: total,
    label,
    description,
    updatedAt: new Date().toISOString(),
    categories,
    contributions,
    improvements,
    history,
  }
}
