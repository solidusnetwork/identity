'use client'

import { useState, useEffect } from 'react'
import { DashboardTopBar } from '@/components/app/DashboardTopBar'
import { api } from '@/lib/api'
import type { ActivityItem as ApiActivityItem } from '@/types/api'
import { cn } from '@/lib/utils'
import {
  ChevronDown,
  Download,
  Activity,
  CheckCircle,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Share2,
  Fingerprint,
  Lock,
  Server,
  Loader2,
  XCircle,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

type ActivityStatus = 'valid' | 'invalid' | 'loading'

interface ActivityItem {
  id: string
  type: string
  desc: string
  party: string
  date: string
  hasProof: true
  hash: string
  block: string
  timestamp: string
  status: ActivityStatus
}

interface ActivityItemNoProof {
  id: string
  type: string
  desc: string
  party: string
  date: string
  hasProof: false
  detailText: string
}

type AnyActivity = ActivityItem | ActivityItemNoProof

// ─── Event type → display category ───────────────────────────────────────────

const EVENT_CATEGORY: Record<string, string> = {
  'auth.login':         'Identity',
  'did.registered':     'Identity',
  'credential.shared':  'Sharing',
  'credential.received':'Credentials',
  'auth.new_session':   'Security',
}

function toDisplayCategory(eventType: string): string {
  return EVENT_CATEGORY[eventType] ?? 'System'
}

function toAnyActivity(item: ApiActivityItem): AnyActivity {
  const meta = item.metadata
  const hash = typeof meta['hash'] === 'string' ? meta['hash'] : undefined
  const block = typeof meta['block'] === 'string' ? meta['block'] : undefined
  const date = new Date(item.createdAt).toLocaleString('en-US', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  }) + ' UTC'

  if (hash && block) {
    return {
      id: item.id,
      type: toDisplayCategory(item.eventType),
      desc: item.description,
      party: item.party ?? 'System',
      date,
      hasProof: true,
      hash,
      block,
      timestamp: date,
      status: 'valid',
    }
  }
  return {
    id: item.id,
    type: toDisplayCategory(item.eventType),
    desc: item.description,
    party: item.party ?? 'System',
    date,
    hasProof: false,
    detailText: item.eventType,
  }
}

// Reverse map for filter → event_type query param
const EVENT_CATEGORY_REVERSE: Record<string, string> = {
  'Identity':    'auth.login',
  'Sharing':     'credential.shared',
  'Credentials': 'credential.received',
  'Security':    'auth.new_session',
  'System':      'system',
}

const FILTERS = ['All', 'Credentials', 'Sharing', 'Identity', 'Security', 'System']

// ─── EventBadge ───────────────────────────────────────────────────────────────

function EventBadge({ type }: { type: string }) {
  let color = '#8E8E93'
  let bg = 'rgba(142,142,147,0.15)'
  let icon: React.ReactNode = null

  switch (type) {
    case 'Sharing':
      color = '#0066FF'
      bg = 'rgba(0,102,255,0.15)'
      icon = <Share2 className="w-3 h-3 mr-1" />
      break
    case 'Credentials':
      color = '#34C759'
      bg = 'rgba(52,199,89,0.15)'
      icon = <ShieldCheck className="w-3 h-3 mr-1" />
      break
    case 'Identity':
      color = '#FF9500'
      bg = 'rgba(255,149,0,0.15)'
      icon = <Fingerprint className="w-3 h-3 mr-1" />
      break
    case 'Security':
      color = '#FF3B30'
      bg = 'rgba(255,59,48,0.15)'
      icon = <Lock className="w-3 h-3 mr-1" />
      break
    case 'System':
      color = '#00D4FF'
      bg = 'rgba(0,212,255,0.15)'
      icon = <Server className="w-3 h-3 mr-1" />
      break
  }

  return (
    <div className="inline-flex items-center px-2 py-0.5 rounded-full" style={{ backgroundColor: bg }}>
      {icon}
      <span className="font-sans font-medium text-[11px]" style={{ color }}>{type}</span>
    </div>
  )
}

// ─── CopyButton ───────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="text-[#8E8E93] hover:text-white transition-colors p-1 rounded-sm flex-shrink-0"
      title="Copy full hash"
    >
      {copied ? <Check className="w-3 h-3 text-[#34C759]" /> : <Copy className="w-3 h-3" />}
    </button>
  )
}

// ─── VerificationStatusCard ────────────────────────────────────────────────────

function VerificationStatusCard({ status, block }: { status: ActivityStatus; block: string }) {
  if (status === 'invalid') {
    return (
      <div className="bg-[#242438] rounded-lg p-3.5 flex flex-col items-center justify-center text-center h-full min-h-[140px]">
        <XCircle className="w-7 h-7 text-[#FF3B30] mb-1.5" />
        <span className="font-sans font-semibold text-[12px] text-[#FF3B30]">Proof Invalid</span>
        <p className="font-sans font-normal text-[12px] text-[#8E8E93] mt-1 mb-3">
          This proof could not be verified. It may have been revoked or tampered.
        </p>
        <div className="flex flex-col gap-1 w-full max-w-[160px]">
          <div className="flex items-center justify-center gap-1.5 h-[22px]">
            <XCircle className="w-2.5 h-2.5 text-[#FF3B30]" />
            <span className="font-sans font-medium text-[11px] text-[#FF3B30]">Not Anchored</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 h-[22px]">
            <XCircle className="w-2.5 h-2.5 text-[#FF3B30]" />
            <span className="font-sans font-medium text-[11px] text-[#FF3B30]">Revoked</span>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'loading') {
    return (
      <div className="bg-[#242438] rounded-lg p-3.5 flex flex-col items-center justify-center text-center h-full min-h-[140px]">
        <Loader2 className="w-7 h-7 text-[#8E8E93] mb-1.5 animate-spin" />
        <span className="font-sans font-semibold text-[12px] text-[#8E8E93]">Checking...</span>
        <p className="font-sans font-normal text-[12px] text-[#8E8E93] mt-1 mb-3">
          Querying the Solidus Protocol registry...
        </p>
        <div className="flex flex-col gap-1 w-full max-w-[160px]">
          <div className="flex items-center justify-center gap-1.5 h-[22px]">
            <Loader2 className="w-2.5 h-2.5 text-[#8E8E93] animate-spin" />
            <span className="font-sans font-medium text-[11px] text-[#8E8E93]">Verifying...</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 h-[22px]">
            <Loader2 className="w-2.5 h-2.5 text-[#8E8E93] animate-spin" />
            <span className="font-sans font-medium text-[11px] text-[#8E8E93]">Verifying...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#242438] rounded-lg p-3.5 flex flex-col items-center justify-center text-center h-full min-h-[140px]">
      <CheckCircle className="w-7 h-7 text-[#34C759] mb-1.5" />
      <span className="font-sans font-semibold text-[12px] text-[#34C759]">Proof Valid</span>
      <p className="font-sans font-normal text-[12px] text-[#8E8E93] mt-1 mb-3">
        Verified against Solidus Protocol on-chain registry.
      </p>
      <div className="flex flex-col gap-1 w-full max-w-[160px]">
        <div className="flex items-center justify-center gap-1.5 h-[22px]">
          <Check className="w-2.5 h-2.5 text-[#34C759] stroke-[3]" />
          <span className="font-sans font-medium text-[11px] text-[#34C759]">Anchored</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 h-[22px]">
          <Check className="w-2.5 h-2.5 text-[#34C759] stroke-[3]" />
          <span className="font-sans font-medium text-[11px] text-[#34C759]">Not Revoked</span>
        </div>
      </div>
      <a
        href={`#explorer-${block}`}
        className="mt-2.5 flex items-center justify-center gap-1 font-sans font-medium text-[11px] text-[#0066FF] hover:underline"
        onClick={(e) => e.stopPropagation()}
      >
        View on Explorer <ExternalLink className="w-2.5 h-2.5" />
      </a>
    </div>
  )
}

// ─── ActivityRow ──────────────────────────────────────────────────────────────

function ActivityRow({ activity }: { activity: AnyActivity }) {
  const [expanded, setExpanded] = useState(false)

  const toggle = () => {
    if (activity.hasProof) setExpanded((prev) => !prev)
  }

  return (
    <div className="flex flex-col border-b border-[#2A2A42] last:border-0 group">
      {/* Main row */}
      <div
        className="grid grid-cols-12 gap-4 px-5 py-4 items-center group-hover:bg-[#242438] transition-colors cursor-default"
        onClick={toggle}
      >
        <div className="col-span-2">
          <EventBadge type={activity.type} />
        </div>
        <div
          className="col-span-4 font-sans font-normal text-[13px] text-white truncate pr-4"
          title={activity.desc}
        >
          {activity.desc}
        </div>
        <div
          className="col-span-2 font-sans font-normal text-[13px] text-[#8E8E93] truncate pr-4"
          title={activity.party}
        >
          {activity.party}
        </div>
        <div className="col-span-2 font-sans font-normal text-[12px] text-[#8E8E93]">
          {activity.date}
        </div>
        <div className="col-span-2 text-right pr-2 flex justify-end">
          {activity.hasProof ? (
            <button
              onClick={(e) => { e.stopPropagation(); setExpanded((prev) => !prev) }}
              className="font-mono text-[12px] font-normal text-[#00D4FF] hover:underline"
            >
              {activity.hash.substring(0, 6)}...
            </button>
          ) : (
            <span className="font-sans font-normal text-[12px] text-[#8E8E93]">
              {activity.detailText}
            </span>
          )}
        </div>
      </div>

      {/* Expandable proof panel */}
      <div
        className="overflow-hidden transition-all duration-200 ease-out"
        style={{
          maxHeight: expanded ? '320px' : '0',
          opacity: expanded ? 1 : 0,
        }}
      >
        {activity.hasProof && (
          <div className="p-4 px-5 bg-[#00D4FF]/[0.04] border-l-[3px] border-l-[#00D4FF] border-b border-b-[#2A2A42] w-full flex gap-6">
            {/* Left */}
            <div className="flex-1 flex flex-col">
              <span className="font-sans font-semibold text-[11px] text-[#8E8E93] tracking-[0.08em] mb-1">
                PROOF HASH
              </span>
              <div className="flex items-start justify-between mb-4 gap-2">
                <span className="font-mono text-[12px] font-normal text-[#00D4FF] break-all leading-relaxed flex-1">
                  {activity.hash}
                </span>
                <CopyButton text={activity.hash} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center justify-between h-[28px] border-b border-[#242438]">
                  <span className="font-sans font-medium text-[12px] text-[#8E8E93]">Block</span>
                  <span className="font-mono text-[12px] font-normal text-white">{activity.block}</span>
                </div>
                <div className="flex items-center justify-between h-[28px] border-b border-[#242438]">
                  <span className="font-sans font-medium text-[12px] text-[#8E8E93]">Timestamp</span>
                  <span className="font-sans text-[12px] font-normal text-white">{activity.timestamp}</span>
                </div>
                <div className="flex items-center justify-between h-[28px]">
                  <span className="font-sans font-medium text-[12px] text-[#8E8E93]">Event Type</span>
                  <EventBadge type={activity.type} />
                </div>
              </div>
            </div>
            {/* Right */}
            <div className="flex-1">
              <VerificationStatusCard status={activity.status} block={activity.block} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ActivityPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [activities, setActivities] = useState<AnyActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const typeParam = activeFilter === 'All' ? '' : `?type=${EVENT_CATEGORY_REVERSE[activeFilter] ?? activeFilter.toLowerCase()}`
    api.get<{ items: ApiActivityItem[]; total: number }>(`/v1/activity${typeParam}`)
      .then((res) => setActivities(res.items.map(toAnyActivity)))
      .catch(() => setActivities([]))
      .finally(() => setLoading(false))
  }, [activeFilter])

  const filtered = activities

  return (
    <>
      <DashboardTopBar title="Activity" />
      <main className="flex-1 p-6 md:p-8">
        <div className="max-w-[1000px] mx-auto">
          {/* Header row */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-sans font-semibold text-[22px] text-white">Activity Log</h2>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 h-9 px-3 rounded-md border border-[#2A2A42] bg-[#1A1A2E] hover:bg-[#242438] transition-colors">
                <span className="font-sans font-medium text-[13px] text-white">Last 30 Days</span>
                <ChevronDown className="w-4 h-4 text-[#8E8E93]" />
              </button>
              <button className="flex items-center gap-2 h-9 px-3 rounded-md border border-[#2A2A42] bg-[#1A1A2E] hover:bg-[#242438] transition-colors group">
                <Download className="w-4 h-4 text-[#8E8E93] group-hover:text-white transition-colors" />
                <span className="font-sans font-medium text-[13px] text-white">Export</span>
              </button>
            </div>
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  'h-8 px-4 rounded-full font-sans font-medium text-[13px] whitespace-nowrap transition-colors',
                  activeFilter === filter
                    ? 'bg-[#0066FF] text-white'
                    : 'bg-[#1A1A2E] border border-[#2A2A42] text-[#8E8E93] hover:text-white hover:bg-[#242438]'
                )}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-[#1A1A2E] rounded-[8px] border border-[#2A2A42] overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-[#242438] border-b border-[#2A2A42]">
              <div className="col-span-2 font-sans font-medium text-[11px] text-[#8E8E93] uppercase tracking-wider">
                Event Type
              </div>
              <div className="col-span-4 font-sans font-medium text-[11px] text-[#8E8E93] uppercase tracking-wider">
                Description
              </div>
              <div className="col-span-2 font-sans font-medium text-[11px] text-[#8E8E93] uppercase tracking-wider">
                Party
              </div>
              <div className="col-span-2 font-sans font-medium text-[11px] text-[#8E8E93] uppercase tracking-wider">
                Date &amp; Time
              </div>
              <div className="col-span-2 font-sans font-medium text-[11px] text-[#8E8E93] uppercase tracking-wider text-right pr-2">
                Details
              </div>
            </div>

            {loading ? (
              <div className="py-16 flex items-center justify-center text-[#8E8E93] text-[14px]">
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading activity…
              </div>
            ) : filtered.length > 0 ? (
              <div className="flex flex-col">
                {filtered.map((activity) => (
                  <ActivityRow key={activity.id} activity={activity} />
                ))}
              </div>
            ) : (
              <div className="py-16 flex flex-col items-center justify-center text-center">
                <Activity className="w-12 h-12 text-[#8E8E93] mb-4" />
                <h3 className="font-sans font-medium text-[16px] text-white mb-1">No activity yet</h3>
                <p className="font-sans font-normal text-[13px] text-[#8E8E93]">
                  Your activity will appear here as you use your identity.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
