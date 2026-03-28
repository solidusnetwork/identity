import { Share2, ShieldCheck, CheckCircle, Link as LinkIcon, AlertTriangle, type LucideIcon } from 'lucide-react'
import Link from 'next/link'

export function RecentActivityFeed() {
  return (
    <div className="w-full bg-[#1A1A2E] rounded-lg p-6 mb-6">

      <div className="flex items-center justify-between mb-4">
        <h3 className="font-sans font-semibold text-[18px] text-white">
          Recent Activity
        </h3>
        <Link href="/activity" className="font-sans font-medium text-[14px] text-[#0066FF] hover:underline">
          View All
        </Link>
      </div>

      <div className="flex flex-col">

        <ActivityRow
          icon={Share2} iconColor="#0066FF" bg="rgba(0,102,255,0.15)"
          text={<><strong>Email credential</strong> shared with Acme Corp</>}
          time="2 hours ago"
          badgeText="Shared" badgeColor="#0066FF" badgeBg="rgba(0,102,255,0.15)"
        />

        <ActivityRow
          icon={ShieldCheck} iconColor="#00D4FF" bg="rgba(0,212,255,0.15)"
          text={<><strong>KYC Level 2</strong> credential issued</>}
          time="Yesterday at 14:32"
          badgeText="Issued" badgeColor="#34C759" badgeBg="rgba(52,199,89,0.15)"
        />

        <ActivityRow
          icon={CheckCircle} iconColor="#34C759" bg="rgba(52,199,89,0.15)"
          text={<><strong>Phone number</strong> verified successfully</>}
          time="3 days ago"
          badgeText="Verified" badgeColor="#34C759" badgeBg="rgba(52,199,89,0.15)"
        />

        <ActivityRow
          icon={LinkIcon} iconColor="#A8E600" bg="rgba(168,230,0,0.15)"
          text={<><strong>DeFi Exchange</strong> connected to your wallet</>}
          time="1 week ago"
          badgeText="Connected" badgeColor="#00D4FF" badgeBg="rgba(0,212,255,0.15)"
        />

        <ActivityRow
          icon={AlertTriangle} iconColor="#FF9500" bg="rgba(255,149,0,0.15)"
          text={<><strong>Professional License</strong> expires in 18 days</>}
          time="System"
          badgeText="Expiring" badgeColor="#FF9500" badgeBg="rgba(255,149,0,0.15)"
          isLast
        />

      </div>
    </div>
  )
}

interface ActivityRowProps {
  icon: LucideIcon
  iconColor: string
  bg: string
  text: React.ReactNode
  time: string
  badgeText: string
  badgeColor: string
  badgeBg: string
  isLast?: boolean
}

function ActivityRow({ icon: Icon, iconColor, bg, text, time, badgeText, badgeColor, badgeBg, isLast = false }: ActivityRowProps) {
  return (
    <div className={`flex items-center h-12 gap-3 ${isLast ? '' : 'border-b border-[#2A2A42]'}`}>

      <div
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: bg }}
      >
        <Icon className="w-[18px] h-[18px]" style={{ color: iconColor }} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 justify-center">
        <span className="font-sans font-normal text-[14px] text-white truncate leading-tight">
          {text}
        </span>
        <span className="font-sans font-normal text-[12px] text-[#8E8E93] leading-tight mt-0.5">
          {time}
        </span>
      </div>

      <div
        className="rounded px-2 py-0.5 shrink-0"
        style={{ backgroundColor: badgeBg }}
      >
        <span
          className="font-sans font-medium text-[11px]"
          style={{ color: badgeColor }}
        >
          {badgeText}
        </span>
      </div>

    </div>
  )
}
