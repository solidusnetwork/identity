'use client'

import { motion, useInView } from 'motion/react'
import Link from 'next/link'
import {
  ShieldCheck, Key, EyeOff, Copy, Fingerprint, Award, Share2, ArrowRight,
  Users, Lock, CheckCircle, TrendingUp, Briefcase, Mail, AlertCircle,
  Bitcoin, Cpu, Stethoscope, Home, Zap, Gamepad2, ShoppingCart
} from 'lucide-react'
import { useEffect, useState, useRef } from 'react'

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="w-full bg-[#0A1628] flex items-center justify-center overflow-hidden relative py-20 lg:py-0 lg:h-[640px]">
      <div className="w-full max-w-[1440px] px-6 lg:px-[120px] flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-10">

        {/* Left Column */}
        <div className="w-full lg:w-[560px] flex flex-col z-10">
          <span className="font-sans font-medium text-[12px] text-[#A8E600] uppercase tracking-[0.08em]">
            SELF-SOVEREIGN IDENTITY
          </span>
          <h1 className="font-sans font-bold text-[40px] lg:text-[56px] text-white leading-[1.1] mt-2 whitespace-pre-line">
            {'Own Your Identity.\nShare Only What Matters.'}
          </h1>
          <p className="font-sans font-normal text-[18px] text-[#8E8E93] leading-[1.6] max-w-[480px] mt-5">
            A Solidus DID is yours forever. No company controls it, no company can revoke it. Collect verifiable credentials from trusted issuers and share them with zero-knowledge precision.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-10">
            <Link href="/register" className="h-[48px] px-5 bg-gradient-to-br from-[#0066FF] to-[#0052CC] rounded-md shadow-[0_4px_16px_rgba(0,102,255,0.35)] font-sans font-semibold text-[16px] text-white hover:opacity-90 transition-opacity flex items-center justify-center w-full sm:w-auto">
              Create Your DID
            </Link>
            <Link href="/how-it-works" className="h-[48px] px-5 border border-white/25 rounded-md font-sans font-normal text-[16px] text-white hover:bg-white/5 transition-colors flex items-center justify-center w-full sm:w-auto">
              See How It Works
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mt-8">
            <div className="flex items-center gap-2 font-sans font-normal text-[13px] text-[#8E8E93]">
              <ShieldCheck className="w-[14px] h-[14px] text-[#34C759]" /> No email required
            </div>
            <div className="hidden sm:block w-px h-3 bg-white/20" />
            <div className="flex items-center gap-2 font-sans font-normal text-[13px] text-[#8E8E93]">
              <Key className="w-[14px] h-[14px] text-[#A8E600]" /> You hold your keys
            </div>
            <div className="hidden sm:block w-px h-3 bg-white/20" />
            <div className="flex items-center gap-2 font-sans font-normal text-[13px] text-[#8E8E93]">
              <EyeOff className="w-[14px] h-[14px] text-[#00D4FF]" /> Zero-knowledge sharing
            </div>
          </div>
        </div>

        {/* Right Column (Hero Visual) */}
        <div className="w-full lg:w-[560px] flex flex-col items-center">
          <motion.div
            initial={{ rotate: 0, y: 20, opacity: 0 }}
            animate={{ rotate: 8, y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="w-full max-w-[480px] h-[300px] rounded-xl relative shadow-[0_32px_80px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #0D1F38 100%)' }}
          >
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(90deg, #A8E600, #00D4FF, #003366)' }} />
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.06)_0%,transparent_70%)] rounded-bl-full pointer-events-none" />

            <div className="p-6 flex flex-col h-full justify-between relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-[4px] bg-white flex items-center justify-center text-[#1A1A2E] font-bold text-[10px]">S</div>
                <div className="font-sans font-normal text-[10px] text-[#8E8E93]">identity.solidus.network</div>
              </div>

              <div className="flex items-center gap-5 mt-4">
                <div className="relative shrink-0">
                  <div className="w-[88px] h-[88px] rounded-full bg-[#242438] overflow-hidden border border-white/10 flex items-center justify-center">
                    <span className="font-sans font-bold text-[28px] text-white select-none">AC</span>
                  </div>
                  <div className="absolute bottom-1 right-1 w-3 h-3 bg-[#34C759] rounded-full border-2 border-[#1A1A2E]" />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <div className="font-sans font-bold text-[22px] text-white">Alex Chen</div>
                  <div className="flex items-center gap-2 mt-1 bg-white/5 rounded-md px-2 py-1 max-w-full">
                    <div className="font-mono text-[11px] text-[#8E8E93] truncate">did:solidus:mainnet:5dK3fP7...J6tHgAs</div>
                    <Copy className="w-3 h-3 text-[#8E8E93] shrink-0 cursor-pointer hover:text-white transition-colors" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-auto overflow-x-auto pb-1">
                <div className="h-[24px] px-3 bg-[#0066FF] rounded-md font-sans font-medium text-[12px] text-white flex items-center justify-center whitespace-nowrap">Email ✓</div>
                <div className="h-[24px] px-3 bg-[#00D4FF] rounded-md font-sans font-medium text-[12px] text-[#0A1628] flex items-center justify-center whitespace-nowrap">KYC L2 ✓</div>
                <div className="h-[24px] px-3 bg-[#A8E600] rounded-md font-sans font-medium text-[12px] text-[#0A1628] flex items-center justify-center whitespace-nowrap">University ✓</div>
              </div>
            </div>
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-12 w-full max-w-[480px]">
            {['7 Credentials', 'Score 94', '12 Connections'].map((stat) => (
              <div key={stat} className="h-[28px] px-4 bg-white/[0.06] border border-white/[0.12] rounded-full flex items-center justify-center font-sans font-medium text-[12px] text-white">
                {stat}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── How It Works Section ──────────────────────────────────────────────────────
function HowItWorksSection() {
  return (
    <section className="w-full bg-[#F2F2F7] px-6 lg:px-[120px] py-[96px] flex flex-col items-center">
      <div className="font-sans font-medium text-[12px] text-[#0066FF] uppercase tracking-[0.08em] text-center">
        THE PROCESS
      </div>
      <h2 className="font-sans font-semibold text-[40px] text-[#0A1628] mt-2 text-center leading-[1.2]">
        Three steps to sovereign identity.
      </h2>

      <div className="w-full max-w-[1200px] flex flex-col lg:flex-row items-stretch gap-6 mt-12 relative">
        <div className="absolute top-[80px] left-[15%] right-[15%] h-[1px] bg-[#E0E0E5] hidden lg:flex items-center justify-between pointer-events-none z-0">
          <ArrowRight className="w-4 h-4 text-[#0066FF] absolute left-1/2 -translate-x-[calc(50%+200px)] bg-[#F2F2F7] px-1" />
          <ArrowRight className="w-4 h-4 text-[#0066FF] absolute right-1/2 translate-x-[calc(50%+200px)] bg-[#F2F2F7] px-1" />
        </div>

        {[
          {
            num: '1',
            gradient: 'linear-gradient(135deg, #A8E600, #00D4FF)',
            icon: <Fingerprint className="w-12 h-12 text-[#0A1628]" strokeWidth={1.5} />,
            title: 'Create Your DID',
            desc: 'Generate a cryptographic identity on your device in seconds. Your private key never leaves your browser or phone.'
          },
          {
            num: '2',
            gradient: 'linear-gradient(135deg, #00D4FF, #0066FF)',
            icon: <Award className="w-12 h-12 text-[#0A1628]" strokeWidth={1.5} />,
            title: 'Collect Credentials',
            desc: 'Get verified by trusted issuers — your employer, university, government, or Solidus Verify. Each credential is a cryptographically signed certificate.'
          },
          {
            num: '3',
            gradient: 'linear-gradient(135deg, #0066FF, #6B21A8)',
            icon: <Share2 className="w-12 h-12 text-[#0A1628]" strokeWidth={1.5} />,
            title: 'Share Selectively',
            desc: 'Choose exactly which fields any recipient sees. Prove your age without revealing your birthdate. Prove your address without sharing your name. Built on BBS+ cryptography.'
          }
        ].map((card) => (
          <div key={card.num} className="flex-1 bg-white rounded-lg p-8 shadow-[0_1px_4px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.06)] relative z-10 flex flex-col items-start border border-[#E0E0E5]">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-sans font-bold text-[20px] mb-6" style={{ background: card.gradient }}>{card.num}</div>
            {card.icon}
            <h3 className="font-sans font-semibold text-[22px] text-[#0A1628] mt-4">{card.title}</h3>
            <p className="font-sans font-normal text-[15px] text-[#666666] leading-[1.6] mt-2">{card.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Guardian Recovery Section ─────────────────────────────────────────────────
function GuardianRecoverySection() {
  return (
    <section className="w-full bg-[#F2F2F7] px-6 lg:px-[120px] py-[80px] flex flex-col items-center">
      <h2 className="font-sans font-bold text-[36px] text-[#0A1628] text-center leading-[1.2]">
        Never lose your identity.
      </h2>
      <p className="font-sans font-normal text-[18px] text-[#666666] max-w-[600px] text-center mt-4 leading-[1.5]">
        Your DID is permanent. Even if you lose your device or forget your seed phrase, trusted contacts — your guardians — can restore your access.
      </p>

      <div className="w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="bg-white rounded-xl border border-[#E0E0E5] p-7 shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex flex-col items-start">
          <Users className="w-7 h-7 text-[#0066FF] mb-4" />
          <h3 className="font-sans font-semibold text-[18px] text-[#0A1628]">Choose Your Circle</h3>
          <p className="font-sans font-normal text-[14px] text-[#666666] mt-2 leading-[1.5]">
            Pick 3–7 trusted contacts: friends, family, or colleagues. They don't need to be technical — just trustworthy.
          </p>
        </div>
        <div className="bg-white rounded-xl border border-[#E0E0E5] p-7 shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex flex-col items-start">
          <ShieldCheck className="w-7 h-7 text-[#34C759] mb-4" />
          <h3 className="font-sans font-semibold text-[18px] text-[#0A1628]">3-of-5 Threshold</h3>
          <p className="font-sans font-normal text-[14px] text-[#666666] mt-2 leading-[1.5]">
            You choose the threshold. With 5 guardians and a threshold of 3, any 3 can recover your identity. No single guardian can act alone.
          </p>
        </div>
        <div className="bg-white rounded-xl border border-[#E0E0E5] p-7 shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex flex-col items-start">
          <Key className="w-7 h-7 text-[#FF9500] mb-4" />
          <h3 className="font-sans font-semibold text-[18px] text-[#0A1628]">Zero Guardian Access</h3>
          <p className="font-sans font-normal text-[14px] text-[#666666] mt-2 leading-[1.5]">
            Guardians confirm your identity — they cannot see your credentials, keys, or data. Recovery creates a new keypair for you alone.
          </p>
        </div>
      </div>

      <div className="w-full max-w-[1200px] bg-[#0A1628] rounded-xl py-6 px-6 lg:px-8 mt-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Lock className="w-5 h-5 text-[#A8E600] shrink-0" />
          <span className="font-sans font-semibold text-[16px] text-white">No company controls your DID. No company can revoke it.</span>
        </div>
        <button className="h-[36px] px-5 border border-[#A8E600] rounded-lg font-sans font-semibold text-[13px] text-[#A8E600] hover:bg-[#A8E600]/10 transition-colors flex items-center whitespace-nowrap shrink-0">
          Set up guardians <ArrowRight className="w-4 h-4 ml-1.5" />
        </button>
      </div>
    </section>
  )
}

// ─── Credential Types Section ──────────────────────────────────────────────────
function CredentialTypesSection() {
  const credentials = [
    { icon: ShieldCheck, color: '#00D4FF', title: 'KYC / Government ID', desc: 'Passport, driving license, proof of address. Issued by Solidus Verify and government partners.' },
    { icon: Award, color: '#A8E600', title: 'Education', desc: 'University degrees, certifications, professional qualifications from accredited institutions.' },
    { icon: Briefcase, color: '#FF9500', title: 'Professional', desc: 'Employment history, licenses, professional memberships. Shareable with employers or platforms.' },
    { icon: TrendingUp, color: '#C084FC', title: 'Financial', desc: 'Accredited investor status, credit standing, tax residency. Issue once, reuse everywhere.' },
    { icon: Mail, color: '#0066FF', title: 'Contact', desc: 'Email, phone number, social handles — verified at point of issuance, cryptographically signed.' },
    { icon: Users, color: '#FF6B6B', title: 'Social Attestations', desc: 'Community membership, contribution history, reputation scores. From DAOs, GitHub, and beyond.' }
  ]

  return (
    <section className="w-full bg-white px-6 lg:px-[120px] py-[96px] flex flex-col items-center">
      <h2 className="font-sans font-semibold text-[40px] text-[#0A1628] text-center leading-[1.2]">Every type of trust, in one wallet.</h2>
      <p className="font-sans font-normal text-[18px] text-[#666666] max-w-[560px] text-center mt-3 leading-[1.5]">
        Collect credentials from hundreds of issuers across government, education, finance, and professional domains.
      </p>

      <div className="w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {credentials.map((cred, i) => (
          <div key={i} className="bg-[#F2F2F7] rounded-lg p-6 border-l-[3px]" style={{ borderLeftColor: cred.color }}>
            <cred.icon className="w-6 h-6 mb-4" style={{ color: cred.color }} />
            <h3 className="font-sans font-semibold text-[18px] text-[#0A1628]">{cred.title}</h3>
            <p className="font-sans font-normal text-[14px] text-[#666666] mt-2 leading-[1.5]">{cred.desc}</p>
          </div>
        ))}
      </div>

      <Link href="/credentials" className="mt-10 font-sans font-medium text-[15px] text-[#0066FF] hover:underline flex items-center justify-center">
        Browse all credential types →
      </Link>
    </section>
  )
}

// ─── Trust Score Marketing Section ────────────────────────────────────────────
function TrustScoreMarketingSection() {
  return (
    <section className="w-full bg-white px-6 lg:px-[120px] py-[80px] flex justify-center">
      <div className="w-full max-w-[1200px] flex flex-col md:flex-row items-center gap-12 lg:gap-[64px]">
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <div className="w-[180px] h-[180px] relative mb-8">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#F2F2F7" strokeWidth="8" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="url(#ts-score-gradient)" strokeWidth="8" strokeDasharray="283" strokeDashoffset="42" strokeLinecap="round" />
              <defs>
                <linearGradient id="ts-score-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00D4FF" />
                  <stop offset="100%" stopColor="#A8E600" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-sans font-bold text-[48px] text-[#0A1628] leading-none">85</span>
              <span className="font-sans font-medium text-[12px] text-[#666666] mt-1 uppercase tracking-wider">High Trust</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full max-w-[320px]">
            {[
              { icon: Fingerprint, color: '#00D4FF', label: 'Identity', pts: '+10 pts' },
              { icon: ShieldCheck, color: '#0066FF', label: 'Gov ID', pts: '+25 pts' },
              { icon: TrendingUp, color: '#FF9500', label: 'Financial', pts: '+20 pts' },
              { icon: Briefcase, color: '#A8E600', label: 'Professional', pts: '+18 pts' }
            ].map((item) => (
              <div key={item.label} className="bg-[#F2F2F7] border border-[#E0E0E5] rounded-md py-2 px-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <item.icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                  <span className="font-sans font-medium text-[12px] text-[#0A1628]">{item.label}</span>
                </div>
                <span className="font-sans font-normal text-[11px] text-[#666666]">{item.pts}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col">
          <span className="font-sans font-semibold text-[13px] text-[#0066FF] uppercase tracking-[0.08em]">TRUST SCORE</span>
          <h2 className="font-sans font-bold text-[36px] text-[#0A1628] mt-2 leading-[1.2]">Your reputation, built by you.</h2>
          <p className="font-sans font-normal text-[16px] text-[#666666] mt-4 leading-[1.6]">
            The Solidus Trust Score is a privacy-preserving composite number (0–100) that reflects the strength and diversity of your verified credentials — not your browsing history, social graph, or personal data.
          </p>

          <div className="flex flex-col gap-4 mt-6">
            {[
              'Start at 0, build at your own pace',
              'No authority controls your score — only your credentials do',
              'Share only the score, not the underlying data',
              'Higher scores unlock access to more apps and services'
            ].map((item) => (
              <div key={item} className="flex items-center gap-[10px]">
                <CheckCircle className="w-4 h-4 text-[#34C759] shrink-0" />
                <span className="font-sans font-normal text-[15px] text-[#0A1628]">{item}</span>
              </div>
            ))}
          </div>

          <Link href="/trust-score" className="flex items-center gap-1 mt-6 font-sans font-semibold text-[14px] text-[#0066FF] hover:underline self-start">
            See how scores work <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─── Sign In Demo Section ──────────────────────────────────────────────────────
function SignInDemoSection() {
  return (
    <section className="w-full bg-[#0A1628] px-6 lg:px-[120px] py-[96px] flex justify-center overflow-hidden">
      <div className="w-full max-w-[1200px] flex flex-col lg:flex-row items-center justify-between gap-16">
        <div className="w-full lg:w-1/2 flex flex-col z-10">
          <h2 className="font-sans font-semibold text-[40px] text-white leading-[1.2] whitespace-pre-line">
            {'Replace passwords.\nForever.'}
          </h2>
          <p className="font-sans font-normal text-[18px] text-[#8E8E93] mt-4 leading-[1.6] max-w-[480px]">
            One button on any site. Your credential proof is generated locally — no password, no OAuth handshake, no data broker in the middle.
          </p>

          <div className="flex flex-col gap-4 mt-8">
            {['No password to leak', 'No Google or Apple middleman', 'No personal data sent to the site', 'Biometric confirmation on your device'].map((item) => (
              <div key={item} className="flex items-center gap-[10px]">
                <CheckCircle className="w-[18px] h-[18px] text-[#34C759] shrink-0" />
                <span className="font-sans font-normal text-[16px] text-white">{item}</span>
              </div>
            ))}
          </div>

          <Link href="/developers" className="mt-8 font-sans font-medium text-[15px] text-[#0066FF] hover:underline self-start">
            View developer docs →
          </Link>
        </div>

        <div className="w-full lg:w-1/2 flex justify-center z-10">
          <div className="w-full max-w-[360px] bg-[#1A1A2E] rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden border border-white/10">
            <div className="px-6 py-5 border-b border-white/10 flex flex-col items-center relative">
              <div className="w-12 h-12 bg-[#242438] rounded-xl flex items-center justify-center mb-4 border border-white/5">
                <AlertCircle className="w-6 h-6 text-[#00D4FF]" />
              </div>
              <h3 className="font-sans font-semibold text-[18px] text-white text-center">Sign in to DefiSwap</h3>
              <p className="font-sans font-normal text-[14px] text-[#8E8E93] text-center mt-1">defiswap.exchange</p>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <div className="font-sans font-medium text-[13px] text-[#8E8E93] uppercase tracking-wider">Requested Information</div>
              <div className="flex flex-col gap-3">
                <div className="bg-[#242438] rounded-lg p-3 border border-white/5 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#00D4FF] mt-0.5 shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-sans font-medium text-[14px] text-white">Proof of Personhood</span>
                    <span className="font-sans font-normal text-[12px] text-[#8E8E93]">KYC L2 (No PII disclosed)</span>
                  </div>
                </div>
                <div className="bg-[#242438] rounded-lg p-3 border border-white/5 flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#0066FF] mt-0.5 shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-sans font-medium text-[14px] text-white">Verified Email</span>
                    <span className="font-sans font-normal text-[12px] text-[#8E8E93]">alex****@example.com</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-white/10 flex flex-col gap-4">
              <button className="w-full h-12 bg-[#0066FF] rounded-lg flex items-center justify-center gap-2 font-sans font-semibold text-[15px] text-white shadow-[0_4px_16px_rgba(0,102,255,0.35)] hover:opacity-90 transition-opacity">
                <Fingerprint className="w-5 h-5" /> Confirm & Sign In
              </button>
              <button className="w-full h-10 border border-transparent rounded-lg font-sans font-medium text-[14px] text-[#8E8E93] hover:bg-white/5 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Ecosystem Apps Section ────────────────────────────────────────────────────
function EcosystemAppsSection() {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  useEffect(() => {
    if (isInView) {
      const end = 312
      const duration = 1200
      const startTime = performance.now()
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easeOut = 1 - Math.pow(1 - progress, 3)
        setCount(Math.floor(easeOut * end))
        if (progress < 1) requestAnimationFrame(animate)
      }
      requestAnimationFrame(animate)
    }
  }, [isInView])

  const apps = [
    { name: 'DeFi Exchange', category: 'DeFi', icon: Bitcoin, reqs: ['KYC L2 required'] },
    { name: 'NFT Marketplace', category: 'Web3', icon: ShoppingCart, reqs: ['Email'] },
    { name: 'Crypto Lending', category: 'Fintech', icon: Cpu, reqs: ['KYC L3 required'] },
    { name: 'Job Board', category: 'Professional', icon: Briefcase, reqs: ['KYC L1', 'Professional'] },
    { name: 'Healthcare Portal', category: 'Healthcare', icon: Stethoscope, reqs: ['KYC L2', 'Phone'] },
    { name: 'Real Estate App', category: 'Real Estate', icon: Home, reqs: ['KYC L2 required'] },
    { name: 'Gig Platform', category: 'Gig Economy', icon: Zap, reqs: ['KYC L1', 'Phone'] },
    { name: 'Game Studio', category: 'Gaming', icon: Gamepad2, reqs: ['Email', 'Phone'] }
  ]

  return (
    <section className="w-full bg-[#F2F2F7] px-6 lg:px-[120px] py-[80px] flex flex-col items-center" ref={ref}>
      <div className="text-center max-w-[800px]">
        <h2 className="font-sans font-bold text-[36px] text-[#0A1628] leading-[1.2]">
          Join <span className="text-[#0066FF] tabular-nums">{count}</span> apps already using Sign in with Solidus.
        </h2>
        <p className="font-sans font-normal text-[16px] text-[#666666] mt-3">
          From DeFi to healthcare — any platform can replace passwords with Solidus credentials.
        </p>
      </div>

      <div className="w-full max-w-[1200px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
        {apps.map((app, i) => (
          <div key={i} className="bg-white rounded-lg border border-[#E0E0E5] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 transition-all duration-200 ease-in-out flex flex-col group cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-[#F2F2F7] flex items-center justify-center mb-4">
              <app.icon className="w-5 h-5 text-[#8E8E93] group-hover:text-[#0066FF] transition-colors" />
            </div>
            <h3 className="font-sans font-semibold text-[14px] text-[#0A1628]">{app.name}</h3>
            <p className="font-sans font-medium text-[11px] text-[#666666] mt-1">{app.category}</p>
            <div className="flex flex-wrap items-center gap-1.5 mt-4">
              {app.reqs.map((req, j) => (
                <div key={j} className="bg-[#F2F2F7] border border-[#E0E0E5] rounded px-1.5 py-0.5 font-sans font-medium text-[10px] text-[#8E8E93]">{req}</div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 font-sans font-normal text-[14px] text-[#666666] flex items-center justify-center">
        Are you a developer?{' '}
        <Link href="/developers" className="text-[#0066FF] hover:underline ml-1 inline-flex items-center gap-1 font-medium">
          Add your app <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="w-full flex flex-col">
      <HeroSection />
      <HowItWorksSection />
      <GuardianRecoverySection />
      <CredentialTypesSection />
      <TrustScoreMarketingSection />
      <SignInDemoSection />
      <EcosystemAppsSection />
    </div>
  )
}
