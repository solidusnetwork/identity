'use client'

import { useEffect, useState } from 'react'
import { Fingerprint, Briefcase, Users, TrendingUp, CheckCircle2, XCircle, MinusCircle, Grid, Zap, Sliders } from 'lucide-react'

// ─── Hero Trust Score ──────────────────────────────────────────────────────────
function HeroTrustScore() {
  const [fillPercentage, setFillPercentage] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setFillPercentage(73), 100)
    return () => clearTimeout(timer)
  }, [])

  const radius = 140
  const circumference = 2 * Math.PI * radius
  const arcLength = circumference * (240 / 360)
  const strokeDashoffset = arcLength - arcLength * (fillPercentage / 100)

  return (
    <section className="w-full bg-white py-[96px] pt-[120px] px-6 flex justify-center">
      <div className="w-full max-w-[1200px] flex flex-col md:flex-row items-center gap-[56px]">
        <div className="w-full md:w-[52%] flex flex-col items-start">
          <div className="bg-[#0066FF]/[0.08] border border-[#0066FF]/20 rounded px-1.5 py-0.5 mb-4">
            <span className="font-sans font-semibold text-[11px] text-[#0066FF] tracking-wide uppercase">PRIVACY-PRESERVING REPUTATION</span>
          </div>
          <h1 className="font-sans font-bold text-[48px] lg:text-[64px] leading-[1.1] text-[#0A1628] mb-6">
            Your Trust Score.<br />
            <span className="text-[#0066FF]">Built by you.</span>
          </h1>
          <p className="font-sans font-normal text-[18px] lg:text-[20px] leading-[1.6] text-[#666666] max-w-[480px] mb-10">
            A privacy-preserving composite of the credentials you hold — not a surveillance metric. No authority assigns it. You earn it by building your identity.
          </p>
          <div className="flex items-center gap-4">
            <button className="h-[48px] bg-[#0066FF] hover:bg-[#0055D4] text-white px-5 rounded-lg font-sans font-semibold text-[18px] transition-colors flex items-center shadow-[0_4px_12px_rgba(0,102,255,0.3)] hover:-translate-y-px">
              Build My Score
            </button>
            <button className="font-sans font-medium text-[14px] text-[#666666] hover:text-[#0A1628] transition-colors">
              Learn how it works ↓
            </button>
          </div>
        </div>

        <div className="w-full md:w-[48%] flex justify-center md:justify-end">
          <div className="relative w-[320px] h-[320px] rounded-full bg-[#F2F2F7] shadow-[0_8px_32px_rgba(0,0,0,0.10)] flex flex-col items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-[210deg]" viewBox="0 0 320 320">
              <defs>
                <linearGradient id="heroScoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00D4FF" />
                  <stop offset="100%" stopColor="#A8E600" />
                </linearGradient>
              </defs>
              <circle cx="160" cy="160" r={radius} fill="none" stroke="#E0E0E5" strokeWidth="20" strokeLinecap="round" strokeDasharray={`${arcLength} ${circumference}`} />
              <circle cx="160" cy="160" r={radius} fill="none" stroke="url(#heroScoreGradient)" strokeWidth="20" strokeLinecap="round" strokeDasharray={`${arcLength} ${circumference}`} strokeDashoffset={strokeDashoffset} className="transition-all duration-[1200ms] ease-out" />
            </svg>
            <div className="relative z-10 flex flex-col items-center mt-8">
              <div className="font-sans font-bold text-[72px] text-[#0A1628] leading-none">{fillPercentage}</div>
              <div className="font-sans font-normal text-[14px] text-[#666666] mt-1">/100</div>
              <div className="font-sans font-semibold text-[13px] text-[#34C759] mt-3 bg-[#34C759]/10 px-3 py-1 rounded-full">High Confidence</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Score Breakdown ───────────────────────────────────────────────────────────
const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const categories = [
  { id: 'identity', name: 'Identity', icon: Fingerprint, accentColor: '#00D4FF', maxPts: 40, currentPts: 40, statusText: 'KYC Level 2 = 35 pts · Email = 5 pts', improveText: 'Already maxed — maintain active credentials.' },
  { id: 'professional', name: 'Professional', icon: Briefcase, accentColor: '#FF9500', maxPts: 25, currentPts: 18, statusText: 'Job Board profile linked', improveText: 'Add a Professional License credential (+7 pts).' },
  { id: 'social', name: 'Social', icon: Users, accentColor: '#FF6B6B', maxPts: 20, currentPts: 14, statusText: 'GitHub + Twitter/X linked', improveText: 'Link your LinkedIn account (+6 pts).' },
  { id: 'financial', name: 'Financial', icon: TrendingUp, accentColor: '#C084FC', maxPts: 15, currentPts: 6, statusText: 'Bank account not yet verified', improveText: 'Get a Financial Accreditation credential (+9 pts).' }
]

function ScoreBreakdown() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="w-full bg-[#F2F2F7] py-[96px] px-6 flex flex-col items-center">
      <div className="w-full max-w-[1200px] flex flex-col items-center">
        <div className="flex flex-col items-center text-center">
          <span className="font-sans font-semibold text-[11px] text-[#0066FF] tracking-wide mb-3">HOW YOUR SCORE IS CALCULATED</span>
          <h2 className="font-sans font-bold text-[32px] md:text-[40px] text-[#0A1628] mb-4">Four categories. One composite.</h2>
          <p className="font-sans font-normal text-[16px] md:text-[18px] text-[#666666] max-w-[560px] mb-[56px] leading-[1.6]">
            Your Trust Score reflects the depth and diversity of your verified identity — not personal data.
          </p>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const progressPercent = isLoaded ? (cat.currentPts / cat.maxPts) * 100 : 0
            return (
              <div key={cat.id} className="bg-white rounded-xl border border-[#E0E0E5] p-[28px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex flex-col">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-5" style={{ backgroundColor: hexToRgba(cat.accentColor, 0.1) }}>
                  <cat.icon className="w-5 h-5" style={{ color: cat.accentColor }} />
                </div>
                <h3 className="font-sans font-semibold text-[16px] text-[#0A1628] mb-4">{cat.name}</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-sans font-normal text-[12px] text-[#666666]">Max {cat.maxPts}</span>
                  <span className="font-sans font-bold text-[12px] text-[#0A1628]">{cat.maxPts} pts</span>
                </div>
                <div className="w-full h-2 bg-[#F2F2F7] rounded-full overflow-hidden mb-2">
                  <div className="h-full rounded-full transition-all duration-[800ms] ease-out" style={{ backgroundColor: cat.accentColor, width: `${progressPercent}%` }} />
                </div>
                <div className="font-sans font-bold text-[12px] mb-6">
                  <span style={{ color: cat.accentColor }}>{cat.currentPts}</span>
                  <span className="font-normal text-[#666666]"> / {cat.maxPts}</span>
                </div>
                <div className="mt-auto flex flex-col gap-1">
                  <span className="font-sans font-medium text-[11px] text-[#666666]">How to improve:</span>
                  <span className="font-sans font-normal text-[11px] text-[#666666] leading-[1.4]">{cat.improveText}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Why It Matters ────────────────────────────────────────────────────────────
const values = [
  { icon: Grid, title: 'Unlock more apps', desc: 'Many apps and services set a minimum Trust Score for access, reducing fraud without requiring invasive identity checks.' },
  { icon: Zap, title: 'Reduce friction', desc: 'Higher scores mean fewer re-verifications. Apps that trust your score skip redundant checks entirely.' },
  { icon: Sliders, title: 'You set the pace', desc: 'No central authority assigns your score. You earn it incrementally by collecting credentials that matter to you.' }
]

function WhyItMatters() {
  return (
    <section className="w-full bg-white py-[96px] px-6 flex flex-col items-center">
      <div className="w-full max-w-[1200px] flex flex-col items-center">
        <h2 className="font-sans font-bold text-[32px] md:text-[40px] text-[#0A1628] mb-[56px] text-center">Why your Trust Score matters</h2>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((v, i) => (
            <div key={i} className="bg-[#F2F2F7] rounded-xl border border-[#E0E0E5] p-[32px] flex flex-col items-start">
              <div className="w-12 h-12 rounded-full bg-[#0066FF]/[0.08] flex items-center justify-center mb-5">
                <v.icon className="w-6 h-6 text-[#0066FF]" />
              </div>
              <h3 className="font-sans font-semibold text-[20px] text-[#0A1628] mt-1 mb-2.5">{v.title}</h3>
              <p className="font-sans font-normal text-[15px] text-[#666666] leading-[1.65]">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Score vs Competitors ──────────────────────────────────────────────────────
function FullCheck({ text }: { text?: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <CheckCircle2 className="w-4 h-4 text-[#34C759]" />
      {text && <span className="font-sans font-medium text-[11px] text-[#34C759] hidden sm:block">{text}</span>}
    </div>
  )
}

function Cross({ text }: { text?: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <XCircle className="w-4 h-4 text-[#FF3B30]" />
      {text && <span className="font-sans font-medium text-[11px] text-[#FF3B30] hidden sm:block">{text}</span>}
    </div>
  )
}

function Partial({ text }: { text?: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <MinusCircle className="w-4 h-4 text-[#FF9500]" />
      {text && <span className="font-sans font-medium text-[11px] text-[#FF9500] hidden sm:block">Partial</span>}
    </div>
  )
}

function CompRow({ feature, solidus, gitcoin, worldcoin, isLast = false }: { feature: string; solidus: React.ReactNode; gitcoin: React.ReactNode; worldcoin: React.ReactNode; isLast?: boolean }) {
  return (
    <div className={`flex items-center h-[52px] px-6 ${isLast ? '' : 'border-b border-[#E0E0E5]'}`}>
      <div className="w-[40%] font-sans font-medium text-[14px] text-[#0A1628]">{feature}</div>
      <div className="w-[20%] flex justify-center">{solidus}</div>
      <div className="w-[20%] flex justify-center">{gitcoin}</div>
      <div className="w-[20%] flex justify-center">{worldcoin}</div>
    </div>
  )
}

function ScoreVsCompetitors() {
  return (
    <section className="w-full bg-[#F8F8FB] py-[96px] px-6 flex flex-col items-center">
      <div className="w-full max-w-[1000px] flex flex-col items-center">
        <h2 className="font-sans font-bold text-[32px] md:text-[36px] text-[#0A1628] mb-4 text-center">How we compare</h2>
        <p className="font-sans font-normal text-[16px] text-[#666666] max-w-[480px] mb-[48px] text-center leading-[1.6]">
          Trust Score is not the first reputation system — but it is the most privacy-respecting.
        </p>

        <div className="w-full bg-white rounded-xl border border-[#E0E0E5] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <div className="overflow-x-auto">
            <div className="min-w-[700px]">
              <div className="flex items-center h-[48px] bg-[#F2F2F7] border-b border-[#E0E0E5] px-6">
                <div className="w-[40%] font-sans font-semibold text-[12px] text-[#0A1628]">Feature</div>
                <div className="w-[20%] font-sans font-semibold text-[12px] text-[#0A1628] text-center">Solidus Trust Score</div>
                <div className="w-[20%] font-sans font-semibold text-[12px] text-[#0A1628] text-center">Gitcoin Passport</div>
                <div className="w-[20%] font-sans font-semibold text-[12px] text-[#0A1628] text-center">Worldcoin ID</div>
              </div>
              <div className="flex flex-col">
                <CompRow feature="Privacy model" solidus={<FullCheck text="ZK per-field" />} gitcoin={<Partial text="Hashed on-chain" />} worldcoin={<Cross text="Iris biometric" />} />
                <CompRow feature="Credential variety" solidus={<FullCheck text="7 types" />} gitcoin={<Partial text="Mostly on-chain" />} worldcoin={<Cross text="Single iris" />} />
                <CompRow feature="ZK proofs" solidus={<FullCheck text="BBS+ per-field" />} gitcoin={<Cross text="None" />} worldcoin={<Partial text="ZK-SNARK limited" />} />
                <CompRow feature="No crypto required" solidus={<FullCheck text="Yes" />} gitcoin={<Cross text="Requires wallet" />} worldcoin={<Cross text="Requires Orb" />} isLast />
              </div>
            </div>
          </div>
          <div className="h-[44px] bg-[#F2F2F7] flex items-center justify-center border-t border-[#E0E0E5]">
            <div className="flex items-center gap-1.5 font-sans font-semibold text-[13px] text-[#34C759]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Solidus wins 3 of 4</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── CTA Band ──────────────────────────────────────────────────────────────────
function CTABand() {
  return (
    <section className="w-full bg-[#0A1628] py-[80px] px-6 flex justify-center">
      <div className="w-full max-w-[1200px] flex flex-col items-center text-center">
        <h2 className="font-sans font-bold text-[32px] md:text-[40px] text-white max-w-[560px] leading-[1.2]">
          Start building your Trust Score today.
        </h2>
        <p className="font-sans font-normal text-[16px] text-white/60 mt-3 mb-[36px]">
          Free for individuals. No crypto wallet required. Works on web and mobile.
        </p>
        <button className="h-[52px] bg-[#0066FF] hover:brightness-110 text-white px-6 rounded-lg font-sans font-bold text-[18px] transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_4px_16px_rgba(0,102,255,0.4)]">
          Create Your DID
        </button>
      </div>
    </section>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function TrustScorePage() {
  return (
    <div className="w-full flex flex-col">
      <HeroTrustScore />
      <ScoreBreakdown />
      <WhyItMatters />
      <ScoreVsCompetitors />
      <CTABand />
    </div>
  )
}
