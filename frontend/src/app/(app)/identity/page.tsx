'use client'

import { useState } from 'react'
import Link from 'next/link'
import QRCode from 'react-qr-code'
import { DashboardTopBar } from '@/components/app/DashboardTopBar'
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import {
  Copy,
  Check,
  ExternalLink,
  Mail,
  Link as LinkIcon,
  Unlink,
  Plus,
  Download,
  Maximize2,
  X,
} from 'lucide-react'
import { useAuth } from '../../../lib/auth'

function buildDidJson(did: string) {
  return `{
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://w3id.org/security/suites/ed25519-2020/v1"
  ],
  "id": "${did}",
  "verificationMethod": [
    {
      "id": "#key-1",
      "type": "Ed25519VerificationKey2020",
      "controller": "${did}",
      "publicKeyMultibase": "z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuRu8vH"
    },
    {
      "id": "#key-2",
      "type": "Bls12381G2Key2020",
      "controller": "${did}",
      "publicKeyMultibase": "zUC72Q7Vu4R...8eKp"
    }
  ],
  "authentication": ["#key-1"],
  "assertionMethod": ["#key-1", "#key-2"],
  "service": [
    {
      "id": "#vc",
      "type": "VerifiableCredentialService",
      "serviceEndpoint": "https://hub.solidus.network/vc"
    },
    {
      "id": "#hub",
      "type": "IdentityHubService",
      "serviceEndpoint": "https://hub.solidus.network/identity"
    }
  ]
}`
}

const LINKED_ACCOUNTS = [
  { id: '1', Icon: ExternalLink, iconColor: '#FFFFFF', name: 'GitHub', handle: '@alexchen', verified: true },
  { id: '2', Icon: ExternalLink, iconColor: '#1DA1F2', name: 'Twitter / X', handle: '@alexchen', verified: true },
  { id: '3', Icon: Mail, iconColor: '#EA4335', name: 'Email', handle: 'alex@example.com', verified: true },
  { id: '4', Icon: LinkIcon, iconColor: '#8E8E93', name: 'Google OAuth', handle: 'Not linked', verified: false },
]

const GUARDIANS = [
  { id: '1', name: 'Alice Chen', email: 'alice@email.com', initials: 'AC', status: 'Confirmed', lastActive: '2026-01-15', statusColor: 'green' as const },
  { id: '2', name: 'Bob Martinez', email: 'bob@email.com', initials: 'BM', status: 'Confirmed', lastActive: '2026-02-01', statusColor: 'green' as const },
  { id: '3', name: 'Carol Wright', email: 'carol@email.com', initials: 'CW', status: 'Confirmed', lastActive: '2026-01-28', statusColor: 'green' as const },
  { id: '4', name: 'David Kim', email: 'Invite pending', initials: 'DK', status: 'Pending', sentAgo: 'Sent 3 days ago', statusColor: 'orange' as const },
]

// ─── DIDDocumentViewer ────────────────────────────────────────────────────────

function DIDDocumentViewer({ did }: { did: string }) {
  const [activeTab, setActiveTab] = useState<'human' | 'json'>('human')
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(did)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-[#1A1A2E] rounded-lg p-6 flex flex-col mb-6 shadow-[0_2px_8px_rgba(0,0,0,0.32)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-sans font-semibold text-[22px] text-white">Your DID Document</h2>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[#8E8E93] hover:text-white transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-[#34C759]" /> : <Copy className="w-4 h-4" />}
          <span className="font-sans text-[13px]">{copied ? 'Copied' : 'Copy DID'}</span>
        </button>
      </div>

      {/* DID pill */}
      <div className="flex items-center justify-between bg-[#242438] rounded-md px-4 py-3 mb-6">
        <span className="font-mono font-medium text-[16px] text-white truncate mr-4">{did}</span>
        <button onClick={handleCopy} className="text-[#8E8E93] hover:text-white transition-colors shrink-0">
          {copied ? <Check className="w-5 h-5 text-[#34C759]" /> : <Copy className="w-5 h-5" />}
        </button>
      </div>

      {/* Sub-tabs */}
      <div className="flex border-b border-[#2A2A42] mb-6">
        {(['human', 'json'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'pb-3 px-4 font-sans text-[14px] font-medium border-b-2 transition-colors',
              activeTab === tab
                ? 'border-[#0066FF] text-white'
                : 'border-transparent text-[#8E8E93] hover:text-white'
            )}
          >
            {tab === 'human' ? 'Human Readable' : 'Raw JSON'}
          </button>
        ))}
      </div>

      {activeTab === 'human' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="block font-sans text-[11px] text-[#8E8E93] uppercase tracking-[0.06em] mb-1">
                Created
              </span>
              <span className="font-sans text-[14px] text-white">2026-01-15 UTC</span>
            </div>
            <div>
              <span className="block font-sans text-[11px] text-[#8E8E93] uppercase tracking-[0.06em] mb-1">
                Updated
              </span>
              <span className="font-sans text-[14px] text-white">2026-01-20 UTC</span>
            </div>
          </div>

          <div>
            <h4 className="font-sans font-semibold text-[14px] text-white mb-2">Verification Methods</h4>
            <div className="flex flex-col gap-2">
              <div className="bg-[#242438] rounded p-3 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-mono text-[13px] text-white">#key-1</span>
                  <span className="font-sans text-[12px] text-[#8E8E93]">Ed25519VerificationKey2020</span>
                </div>
                <span className="bg-[#34C759]/10 text-[#34C759] text-[11px] font-semibold px-2 py-0.5 rounded">
                  Active
                </span>
              </div>
              <div className="bg-[#242438] rounded p-3 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-mono text-[13px] text-white">#key-2</span>
                  <span className="font-sans text-[12px] text-[#8E8E93]">Bls12381G2Key2020 (ZK Proofs)</span>
                </div>
                <span className="bg-[#34C759]/10 text-[#34C759] text-[11px] font-semibold px-2 py-0.5 rounded">
                  Active
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-sans font-semibold text-[14px] text-white mb-2">Services</h4>
            <div className="flex flex-col gap-2">
              <div className="bg-[#242438] rounded p-3 flex flex-col gap-1">
                <span className="font-mono text-[13px] text-white">VerifiableCredentialService</span>
                <span className="font-sans text-[12px] text-[#8E8E93]">https://hub.solidus.network/vc</span>
              </div>
              <div className="bg-[#242438] rounded p-3 flex flex-col gap-1">
                <span className="font-mono text-[13px] text-white">IdentityHubService</span>
                <span className="font-sans text-[12px] text-[#8E8E93]">https://hub.solidus.network/identity</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'json' && (
        <div className="bg-[#242438] rounded-md p-4 overflow-x-auto animate-in fade-in duration-200">
          <pre className="font-mono text-[12px] text-[#A8E600] leading-relaxed">{buildDidJson(did)}</pre>
        </div>
      )}
    </div>
  )
}

// ─── LinkedAccounts ────────────────────────────────────────────────────────────

function LinkedAccounts() {
  return (
    <div className="bg-[#1A1A2E] rounded-lg p-6 flex flex-col mb-6 shadow-[0_2px_8px_rgba(0,0,0,0.32)]">
      <h3 className="font-sans font-semibold text-[18px] text-white mb-6">Linked Accounts</h3>
      <div className="flex flex-col gap-4 mb-6">
        {LINKED_ACCOUNTS.map((acct) => (
          <div
            key={acct.id}
            className="flex items-center justify-between p-3 bg-[#242438] rounded-lg border border-[#2A2A42]"
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-md bg-[#1A1A2E] border border-[#2A2A42] flex items-center justify-center shrink-0">
                <acct.Icon className="w-4 h-4" style={{ color: acct.iconColor }} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-sans font-normal text-[14px] text-white leading-tight">
                    {acct.name}
                  </span>
                  {acct.verified && (
                    <span className="bg-[#34C759]/10 text-[#34C759] text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider">
                      Verified
                    </span>
                  )}
                </div>
                <span className="font-sans font-normal text-[12px] text-[#8E8E93] leading-tight mt-0.5">
                  {acct.handle}
                </span>
              </div>
            </div>
            {acct.verified ? (
              <button
                className="p-2 text-[#48484F] hover:text-[#FF3B30] hover:bg-[#FF3B30]/10 rounded-md transition-colors"
                title="Unlink Account"
              >
                <Unlink className="w-4 h-4" />
              </button>
            ) : (
              <button className="h-8 px-4 rounded-md bg-[#0066FF]/10 font-sans font-medium text-[13px] text-[#0066FF] hover:bg-[#0066FF]/20 transition-colors">
                Link
              </button>
            )}
          </div>
        ))}
      </div>
      <button className="h-10 px-4 rounded-lg border border-[#0066FF] font-sans font-medium text-[14px] text-[#0066FF] hover:bg-[#0066FF]/10 transition-colors self-start">
        Link New Account
      </button>
    </div>
  )
}

// ─── GuardianManagementCard ────────────────────────────────────────────────────

type GuardianStatusColor = 'green' | 'orange'

interface GuardianEntry {
  id: string
  name: string
  email: string
  initials: string
  status: string
  statusColor: GuardianStatusColor
  lastActive?: string
  sentAgo?: string
}

function GuardianRow({ guardian }: { guardian: GuardianEntry }) {
  const isGreen = guardian.statusColor === 'green'

  return (
    <div className="h-[52px] border-b border-[#242438] flex items-center gap-[12px] px-1">
      <div className="w-[36px] h-[36px] rounded-full bg-[#242438] flex items-center justify-center shrink-0">
        <span className="font-sans font-semibold text-[12px] text-[#8E8E93]">{guardian.initials}</span>
      </div>
      <div className="flex flex-col gap-[2px] flex-1 min-w-0">
        <span className="font-sans font-medium text-[13px] text-white truncate">{guardian.name}</span>
        <span className="font-sans font-normal text-[11px] text-[#8E8E93] truncate">{guardian.email}</span>
      </div>
      <div className="flex flex-col items-end gap-[2px] shrink-0">
        {isGreen ? (
          <>
            <div className="bg-[#34C759]/[0.12] border border-[#34C759]/25 rounded-[10px] px-[10px] py-[3px]">
              <span className="font-sans font-semibold text-[11px] text-[#34C759]">{guardian.status}</span>
            </div>
            <span className="font-sans font-normal text-[10px] text-[#48484F]">
              Last: {guardian.lastActive ?? ''}
            </span>
          </>
        ) : (
          <>
            <div className="bg-[#FF9500]/[0.12] border border-[#FF9500]/25 rounded-[10px] px-[10px] py-[3px]">
              <span className="font-sans font-semibold text-[11px] text-[#FF9500]">{guardian.status}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-sans font-normal text-[10px] text-[#48484F]">
                {guardian.sentAgo ?? ''}
              </span>
              <button className="font-sans font-semibold text-[10px] text-[#0066FF] hover:underline">
                Resend →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function GuardianManagementCard() {
  return (
    <div className="bg-[#1A1A2E] rounded-[8px] px-6 py-5 shadow-[0_2px_8px_rgba(0,0,0,0.32)] mb-6 flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[10px]">
          <h3 className="font-sans font-semibold text-[16px] text-white">Guardian Recovery</h3>
          <div className="bg-[#34C759]/[0.12] border border-[#34C759]/25 rounded-[10px] px-[10px] py-[3px]">
            <span className="font-sans font-semibold text-[11px] text-[#34C759]">3 of 5 set up</span>
          </div>
        </div>
        <Link
          href="/settings/guardians"
          className="font-sans font-medium text-[12px] text-[#8E8E93] hover:text-white transition-colors"
        >
          Edit
        </Link>
      </div>

      <p className="font-sans font-normal text-[13px] text-[#8E8E93] mt-[10px] mb-[16px]">
        3 of 5 guardians must approve to restore your identity.
      </p>

      <div className="flex flex-col">
        {GUARDIANS.map((g) => (
          <GuardianRow key={g.id} guardian={g} />
        ))}
        {/* Empty slot — add guardian */}
        <div className="h-[52px] border-b border-[#242438] last:border-0 flex items-center gap-[12px] px-1 cursor-pointer group">
          <div className="w-[36px] h-[36px] rounded-full border-[1.5px] border-dashed border-[#2A2A42] flex items-center justify-center bg-transparent group-hover:border-[#0066FF] transition-colors">
            <Plus className="w-[14px] h-[14px] text-[#48484F] group-hover:text-[#0066FF] transition-colors" />
          </div>
          <div className="flex flex-col gap-[2px]">
            <span className="font-sans font-medium text-[13px] text-[#0066FF]">+ Add Guardian</span>
          </div>
        </div>
      </div>

      <div className="mt-[12px]">
        <a
          href="#"
          className="font-sans font-medium text-[12px] text-[#48484F] hover:text-[#8E8E93] transition-colors"
        >
          Learn about guardian recovery →
        </a>
      </div>
    </div>
  )
}

// ─── DIDExportCard ────────────────────────────────────────────────────────────

function DIDExportCard({ did, onOpenModal }: { did: string; onOpenModal: () => void }) {
  const profileUrl = `https://identity.solidus.network/profile/${did}`
  const didTruncated = did.length > 30 ? did.slice(0, 26) + '...' : did
  const [copiedDid, setCopiedDid] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  const handleCopyDid = () => {
    navigator.clipboard.writeText(did)
    setCopiedDid(true)
    setTimeout(() => setCopiedDid(false), 1500)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 1500)
  }

  const downloadQR = () => {
    const svg = document.querySelector('#qr-container svg') as SVGElement | null
    if (!svg) return
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = 'solidus-did-qr.png'
      link.href = pngFile
      link.click()
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  return (
    <div className="bg-[#1A1A2E] rounded-[8px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.32)] mb-6 flex items-center gap-6">
      {/* QR preview */}
      <div className="w-[220px] shrink-0 flex flex-col items-center">
        <div className="bg-[#242438] rounded-[8px] p-[12px] w-[196px]">
          <div id="qr-container" className="w-full aspect-square bg-[#242438]">
            <QRCode
              value={profileUrl}
              size={172}
              fgColor="#FFFFFF"
              bgColor="#242438"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>
        <span className="font-sans font-normal text-[11px] text-[#8E8E93] text-center mt-[8px]">
          QR code
        </span>
      </div>

      {/* Right content */}
      <div className="flex-1 flex flex-col justify-center">
        <h3 className="font-sans font-semibold text-[16px] text-white">Share Your DID</h3>
        <p className="font-sans font-normal text-[14px] text-[#8E8E93] mt-[8px]">
          Let others find and verify your public identity. Your DID is safe to share — it contains no personal data.
        </p>

        <div className="bg-[#242438] rounded-[6px] px-[12px] py-[8px] mt-[12px] flex items-center justify-between">
          <span className="font-mono text-[12px] text-white">{didTruncated}</span>
          <button
            onClick={handleCopyDid}
            className="text-[#8E8E93] hover:text-white transition-colors relative group"
          >
            {copiedDid ? <Check className="w-3 h-3 text-[#34C759]" /> : <Copy className="w-3 h-3" />}
            {copiedDid && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#48484F] text-white text-[10px] px-2 py-1 rounded">
                Copied!
              </div>
            )}
          </button>
        </div>

        <div className="flex items-center gap-[8px] mt-[12px]">
          <button
            onClick={downloadQR}
            className="h-[32px] bg-[#242438] border border-[#2A2A42] hover:border-white rounded-[6px] px-[12px] flex items-center gap-[6px] text-[#8E8E93] hover:text-white group transition-colors"
          >
            <Download className="w-3 h-3 text-[#8E8E93] group-hover:text-white transition-colors" />
            <span className="font-sans font-medium text-[12px]">Download QR</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="h-[32px] bg-[#242438] border border-[#2A2A42] hover:border-white rounded-[6px] px-[12px] flex items-center gap-[6px] text-[#8E8E93] hover:text-white group transition-colors relative"
          >
            {copiedLink ? (
              <Check className="w-3 h-3 text-[#34C759]" />
            ) : (
              <LinkIcon className="w-3 h-3 text-[#8E8E93] group-hover:text-white transition-colors" />
            )}
            <span className="font-sans font-medium text-[12px]">Copy Link</span>
            {copiedLink && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#48484F] text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
                Copied!
              </div>
            )}
          </button>

          <button
            onClick={onOpenModal}
            className="h-[32px] px-[8px] flex items-center gap-[6px] text-[#0066FF] hover:underline"
          >
            <Maximize2 className="w-3 h-3" />
            <span className="font-sans font-medium text-[12px]">Export DID</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── DIDQRModal ───────────────────────────────────────────────────────────────

function DIDQRModal({ did, open, onClose }: { did: string; open: boolean; onClose: () => void }) {
  const profileUrl = `https://identity.solidus.network/profile/${did}`
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(did)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handleSave = () => {
    const svg = document.querySelector('#modal-qr svg') as SVGElement | null
    if (!svg) return
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = 'solidus-did-qr.png'
      link.href = pngFile
      link.click()
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogPortal>
        <DialogOverlay className="bg-black/80 backdrop-blur-sm" />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          <div className="pointer-events-auto relative bg-[#1A1A2E] rounded-2xl p-8 max-w-[480px] w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-200 shadow-[0_16px_48px_rgba(0,0,0,0.6)]">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 bg-[#242438] rounded-full flex items-center justify-center text-[#8E8E93] hover:text-white hover:bg-[#2A2A42] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="font-sans font-semibold text-[24px] text-white mb-2">Your DID Profile</h2>
            <p className="font-sans font-normal text-[14px] text-[#8E8E93] text-center mb-8">
              Scan to view DID document and linked credentials
            </p>

            <div className="bg-white p-4 rounded-xl mb-8" id="modal-qr">
              <QRCode value={profileUrl} size={240} fgColor="#000000" bgColor="#FFFFFF" />
            </div>

            <div className="w-full bg-[#242438] rounded-lg p-4 flex flex-col gap-3">
              <span className="font-mono text-[13px] text-white text-center break-all">{did}</span>
              <div className="h-px w-full bg-[#2A2A42]" />
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={handleCopy}
                  className="flex flex-col items-center gap-2 text-[#8E8E93] hover:text-white transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#1A1A2E] flex items-center justify-center group-hover:bg-[#0066FF] transition-colors">
                    {copied ? <Check className="w-4 h-4 text-[#34C759]" /> : <Copy className="w-4 h-4" />}
                  </div>
                  <span className="font-sans text-[11px] font-medium">Copy</span>
                </button>
                <button
                  onClick={handleSave}
                  className="flex flex-col items-center gap-2 text-[#8E8E93] hover:text-white transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#1A1A2E] flex items-center justify-center group-hover:bg-[#0066FF] transition-colors">
                    <Download className="w-4 h-4" />
                  </div>
                  <span className="font-sans text-[11px] font-medium">Save</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogPortal>
    </Dialog>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function IdentityPage() {
  const { user } = useAuth()
  const did = user?.did ?? ''
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <DashboardTopBar title="Identity" />
      <main className="flex-1 p-6 md:p-8">
        <div className="max-w-[1000px] mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-sans font-semibold text-[28px] text-white">Identity</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left column */}
            <div className="lg:col-span-7 flex flex-col">
              <DIDDocumentViewer did={did} />
              <LinkedAccounts />
            </div>

            {/* Right column */}
            <div className="lg:col-span-5 flex flex-col">
              <GuardianManagementCard />
              <DIDExportCard did={did} onOpenModal={() => setModalOpen(true)} />
            </div>
          </div>
        </div>
      </main>

      <DIDQRModal did={did} open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
