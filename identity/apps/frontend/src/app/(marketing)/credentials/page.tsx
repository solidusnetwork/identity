'use client'

import { useState } from 'react'
import {
  Search, ShieldCheck, Mail, GraduationCap, Briefcase, TrendingUp, Users,
  ArrowRight, Building2, Library, BadgeCheck, Stethoscope, Shield, Scale,
  Landmark
} from 'lucide-react'

// ─── Hero ──────────────────────────────────────────────────────────────────────
function HeroCredentials() {
  return (
    <section className="w-full bg-white px-6 py-20 lg:py-24 flex flex-col items-center justify-center">
      <h1 className="font-sans font-bold text-[36px] md:text-[48px] text-[#0A1628] text-center leading-[1.2]">
        Every Credential You'll Ever Need
      </h1>
      <div className="w-full max-w-[560px] mt-8 relative">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-[#8E8E93]" />
        </div>
        <input
          type="text"
          className="w-full h-[48px] bg-[#F2F2F7] border border-[#E0E0E5] rounded-[24px] pl-12 pr-6 font-sans font-normal text-[16px] text-[#0A1628] placeholder:text-[#8E8E93] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] transition-all"
          placeholder="Search credentials, issuers, categories..."
        />
      </div>
    </section>
  )
}

// ─── Credential Type Browser ───────────────────────────────────────────────────
const tabs = ['All', 'Identity', 'Education', 'Professional', 'Financial', 'Social']

const credentialsData = [
  { id: 1, category: 'Identity', name: 'Government ID', issuersCount: 14, description: 'Passport, driving license, or national ID to prove your legal identity and age.', icon: ShieldCheck, color: '#00D4FF' },
  { id: 2, category: 'Identity', name: 'Verified Email', issuersCount: 42, description: 'Cryptographic proof that you control a specific email address.', icon: Mail, color: '#0066FF' },
  { id: 3, category: 'Education', name: 'University Degree', issuersCount: 315, description: "Bachelor's, Master's, or PhD degrees verified directly by the issuing university.", icon: GraduationCap, color: '#A8E600' },
  { id: 4, category: 'Professional', name: 'Employment History', issuersCount: 85, description: 'Verified employment records including job title, tenure, and employer.', icon: Briefcase, color: '#FF9500' },
  { id: 5, category: 'Financial', name: 'Accredited Investor', issuersCount: 6, description: 'Proof of financial standing meeting regulatory requirements for investment.', icon: TrendingUp, color: '#C084FC' },
  { id: 6, category: 'Social', name: 'Community Member', issuersCount: 120, description: 'Attestations from DAOs, open-source projects, and digital communities.', icon: Users, color: '#FF6B6B' }
]

const featuredLogos = [
  { icon: Building2, name: 'Solidus Verify' },
  { icon: Library, name: 'State Univ' },
  { icon: BadgeCheck, name: 'GovPortal' },
  { icon: Stethoscope, name: 'MedBoard' },
  { icon: TrendingUp, name: 'FinCert' }
]

function CredentialTypeBrowser() {
  const [activeTab, setActiveTab] = useState('All')
  const filteredCredentials = activeTab === 'All' ? credentialsData : credentialsData.filter(c => c.category === activeTab)

  return (
    <section className="w-full bg-white px-6 lg:px-[120px] py-[80px] flex flex-col items-center">
      <div className="w-full max-w-[1200px] flex flex-col">
        <div className="flex items-center gap-2 overflow-x-auto pb-4 w-full justify-start md:justify-center">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`h-[36px] px-5 rounded-full font-sans font-medium text-[14px] whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-[#0066FF] text-white' : 'bg-[#F2F2F7] text-[#666666] hover:bg-[#E0E0E5] hover:text-[#0A1628]'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredCredentials.map((cred) => (
            <div key={cred.id} className="bg-white rounded-lg shadow-[0_1px_4px_rgba(0,0,0,0.08)] p-6 flex flex-col relative overflow-hidden border border-[#E0E0E5]/50 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-shadow">
              <div className="absolute top-0 left-0 bottom-0 w-[3px]" style={{ backgroundColor: cred.color }} />
              <cred.icon className="w-8 h-8 mb-4" style={{ color: cred.color }} />
              <h3 className="font-sans font-semibold text-[20px] text-[#0A1628]">{cred.name}</h3>
              <div className="font-sans font-medium text-[12px] text-[#666666] mt-1">{cred.issuersCount} verified issuers</div>
              <p className="font-sans font-normal text-[14px] text-[#666666] mt-3 leading-[1.6] flex-1">{cred.description}</p>
              <button className="mt-6 font-sans font-medium text-[14px] text-[#0066FF] hover:underline flex items-center group self-start">
                Get This Credential <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center">
          <div className="font-sans font-medium text-[12px] text-[#8E8E93] uppercase tracking-[0.08em] mb-6">TRUSTED BY LEADING ORGANIZATIONS</div>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
            {featuredLogos.map((logo, i) => (
              <div key={i} className="flex items-center gap-2">
                <logo.icon className="w-6 h-6 text-[#0A1628]" />
                <span className="font-sans font-semibold text-[15px] text-[#0A1628] hidden sm:block">{logo.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Featured Issuers Strip ────────────────────────────────────────────────────
const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const featuredIssuers = [
  { name: 'Solidus Verify', icon: Shield, pills: [{ text: 'KYC L1', color: '#0066FF' }, { text: 'KYC L2', color: '#0066FF' }] },
  { name: 'State University', icon: Library, pills: [{ text: 'Education Degree', color: '#00D4FF' }, { text: 'Transcript', color: '#00D4FF' }] },
  { name: 'BarAssociation', icon: Scale, pills: [{ text: 'Professional License', color: '#A8E600' }] },
  { name: 'FinCert Authority', icon: Landmark, pills: [{ text: 'Financial Accreditation', color: '#FF9500' }] },
  { name: 'MedBoard', icon: Stethoscope, pills: [{ text: 'Healthcare License', color: '#34C759' }] },
  { name: 'EmployVerify', icon: Briefcase, pills: [{ text: 'Employment Record', color: '#FF9500' }] }
]

function FeaturedIssuersStrip() {
  return (
    <section className="w-full bg-[#F2F2F7] px-6 lg:px-[120px] py-[48px] flex flex-col items-center">
      <div className="w-full max-w-[1200px] flex flex-col">
        <div className="flex items-center justify-between">
          <h3 className="font-sans font-bold text-[20px] text-[#0A1628]">Featured & Verified Issuers</h3>
          <button className="font-sans font-medium text-[13px] text-[#0066FF] hover:underline flex items-center">
            View all <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>

        <div className="flex overflow-x-auto gap-4 mt-6 pb-4 md:grid md:grid-cols-3 lg:grid-cols-6 md:pb-0 md:overflow-visible">
          {featuredIssuers.map((issuer, idx) => (
            <div key={idx} className="bg-white rounded-lg border border-[#E0E0E5] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)] hover:-translate-y-0.5 transition-all duration-200 flex flex-col min-w-[200px]">
              <div className="w-[44px] h-[44px] rounded-full bg-[#F2F2F7] flex items-center justify-center mb-2">
                <issuer.icon className="w-[22px] h-[22px] text-[#8E8E93]" />
              </div>
              <h4 className="font-sans font-semibold text-[14px] text-[#0A1628] leading-tight">{issuer.name}</h4>
              <div className="flex items-center gap-1 bg-[#34C759]/10 border border-[#34C759]/25 rounded px-2 py-[3px] w-max mt-2">
                <ShieldCheck className="w-2.5 h-2.5 text-[#34C759]" />
                <span className="font-sans font-semibold text-[10px] text-[#34C759] leading-none">Verified Issuer</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {issuer.pills.map((pill, pIdx) => (
                  <div
                    key={pIdx}
                    className="font-sans font-medium text-[10px] rounded px-2 py-0.5 border"
                    style={{ color: pill.color, backgroundColor: hexToRgba(pill.color, 0.1), borderColor: hexToRgba(pill.color, 0.25) }}
                  >
                    {pill.text}
                  </div>
                ))}
              </div>
              <button className="mt-auto pt-3 font-sans font-semibold text-[12px] text-[#0066FF] hover:underline flex items-center group self-start">
                Get credential <ArrowRight className="w-2.5 h-2.5 ml-1 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center font-sans font-normal text-[14px] text-[#666666]">
          Are you an organization?{' '}
          <button className="text-[#0066FF] hover:underline ml-1 font-medium inline-flex items-center">
            Become a Verified Issuer <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>
      </div>
    </section>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function CredentialsPage() {
  return (
    <div className="w-full flex flex-col">
      <HeroCredentials />
      <CredentialTypeBrowser />
      <FeaturedIssuersStrip />
    </div>
  )
}
