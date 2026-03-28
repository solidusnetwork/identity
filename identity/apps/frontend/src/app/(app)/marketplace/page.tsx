'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Search, SlidersHorizontal, ShieldCheck, Award, Clock, Star,
  ChevronRight, Copy, X, Briefcase, Shield, Building2, User,
  GraduationCap, CreditCard, HeartHandshake, Link as LinkIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// --- TYPES ---

type Category =
  | 'All Categories'
  | 'Government'
  | 'Finance'
  | 'Healthcare'
  | 'Education'
  | 'Employment'
  | 'Social'

interface CredentialType {
  id: string
  name: string
  icon: React.ElementType
  color: string
  turnaround: string
}

interface Review {
  id: string
  author: string
  initials: string
  rating: number
  text: string
}

interface Issuer {
  id: string
  name: string
  logo: React.ElementType
  logoColor: string
  isVerified: boolean
  category: Exclude<Category, 'All Categories'>
  turnaroundTime: 'Instant' | '1-3 days' | '1-5 days' | 'Manual review'
  description: string
  did: string
  credentialTypes: CredentialType[]
  rating: number
  reviews: Review[]
}

// --- MOCK DATA ---

const CATEGORIES: Category[] = [
  'All Categories',
  'Government',
  'Finance',
  'Healthcare',
  'Education',
  'Employment',
  'Social',
]

const MOCK_ISSUERS: Issuer[] = [
  {
    id: 'iss_1',
    name: 'Solidus Verify',
    logo: Shield,
    logoColor: '#0066FF',
    isVerified: true,
    category: 'Government',
    turnaroundTime: 'Instant',
    description:
      'The native identity verification service for the Solidus network. Instant, zero-knowledge proofs for KYC and more.',
    did: 'did:solidus:mainnet:v1x9...a7f2',
    rating: 4.9,
    credentialTypes: [
      { id: 'ct_1', name: 'KYC Verification', icon: ShieldCheck, color: '#0066FF', turnaround: 'Instant' },
      { id: 'ct_2', name: 'Proof of Address', icon: Building2, color: '#FF9500', turnaround: 'Instant' },
      { id: 'ct_3', name: 'Verified Phone', icon: LinkIcon, color: '#34C759', turnaround: 'Instant' },
    ],
    reviews: [
      { id: 'r1', author: 'Alex C.', initials: 'AC', rating: 5, text: 'Instant verification, seamless integration with my wallet.' },
      { id: 'r2', author: 'Sarah J.', initials: 'SJ', rating: 5, text: 'The standard for web3 identity. Perfect experience.' },
    ],
  },
  {
    id: 'iss_2',
    name: 'Stanford University',
    logo: GraduationCap,
    logoColor: '#8C1515',
    isVerified: true,
    category: 'Education',
    turnaroundTime: '1-3 days',
    description:
      'Official issuer for Stanford University degrees, certificates, and academic transcripts.',
    did: 'did:solidus:mainnet:s4u8...k9p1',
    rating: 4.8,
    credentialTypes: [
      { id: 'ct_4', name: 'BSc Degree', icon: Award, color: '#8C1515', turnaround: '1-3 days' },
      { id: 'ct_5', name: 'MSc Degree', icon: Award, color: '#8C1515', turnaround: '1-3 days' },
      { id: 'ct_6', name: 'Academic Transcript', icon: Briefcase, color: '#48484F', turnaround: '24 hours' },
    ],
    reviews: [
      { id: 'r3', author: 'Michael T.', initials: 'MT', rating: 5, text: 'Got my alumni credentials easily. Verified by the registrar.' },
      { id: 'r4', author: 'Elena R.', initials: 'ER', rating: 4, text: 'Took about 2 days to verify my 2018 degree. Works great.' },
    ],
  },
  {
    id: 'iss_3',
    name: 'LinkedIn',
    logo: User,
    logoColor: '#0A66C2',
    isVerified: true,
    category: 'Employment',
    turnaroundTime: 'Instant',
    description:
      'Verify your professional profile, employment history, and skills directly from LinkedIn.',
    did: 'did:solidus:mainnet:l9k2...m4n5',
    rating: 4.7,
    credentialTypes: [
      { id: 'ct_7', name: 'Professional Profile', icon: User, color: '#0A66C2', turnaround: 'Instant' },
      { id: 'ct_8', name: 'Current Employment', icon: Building2, color: '#0A66C2', turnaround: 'Instant' },
    ],
    reviews: [
      { id: 'r5', author: 'David W.', initials: 'DW', rating: 5, text: "Great way to prove my job without sharing my whole profile." },
      { id: 'r6', author: 'Jessica K.', initials: 'JK', rating: 4, text: 'OAuth flow was quick and easy.' },
    ],
  },
  {
    id: 'iss_4',
    name: 'AICPA',
    logo: Briefcase,
    logoColor: '#FF9500',
    isVerified: true,
    category: 'Employment',
    turnaroundTime: 'Manual review',
    description:
      'American Institute of CPAs. Official issuer for CPA licenses and accounting credentials.',
    did: 'did:solidus:mainnet:a2c4...p7a9',
    rating: 4.5,
    credentialTypes: [
      { id: 'ct_9', name: 'CPA License', icon: Award, color: '#FF9500', turnaround: '3-5 days' },
      { id: 'ct_10', name: 'Good Standing Cert', icon: ShieldCheck, color: '#34C759', turnaround: '1-2 days' },
    ],
    reviews: [
      { id: 'r7', author: 'Robert M.', initials: 'RM', rating: 5, text: 'Manual review took a few days, but now I have my CPA on-chain.' },
      { id: 'r8', author: 'Linda S.', initials: 'LS', rating: 4, text: 'Support was helpful during the verification process.' },
    ],
  },
  {
    id: 'iss_5',
    name: 'SecuritiesVerify',
    logo: CreditCard,
    logoColor: '#00D4FF',
    isVerified: true,
    category: 'Finance',
    turnaroundTime: '1-5 days',
    description:
      'SEC-compliant verification for Accredited Investor, Qualified Purchaser, and other financial statuses.',
    did: 'did:solidus:mainnet:s8v1...e9r4',
    rating: 4.6,
    credentialTypes: [
      { id: 'ct_11', name: 'Accredited Investor', icon: Shield, color: '#00D4FF', turnaround: '1-3 days' },
      { id: 'ct_12', name: 'Qualified Purchaser', icon: Shield, color: '#00D4FF', turnaround: '3-5 days' },
    ],
    reviews: [
      { id: 'r9', author: 'Thomas B.', initials: 'TB', rating: 5, text: 'Essential for accessing private markets on Solidus.' },
      { id: 'r10', author: 'Anna P.', initials: 'AP', rating: 4, text: 'Had to upload some tax docs, but approval was faster than expected.' },
    ],
  },
  {
    id: 'iss_6',
    name: 'GitHub',
    logo: LinkIcon,
    logoColor: '#6E7681',
    isVerified: true,
    category: 'Social',
    turnaroundTime: 'Instant',
    description:
      'Prove ownership of your GitHub account, repositories, and open source contributions.',
    did: 'did:solidus:mainnet:g4h7...b2u1',
    rating: 4.9,
    credentialTypes: [
      { id: 'ct_13', name: 'Account Ownership', icon: User, color: '#6E7681', turnaround: 'Instant' },
      { id: 'ct_14', name: 'Top Contributor', icon: Star, color: '#FF9500', turnaround: 'Instant' },
    ],
    reviews: [
      { id: 'r11', author: 'Chris L.', initials: 'CL', rating: 5, text: 'Perfect for dev grants and hackathons.' },
      { id: 'r12', author: 'Sam R.', initials: 'SR', rating: 5, text: 'Instant verification via OAuth.' },
    ],
  },
  {
    id: 'iss_7',
    name: 'HealthBridge',
    logo: HeartHandshake,
    logoColor: '#FF3B30',
    isVerified: true,
    category: 'Healthcare',
    turnaroundTime: '1-3 days',
    description:
      'HIPAA-compliant health credential issuer. Verify vaccination records, insurance, and medical clearances.',
    did: 'did:solidus:mainnet:h9b3...c5f0',
    rating: 4.7,
    credentialTypes: [
      { id: 'ct_15', name: 'Vaccination Record', icon: ShieldCheck, color: '#34C759', turnaround: '1-2 days' },
      { id: 'ct_16', name: 'Insurance Status', icon: CreditCard, color: '#00D4FF', turnaround: '1-3 days' },
    ],
    reviews: [
      { id: 'r13', author: 'Maria L.', initials: 'ML', rating: 5, text: 'Got my vaccine credential verified for travel. Smooth process.' },
      { id: 'r14', author: 'James D.', initials: 'JD', rating: 4, text: 'Uploaded my insurance card, approved next day.' },
    ],
  },
]

// --- ISSUER CARD ---

function IssuerCard({ issuer, onClick }: { issuer: Issuer; onClick: () => void }) {
  const Logo = issuer.logo

  return (
    <div
      onClick={onClick}
      className="bg-[#1A1A2E] rounded-[8px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.32)] border border-transparent hover:border-[#2A2A42] cursor-pointer transition-all group flex flex-col h-full"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-[8px] flex items-center justify-center bg-[#242438]">
          <Logo className="w-6 h-6" style={{ color: issuer.logoColor }} />
        </div>

        {issuer.isVerified && (
          <div className="bg-[#34C759]/10 border border-[#34C759]/25 rounded-full px-2.5 py-1 flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-[#34C759]" />
            <span className="text-[10px] font-semibold text-[#34C759] uppercase tracking-wider">Verified</span>
          </div>
        )}
      </div>

      <h3 className="text-[16px] font-semibold text-white mb-1 group-hover:text-[#0066FF] transition-colors">
        {issuer.name}
      </h3>

      <p className="text-[12px] text-[#8E8E93] mb-3 line-clamp-2 leading-relaxed flex-1">
        {issuer.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-auto">
        {issuer.credentialTypes.slice(0, 3).map((type) => (
          <div
            key={type.id}
            className="px-2 py-1 rounded-[20px] bg-[#242438] text-[11px] font-medium border border-[#2A2A42]"
            style={{ color: type.color }}
          >
            {type.name}
          </div>
        ))}
        {issuer.credentialTypes.length > 3 && (
          <div className="px-2 py-1 rounded-[20px] bg-[#242438] text-[11px] font-medium text-[#8E8E93] border border-[#2A2A42]">
            +{issuer.credentialTypes.length - 3}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#2A2A42]">
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-[#48484F] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {issuer.turnaroundTime}
          </span>
          <span className="text-[11px] text-[#48484F] flex items-center gap-1">
            <Star className="w-3 h-3 text-[#A8E600]" fill="#A8E600" />
            {issuer.rating}
          </span>
        </div>
        <span className="text-[13px] font-medium text-[#0066FF] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          Get Credential <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  )
}

// --- ISSUER DETAIL DRAWER ---

function IssuerDetailDrawer({ issuer, onClose }: { issuer: Issuer; onClose: () => void }) {
  const Logo = issuer.logo
  const [copiedDid, setCopiedDid] = useState(false)

  const handleCopyDid = () => {
    navigator.clipboard.writeText(issuer.did).catch(() => {})
    setCopiedDid(true)
    setTimeout(() => setCopiedDid(false), 1500)
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#0A1628]/40 backdrop-blur-sm z-40"
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 w-full max-w-[480px] h-full bg-[#1A1A2E] border-l border-[#2A2A42] z-50 flex flex-col shadow-2xl"
      >
        {/* Drawer Header */}
        <div className="h-[64px] px-6 border-b border-[#2A2A42] flex items-center justify-between shrink-0 sticky top-0 bg-[#1A1A2E] z-10">
          <button
            onClick={onClose}
            className="w-9 h-9 bg-[#242438] rounded-[8px] flex items-center justify-center text-[#8E8E93] hover:text-white hover:bg-[#2A2A42] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <h3 className="text-[16px] font-semibold text-white">Issuer Details</h3>

          {issuer.isVerified ? (
            <div className="bg-[#34C759]/10 border border-[#34C759]/25 rounded-[10px] px-2.5 py-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#34C759]" />
              <span className="text-[11px] font-semibold text-[#34C759]">Verified</span>
            </div>
          ) : (
            <div className="w-[88px]" />
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">

          {/* Issuer Profile */}
          <div className="p-5 px-6 border-b border-[#2A2A42]">
            <div className="w-14 h-14 rounded-full bg-[#242438] flex items-center justify-center mb-3">
              <Logo className="w-7 h-7" style={{ color: issuer.logoColor }} />
            </div>

            <h2 className="text-[18px] font-semibold text-white">{issuer.name}</h2>

            <div
              onClick={handleCopyDid}
              className="flex items-center gap-1.5 mt-1 cursor-pointer group w-fit"
            >
              <span className="font-mono text-[11px] text-[#8E8E93]">
                {issuer.did.length > 40 ? `${issuer.did.slice(0, 40)}...` : issuer.did}
              </span>
              {copiedDid
                ? <span className="text-[11px] text-[#34C759]">✓</span>
                : <Copy className="w-3 h-3 text-[#8E8E93] group-hover:text-white transition-colors" />
              }
            </div>

            <p className="text-[13px] text-[#8E8E93] mt-2 leading-relaxed">{issuer.description}</p>

            <div className="flex items-center gap-2 mt-4">
              <div className="bg-[#242438] rounded-[6px] p-[10px_14px] flex flex-col gap-1 items-center justify-center flex-1">
                <Award className="w-3.5 h-3.5 text-[#0066FF]" />
                <span className="text-[11px] font-medium text-white">{issuer.credentialTypes.length} types</span>
              </div>
              <div className="bg-[#242438] rounded-[6px] p-[10px_14px] flex flex-col gap-1 items-center justify-center flex-1">
                <Clock className="w-3.5 h-3.5 text-[#FF9500]" />
                <span className="text-[11px] font-medium text-white whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">
                  {issuer.turnaroundTime}
                </span>
              </div>
              <div className="bg-[#242438] rounded-[6px] p-[10px_14px] flex flex-col gap-1 items-center justify-center flex-1">
                <Star className="w-3.5 h-3.5 text-[#A8E600]" />
                <span className="text-[11px] font-medium text-white">{issuer.rating} / 5</span>
              </div>
            </div>
          </div>

          {/* Credential Types */}
          <div className="p-5 px-6 border-b border-[#2A2A42]">
            <h4 className="text-[11px] font-semibold text-[#8E8E93] tracking-[0.08em] uppercase mb-2">
              Available Credentials
            </h4>
            <div className="flex flex-col">
              {issuer.credentialTypes.map((type) => {
                const TypeIcon = type.icon
                return (
                  <div
                    key={type.id}
                    className="h-12 border-b border-[#2A2A42] last:border-0 flex items-center gap-3 cursor-pointer group hover:bg-[#242438] -mx-4 px-4 transition-colors"
                  >
                    <TypeIcon className="w-5 h-5 shrink-0" style={{ color: type.color }} />
                    <span className="text-[14px] font-medium text-white flex-1">{type.name}</span>
                    <span className="text-[11px] text-[#48484F] mr-1">{type.turnaround}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#48484F] group-hover:text-white transition-colors" />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Reviews */}
          <div className="p-5 px-6 border-b border-[#2A2A42]">
            <h4 className="text-[11px] font-semibold text-[#8E8E93] tracking-[0.08em] uppercase mb-4">
              Recent Reviews
            </h4>
            <div className="flex flex-col">
              {issuer.reviews.map((review) => (
                <div key={review.id} className="flex gap-2.5 py-2.5 border-b border-[#242438] last:border-0">
                  <div className="w-8 h-8 rounded-full bg-[#242438] flex items-center justify-center shrink-0">
                    <span className="text-[11px] font-medium text-white">{review.initials}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12px] font-medium text-white mb-0.5">{review.author}</span>
                    <div className="flex items-center gap-0.5 mb-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="w-[11px] h-[11px]"
                          fill={star <= review.rating ? '#A8E600' : 'transparent'}
                          color={star <= review.rating ? '#A8E600' : '#48484F'}
                        />
                      ))}
                    </div>
                    <p className="text-[13px] text-[#8E8E93] line-clamp-2 leading-snug">
                      &ldquo;{review.text}&rdquo;
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button className="text-[12px] font-medium text-[#0066FF] mt-4 hover:underline">
              See all reviews &rarr;
            </button>
          </div>

          {/* Bottom Padding for Sticky CTA */}
          <div className="h-[120px]" />
        </div>

        {/* Sticky CTA Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-5 px-6 bg-[#1A1A2E] shadow-[0_-4px_16px_rgba(0,0,0,0.24)] border-t border-[#2A2A42]">
          <button className="w-full h-10 bg-[#0066FF] hover:bg-[#0052CC] text-white text-[14px] font-semibold rounded-[8px] transition-all hover:shadow-[0_0_16px_rgba(0,102,255,0.30)]">
            Request Credential
          </button>
          <p className="text-[12px] text-[#8E8E93] text-center mt-2">
            You&apos;ll be taken through the issuer&apos;s verification process. Typically completes in{' '}
            {issuer.turnaroundTime.toLowerCase()}.
          </p>
        </div>
      </motion.div>
    </>
  )
}

// --- PAGE ---

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<Category>('All Categories')
  const [selectedIssuer, setSelectedIssuer] = useState<Issuer | null>(null)

  const filteredIssuers = MOCK_ISSUERS.filter((issuer) => {
    const matchesSearch =
      issuer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issuer.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      activeCategory === 'All Categories' || issuer.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-[#0A1628] w-full flex flex-col font-sans text-white">
      {/* Sticky Page Header */}
      <header className="px-8 pt-6 pb-4 border-b border-[#1A1A2E] sticky top-[64px] bg-[#0A1628]/90 backdrop-blur-md z-10">
        <div className="max-w-[1080px] mx-auto flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-[22px] font-semibold text-white">Credential Marketplace</h2>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#8E8E93] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search issuers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[280px] h-[36px] bg-[#1A1A2E] border border-[#2A2A42] rounded-[8px] pl-9 pr-3 text-[13px] text-white placeholder:text-[#8E8E93] focus:outline-none focus:border-[#0066FF] transition-colors"
              />
            </div>

            <button className="h-[36px] px-3 bg-[#1A1A2E] border border-[#2A2A42] rounded-[8px] flex items-center gap-2 hover:bg-[#2A2A42] transition-colors">
              <SlidersHorizontal className="w-4 h-4 text-[#8E8E93]" />
              <span className="text-[13px] font-medium text-white">Filters</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content — offset below both the app top bar (64px) and the sticky marketplace header (~80px) */}
      <main className="flex-1 px-6 md:px-8 pb-8 pt-6">
        <div className="max-w-[1080px] mx-auto">

          {/* Category Pills */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  'px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors',
                  activeCategory === category
                    ? 'bg-white text-[#1A1A2E]'
                    : 'bg-[#1A1A2E] text-[#8E8E93] hover:text-white hover:bg-[#2A2A42]'
                )}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Grid or Empty State */}
          {filteredIssuers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredIssuers.map((issuer) => (
                <IssuerCard
                  key={issuer.id}
                  issuer={issuer}
                  onClick={() => setSelectedIssuer(issuer)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search className="w-12 h-12 text-[#8E8E93] mb-4" />
              <h3 className="text-[16px] font-semibold text-white mb-2">No issuers found</h3>
              <p className="text-[13px] text-[#8E8E93]">Try a different search or browse all categories.</p>
            </div>
          )}

        </div>
      </main>

      {/* Issuer Detail Drawer */}
      <AnimatePresence>
        {selectedIssuer && (
          <IssuerDetailDrawer
            issuer={selectedIssuer}
            onClose={() => setSelectedIssuer(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
