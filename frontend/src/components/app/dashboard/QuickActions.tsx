import { Share2, PlusCircle, Scan, type LucideIcon } from 'lucide-react'

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

      <ActionCard
        icon={Share2}
        iconColor="#0066FF"
        title="Share Identity"
        subtitle="QR or link"
      />

      <ActionCard
        icon={PlusCircle}
        iconColor="#34C759"
        title="Add Credential"
        subtitle="Scan or paste"
      />

      <ActionCard
        icon={Scan}
        iconColor="#00D4FF"
        title="Scan QR"
        subtitle="Verify request"
      />

    </div>
  )
}

function ActionCard({ icon: Icon, iconColor, title, subtitle }: { icon: LucideIcon; iconColor: string; title: string; subtitle: string }) {
  return (
    <div className="bg-[#1A1A2E] rounded-lg p-5 shadow-[0_2px_8px_rgba(0,0,0,0.32)] cursor-pointer hover:shadow-[0_0_24px_rgba(0,212,255,0.15)] transition-shadow flex flex-col items-start group">
      <Icon
        className="w-7 h-7 mb-3"
        style={{ color: iconColor }}
      />
      <span className="font-sans font-medium text-[14px] text-white mb-0.5 group-hover:text-[#00D4FF] transition-colors">
        {title}
      </span>
      <span className="font-sans font-normal text-[12px] text-[#8E8E93]">
        {subtitle}
      </span>
    </div>
  )
}
