'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'motion/react'
import {
  ShieldCheck, GraduationCap, Building2, Copy, CheckCircle, MapPin, Check
} from 'lucide-react'

export default function PublicProfilePage() {
  const params = useParams()
  const username = typeof params.username === 'string' ? params.username : (params.username?.[0] ?? 'user')

  const displayDid = `did:solidus:mainnet:5dK3fP7vLm8Qw2xNz9Rb4YcJ6tHgAs`
  const truncatedDid = `${displayDid.slice(0, 24)}...${displayDid.slice(-8)}`

  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(displayDid)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const targetScore = 73
  const [score, setScore] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setScore(targetScore), 100)
    return () => clearTimeout(timer)
  }, [])

  const circumference = 2 * Math.PI * 62

  return (
    <div className="flex-1 w-full max-w-[720px] mx-auto px-4 py-12 md:py-16">
      {/* Profile Hero Card */}
      <div className="bg-white rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-[#E0E0E5] overflow-hidden mb-8 relative">
        <div className="h-3 w-full bg-gradient-to-r from-[#A8E600] via-[#00D4FF] to-[#003366]" />

        <div className="p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Avatar and Info */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="w-[100px] h-[100px] rounded-full overflow-hidden border-2 border-[#F2F2F7] shadow-sm mb-5 relative bg-[#242438] flex items-center justify-center">
              <span className="font-sans font-bold text-[32px] text-white select-none">AC</span>
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#34C759] border-2 border-white rounded-full flex items-center justify-center translate-x-1/4 translate-y-1/4">
                <CheckCircle className="w-3.5 h-3.5 text-white" />
              </div>
            </div>

            <h1 className="font-sans font-bold text-[28px] text-[#0A1628] leading-tight mb-2">Alex Chen</h1>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 bg-[#F2F2F7] px-3 py-1.5 rounded-full mb-6 cursor-pointer hover:bg-[#E0E0E5] transition-colors group border border-transparent hover:border-[#D1D1D6]"
              title="Copy DID"
            >
              <span className="font-mono text-[12px] text-[#666666] group-hover:text-[#0A1628] transition-colors">
                {truncatedDid}
              </span>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-[#34C759]" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-[#8E8E93] group-hover:text-[#0A1628] transition-colors" />
              )}
            </button>

            <p className="font-sans text-[15px] text-[#666666] leading-[1.6] max-w-[400px]">
              Software Engineer based in San Francisco. Building decentralized tools and self-sovereign identity solutions.
            </p>
          </div>

          {/* Trust Score Gauge */}
          <div className="flex flex-col items-center justify-center shrink-0 mt-6 md:mt-0">
            <div className="relative w-[140px] h-[140px]">
              <svg width="140" height="140" viewBox="0 0 140 140" className="transform -rotate-90">
                <circle cx="70" cy="70" r="62" fill="none" stroke="#F2F2F7" strokeWidth="12" />
                <motion.circle
                  cx="70" cy="70" r="62"
                  fill="none"
                  stroke="url(#publicScoreGradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: circumference * (1 - score / 100) }}
                  transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
                />
                <defs>
                  <linearGradient id="publicScoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00D4FF" />
                    <stop offset="100%" stopColor="#A8E600" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-sans font-bold text-[36px] text-[#0A1628] leading-none mt-2">{targetScore}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-4 bg-[rgba(52,199,89,0.1)] px-2.5 py-1 rounded">
              <ShieldCheck className="w-3.5 h-3.5 text-[#34C759]" />
              <span className="font-sans font-semibold text-[11px] text-[#34C759] uppercase tracking-wide">High Confidence</span>
            </div>
          </div>
        </div>
      </div>

      {/* Credentials Section */}
      <h2 className="font-sans font-semibold text-[20px] text-[#0A1628] mb-6 px-1">Public Credentials</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Credential 1 */}
        <div className="bg-white rounded-xl p-5 border border-[#E0E0E5] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-shadow">
          <div className="w-10 h-10 rounded-full bg-[rgba(0,212,255,0.15)] flex items-center justify-center mb-4">
            <ShieldCheck className="w-5 h-5 text-[#00D4FF]" />
          </div>
          <h3 className="font-sans font-semibold text-[16px] text-[#0A1628] mb-1">KYC Level 2</h3>
          <div className="flex items-center gap-1.5 mb-4">
            <span className="font-sans text-[13px] text-[#666666]">verify.solidus.network</span>
            <CheckCircle className="w-3.5 h-3.5 text-[#34C759]" />
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-[#F2F2F7] text-[#666666] text-[11px] font-medium rounded border border-[#E0E0E5]">Identity</span>
            <span className="px-2 py-1 bg-[rgba(52,199,89,0.1)] text-[#34C759] text-[11px] font-medium rounded">Active</span>
          </div>
        </div>

        {/* Credential 2 */}
        <div className="bg-white rounded-xl p-5 border border-[#E0E0E5] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-shadow">
          <div className="w-10 h-10 rounded-full bg-[rgba(168,230,0,0.15)] flex items-center justify-center mb-4">
            <GraduationCap className="w-5 h-5 text-[#A8E600]" />
          </div>
          <h3 className="font-sans font-semibold text-[16px] text-[#0A1628] mb-1">B.S. Computer Science</h3>
          <div className="flex items-center gap-1.5 mb-4">
            <span className="font-sans text-[13px] text-[#666666]">Stanford University</span>
            <CheckCircle className="w-3.5 h-3.5 text-[#34C759]" />
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-[#F2F2F7] text-[#666666] text-[11px] font-medium rounded border border-[#E0E0E5]">Education</span>
            <span className="px-2 py-1 bg-[rgba(52,199,89,0.1)] text-[#34C759] text-[11px] font-medium rounded">Active</span>
          </div>
        </div>

        {/* Credential 3 */}
        <div className="bg-white rounded-xl p-5 border border-[#E0E0E5] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-shadow">
          <div className="w-10 h-10 rounded-full bg-[rgba(0,102,255,0.15)] flex items-center justify-center mb-4">
            <Building2 className="w-5 h-5 text-[#0066FF]" />
          </div>
          <h3 className="font-sans font-semibold text-[16px] text-[#0A1628] mb-1">Senior Engineer</h3>
          <div className="flex items-center gap-1.5 mb-4">
            <span className="font-sans text-[13px] text-[#666666]">Acme Corp</span>
            <CheckCircle className="w-3.5 h-3.5 text-[#34C759]" />
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-[#F2F2F7] text-[#666666] text-[11px] font-medium rounded border border-[#E0E0E5]">Employment</span>
            <span className="px-2 py-1 bg-[rgba(52,199,89,0.1)] text-[#34C759] text-[11px] font-medium rounded">Active</span>
          </div>
        </div>

        {/* Credential 4 */}
        <div className="bg-white rounded-xl p-5 border border-[#E0E0E5] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-shadow">
          <div className="w-10 h-10 rounded-full bg-[rgba(255,107,107,0.15)] flex items-center justify-center mb-4">
            <MapPin className="w-5 h-5 text-[#FF6B6B]" />
          </div>
          <h3 className="font-sans font-semibold text-[16px] text-[#0A1628] mb-1">Proof of Address</h3>
          <div className="flex items-center gap-1.5 mb-4">
            <span className="font-sans text-[13px] text-[#666666]">verify.solidus.network</span>
            <CheckCircle className="w-3.5 h-3.5 text-[#34C759]" />
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-[#F2F2F7] text-[#666666] text-[11px] font-medium rounded border border-[#E0E0E5]">Location</span>
            <span className="px-2 py-1 bg-[rgba(52,199,89,0.1)] text-[#34C759] text-[11px] font-medium rounded">Active</span>
          </div>
        </div>
      </div>
    </div>
  )
}
