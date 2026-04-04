'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ShieldCheck, Copy, Check, Link as LinkIcon, Download, XCircle,
  Share2, CheckCircle, Hash, User, Calendar, Flag, CreditCard,
  QrCode,
} from 'lucide-react'
import { DashboardTopBar } from '@/components/app/DashboardTopBar'
import { cn } from '@/lib/utils'
import { api } from '../../../../lib/api'
import type { CredentialDetail } from '../../../../types/api'

// --- TYPES ---

interface CredentialField {
  key: string
  label: string
  value: string
  isMono?: boolean
  isDimmed?: boolean
}

interface CredentialMock {
  name: string
  issuer: string
  issuerDid: string
  issuedAt: string
  expiresAt: string
  accent: string
  gradientFrom: string
  gradientTo: string
  status: 'Active' | 'Expired' | 'Revoked' | 'Pending Issuance'
  fields: CredentialField[]
  subjectDid: string
  proofType: string
  proofValue: string
}

type DisclosureState = 'Reveal' | 'Derive' | 'Hide'

interface DisclosureFields {
  [key: string]: DisclosureState
}

// --- MOCK CREDENTIAL LOOKUP ---

const DEFAULT_CREDENTIAL: CredentialMock = {
  name: 'KYC Level 2 — Identity Verification',
  issuer: 'verify.solidus.network',
  issuerDid: 'did:solidus:mainnet:verify#key-1',
  issuedAt: '2026-01-20 14:32 UTC',
  expiresAt: '2027-01-20 14:32 UTC',
  accent: '#00D4FF',
  gradientFrom: '#A8E600',
  gradientTo: '#00D4FF',
  status: 'Active',
  subjectDid: 'did:solidus:mainnet:5dK3fP7vLm8Qw2xNz9Rb4YcJ6tHgAs',
  proofType: 'BbsBlsSignature2020',
  proofValue: 'rVX8GJj4BDxf...Ln5q7K9pM2...',
  fields: [
    { key: 'did', label: 'Subject DID', value: 'did:solidus:mainnet:5dK3fP7vLm8Qw2xNz9Rb4YcJ6tHgAs', isMono: true },
    { key: 'name', label: 'Full Name', value: 'Alex Chen' },
    { key: 'dob', label: 'Date of Birth', value: '••••-••-15', isDimmed: true },
    { key: 'nationality', label: 'Nationality', value: 'United States' },
    { key: 'docType', label: 'Document Type', value: 'Passport' },
    { key: 'level', label: 'Verification Level', value: 'Level 2 — Document + Liveness' },
  ],
}

const CREDENTIAL_MAP: Record<string, Partial<CredentialMock>> = {
  'email-verified': {
    name: 'Email Verified',
    issuer: 'verify.solidus.network',
    issuerDid: 'did:solidus:mainnet:verify#key-1',
    issuedAt: '2026-01-15 10:00 UTC',
    expiresAt: '2027-01-15 10:00 UTC',
    accent: '#0066FF',
    gradientFrom: '#0066FF',
    gradientTo: '#00D4FF',
    status: 'Active',
    fields: [
      { key: 'did', label: 'Subject DID', value: 'did:solidus:mainnet:5dK3fP7vLm8Qw2xNz9Rb4YcJ6tHgAs', isMono: true },
      { key: 'email', label: 'Email Address', value: 'a***@gmail.com', isDimmed: true },
      { key: 'verified', label: 'Verified At', value: '2026-01-15' },
    ],
  },
  'phone-verified': {
    name: 'Phone Verified',
    issuer: 'verify.solidus.network',
    issuerDid: 'did:solidus:mainnet:verify#key-1',
    issuedAt: '2026-01-10 09:15 UTC',
    accent: '#34C759',
    gradientFrom: '#34C759',
    gradientTo: '#A8E600',
    status: 'Active',
    fields: [
      { key: 'did', label: 'Subject DID', value: 'did:solidus:mainnet:5dK3fP7vLm8Qw2xNz9Rb4YcJ6tHgAs', isMono: true },
      { key: 'phone', label: 'Phone Number', value: '+1 (***) ***-1234', isDimmed: true },
      { key: 'country', label: 'Country Code', value: 'US' },
    ],
  },
  'cpa-license': {
    name: 'Certified Public Accountant (CPA)',
    issuer: 'AICPA',
    issuerDid: 'did:solidus:mainnet:a2c4...p7a9',
    issuedAt: '2024-04-04 08:00 UTC',
    expiresAt: '2026-04-04 08:00 UTC',
    accent: '#FF9500',
    gradientFrom: '#FF9500',
    gradientTo: '#FF3B30',
    status: 'Active',
    fields: [
      { key: 'did', label: 'Subject DID', value: 'did:solidus:mainnet:5dK3fP7vLm8Qw2xNz9Rb4YcJ6tHgAs', isMono: true },
      { key: 'name', label: 'Full Name', value: 'Alex Chen' },
      { key: 'licenseNum', label: 'License Number', value: 'CPA-2024-####', isDimmed: true },
      { key: 'state', label: 'State', value: 'California' },
      { key: 'status', label: 'License Status', value: 'Active' },
    ],
  },
  'bsc-stanford': {
    name: 'BSc Computer Science — Stanford University',
    issuer: 'Stanford University',
    issuerDid: 'did:solidus:mainnet:s4u8...k9p1',
    issuedAt: '2026-05-15 00:00 UTC',
    accent: '#A8E600',
    gradientFrom: '#A8E600',
    gradientTo: '#34C759',
    status: 'Active',
    fields: [
      { key: 'did', label: 'Subject DID', value: 'did:solidus:mainnet:5dK3fP7vLm8Qw2xNz9Rb4YcJ6tHgAs', isMono: true },
      { key: 'name', label: 'Full Name', value: 'Alex Chen' },
      { key: 'degree', label: 'Degree', value: 'Bachelor of Science' },
      { key: 'major', label: 'Major', value: 'Computer Science' },
      { key: 'gpa', label: 'GPA', value: '3.9 / 4.0' },
      { key: 'graduated', label: 'Graduation Year', value: '2026' },
    ],
  },
  'accredited-investor': {
    name: 'Accredited Investor Status',
    issuer: 'SecuritiesVerify Inc',
    issuerDid: 'did:solidus:mainnet:s8v1...e9r4',
    issuedAt: '2026-02-01 12:00 UTC',
    expiresAt: '2027-02-01 12:00 UTC',
    accent: '#C084FC',
    gradientFrom: '#6B21A8',
    gradientTo: '#C084FC',
    status: 'Active',
    fields: [
      { key: 'did', label: 'Subject DID', value: 'did:solidus:mainnet:5dK3fP7vLm8Qw2xNz9Rb4YcJ6tHgAs', isMono: true },
      { key: 'name', label: 'Full Name', value: 'Alex Chen' },
      { key: 'status', label: 'Investor Status', value: 'Accredited Investor' },
      { key: 'netWorth', label: 'Net Worth Threshold', value: '$1M+ (ZK verified)', isDimmed: true },
      { key: 'regulation', label: 'Regulation', value: 'SEC Rule 501(a)' },
    ],
  },
}

function getCredential(id: string): CredentialMock {
  const override = CREDENTIAL_MAP[id] ?? {}
  return { ...DEFAULT_CREDENTIAL, ...override }
}

// --- FIELD ICON MAP ---

const FIELD_ICONS: Record<string, React.ElementType> = {
  did: Hash,
  name: User,
  dob: Calendar,
  nationality: Flag,
  docType: CreditCard,
  level: ShieldCheck,
  email: User,
  phone: User,
  verified: Calendar,
  country: Flag,
  licenseNum: CreditCard,
  state: Flag,
  status: ShieldCheck,
  degree: ShieldCheck,
  major: ShieldCheck,
  gpa: ShieldCheck,
  graduated: Calendar,
  netWorth: CreditCard,
  regulation: ShieldCheck,
}

// --- STATUS BADGE ---

function StatusBadge({ status }: { status: CredentialMock['status'] }) {
  let bg = 'rgba(72,72,79,0.15)'
  let color = '#8E8E93'
  if (status === 'Active') { bg = 'rgba(52,199,89,0.15)'; color = '#34C759' }
  else if (status === 'Expired' || status === 'Revoked') { bg = 'rgba(255,59,48,0.15)'; color = '#FF3B30' }
  else if (status === 'Pending Issuance') { bg = 'rgba(0,212,255,0.15)'; color = '#00D4FF' }

  return (
    <div className="rounded px-2 py-0.5 shrink-0" style={{ backgroundColor: bg }}>
      <span className="font-sans font-medium text-[11px] uppercase tracking-wide" style={{ color }}>{status}</span>
    </div>
  )
}

// --- QR SHARE CARD ---

function QRShareCard({ credentialName }: { credentialName: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const shareUrl = `https://identity.solidus.network/verify?cred=${encodeURIComponent(credentialName)}`
    navigator.clipboard.writeText(shareUrl).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="bg-[#1A1A2E] rounded-lg p-6 mb-4">
      <h3 className="font-sans font-semibold text-[16px] text-white mb-4">Share via QR</h3>

      {/* QR Code mock */}
      <div className="w-[200px] h-[200px] bg-[#242438] rounded-lg mx-auto flex items-center justify-center p-3 relative">
        <div className="w-full h-full bg-white opacity-90 rounded p-2 relative">
          <div className="absolute top-4 left-4 w-8 h-8 border-[3px] border-[#0A1628]" />
          <div className="absolute top-4 right-4 w-8 h-8 border-[3px] border-[#0A1628]" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-[3px] border-[#0A1628]" />
          <div className="flex items-center justify-center h-full">
            <QrCode className="w-12 h-12 text-[#0A1628] opacity-30" />
          </div>
        </div>
      </div>

      <p className="font-sans font-normal text-[13px] text-[#8E8E93] text-center mt-3 mb-4">
        Scan to receive this credential
      </p>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 font-sans font-medium text-[13px] text-[#0066FF] hover:underline"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#34C759]" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
        <span className="text-[#2A2A42]">|</span>
        <button className="flex items-center gap-1.5 font-sans font-medium text-[13px] text-[#0066FF] hover:underline">
          <Download className="w-3.5 h-3.5" /> Download QR
        </button>
      </div>
    </div>
  )
}

// --- PRESENTATION HISTORY PANEL ---

const HISTORY_ROWS = [
  { id: 1, initials: 'AC', name: 'Acme Corp', fields: 'Full name · Country · KYC Level', date: '2026-03-17 14:32' },
  { id: 2, initials: 'DE', name: 'DeFi Exchange', fields: 'KYC Level (ZK)', date: '2026-03-15 09:18' },
  { id: 3, initials: 'JB', name: 'Job Board', fields: 'Full name · Employer · Role', date: '2026-03-10 11:45' },
]

function PresentationHistoryPanel() {
  const [activeTab, setActiveTab] = useState<'All' | 'By Recipient'>('All')

  return (
    <div className="bg-[#1A1A2E] rounded-lg p-5 px-6 shadow-[0_2px_8px_rgba(0,0,0,0.32)] mb-4">
      <div className="flex items-center justify-between">
        <h3 className="font-sans font-semibold text-[16px] text-white">Presentation History</h3>
        <div className="h-5 bg-[#242438] border border-[#2A2A42] rounded-full px-2 flex items-center gap-1">
          <Share2 className="w-2.5 h-2.5 text-[#FF9500]" />
          <span className="font-sans font-normal text-[11px] text-[#FF9500]">Shared 31×</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mt-3 mb-4 border-b border-[#242438]">
        {(['All', 'By Recipient'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'pb-2 px-1 font-sans font-medium text-[12px] transition-all duration-150 relative',
              activeTab === tab ? 'text-white' : 'text-[#8E8E93] hover:text-[#D1D1D6]'
            )}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0066FF]" />
            )}
          </button>
        ))}
      </div>

      {/* Rows */}
      <div className="flex flex-col">
        {HISTORY_ROWS.map((row, idx) => (
          <div
            key={row.id}
            className={cn(
              'flex items-center gap-3 py-2.5',
              idx !== HISTORY_ROWS.length - 1 ? 'border-b border-[#242438]' : ''
            )}
          >
            <div className="w-9 h-9 rounded-full bg-[#242438] flex items-center justify-center shrink-0">
              <span className="font-sans font-semibold text-[12px] text-[#8E8E93]">{row.initials}</span>
            </div>
            <div className="flex-1 flex flex-col min-w-0">
              <span className="font-sans font-medium text-[13px] text-white truncate">{row.name}</span>
              <span className="font-sans font-normal text-[11px] text-[#8E8E93] truncate">{row.fields}</span>
            </div>
            <div className="shrink-0 text-right">
              <span className="font-sans font-normal text-[11px] text-[#48484F]">{row.date}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-3">
        <button className="font-sans font-medium text-[11px] text-[#8E8E93] hover:underline">
          View in Activity Log →
        </button>
        <button className="font-sans font-medium text-[11px] text-[#0066FF] hover:underline">
          Export history CSV
        </button>
      </div>
    </div>
  )
}

// --- SELECTIVE DISCLOSURE DESIGNER ---

function ToggleSeg({
  text,
  active,
  color,
  onClick,
  disabled,
}: {
  text: string
  active: boolean
  color: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={cn(
        'w-12 sm:w-14 h-full rounded-full font-sans font-medium text-[11px] transition-colors',
        active ? 'text-white' : 'text-[#8E8E93] hover:text-[#D1D1D6]',
        disabled ? 'opacity-30 cursor-not-allowed' : ''
      )}
      style={{ backgroundColor: active ? color : 'transparent' }}
    >
      {text}
    </button>
  )
}

function SelectiveDisclosureDesigner({ fields }: { fields: CredentialField[] }) {
  const initialState = Object.fromEntries(fields.map((f) => [f.key, 'Reveal' as DisclosureState]))
  // Pre-set DOB to Derive if present
  if ('dob' in initialState) initialState['dob'] = 'Derive'
  const [disclosure, setDisclosure] = useState<DisclosureFields>(initialState)
  const [showFullProof, setShowFullProof] = useState(false)

  const noDerive = new Set(['did', 'docType', 'level', 'status', 'regulation'])

  const setField = (key: string, val: DisclosureState) => {
    setDisclosure((prev) => ({ ...prev, [key]: val }))
  }

  const revealedCount = Object.values(disclosure).filter((v) => v === 'Reveal').length
  const proofSizeKb = (0.8 + (fields.length - revealedCount) * 0.3).toFixed(1)

  const previewFields = fields.filter((f) => disclosure[f.key] !== 'Hide')

  return (
    <div className="w-full">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <h3 className="font-sans font-semibold text-[16px] text-white">Selective Disclosure</h3>
          <div className="bg-[#C084FC]/10 border border-[#C084FC]/25 rounded-full px-2.5 py-0.5">
            <span className="font-sans font-semibold text-[11px] text-[#C084FC]">ZK Proof</span>
          </div>
        </div>
        <span className="font-sans font-normal text-[12px] text-[#8E8E93] max-w-[180px] text-right leading-snug hidden md:block">
          Hidden fields proven with zero-knowledge cryptography.
        </span>
      </div>

      <div className="bg-[#1A1A2E] rounded-lg p-5">
        <span className="font-sans font-medium text-[11px] text-[#8E8E93] uppercase tracking-[0.06em] mb-3 block">
          Credential Fields
        </span>

        {fields.map((field, idx) => {
          const IconComp = FIELD_ICONS[field.key] ?? ShieldCheck
          const state = disclosure[field.key] ?? 'Reveal'
          const isLast = idx === fields.length - 1
          const isDeriveDisabled = noDerive.has(field.key)

          return (
            <div key={field.key}>
              <div
                className={cn(
                  'flex items-center py-3 gap-3',
                  !isLast ? 'border-b border-[#242438]' : ''
                )}
              >
                <IconComp className="w-4 h-4 text-[#8E8E93] shrink-0" />
                <span className="font-sans font-medium text-[12px] text-[#8E8E93] w-[110px] sm:w-[140px] shrink-0 truncate">
                  {field.label}
                </span>
                <span
                  className={cn(
                    'font-normal flex-1 truncate pr-2',
                    field.isMono ? 'font-mono text-[11px]' : 'font-sans text-[13px]',
                    field.isDimmed ? 'text-[#8E8E93]' : 'text-white'
                  )}
                >
                  {field.value}
                </span>
                <div className="h-7 bg-[#242438] rounded-full flex p-0.5 shrink-0">
                  <ToggleSeg text="Reveal" active={state === 'Reveal'} color="#34C759" onClick={() => setField(field.key, 'Reveal')} />
                  <ToggleSeg text="Derive" active={state === 'Derive'} color="#C084FC" onClick={() => setField(field.key, 'Derive')} disabled={isDeriveDisabled} />
                  <ToggleSeg text="Hide" active={state === 'Hide'} color="#FF3B30" onClick={() => setField(field.key, 'Hide')} />
                </div>
              </div>

              {field.key === 'dob' && state === 'Derive' && (
                <div className="bg-[#C084FC]/[0.06] border-l-[3px] border-[#C084FC] ml-8 mb-2 p-2.5 px-3">
                  <div className="flex gap-2">
                    <div className="bg-[#C084FC] text-white rounded px-2.5 py-1 font-sans text-[11px] font-medium">
                      Age ≥ 18
                    </div>
                    <div className="bg-[#242438] border border-[#2A2A42] text-[#8E8E93] rounded px-2.5 py-1 font-sans text-[11px] font-medium cursor-pointer hover:text-white">
                      Age ≥ 21
                    </div>
                    <div className="bg-[#242438] border border-[#2A2A42] text-[#8E8E93] rounded px-2.5 py-1 font-sans text-[11px] font-medium cursor-pointer hover:text-white">
                      Custom...
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {/* Complexity Bar */}
        <div className="mt-4 pt-3 border-t border-[#242438]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-sans text-[12px] text-[#8E8E93]">
              Proof size: <strong className="text-white">{proofSizeKb} KB</strong>
            </span>
            <span className="font-sans text-[12px] text-[#8E8E93]">
              Est. generation: <strong className="text-white">~0.8s</strong>
            </span>
          </div>
          <div className="h-1 bg-[#242438] rounded-full overflow-hidden">
            <div
              className="h-full"
              style={{
                width: `${Math.min(100, (revealedCount / fields.length) * 100)}%`,
                background: 'linear-gradient(90deg, #34C759, #C084FC)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Recipient Preview */}
      <div className="bg-[#1A1A2E] rounded-lg p-5 mt-4">
        <span className="font-sans font-medium text-[11px] text-[#8E8E93] uppercase tracking-[0.06em] mb-3 block">
          What the recipient sees
        </span>
        <div className="bg-[#242438] border border-[#2A2A42] rounded-lg p-4">
          <div className="space-y-2">
            {previewFields.map((f) => {
              const isZK = disclosure[f.key] === 'Derive'
              const displayVal = isZK ? '[ZK PROOF: condition ✓]' : f.value
              return (
                <div key={f.key} className="flex items-start justify-between">
                  <span className="font-sans font-medium text-[11px] text-[#8E8E93] w-[120px] shrink-0">{f.label}</span>
                  <span className={cn('font-sans text-[12px] text-right font-medium', isZK ? 'text-[#C084FC]' : 'text-white')}>
                    {displayVal}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <button
        className="w-full h-11 rounded-lg font-sans font-semibold text-[14px] text-white mt-4 flex items-center justify-center hover:opacity-90 transition-opacity"
        style={{
          background: 'linear-gradient(135deg, #6B21A8, #C084FC)',
          boxShadow: '0 4px 16px rgba(192,132,252,0.25)',
        }}
      >
        Generate ZK Proof &amp; Share
      </button>

      {/* Revocation section — full proof toggle */}
      {showFullProof && (
        <div className="mt-4 bg-[#242438] rounded p-4 overflow-x-auto">
          <pre className="font-mono text-[11px] text-[#A8E600] leading-relaxed whitespace-pre-wrap break-all">
            {`{\n  "type": "BbsBlsSignature2020",\n  "created": "2026-01-20T14:32:11Z",\n  "verificationMethod": "did:solidus:mainnet:verify#key-1",\n  "proofValue": "rVX8GJj4BDxf...Ln5q7K9pM2..."\n}`}
          </pre>
        </div>
      )}
      <button
        onClick={() => setShowFullProof(!showFullProof)}
        className="font-sans font-normal text-[12px] text-[#0066FF] hover:underline mt-2 block"
      >
        {showFullProof ? 'Hide Proof' : 'Show Full Proof'}
      </button>
    </div>
  )
}

// --- CREDENTIAL HERO LEFT ---

function CredentialHeroLeft({ credential }: { credential: CredentialMock }) {
  const [copiedDid, setCopiedDid] = useState(false)
  const [revokeConfirm, setRevokeConfirm] = useState(false)

  const handleCopyDid = () => {
    navigator.clipboard.writeText(credential.subjectDid).catch(() => {})
    setCopiedDid(true)
    setTimeout(() => setCopiedDid(false), 1500)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Hero Card */}
      <div
        className="bg-[#1A1A2E] rounded-xl p-7 shadow-[0_0_24px_rgba(0,212,255,0.15)] relative overflow-hidden flex flex-col"
        style={{
          borderTop: '3px solid transparent',
          backgroundImage: `linear-gradient(#1A1A2E, #1A1A2E), linear-gradient(90deg, ${credential.gradientFrom}, ${credential.gradientTo})`,
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
        }}
      >
        <span className="font-sans font-medium text-[11px] text-[#8E8E93] uppercase tracking-[0.06em] mb-2">
          Verifiable Credential
        </span>

        <div className="flex items-start justify-between mb-3">
          <h2 className="font-sans font-semibold text-[26px] text-white leading-tight pr-4">
            {credential.name}
          </h2>
          <StatusBadge status={credential.status} />
        </div>

        <div className="flex items-center mb-5">
          <LinkIcon className="w-3.5 h-3.5 text-[#8E8E93] mr-1.5" />
          <span className="font-sans font-medium text-[14px] text-[#0066FF] mr-3">{credential.issuer}</span>
          <ShieldCheck className="w-3.5 h-3.5 text-[#34C759] mr-1" />
          <span className="font-sans font-normal text-[11px] text-[#34C759]">Verified Issuer</span>
        </div>

        <div className="w-full h-px bg-[#242438] mb-5" />

        {/* KV Grid */}
        <div className="grid grid-cols-2 gap-y-5 gap-x-4">
          {credential.fields.map((field) => (
            <div key={field.key} className="flex flex-col">
              <span className="font-sans font-medium text-[11px] text-[#8E8E93] uppercase mb-1">{field.label}</span>
              {field.key === 'did' ? (
                <div className="flex items-center gap-1.5 cursor-pointer group" onClick={handleCopyDid}>
                  <span className="font-mono text-[13px] text-white truncate max-w-[200px]">
                    {field.value.slice(0, 36)}...
                  </span>
                  {copiedDid
                    ? <Check className="w-3.5 h-3.5 text-[#34C759]" />
                    : <Copy className="w-3.5 h-3.5 text-[#48484F] group-hover:text-[#8E8E93]" />
                  }
                </div>
              ) : (
                <span className={cn('font-sans font-normal text-[15px]', field.isDimmed ? 'text-[#8E8E93]' : 'text-white')}>
                  {field.value}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Issuer Information */}
      <div className="bg-[#1A1A2E] rounded-lg p-5">
        <h3 className="font-sans font-semibold text-[16px] text-white mb-4">Issuer</h3>
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="font-sans font-normal text-[13px] text-[#0066FF]">{credential.issuer}</span>
            <span className="font-mono text-[11px] text-[#8E8E93] truncate max-w-[200px]">{credential.issuerDid}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-sans font-normal text-[13px] text-[#8E8E93]">Issued</span>
            <span className="font-sans font-normal text-[13px] text-[#8E8E93]">{credential.issuedAt}</span>
          </div>
          {credential.expiresAt && (
            <div className="flex items-center justify-between">
              <span className="font-sans font-normal text-[13px] text-[#8E8E93]">Expires</span>
              <span className="font-sans font-normal text-[13px] text-[#8E8E93]">{credential.expiresAt}</span>
            </div>
          )}
          <div className="flex items-center mt-1">
            <CheckCircle className="w-3.5 h-3.5 text-[#34C759] mr-1.5" />
            <span className="font-sans font-normal text-[13px] text-[#34C759]">Signature Valid</span>
          </div>
        </div>
      </div>

      {/* Cryptographic Proof */}
      <div className="bg-[#1A1A2E] rounded-lg p-5">
        <h3 className="font-sans font-semibold text-[16px] text-white mb-3">Cryptographic Proof</h3>
        <div className="bg-[#242438] rounded flex p-4 overflow-x-auto mb-3">
          <pre className="font-mono text-[11px] text-[#A8E600] leading-relaxed whitespace-pre">
{`{
  "type": "${credential.proofType}",
  "created": "${credential.issuedAt}",
  "verificationMethod": "${credential.issuerDid}",
  "proofValue": "${credential.proofValue}"
}`}
          </pre>
        </div>
        <div className="flex justify-end">
          <button className="font-sans font-normal text-[12px] text-[#0066FF] hover:underline">Show Full Proof</button>
        </div>
      </div>

      {/* Actions Row */}
      <div className="flex items-center gap-3 mt-1">
        <button className="h-10 bg-[#0066FF] hover:bg-[#0055D4] rounded-lg px-4 flex items-center justify-center transition-colors">
          <Share2 className="w-[18px] h-[18px] text-white mr-2" />
          <span className="font-sans font-medium text-[14px] text-white">Share Credential</span>
        </button>
        <button className="h-10 border border-white/20 hover:border-white/40 hover:bg-white/5 rounded-lg px-4 flex items-center justify-center transition-colors">
          <Download className="w-[18px] h-[18px] text-white mr-2" />
          <span className="font-sans font-medium text-[14px] text-white">Download</span>
        </button>

        {!revokeConfirm ? (
          <button
            onClick={() => setRevokeConfirm(true)}
            className="h-10 border border-[#FF3B30] hover:bg-[#FF3B30]/10 rounded-lg px-4 flex items-center justify-center transition-colors ml-auto"
          >
            <XCircle className="w-[18px] h-[18px] text-[#FF3B30] mr-2" />
            <span className="font-sans font-medium text-[14px] text-[#FF3B30]">Revoke</span>
          </button>
        ) : (
          <div className="ml-auto flex items-center gap-2">
            <span className="font-sans text-[13px] text-[#FF3B30]">Confirm revoke?</span>
            <button
              onClick={() => setRevokeConfirm(false)}
              className="h-8 px-3 rounded bg-[#FF3B30] text-white font-sans font-semibold text-[12px] hover:bg-[#CC2F26] transition-colors"
            >
              Yes, Revoke
            </button>
            <button
              onClick={() => setRevokeConfirm(false)}
              className="h-8 px-3 rounded border border-[#2A2A42] text-[#8E8E93] font-sans font-medium text-[12px] hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function mapApiToMock(vc: CredentialDetail): CredentialMock {
  const typeName = vc.type[1] ?? vc.type[0] ?? 'Credential'
  const now = new Date()
  let status: CredentialMock['status'] = 'Active'
  if (!vc.valid) {
    status = 'Revoked'
  } else if (vc.expiresAt) {
    const exp = new Date(vc.expiresAt)
    if (exp < now) status = 'Expired'
  }

  const fields: CredentialField[] = [
    { key: 'did', label: 'Subject DID', value: vc.subjectDid, isMono: true },
    ...Object.entries(vc.claims).map(([key, val]) => ({
      key,
      label: key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()),
      value: String(val ?? ''),
    })),
  ]

  return {
    name: typeName,
    issuer: (vc.claims['issuerName'] as string | undefined) ?? vc.issuerDid,
    issuerDid: vc.issuerDid,
    issuedAt: vc.issuedAt,
    expiresAt: vc.expiresAt ?? '',
    accent: '#00D4FF',
    gradientFrom: '#A8E600',
    gradientTo: '#00D4FF',
    status,
    subjectDid: vc.subjectDid,
    proofType: 'BbsBlsSignature2020',
    proofValue: '...',
    fields,
  }
}

// --- PAGE ---

export default function CredentialDetailPage() {
  const params = useParams()
  const id = (Array.isArray(params?.id) ? (params.id[0] ?? '') : (params?.id ?? ''))

  const [credentialDetail, setCredentialDetail] = useState<CredentialDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    api.get<CredentialDetail>('/v1/credentials/' + encodeURIComponent(id as string))
      .then(setCredentialDetail)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <>
        <DashboardTopBar title="Credential Detail" />
        <main className="flex-1 max-w-[1200px] w-full mx-auto pb-16 flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#0066FF] border-t-transparent rounded-full animate-spin" />
        </main>
      </>
    )
  }

  if (!credentialDetail) {
    return (
      <>
        <DashboardTopBar title="Credential Detail" />
        <main className="flex-1 max-w-[1200px] w-full mx-auto pb-16 flex flex-col items-center justify-center py-20">
          <p className="font-sans font-normal text-[16px] text-[#8E8E93]">Credential not found.</p>
          <Link href="/my-credentials" className="mt-4 font-sans font-medium text-[14px] text-[#0066FF] hover:underline">
            Back to My Credentials
          </Link>
        </main>
      </>
    )
  }

  const credential = mapApiToMock(credentialDetail)

  return (
    <>
      <DashboardTopBar title="Credential Detail" />

      <main className="flex-1 max-w-[1200px] w-full mx-auto pb-16">
        {/* Breadcrumb */}
        <div className="pt-6 px-6 mb-6">
          <span className="font-sans font-normal text-[13px]">
            <Link href="/my-credentials" className="text-[#0066FF] hover:underline">
              My Credentials
            </Link>
            <span className="text-[#48484F] mx-2">/</span>
            <span className="text-white">{credential.name}</span>
          </span>
        </div>

        {/* Layout */}
        <div className="px-6 grid grid-cols-1 lg:grid-cols-[55%_45%] gap-6 items-start">
          <CredentialHeroLeft credential={credential} />

          <div className="flex flex-col">
            <QRShareCard credentialName={credential.name} />
            <PresentationHistoryPanel />
            <SelectiveDisclosureDesigner fields={credential.fields} />
          </div>
        </div>
      </main>
    </>
  )
}
