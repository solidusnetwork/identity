'use client'

import { useState, useEffect, useCallback } from 'react'
import { DashboardTopBar } from '@/components/app/DashboardTopBar'
import { cn } from '@/lib/utils'
import {
  AlertTriangle,
  Mail,
  ShieldCheck,
  Briefcase,
  ChevronDown,
  Share2,
  CheckCircle,
  User,
} from 'lucide-react'
import { api } from '../../../lib/api'
import type { ShareRequest, ActiveShare } from '../../../types/api'

// ─── Types ────────────────────────────────────────────────────────────────────

type ActiveTab = 'requests' | 'connections' | 'history'

// ─── Static data (not from API) ───────────────────────────────────────────────

const DISCLOSURE_FIELDS = [
  { id: '1', icon: Mail, name: 'Email Address' },
  { id: '2', icon: ShieldCheck, name: 'KYC Level 2' },
  { id: '3', icon: Briefcase, name: 'Accredited Investor' },
  { id: '4', icon: User, name: 'Legal Name' },
  { id: '5', icon: User, name: 'Date of Birth' },
]

// ─── Tab Bar ──────────────────────────────────────────────────────────────────

function TabButton({
  active,
  onClick,
  label,
  badge,
}: {
  active: boolean
  onClick: () => void
  label: string
  badge?: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'pb-3 border-b-[2px] flex items-center gap-2 transition-colors',
        active ? 'border-[#0066FF] text-white' : 'border-transparent text-[#8E8E93] hover:text-white'
      )}
    >
      <span className="font-sans font-medium text-[14px]">{label}</span>
      {badge && (
        <div className="bg-[#FF9500]/15 border border-[#FF9500]/30 rounded-full px-2 py-0.5">
          <span className="font-sans font-semibold text-[10px] text-[#FF9500]">{badge}</span>
        </div>
      )}
    </button>
  )
}

// ─── Access Requests Tab ──────────────────────────────────────────────────────

function AccessRequestsList({
  requests,
  onRespond,
}: {
  requests: ShareRequest[]
  onRespond: (requestId: string, action: 'approve' | 'deny') => Promise<void>
}) {
  if (requests.length === 0) {
    return (
      <p className="font-sans font-normal text-[14px] text-[#8E8E93]">No pending access requests.</p>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {requests.map((req) => {
        const initials = req.requesterName
          .split(' ')
          .map((w) => w[0] ?? '')
          .join('')
          .slice(0, 2)
          .toUpperCase()

        const timeAgo = new Date(req.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })

        return (
          <div
            key={req.id}
            className="bg-[#1A1A2E] rounded-[8px] p-5 border-l-[3px] border-l-[#FF9500] shadow-[0_2px_8px_rgba(0,0,0,0.32)] flex flex-col md:flex-row md:items-start justify-between gap-5"
          >
            <div className="flex flex-col gap-3 flex-1">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-md bg-[#242438] flex items-center justify-center font-sans font-bold text-[14px] text-white shrink-0">
                  {initials}
                </div>
                <div className="flex flex-col">
                  <h3 className="font-sans font-semibold text-[16px] text-white leading-tight">
                    {req.requesterName}
                  </h3>
                  <span className="font-sans font-normal text-[12px] text-[#8E8E93]">
                    {req.requesterDomain ?? ''}
                  </span>
                </div>
              </div>
              <div className="pl-12">
                <p className="font-sans font-medium text-[13px] text-[#8E8E93] mb-2">Requesting:</p>
                <div className="flex flex-wrap gap-2">
                  {req.requestedClaims.map((claim, i) => (
                    <div key={i} className="bg-[#242438] border border-[#2A2A42] rounded px-2.5 py-1">
                      <span className="font-sans font-medium text-[12px] text-white">{claim}</span>
                    </div>
                  ))}
                </div>
                <p className="font-sans font-normal text-[11px] text-[#48484F] mt-3">
                  Requested {timeAgo}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 pl-12 md:pl-0">
              <button
                onClick={() => { void onRespond(req.id, 'deny') }}
                className="h-[36px] px-4 rounded-md border border-[#2A2A42] font-sans font-medium text-[13px] text-[#8E8E93] hover:text-white hover:bg-[#242438] transition-colors"
              >
                Decline
              </button>
              <button
                onClick={() => { void onRespond(req.id, 'approve') }}
                className="h-[36px] px-4 rounded-md bg-[#0066FF] hover:bg-[#0055D4] font-sans font-medium text-[13px] text-white transition-colors"
              >
                Approve
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Active Connections Tab ────────────────────────────────────────────────────

function ConnectionRow({
  share,
  onRevoke,
}: {
  share: ActiveShare
  onRevoke: (shareId: string) => Promise<void>
}) {
  const [showRevoke, setShowRevoke] = useState(false)

  const lastAccessed = share.createdAt
    ? new Date(share.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '—'

  const credentialsLabel = share.sharedClaims.join(', ')

  return (
    <div className="flex flex-col border-b border-[#2A2A42] last:border-0">
      <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
        <div className="col-span-3 font-sans font-medium text-[14px] text-white">{share.recipientName}</div>
        <div className="col-span-5 font-sans font-normal text-[13px] text-[#8E8E93] truncate">
          {credentialsLabel}
        </div>
        <div className="col-span-3 font-sans font-normal text-[13px] text-[#8E8E93]">
          {lastAccessed}
        </div>
        <div className="col-span-1 text-right">
          <button
            onClick={() => setShowRevoke((prev) => !prev)}
            className="font-sans font-medium text-[13px] text-[#FF3B30] hover:underline"
          >
            Revoke
          </button>
        </div>
      </div>
      {showRevoke && (
        <div className="px-6 py-4 bg-[#FF3B30]/5 border-t border-[#FF3B30]/10 flex flex-col gap-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-[#FF3B30] mt-0.5 shrink-0" />
            <p className="font-sans font-normal text-[13px] text-[#E0E0E5] leading-[1.5]">
              Revoking removes {share.recipientName}'s access immediately. They will not be notified of the reason.
              Revoke presentations cannot be undone.
            </p>
          </div>
          <div className="flex items-center gap-3 pl-6">
            <button
              onClick={() => { void onRevoke(share.id) }}
              className="h-[32px] px-4 rounded-md bg-[#FF3B30] hover:bg-[#D92D20] font-sans font-medium text-[12px] text-white transition-colors"
            >
              Confirm Revoke
            </button>
            <button
              onClick={() => setShowRevoke(false)}
              className="font-sans font-medium text-[12px] text-[#8E8E93] hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function ActiveConnectionsList({
  shares,
  onRevoke,
}: {
  shares: ActiveShare[]
  onRevoke: (shareId: string) => Promise<void>
}) {
  const activeShares = shares.filter((s) => s.revokedAt === null)

  if (activeShares.length === 0) {
    return (
      <p className="font-sans font-normal text-[14px] text-[#8E8E93]">No active connections.</p>
    )
  }

  return (
    <div className="bg-[#1A1A2E] rounded-[8px] border border-[#2A2A42] overflow-hidden">
      <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#2A2A42] bg-[#151525]">
        <div className="col-span-3 font-sans font-medium text-[12px] text-[#8E8E93]">Company</div>
        <div className="col-span-5 font-sans font-medium text-[12px] text-[#8E8E93]">Credentials Shared</div>
        <div className="col-span-3 font-sans font-medium text-[12px] text-[#8E8E93]">Last Accessed</div>
        <div className="col-span-1 font-sans font-medium text-[12px] text-[#8E8E93] text-right">Action</div>
      </div>
      <div className="flex flex-col">
        {activeShares.map((share) => (
          <ConnectionRow key={share.id} share={share} onRevoke={onRevoke} />
        ))}
      </div>
    </div>
  )
}

// ─── Sharing History Tab ───────────────────────────────────────────────────────

type HistoryIconType = 'share' | 'revoke' | 'approve'

function historyIcon(type: HistoryIconType): { Icon: React.ElementType; color: string } {
  switch (type) {
    case 'share':
      return { Icon: Share2, color: '#0066FF' }
    case 'revoke':
      return { Icon: ShieldCheck, color: '#34C759' }
    case 'approve':
      return { Icon: CheckCircle, color: '#A8E600' }
  }
}

function SharingHistoryList({ shares }: { shares: ActiveShare[] }) {
  const revokedShares = shares.filter((s) => s.revokedAt !== null)

  if (revokedShares.length === 0) {
    return (
      <p className="font-sans font-normal text-[14px] text-[#8E8E93]">No sharing history yet.</p>
    )
  }

  return (
    <div className="bg-[#1A1A2E] rounded-[8px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.32)]">
      <div className="flex flex-col gap-6">
        {revokedShares.map((share) => {
          const { Icon, color } = historyIcon('revoke')
          const revokedDate = share.revokedAt
            ? new Date(share.revokedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : '—'

          return (
            <div key={share.id} className="flex gap-4">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${color}1A` }}
              >
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-sans font-medium text-[14px] text-white">
                  Access Revoked — {share.recipientName}
                </h4>
                <p className="font-sans font-normal text-[13px] text-[#8E8E93]">
                  Revoked sharing of {share.sharedClaims.join(', ')} from {share.recipientName}.
                </p>
                <span className="font-sans font-medium text-[11px] text-[#48484F] mt-1">{revokedDate}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Selective Disclosure Designer ────────────────────────────────────────────

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={cn(
        'w-11 h-6 rounded-full flex items-center px-0.5 shrink-0 transition-colors duration-200',
        checked ? 'bg-[#0066FF]' : 'bg-[#48484F]'
      )}
    >
      <div
        className={cn(
          'w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200',
          checked ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </button>
  )
}

function SelectiveDisclosureDesigner() {
  const [bioRequired, setBioRequired] = useState(true)
  const [allowDiscovery, setAllowDiscovery] = useState(false)
  const [autoExpire, setAutoExpire] = useState(true)

  return (
    <div className="bg-[#1A1A2E] rounded-[8px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.32)] mt-8">
      <h3 className="font-sans font-semibold text-[18px] text-white mb-6">
        Configure Default Sharing Rules
      </h3>

      {/* Per-credential sharing rules */}
      <div className="flex flex-col gap-4 mb-8">
        {DISCLOSURE_FIELDS.map((field) => {
          const Icon = field.icon
          return (
            <div key={field.id} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#242438] flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-[#00D4FF]" />
                </div>
                <span className="font-sans font-medium text-[14px] text-white">{field.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <button className="font-sans font-medium text-[12px] text-[#0066FF] hover:underline">
                  Customize Fields →
                </button>
                <div className="relative">
                  <button className="h-[36px] bg-[#242438] border border-[#2A2A42] rounded-md px-3 flex items-center justify-between w-[160px] hover:border-[#48484F] transition-colors">
                    <span className="font-sans font-medium text-[13px] text-white">Ask Every Time</span>
                    <ChevronDown className="w-4 h-4 text-[#8E8E93]" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="h-px w-full bg-[#2A2A42] mb-8" />

      {/* Global controls */}
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1 pr-8">
            <span className="font-sans font-medium text-[14px] text-white">
              Require biometric for all sharing
            </span>
            <span className="font-sans font-normal text-[13px] text-[#8E8E93] leading-[1.5]">
              Biometric confirmation required before any credential is shared.
            </span>
          </div>
          <ToggleSwitch checked={bioRequired} onChange={() => setBioRequired((v) => !v)} />
        </div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1 pr-8">
            <span className="font-sans font-medium text-[14px] text-white">
              Allow credential discovery
            </span>
            <span className="font-sans font-normal text-[13px] text-[#8E8E93] leading-[1.5]">
              When off, requesters cannot see which credentials you hold without your explicit DID.
            </span>
          </div>
          <ToggleSwitch checked={allowDiscovery} onChange={() => setAllowDiscovery((v) => !v)} />
        </div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1 pr-8">
            <span className="font-sans font-medium text-[14px] text-white">
              Auto-expire presentations
            </span>
            <span className="font-sans font-normal text-[13px] text-[#8E8E93] leading-[1.5]">
              Shared presentations expire after 30 days. Reauth required for continued access.
            </span>
          </div>
          <ToggleSwitch checked={autoExpire} onChange={() => setAutoExpire((v) => !v)} />
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SharingPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('requests')
  const [requests, setRequests] = useState<ShareRequest[]>([])
  const [shares, setShares] = useState<ActiveShare[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const [reqData, shareData] = await Promise.all([
        api.get<ShareRequest[]>('/v1/sharing/requests'),
        api.get<ActiveShare[]>('/v1/sharing/active'),
      ])
      setRequests(reqData)
      setShares(shareData)
    } catch {
      // silently ignore — keep existing state on error
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void fetchData() }, [fetchData])

  const handleRespond = async (requestId: string, action: 'approve' | 'deny') => {
    try {
      await api.post('/v1/sharing/requests/' + requestId + '/respond', { action })
      await fetchData()
    } catch {
      // silently ignore
    }
  }

  const handleRevoke = async (shareId: string) => {
    try {
      await api.delete('/v1/sharing/active/' + shareId)
      await fetchData()
    } catch {
      // silently ignore
    }
  }

  const pendingCount = requests.filter((r) => r.status === 'pending').length
  const pendingBadge = pendingCount > 0 ? `${pendingCount} Pending` : undefined

  if (loading) {
    return (
      <>
        <DashboardTopBar title="Privacy & Sharing" />
        <main className="flex-1 p-6 md:p-8">
          <div className="max-w-[1000px] mx-auto">
            <p className="font-sans font-normal text-[14px] text-[#8E8E93]">Loading…</p>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <DashboardTopBar title="Privacy & Sharing" />
      <main className="flex-1 p-6 md:p-8">
        <div className="max-w-[1000px] mx-auto">
          <h2 className="font-sans font-semibold text-[22px] text-white mb-6">Privacy &amp; Sharing</h2>

          {/* Tab bar */}
          <div className="flex items-center gap-6 border-b border-[#2A2A42] mb-6">
            <TabButton
              active={activeTab === 'requests'}
              onClick={() => setActiveTab('requests')}
              label="Access Requests"
              badge={pendingBadge}
            />
            <TabButton
              active={activeTab === 'connections'}
              onClick={() => setActiveTab('connections')}
              label="Active Connections"
            />
            <TabButton
              active={activeTab === 'history'}
              onClick={() => setActiveTab('history')}
              label="Sharing History"
            />
          </div>

          {/* Tab content */}
          <div className="mb-8">
            {activeTab === 'requests' && (
              <AccessRequestsList
                requests={requests.filter((r) => r.status === 'pending')}
                onRespond={handleRespond}
              />
            )}
            {activeTab === 'connections' && (
              <ActiveConnectionsList shares={shares} onRevoke={handleRevoke} />
            )}
            {activeTab === 'history' && <SharingHistoryList shares={shares} />}
          </div>

          {/* Selective Disclosure — always visible */}
          <SelectiveDisclosureDesigner />
        </div>
      </main>
    </>
  )
}
