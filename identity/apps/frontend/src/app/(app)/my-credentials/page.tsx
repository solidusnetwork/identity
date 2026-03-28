'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ShieldCheck,
  Share2, Plus, SortDesc, ChevronDown, Award,
  Search,
} from 'lucide-react'
import { DashboardTopBar } from '@/components/app/DashboardTopBar'
import { cn } from '@/lib/utils'
import { api } from '../../../lib/api'
import type { Credential as ApiCredential } from '../../../types/api'

// --- TYPES ---

type CredentialStatus = 'Active' | 'Expiring Soon' | 'Expired' | 'Revoked' | 'Pending Issuance'
type CredentialType = 'All' | 'Identity' | 'Professional' | 'Financial' | 'Social' | 'Health'
type SortOption = 'Recent' | 'Expiring' | 'Most Used' | 'Issuer A–Z'

interface Credential {
  id: string
  icon: React.ElementType
  accent: string
  name: string
  type: Exclude<CredentialType, 'All'>
  status: CredentialStatus
  issuer: string
  issued: string
  expires?: string
  shareCount: number
}

const CREDENTIAL_TYPES: CredentialType[] = ['All', 'Identity', 'Professional', 'Financial', 'Social', 'Health']
const STATUSES: Array<'All' | CredentialStatus> = ['All', 'Active', 'Pending Issuance', 'Expired']
const SORT_OPTIONS: SortOption[] = ['Recent', 'Expiring', 'Most Used', 'Issuer A–Z']

// --- STATUS BADGE ---

function StatusBadge({ status }: { status: CredentialStatus }) {
  let bg = 'rgba(72,72,79,0.15)'
  let color = '#8E8E93'

  if (status === 'Active') {
    bg = 'rgba(52,199,89,0.15)'
    color = '#34C759'
  } else if (status === 'Expiring Soon') {
    bg = 'rgba(255,149,0,0.15)'
    color = '#FF9500'
  } else if (status === 'Expired' || status === 'Revoked') {
    bg = 'rgba(255,59,48,0.15)'
    color = '#FF3B30'
  } else if (status === 'Pending Issuance') {
    bg = 'rgba(0,212,255,0.15)'
    color = '#00D4FF'
  }

  return (
    <div className="rounded px-2 py-0.5 shrink-0" style={{ backgroundColor: bg }}>
      <span className="font-sans font-medium text-[11px] uppercase tracking-wide" style={{ color }}>
        {status}
      </span>
    </div>
  )
}

// --- CREDENTIAL CARD ---

function CredentialCard({ credential }: { credential: Credential }) {
  const Icon = credential.icon

  let pillColor = '#8E8E93'
  if (credential.shareCount >= 50) pillColor = '#34C759'
  else if (credential.shareCount >= 10) pillColor = '#FF9500'

  return (
    <Link
      href={`/my-credentials/${credential.id}`}
      className="block bg-[#1A1A2E] rounded-lg p-5 shadow-[0_2px_8px_rgba(0,0,0,0.32)] flex flex-col hover:border hover:border-[#2A2A42] border border-transparent transition-all group"
      style={{ borderLeft: `3px solid ${credential.accent}` }}
    >
      {/* Row 1 */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <Icon className="w-[22px] h-[22px] mr-3 shrink-0" style={{ color: credential.accent }} />
          <span className="font-sans font-semibold text-[16px] text-white pr-2 line-clamp-2 group-hover:text-[#0066FF] transition-colors">
            {credential.name}
          </span>
        </div>
        <StatusBadge status={credential.status} />
      </div>

      {/* Row 2 */}
      <div className="flex items-center mb-4">
        <span className="font-sans font-normal text-[11px] text-[#8E8E93] mr-1.5">Issued by</span>
        <span className="font-sans font-normal text-[13px] text-[#8E8E93] truncate">{credential.issuer}</span>
      </div>

      {/* Row 3 */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-sans font-normal text-[11px] text-[#48484F]">Issued: {credential.issued}</span>
        {credential.expires && (
          <span className="font-sans font-normal text-[11px] text-[#48484F]">Expires: {credential.expires}</span>
        )}
      </div>

      <div className="w-full h-px bg-[#242438] mb-4" />

      {/* Row 4 */}
      <div className="flex items-center justify-between mt-auto">
        <span className="font-sans font-medium text-[13px] text-[#0066FF] hover:underline">View Details</span>
        <div className="flex items-center gap-3">
          {credential.shareCount > 0 && (
            <div className="h-5 bg-[#242438] border border-[#2A2A42] rounded-full px-2 flex items-center gap-1">
              <Share2 className="w-2.5 h-2.5" style={{ color: pillColor }} />
              <span className="font-sans font-normal text-[11px]" style={{ color: pillColor }}>
                Shared {credential.shareCount}×
              </span>
            </div>
          )}
          <button
            className="text-[#8E8E93] hover:text-white transition-colors"
            title="Share Credential"
            onClick={(e) => e.preventDefault()}
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Link>
  )
}

// --- FILTER PILL ---

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'h-7 px-3.5 rounded-full font-sans font-medium text-[12px] transition-colors whitespace-nowrap',
        active
          ? 'bg-[#0066FF] text-white'
          : 'bg-[#242438] text-[#8E8E93] hover:bg-[#2A2A42] hover:text-white'
      )}
    >
      {label}
    </button>
  )
}

// --- PAGE ---

function mapApiCredential(vc: ApiCredential): Credential {
  const typeName = vc.type[1] ?? vc.type[0] ?? 'Credential'
  const issuer = (vc.claims['issuerName'] as string | undefined) ?? vc.issuerDid
  const now = new Date()
  let status: CredentialStatus = 'Active'
  if (vc.expiresAt) {
    const exp = new Date(vc.expiresAt)
    if (exp < now) {
      status = 'Expired'
    } else {
      const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      if (exp < thirtyDays) status = 'Expiring Soon'
    }
  }
  return {
    id: vc.id,
    icon: ShieldCheck,
    accent: '#00D4FF',
    name: typeName,
    type: 'Identity',
    status,
    issuer,
    issued: vc.issuedAt.slice(0, 10),
    ...(vc.expiresAt ? { expires: vc.expiresAt.slice(0, 10) } : {}),
    shareCount: 0,
  }
}

export default function MyCredentialsPage() {
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [loading, setLoading] = useState(true)
  const [activeType, setActiveType] = useState<CredentialType>('All')
  const [activeStatus, setActiveStatus] = useState<'All' | CredentialStatus>('All')
  const [sortOption, setSortOption] = useState<SortOption>('Recent')
  const [sortOpen, setSortOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    api.get<ApiCredential[]>('/v1/credentials/')
      .then((data) => setCredentials(data.map(mapApiCredential)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = credentials.filter((c) => {
    const matchesType = activeType === 'All' || c.type === activeType
    const matchesStatus = activeStatus === 'All' || c.status === activeStatus
    const matchesSearch =
      searchQuery === '' ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.issuer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesStatus && matchesSearch
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sortOption === 'Most Used') return b.shareCount - a.shareCount
    if (sortOption === 'Issuer A–Z') return a.issuer.localeCompare(b.issuer)
    if (sortOption === 'Expiring') {
      if (!a.expires) return 1
      if (!b.expires) return -1
      return a.expires.localeCompare(b.expires)
    }
    // Recent: default order
    return 0
  })

  return (
    <>
      <DashboardTopBar title="My Credentials" />

      <main className="flex-1 max-w-[1200px] w-full mx-auto pb-16">
        {/* Page Header */}
        <div className="pt-8 px-6 flex items-center justify-between flex-wrap gap-4 mb-4">
          <h1 className="font-sans font-semibold text-[28px] text-white">My Credentials</h1>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative w-[240px]">
              <Search className="w-4 h-4 text-[#8E8E93] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search credentials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 bg-[#242438] border border-[#2A2A42] rounded px-3 pl-9 font-sans font-normal text-[14px] text-white placeholder:text-[#8E8E93] focus:outline-none focus:border-[#0066FF] transition-colors"
              />
            </div>

            {/* Add Credential */}
            <Link
              href="/marketplace"
              className="h-9 bg-[#0066FF] hover:bg-[#0055D4] rounded px-4 flex items-center transition-colors shadow-[0_2px_8px_rgba(0,102,255,0.3)]"
            >
              <Plus className="w-4 h-4 text-white mr-1.5" />
              <span className="font-sans font-semibold text-[14px] text-white">Add Credential</span>
            </Link>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="h-9 bg-[#242438] border border-[#2A2A42] hover:border-[#0066FF] hover:bg-[#1A1A2E] transition-colors rounded-md px-3 flex items-center gap-2"
              >
                <SortDesc className="w-[14px] h-[14px] text-[#8E8E93]" />
                <span className="font-sans font-normal text-[14px] text-white">Sort: {sortOption}</span>
                <ChevronDown className="w-3 h-3 text-[#8E8E93]" />
              </button>

              {sortOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setSortOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 w-[180px] bg-[#1A1A2E] border border-[#2A2A42] rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.48)] py-1 z-50">
                    {SORT_OPTIONS.map((opt) => {
                      const isActive = sortOption === opt
                      return (
                        <div
                          key={opt}
                          onClick={() => { setSortOption(opt); setSortOpen(false) }}
                          className={cn(
                            'h-10 flex items-center cursor-pointer transition-colors',
                            isActive
                              ? 'bg-[#0066FF]/[0.08] border-l-[3px] border-[#0066FF] pl-[13px] hover:bg-[#242438]'
                              : 'px-4 hover:bg-[#242438]'
                          )}
                        >
                          <span className={cn('font-sans text-[13px]', isActive ? 'font-medium text-white' : 'font-normal text-[#8E8E93]')}>
                            {opt}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Loading spinner */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#0066FF] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Expiring Soon Banner */}
        {!loading && credentials.some((c) => c.status === 'Expiring Soon') && (
          <div className="mx-6 mb-4 bg-[#FF9500]/10 border border-[#FF9500]/25 rounded-lg px-4 py-3 flex items-center gap-3">
            <span className="text-[#FF9500] text-[18px]">⚠</span>
            <span className="font-sans font-normal text-[13px] text-[#FF9500]">
              You have credentials expiring soon. Review and renew them to avoid interruption.
            </span>
          </div>
        )}

        {/* Filter Bar */}
        {!loading && (
          <div className="mx-6 my-4 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              {CREDENTIAL_TYPES.map((t) => (
                <FilterPill
                  key={t}
                  label={t}
                  active={activeType === t}
                  onClick={() => setActiveType(t)}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {STATUSES.map((s) => (
                <FilterPill
                  key={s}
                  label={s}
                  active={activeStatus === s}
                  onClick={() => setActiveStatus(s)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Grid */}
        {!loading && (sorted.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-6 pt-2">
            {sorted.map((credential) => (
              <CredentialCard key={credential.id} credential={credential} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <Award className="w-12 h-12 text-[#8E8E93] mb-4" />
            <h3 className="font-sans font-semibold text-[18px] text-white mb-2">No credentials yet</h3>
            <p className="font-sans font-normal text-[14px] text-[#8E8E93] mb-6">
              Browse the marketplace to get your first verifiable credential.
            </p>
            <Link
              href="/marketplace"
              className="h-10 bg-[#0066FF] hover:bg-[#0055D4] rounded-lg px-6 flex items-center font-sans font-semibold text-[14px] text-white transition-colors"
            >
              Browse Marketplace
            </Link>
          </div>
        ))}
      </main>
    </>
  )
}
