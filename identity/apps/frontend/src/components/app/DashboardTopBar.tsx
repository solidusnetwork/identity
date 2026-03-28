'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Globe, ChevronDown, Sun, Moon, Bell, Share2 } from 'lucide-react'

interface DashboardTopBarProps {
  title?: string
}

export function DashboardTopBar({ title = 'Dashboard' }: DashboardTopBarProps) {
  const { theme, setTheme } = useTheme()
  const [langOpen, setLangOpen] = useState(false)

  const isLight = theme === 'light'

  return (
    <div className="h-[64px] bg-[#0A1628] border-b border-[#2A2A42] px-6 flex items-center justify-between sticky top-0 z-40">
      <h2 className="font-sans font-semibold text-[22px] text-white">
        {title}
      </h2>

      <div className="flex items-center gap-2">
        {/* Language Switcher */}
        <div className="relative">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className={`h-[36px] bg-[#1A1A2E] rounded-md px-3 flex items-center justify-center transition-all duration-150 border
              ${langOpen ? 'border-[#0066FF]/60' : 'border-[#2A2A42] hover:bg-[#242438] hover:border-white/16'}`}
          >
            <Globe className="w-[18px] h-[18px] text-[#8E8E93] mr-1.5 transition-colors" />
            <span className="font-sans font-medium text-[12px] text-[#8E8E93] mr-1 transition-colors">EN</span>
            <ChevronDown className="w-3 h-3 text-[#8E8E93] transition-colors" />
          </button>

          {langOpen && (
            <div className="absolute right-0 top-full mt-1 w-[180px] bg-[#1A1A2E] border border-[#2A2A42] rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.48)] py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="h-[40px] px-3 flex items-center bg-[#0066FF]/10 border-l-[3px] border-[#0066FF] cursor-pointer">
                <span className="mr-2">🇬🇧</span>
                <span className="font-sans text-[14px] text-white flex-1">English</span>
                <span className="font-mono text-[11px] text-[#48484F]">EN</span>
              </div>
              <div className="h-[40px] px-3 flex items-center hover:bg-[#242438] cursor-pointer pl-[15px]">
                <span className="mr-2">🇫🇷</span>
                <span className="font-sans text-[14px] text-white flex-1">Français</span>
                <span className="font-mono text-[11px] text-[#48484F]">FR</span>
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(isLight ? 'dark' : 'light')}
          className="w-[36px] h-[36px] bg-[#1A1A2E] border border-[#2A2A42] rounded-md flex items-center justify-center hover:bg-[#242438] transition-all duration-150 group relative"
          title="Switch to light/dark mode"
        >
          {isLight ? (
            <Sun className="w-[18px] h-[18px] text-[#8E8E93] group-hover:text-white transition-colors" />
          ) : (
            <Moon className="w-[18px] h-[18px] text-[#8E8E93] group-hover:text-white transition-colors" />
          )}
        </button>

        {/* Notification Bell */}
        <Link href="/notifications" className="w-[40px] h-[40px] bg-[#242438] rounded-md flex items-center justify-center relative hover:bg-[#2A2A42] transition-colors ml-1">
          <Bell className="w-[18px] h-[18px] text-[#8E8E93]" />
          <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#0066FF] border border-[#242438]"></div>
        </Link>

        {/* Share Identity */}
        <button className="h-[36px] bg-[#0066FF] hover:bg-[#0055D4] rounded-md px-4 flex items-center justify-center transition-colors ml-1">
          <Share2 className="w-4 h-4 text-white mr-2" />
          <span className="font-sans font-semibold text-[14px] text-white">Share My Identity</span>
        </button>
      </div>
    </div>
  )
}
