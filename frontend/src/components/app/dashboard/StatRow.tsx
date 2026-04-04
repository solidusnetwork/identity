'use client'

import { TrendingUp, Award, Link as LinkIcon } from 'lucide-react'
import Link from 'next/link'

export function StatRow() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <TrustScoreBreakdownCard />
      <CredentialsCard />
      <ConnectionsCard />
    </div>
  )
}

function TrustScoreBreakdownCard() {
  return (
    <div className="bg-[#1A1A2E] rounded-lg p-5 shadow-[0_2px_8px_rgba(0,0,0,0.32)] flex flex-col h-full">
      {/* Top Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* Gauge */}
          <div className="relative w-[56px] h-[56px] rounded-full bg-[#242438] mr-3">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
              <circle
                cx="28" cy="28" r="24"
                fill="none" stroke="#242438" strokeWidth="4"
              />
              <circle
                cx="28" cy="28" r="24"
                fill="none" stroke="#34C759" strokeWidth="4"
                strokeDasharray="150.8" strokeDashoffset={150.8 * (1 - 0.73)}
                strokeLinecap="round"
              />
            </svg>
            {/* Center visual only */}
            <div className="absolute inset-0 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#34C759]" />
            </div>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="font-sans font-medium text-[12px] text-[#8E8E93]">
              Trust Score
            </span>
            <div className="flex items-center">
              <span className="font-sans font-medium text-[12px] text-[#34C759] mr-1">
                High Confidence
              </span>
              <TrendingUp className="w-3 h-3 text-[#34C759]" />
            </div>
          </div>
        </div>

        <div className="flex items-end">
          <span className="font-sans font-bold text-[28px] text-[#34C759] leading-none">
            73
          </span>
          <span className="font-sans font-normal text-[11px] text-[#8E8E93] ml-1 mb-[3px]">
            / 100
          </span>
        </div>
      </div>

      {/* Category Bars */}
      <div className="mt-4 flex flex-col gap-2">
        <CategoryBar label="Identity" color="#00D4FF" pct={87.5} fraction="35/40" />
        <CategoryBar label="Professnl" color="#FF9500" pct={72} fraction="18/25" />
        <CategoryBar label="Social" color="#FF6B6B" pct={70} fraction="14/20" />
        <CategoryBar label="Financial" color="#C084FC" pct={40} fraction="6/15" />
      </div>

      {/* Footer */}
      <div className="mt-auto pt-2 text-right">
        <Link href="/my-trust-score" className="font-sans font-medium text-[11px] text-[#0066FF] hover:underline">
          View breakdown →
        </Link>
      </div>
    </div>
  )
}

function CategoryBar({ label, color, pct, fraction }: { label: string; color: string; pct: number; fraction: string }) {
  return (
    <div className="flex items-center justify-between h-5">
      <span className="w-[60px] font-sans font-medium text-[11px] text-[#8E8E93] shrink-0 truncate">
        {label}
      </span>
      <div className="flex-1 mx-3 h-1 bg-[#242438] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, backgroundColor: color }}
        ></div>
      </div>
      <span className="w-[34px] text-right font-sans font-normal text-[11px] text-[#48484F] shrink-0">
        {fraction}
      </span>
    </div>
  )
}

function CredentialsCard() {
  return (
    <div className="bg-[#1A1A2E] rounded-lg p-5 shadow-[0_2px_8px_rgba(0,0,0,0.32)] flex flex-col h-full relative">
      <Award className="w-5 h-5 text-[#0066FF] absolute top-5 right-5" />
      <span className="font-sans font-bold text-[40px] text-white leading-none mt-2 mb-2">
        7
      </span>
      <div className="flex flex-col mt-auto">
        <span className="font-sans font-medium text-[12px] text-[#8E8E93]">
          Credentials
        </span>
        <span className="font-sans font-normal text-[11px] text-[#48484F] mt-0.5">
          3 types
        </span>
      </div>
    </div>
  )
}

function ConnectionsCard() {
  return (
    <div className="bg-[#1A1A2E] rounded-lg p-5 shadow-[0_2px_8px_rgba(0,0,0,0.32)] flex flex-col h-full relative">
      <LinkIcon className="w-5 h-5 text-[#00D4FF] absolute top-5 right-5" />
      <span className="font-sans font-bold text-[40px] text-white leading-none mt-2 mb-2">
        14
      </span>
      <div className="flex flex-col mt-auto">
        <span className="font-sans font-medium text-[12px] text-[#8E8E93]">
          Active Connections
        </span>
        <span className="font-sans font-normal text-[11px] text-[#FF9500] mt-0.5">
          2 pending
        </span>
      </div>
    </div>
  )
}
