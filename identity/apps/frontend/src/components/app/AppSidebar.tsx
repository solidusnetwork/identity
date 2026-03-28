'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, TrendingUp, Award, Fingerprint, Share2, Activity, Settings, ChevronDown } from 'lucide-react'

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-[240px] bg-[#1A1A2E] border-r border-[#2A2A42] h-screen fixed left-0 top-0 flex flex-col z-50">

      {/* Logo Area */}
      <div className="h-[64px] px-5 border-b border-[#2A2A42] flex items-center shrink-0">
        {/* Light mode: use light logo (dark text on light bg) */}
        <img src="/logos/solidus_light.png" alt="Solidus Identity" className="h-6 w-auto dark:hidden" />
        {/* Dark mode: use dark logo (light text on dark bg) */}
        <img src="/logos/solidus_dark.png" alt="Solidus Identity" className="h-6 w-auto hidden dark:block" />
      </div>

      {/* User mini-card */}
      <div className="h-[64px] p-3 px-4 flex items-center justify-between shrink-0 hover:bg-[#242438] transition-colors cursor-pointer">
        <div className="flex items-center min-w-0">
          <div className="w-9 h-9 rounded-full bg-[#242438] shrink-0 overflow-hidden flex items-center justify-center">
            <span className="text-[#8E8E93] text-sm">AC</span>
          </div>
          <div className="ml-3 flex flex-col min-w-0">
            <span className="font-sans font-semibold text-[13px] text-white truncate">
              Alex Chen
            </span>
            <span className="font-mono text-[10px] text-[#8E8E93] truncate max-w-[130px]">
              did:solidus:mainnet:5dK3...gAs
            </span>
          </div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-[#8E8E93] shrink-0" />
      </div>

      <div className="w-full h-px bg-[#2A2A42] shrink-0"></div>

      {/* Nav Sections */}
      <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-1">
        <NavItem href="/dashboard" icon={Home} label="Home" active={pathname === '/dashboard' || pathname === '/'} />
        <NavItem href="/my-trust-score" icon={TrendingUp} label="Trust Score" active={pathname === '/my-trust-score'} />
        <NavItem
          href="/my-credentials"
          icon={Award}
          label="Credentials"
          active={pathname?.startsWith('/my-credentials') || pathname === '/inbox'}
          badge={
            <div className="w-[18px] h-[18px] rounded-full bg-[#0066FF] flex items-center justify-center">
              <span className="font-sans font-bold text-[10px] text-white leading-none mt-px">3</span>
            </div>
          }
        />
        <NavItem href="/identity" icon={Fingerprint} label="Identity" active={pathname === '/identity'} />
        <NavItem href="/sharing" icon={Share2} label="Privacy & Sharing" active={pathname === '/sharing'} />

        <div className="w-full h-px bg-[#2A2A42] my-3 shrink-0"></div>

        <NavItem href="/activity" icon={Activity} label="Activity" active={pathname === '/activity'} />
        <NavItem href="/settings" icon={Settings} label="Settings" active={pathname === '/settings'} />
      </div>

      {/* Bottom Footer */}
      <div className="p-4 flex items-center justify-between shrink-0">
        <button className="font-sans text-[11px] text-[#48484F] hover:text-[#8E8E93] transition-colors">
          Help & Support
        </button>
        <span className="font-sans text-[11px] text-[#48484F]">
          v2.4.1
        </span>
      </div>

    </div>
  )
}

function NavItem({
  href,
  icon: Icon,
  label,
  active,
  badge
}: {
  href: string
  icon: React.ElementType
  label: string
  active: boolean
  badge?: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={`h-[40px] px-4 flex items-center justify-between transition-colors relative group
        ${active ? 'bg-[#0066FF]/12' : 'hover:bg-[#242438]'}`}
    >
      <div className="flex items-center">
        {active && (
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#0066FF]"></div>
        )}
        <Icon className={`w-[18px] h-[18px] mr-3 ${active ? 'text-[#0066FF]' : 'text-[#8E8E93] group-hover:text-white transition-colors'}`} />
        <span className={`font-sans font-normal text-[14px] ${active ? 'text-white' : 'text-[#8E8E93] group-hover:text-white transition-colors'}`}>
          {label}
        </span>
      </div>
      {badge}
    </Link>
  )
}
