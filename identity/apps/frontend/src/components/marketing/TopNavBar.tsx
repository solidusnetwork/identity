'use client'

import React from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Globe, ChevronDown, Moon, Sun } from 'lucide-react'

export function TopNavBar() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="w-full h-16 bg-white dark:bg-[#0A1628] border-b border-[#E0E0E5] dark:border-[#2A2A42] px-6 lg:px-[120px] flex items-center justify-between sticky top-0 z-50 transition-colors duration-200">
      <Link href="/" className="flex items-center gap-3">
        {/* Light mode */}
        <img src="/logos/solidus_light.png" alt="Solidus" className="h-6 w-auto dark:hidden" />
        {/* Dark mode */}
        <img src="/logos/solidus_dark.png" alt="Solidus" className="h-6 w-auto hidden dark:block" />
      </Link>

      <nav className="hidden md:flex items-center gap-8">
        <Link href="/how-it-works" className="font-sans font-normal text-[14px] text-[#0A1628] dark:text-white hover:text-[#0066FF] transition-colors">
          How It Works
        </Link>
        <Link href="/trust-score" className="font-sans font-normal text-[14px] text-[#0A1628] dark:text-white hover:text-[#0066FF] transition-colors">
          Trust Score
        </Link>
        <Link href="/credentials" className="font-sans font-normal text-[14px] text-[#0A1628] dark:text-white hover:text-[#0066FF] transition-colors">
          Credentials
        </Link>
        <Link href="/privacy" className="font-sans font-normal text-[14px] text-[#0A1628] dark:text-white hover:text-[#0066FF] transition-colors">
          Privacy
        </Link>
        <Link href="/developers" className="font-sans font-normal text-[14px] text-[#0A1628] dark:text-white hover:text-[#0066FF] transition-colors">
          Developers
        </Link>
      </nav>

      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle theme={theme} setTheme={setTheme} />
        <Link href="/login" className="h-[36px] px-[14px] border border-[#0A1628] dark:border-white/20 rounded-md font-sans text-[14px] font-medium text-[#0A1628] dark:text-white hover:bg-[#F2F2F7] dark:hover:bg-white/10 transition-colors hidden sm:flex items-center">
          Sign In
        </Link>
        <Link href="/onboarding" className="h-[36px] px-[16px] bg-[#0066FF] rounded-md font-sans text-[14px] font-medium text-white hover:bg-[#0052CC] transition-colors flex items-center">
          Create Your DID
        </Link>
      </div>
    </header>
  )
}

function LanguageSwitcher() {
  return (
    <button className="h-[36px] bg-[#F2F2F7] dark:bg-[#1A1A2E] border border-[#E0E0E5] dark:border-[#2A2A42] rounded-md px-3 hidden sm:flex items-center gap-2 hover:bg-[#E0E0E5] dark:hover:bg-[#242438] transition-colors">
      <Globe className="w-[18px] h-[18px] text-[#8E8E93]" />
      <span className="font-sans font-medium text-[12px] text-[#8E8E93]">EN</span>
      <ChevronDown className="w-[12px] h-[12px] text-[#8E8E93]" />
    </button>
  )
}

function ThemeToggle({ theme, setTheme }: { theme: string | undefined; setTheme: (t: string) => void }) {
  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="w-[36px] h-[36px] bg-[#F2F2F7] dark:bg-[#1A1A2E] border border-[#E0E0E5] dark:border-[#2A2A42] rounded-md flex items-center justify-center hover:bg-[#E0E0E5] dark:hover:bg-[#242438] transition-colors group"
      title="Switch to light/dark mode"
    >
      {theme === 'light' ? (
        <Moon className="w-[18px] h-[18px] text-[#666666] group-hover:text-[#0A1628] transition-colors" />
      ) : (
        <Sun className="w-[18px] h-[18px] text-[#8E8E93] group-hover:text-white transition-colors" />
      )}
    </button>
  )
}
