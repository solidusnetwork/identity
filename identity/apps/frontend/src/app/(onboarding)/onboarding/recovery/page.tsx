'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { UserPlus } from 'lucide-react'
import { OnboardingStepIndicator } from '@/components/onboarding/OnboardingStepIndicator'

interface ContactRowProps {
  name: string
  did: string
  status: 'Confirmed' | 'Pending'
  initials: string
  avatarColor: string
}

function ContactRow({ name, did, status, initials, avatarColor }: ContactRowProps) {
  return (
    <div className="flex items-center gap-3 w-full p-2">
      {/* Avatar — initials fallback avoids external image dependency */}
      <div
        className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-[14px] font-semibold text-white"
        style={{ backgroundColor: avatarColor }}
      >
        {initials}
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-[14px] font-semibold text-white truncate">{name}</span>
        <span className="font-mono text-[11px] text-[#8E8E93] truncate">{did}</span>
      </div>
      <div
        className={`px-2 py-1 rounded-[4px] text-[11px] font-medium shrink-0 uppercase tracking-wide ${
          status === 'Confirmed'
            ? 'bg-[#34C759]/10 text-[#34C759]'
            : 'bg-[#FF9500]/10 text-[#FF9500]'
        }`}
      >
        {status}
      </div>
    </div>
  )
}

const MOCK_CONTACTS: ContactRowProps[] = [
  {
    name: 'Alice Chen',
    did: 'did:solidus:mainnet:aLi7bX9fKm2QwPz8...',
    status: 'Confirmed',
    initials: 'AC',
    avatarColor: '#0066FF',
  },
  {
    name: 'Marcus Johnson',
    did: 'did:solidus:mainnet:mAr9cJ4vXn8LpTk3...',
    status: 'Pending',
    initials: 'MJ',
    avatarColor: '#34C759',
  },
]

export default function SocialRecoveryPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#0A1628] flex flex-col font-sans relative overflow-x-hidden">
      <OnboardingStepIndicator currentStep={5} />

      <div className="flex-1 flex flex-col items-center justify-center px-6 mt-12 pb-20">
        <div className="w-full max-w-[520px] flex flex-col mx-auto">

          {/* Header row — title centered, skip right-aligned */}
          <div className="w-full relative flex flex-col sm:flex-row items-center justify-center mb-3 min-h-[32px]">
            <h2 className="text-[28px] font-semibold text-white text-center sm:absolute sm:inset-x-0 mx-auto w-fit z-0">
              Set up social recovery
            </h2>
            <Link
              href="/onboarding/done"
              className="mt-2 sm:mt-0 sm:absolute sm:right-0 text-[14px] font-normal text-[#8E8E93] hover:text-white transition-colors z-10"
            >
              Skip for now &rarr;
            </Link>
          </div>

          <p className="text-[16px] text-[#8E8E93] font-normal text-center mb-8 max-w-[480px] mx-auto">
            Add 3&ndash;5 trusted contacts. If you lose your seed phrase, 3 of them can approve recovery of your DID.
          </p>

          {/* Recovery contact card */}
          <div className="w-full bg-[#1A1A2E] rounded-[12px] p-[20px_24px] flex flex-col gap-3 border border-[#2A2A42]">
            {MOCK_CONTACTS.map((contact) => (
              <ContactRow key={contact.did} {...contact} />
            ))}

            {/* Add contact row */}
            <button className="w-full mt-2 border border-dashed border-[#2A2A42] rounded-[8px] p-[16px] flex items-center justify-center gap-2 hover:bg-[#242438] transition-colors">
              <UserPlus className="w-5 h-5 text-[#0066FF]" />
              <span className="text-[14px] font-normal text-[#0066FF]">Add a recovery contact</span>
            </button>
          </div>

          {/* Info card */}
          <div className="mt-6 w-full bg-[#0066FF]/[0.08] rounded-[8px] p-[16px_20px]">
            <p className="text-[13px] font-normal text-[#8E8E93] leading-[1.6]">
              Recovery contacts do not have access to your DID. They hold only an encrypted key fragment. 3-of-5 are
              needed to approve a recovery request.
            </p>
          </div>

          {/* Continue button */}
          <button
            onClick={() => router.push('/onboarding/done')}
            className="w-full h-12 mt-8 bg-[#0066FF] hover:bg-[#0055D4] rounded-md font-medium text-[16px] text-white transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
