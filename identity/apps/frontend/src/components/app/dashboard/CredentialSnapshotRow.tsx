import { Mail, CheckCircle, ShieldCheck, Briefcase, Clock, type LucideIcon } from 'lucide-react'
import Link from 'next/link'

export function CredentialSnapshotRow() {
  return (
    <div className="w-full mb-8">

      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="font-sans font-semibold text-[18px] text-white">
          Credentials
        </h3>
        <Link href="/my-credentials" className="font-sans font-medium text-[14px] text-[#0066FF] hover:underline">
          See All Credentials
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x">

        <CredentialMiniCard
          icon={Mail}
          accent="#0066FF"
          name="Email Verified"
          issuer="Solidus Identity"
          expiryState={1}
        />

        <CredentialMiniCard
          icon={ShieldCheck}
          accent="#00D4FF"
          name="KYC Level 2"
          issuer="Jumio Verification"
          expiryState={1}
        />

        <CredentialMiniCard
          icon={Briefcase}
          accent="#FF9500"
          name="Professional Lic..."
          issuer="State Medical Board"
          expiryState={2}
          daysLeft={18}
        />

        <CredentialMiniCard
          icon={CheckCircle}
          accent="#34C759"
          name="Phone Verified"
          issuer="Solidus Identity"
          expiryState={3}
          daysLeft={2}
        />

      </div>
    </div>
  )
}

function CredentialMiniCard({
  icon: Icon,
  accent,
  name,
  issuer,
  expiryState,
  daysLeft
}: {
  icon: LucideIcon
  accent: string
  name: string
  issuer: string
  expiryState: 1 | 2 | 3
  daysLeft?: number
}) {
  // Determine border color based on expiry state
  let borderColor = accent
  if (expiryState === 2) borderColor = '#FF9500'
  if (expiryState === 3) borderColor = '#FF3B30'

  return (
    <div
      className="bg-[#1A1A2E] rounded-lg p-3 w-[200px] shrink-0 snap-start flex flex-col relative"
      style={{ borderLeft: `3px solid ${borderColor}` }}
    >
      <div className="flex items-center mb-2">
        <Icon className="w-5 h-5 mr-2" style={{ color: accent }} />
        <span className="font-sans font-semibold text-[13px] text-white truncate">
          {name}
        </span>
      </div>

      <div className="mt-auto h-5 flex items-end">
        {expiryState === 1 && (
          <span className="font-sans font-normal text-[11px] text-[#8E8E93] truncate w-full">
            {issuer}
          </span>
        )}

        {expiryState === 2 && (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-[3px]">
              <Clock className="w-2.5 h-2.5 text-[#FF9500]" />
              <span className="font-sans font-medium text-[10px] text-[#FF9500]">
                Expires in {daysLeft}d
              </span>
            </div>
            <Link href="/my-credentials" className="font-sans font-semibold text-[10px] text-[#0066FF] hover:underline">
              Renew →
            </Link>
          </div>
        )}

        {expiryState === 3 && (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-[3px]">
              <Clock className="w-2.5 h-2.5 text-[#FF3B30]" />
              <span className="font-sans font-medium text-[10px] text-[#FF3B30]">
                Expires in {daysLeft}d
              </span>
            </div>
            <Link href="/my-credentials" className="font-sans font-bold text-[10px] text-[#0066FF] hover:underline">
              Renew now →
            </Link>
          </div>
        )}
      </div>

    </div>
  )
}
