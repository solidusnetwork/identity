'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Link from 'next/link'
import {
  ShieldCheck,
  CheckSquare,
  Square,
  Check,
  Fingerprint,
  CheckCircle,
  ChevronRight,
  Hash,
  User,
  Calendar,
  Flag,
} from 'lucide-react'
import { DashboardTopBar } from '@/components/app/DashboardTopBar'
import { api } from '../../../lib/api'
import type { Credential } from '../../../types/api'

// --- STEP PROGRESS INDICATOR ---

function StepProgressIndicator({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-between mb-8 max-w-[500px] mx-auto relative">
      {/* Track */}
      <div className="absolute top-[14px] left-[10%] right-[10%] h-[2px] bg-[#242438] -z-10">
        <div
          className="h-full bg-[#0066FF] transition-all duration-500"
          style={{ width: `${((step - 1) / 3) * 100}%` }}
        />
      </div>

      <StepIcon num={1} label="Select" active={step >= 1} current={step === 1} />
      <StepIcon num={2} label="Configure" active={step >= 2} current={step === 2} />
      <StepIcon num={3} label="Approve" active={step >= 3} current={step === 3} />
      <StepIcon num={4} label="Done" active={step >= 4} current={step === 4} />
    </div>
  )
}

function StepIcon({
  num,
  label,
  active,
  current,
}: {
  num: number
  label: string
  active: boolean
  current: boolean
}) {
  return (
    <div className="flex flex-col items-center relative z-10 gap-2 w-20">
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center font-sans font-semibold text-[12px] transition-all duration-300
          ${active ? 'bg-[#0066FF] text-white' : 'bg-[#242438] text-[#8E8E93] border border-[#2A2A42]'}
          ${current ? 'shadow-[0_0_12px_rgba(0,102,255,0.5)] ring-4 ring-[#0066FF]/20' : ''}
        `}
      >
        {active && !current ? <Check className="w-4 h-4" /> : num}
      </div>
      <span
        className={`font-sans font-medium text-[11px] whitespace-nowrap transition-colors duration-300
          ${current ? 'text-white' : active ? 'text-[#A1C4FF]' : 'text-[#8E8E93]'}
        `}
      >
        {label}
      </span>
    </div>
  )
}

// --- SELECTABLE CARD ---

function SelectableCard({
  name,
  issuer,
  selected,
  onToggle,
}: {
  name: string
  issuer: string
  selected: boolean
  onToggle: () => void
}) {
  return (
    <div
      onClick={onToggle}
      className={`border-2 rounded-lg p-4 flex items-center gap-4 cursor-pointer transition-colors duration-200
        ${selected ? 'border-[#0066FF] bg-[#1A2A4A]' : 'bg-[#242438] border-transparent hover:border-[#2A2A42] hover:bg-[#2A2A42]'}
      `}
    >
      <div className="shrink-0">
        {selected ? (
          <CheckSquare className="w-5 h-5 text-[#0066FF]" />
        ) : (
          <Square className="w-5 h-5 text-[#48484F]" />
        )}
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <span className="font-sans font-semibold text-[15px] text-white truncate mb-0.5">{name}</span>
        <span className="font-sans font-normal text-[12px] text-[#8E8E93] truncate">{issuer}</span>
      </div>
      {selected && (
        <span className="font-sans font-medium text-[11px] text-[#0066FF] bg-[#0066FF]/10 px-2 py-1 rounded shrink-0">
          Selected
        </span>
      )}
    </div>
  )
}

// --- DISCLOSURE ROW ---

type DisclosureState = 'Reveal' | 'Derive' | 'Hide'

function CompactDisclosureRow({
  icon: Icon,
  label,
  value,
  state,
}: {
  icon: React.ElementType
  label: string
  value: string
  state: DisclosureState
}) {
  const colorMap: Record<DisclosureState, { color: string; bg: string }> = {
    Reveal: { color: '#34C759', bg: 'rgba(52,199,89,0.1)' },
    Derive: { color: '#C084FC', bg: 'rgba(192,132,252,0.1)' },
    Hide: { color: '#FF3B30', bg: 'rgba(255,59,48,0.1)' },
  }
  const { color, bg } = colorMap[state] ?? colorMap['Hide']

  return (
    <div className="flex items-center gap-3 h-10 border-b border-[#2A2A42] last:border-0">
      <Icon className="w-4 h-4 text-[#8E8E93] shrink-0" />
      <span className="font-sans font-medium text-[12px] text-[#8E8E93] w-[120px] shrink-0 truncate">{label}</span>
      <span className={`font-sans font-normal text-[13px] text-white flex-1 truncate pr-2 ${state === 'Hide' ? 'opacity-40' : ''}`}>
        {value}
      </span>
      <div
        className="px-2 py-0.5 rounded font-sans font-medium text-[10px] shrink-0"
        style={{ color, backgroundColor: bg }}
      >
        {state}
      </div>
    </div>
  )
}

// --- Helpers ---

function credentialDisplayName(cred: Credential): string {
  // type[] typically looks like ['VerifiableCredential', 'KYCCredential']
  // Return the most specific type (last non-generic one)
  const specific = cred.type.filter((t) => t !== 'VerifiableCredential')
  return specific[specific.length - 1] ?? cred.type[cred.type.length - 1] ?? 'Credential'
}

function credentialIssuerLabel(cred: Credential): string {
  // issuerDid is a full DID — show shortened form
  const parts = cred.issuerDid.split(':')
  return parts[parts.length - 1] ?? cred.issuerDid
}

// --- PAGE ---

export default function SharePage() {
  const [step, setStep] = useState(1)
  const [selectedCredIds, setSelectedCredIds] = useState<string[]>([])
  const [authStatus, setAuthStatus] = useState<'idle' | 'success'>('idle')
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [credsLoading, setCredsLoading] = useState(true)

  const fetchCredentials = useCallback(async () => {
    try {
      const data = await api.get<Credential[]>('/v1/credentials/')
      setCredentials(data)
      // Pre-select the first credential if available
      if (data.length > 0 && data[0] !== undefined) {
        setSelectedCredIds([data[0].id])
      }
    } catch {
      // silently ignore — credentials stay empty
    } finally {
      setCredsLoading(false)
    }
  }, [])

  useEffect(() => { void fetchCredentials() }, [fetchCredentials])

  // Auto-advance step 3 → 4 after 2.5s
  useEffect(() => {
    if (step === 3) {
      const timer = setTimeout(() => {
        setAuthStatus('success')
        setTimeout(() => setStep(4), 800)
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [step])

  const toggleCred = (id: string) => {
    setSelectedCredIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const selectedCreds = credentials.filter((c) => selectedCredIds.includes(c.id))

  return (
    <>
      <DashboardTopBar title="Share Identity" />

      <main className="flex-1 max-w-[800px] w-full mx-auto pb-16 pt-8 px-6">
        <StepProgressIndicator step={step} />

        <div className="bg-[#1A1A2E] rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-8">
          <AnimatePresence mode="wait">
            {/* STEP 1: Select Credentials */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25 }}
              >
                {/* Requester context card */}
                <div className="bg-[#242438] border border-[#2A2A42] rounded-lg p-5 mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#1A1A2E] border border-[#2A2A42] rounded-lg flex items-center justify-center font-bold text-[16px] text-[#8E8E93]">
                        AC
                      </div>
                      <div className="flex flex-col">
                        <h3 className="font-sans font-semibold text-[18px] text-white leading-tight">
                          Acme Corporation
                        </h3>
                        <span className="font-sans font-normal text-[12px] text-[#8E8E93]">
                          acme.com · Verified partner
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center bg-[#34C759]/10 border border-[#34C759]/20 rounded-full px-2.5 py-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#34C759] mr-1.5" />
                      <span className="font-sans font-medium text-[12px] text-[#34C759]">Verified Partner</span>
                    </div>
                  </div>

                  <div className="w-full h-px bg-[#2A2A42] mb-3" />

                  <span className="font-sans font-medium text-[11px] text-[#8E8E93] uppercase tracking-[0.06em] mb-2 block">
                    Requesting
                  </span>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#FF3B30]" />
                      <span className="font-sans font-medium text-[13px] text-white">
                        Identity Verification (KYC Level 2)
                      </span>
                      <span className="bg-[#FF3B30]/20 text-[#FF3B30] text-[10px] font-medium px-1.5 py-0.5 rounded">
                        Required
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#8E8E93]" />
                      <span className="font-sans font-medium text-[13px] text-[#8E8E93]">
                        Proof of Employment
                      </span>
                      <span className="bg-[#242438] text-[#8E8E93] text-[10px] font-medium px-1.5 py-0.5 rounded">
                        Optional
                      </span>
                    </div>
                  </div>
                </div>

                <h3 className="font-sans font-semibold text-[16px] text-white mb-3">
                  Matching Credentials
                </h3>

                <div className="flex flex-col gap-3 mb-8">
                  {credsLoading ? (
                    <p className="font-sans font-normal text-[14px] text-[#8E8E93]">Loading credentials…</p>
                  ) : credentials.length === 0 ? (
                    <p className="font-sans font-normal text-[14px] text-[#8E8E93]">No credentials available.</p>
                  ) : (
                    credentials.map((cred) => (
                      <SelectableCard
                        key={cred.id}
                        name={credentialDisplayName(cred)}
                        issuer={credentialIssuerLabel(cred)}
                        selected={selectedCredIds.includes(cred.id)}
                        onToggle={() => toggleCred(cred.id)}
                      />
                    ))
                  )}
                </div>

                <div className="flex justify-end pt-4 border-t border-[#242438]">
                  <button
                    onClick={() => setStep(2)}
                    disabled={selectedCredIds.length === 0}
                    className={`h-11 px-6 rounded-lg font-sans font-semibold text-[14px] flex items-center transition-colors
                      ${
                        selectedCredIds.length === 0
                          ? 'bg-[#2A2A42] text-[#8E8E93] cursor-not-allowed'
                          : 'bg-[#0066FF] hover:bg-[#0055D4] text-white shadow-[0_2px_8px_rgba(0,102,255,0.3)]'
                      }
                    `}
                  >
                    Continue <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Configure Disclosure */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25 }}
              >
                {/* Disclosure banner */}
                <div className="bg-[#0066FF]/[0.08] border border-[#0066FF]/30 rounded-lg p-3 px-4 mb-6 flex items-start">
                  <ShieldCheck className="w-5 h-5 text-[#0066FF] mr-3 shrink-0 mt-0.5" />
                  <p className="font-sans font-medium text-[13px] text-[#A1C4FF] leading-snug">
                    Data minimization applied automatically — only required fields are revealed by default.
                  </p>
                </div>

                <div className="flex flex-col gap-6 mb-8">
                  {selectedCreds.map((cred, idx) => {
                    const accentColors = ['#00D4FF', '#0066FF', '#34C759', '#A8E600', '#C084FC']
                    const accent = accentColors[idx % accentColors.length] ?? '#00D4FF'
                    const displayName = credentialDisplayName(cred)

                    // Render claim rows from the credential's claims object
                    const claimEntries = Object.entries(cred.claims)

                    return (
                      <div key={cred.id} className="bg-[#242438] border border-[#2A2A42] rounded-lg p-5">
                        <h4 className="font-sans font-semibold text-[15px] text-white mb-4 flex items-center gap-2">
                          <span className="w-1.5 h-4 rounded-full" style={{ backgroundColor: accent }} />
                          {displayName}
                        </h4>
                        <div className="flex flex-col border-t border-[#2A2A42]">
                          <CompactDisclosureRow
                            icon={Hash}
                            label="Subject DID"
                            value="did:solidus:mainnet…"
                            state="Reveal"
                          />
                          {claimEntries.map(([key, val]) => (
                            <CompactDisclosureRow
                              key={key}
                              icon={key.toLowerCase().includes('date') || key.toLowerCase().includes('birth') ? Calendar : key.toLowerCase().includes('country') || key.toLowerCase().includes('nation') ? Flag : User}
                              label={key}
                              value={typeof val === 'string' ? val : String(val)}
                              state="Reveal"
                            />
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="flex justify-between pt-4 border-t border-[#242438]">
                  <button
                    onClick={() => setStep(1)}
                    className="h-11 px-5 rounded-lg border border-[#2A2A42] font-sans font-medium text-[14px] text-[#8E8E93] hover:text-white hover:border-[#48484F] transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="h-11 px-6 rounded-lg bg-[#0066FF] hover:bg-[#0055D4] font-sans font-semibold text-[14px] text-white shadow-[0_2px_8px_rgba(0,102,255,0.3)] transition-colors flex items-center"
                  >
                    Preview & Continue <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Biometric Approval */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25 }}
                className="py-12 flex flex-col items-center justify-center text-center"
              >
                <div className="relative mb-8">
                  {authStatus === 'idle' ? (
                    <>
                      <div className="absolute inset-0 bg-[#0066FF]/20 rounded-full animate-ping" />
                      <div className="w-24 h-24 bg-[#0066FF]/10 rounded-full flex items-center justify-center relative z-10">
                        <Fingerprint className="w-[80px] h-[80px] text-[#0066FF]" />
                      </div>
                    </>
                  ) : (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      transition={{ duration: 0.4, type: 'spring', bounce: 0.5 }}
                      className="w-24 h-24 bg-[#34C759]/10 rounded-full flex items-center justify-center"
                    >
                      <CheckCircle className="w-[80px] h-[80px] text-[#34C759]" />
                    </motion.div>
                  )}
                </div>

                <h2 className="font-sans font-semibold text-[24px] text-white mb-4">
                  {authStatus === 'idle' ? 'Confirm with Biometric' : 'Authenticated'}
                </h2>

                {authStatus === 'idle' && (
                  <button className="font-sans font-medium text-[14px] text-[#8E8E93] hover:text-white hover:underline transition-colors mt-2">
                    Use PIN instead
                  </button>
                )}
              </motion.div>
            )}

            {/* STEP 4: Success Receipt */}
            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25 }}
                className="py-6 flex flex-col items-center justify-center text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.45, type: 'spring', bounce: 0.5 }}
                >
                  <CheckCircle className="w-[64px] h-[64px] text-[#34C759] drop-shadow-[0_0_12px_rgba(52,199,89,0.4)]" />
                </motion.div>

                <h2 className="font-sans font-semibold text-[24px] text-white mb-8 mt-6">
                  Credentials Shared Successfully
                </h2>

                {/* Receipt */}
                <div className="w-full bg-[#242438] border border-[#2A2A42] rounded-xl p-6 text-left mb-8">
                  <div className="grid grid-cols-2 gap-y-4 mb-5 pb-5 border-b border-[#2A2A42]">
                    <div>
                      <span className="font-sans font-medium text-[11px] text-[#8E8E93] uppercase tracking-[0.06em] mb-1 block">
                        Transaction ID
                      </span>
                      <span className="font-mono text-[12px] text-[#00D4FF]">0x8f2c...9e4a</span>
                    </div>
                    <div>
                      <span className="font-sans font-medium text-[11px] text-[#8E8E93] uppercase tracking-[0.06em] mb-1 block">
                        Timestamp
                      </span>
                      <span className="font-sans text-[13px] text-white">
                        {new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' })} UTC
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="font-sans font-medium text-[11px] text-[#8E8E93] uppercase tracking-[0.06em] mb-1 block">
                        Recipient DID
                      </span>
                      <span className="font-mono text-[12px] text-white break-all">
                        did:solidus:mainnet:acmecorp#key-1
                      </span>
                    </div>
                  </div>

                  <span className="font-sans font-medium text-[11px] text-[#8E8E93] uppercase tracking-[0.06em] mb-2 block">
                    Shared Credentials
                  </span>
                  <ul className="list-disc list-inside pl-4 space-y-1">
                    {selectedCreds.map((cred) => (
                      <li key={cred.id} className="font-sans text-[13px] text-white">
                        {credentialDisplayName(cred)}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col gap-3 w-full max-w-[240px]">
                  <Link
                    href="/dashboard"
                    className="h-11 flex items-center justify-center bg-[#0066FF] hover:bg-[#0055D4] rounded-lg font-sans font-semibold text-[14px] text-white transition-colors shadow-[0_2px_8px_rgba(0,102,255,0.3)]"
                  >
                    Done
                  </Link>
                  <button
                    onClick={() => {
                      setStep(1)
                      setSelectedCredIds(credentials.length > 0 && credentials[0] !== undefined ? [credentials[0].id] : [])
                      setAuthStatus('idle')
                    }}
                    className="h-11 flex items-center justify-center font-sans font-medium text-[14px] text-[#0066FF] hover:text-[#A1C4FF] transition-colors"
                  >
                    Share Again
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </>
  )
}
