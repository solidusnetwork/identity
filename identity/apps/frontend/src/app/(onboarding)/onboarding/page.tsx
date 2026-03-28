import { OnboardingStepIndicator } from '@/components/onboarding/OnboardingStepIndicator'
import { Check, EyeOff, ShieldCheck, Key, Server } from 'lucide-react'
import Link from 'next/link'

export default function OnboardingWelcomePage() {
  return (
    <div className="min-h-screen bg-[#0A1628] flex flex-col font-sans relative overflow-x-hidden">
      <OnboardingStepIndicator currentStep={1} />

      <div className="flex-1 flex flex-col items-center justify-center px-6 mt-12 pb-20">
        <div className="w-full max-w-[520px] flex flex-col items-center text-center mx-auto">

          <div className="mb-8">
            <img
              src="/logos/solidus_icon.png"
              alt="Solidus"
              className="w-[64px] h-auto drop-shadow-[0_0_30px_rgba(0,102,255,0.3)]"
            />
          </div>

          <h1 className="text-[40px] font-bold text-white leading-[1.15]">
            Your digital identity.<br />Your rules.
          </h1>

          <p className="text-[16px] text-[#8E8E93] font-normal mt-4 max-w-[460px] leading-relaxed mx-auto">
            A Solidus DID is permanent, self-sovereign, and belongs to you alone. No company controls it. No company can revoke it.
          </p>

          <div className="mt-8 w-full bg-[#A8E600]/[0.08] border border-[#A8E600]/20 rounded-lg p-[16px_20px] flex flex-col">
            <div className="flex items-center gap-[10px] py-[6px]">
              <EyeOff className="w-4 h-4 text-[#A8E600] shrink-0" />
              <span className="text-[14px] text-white/80 font-normal text-left">Your data stays on your device</span>
            </div>
            <div className="flex items-center gap-[10px] py-[6px]">
              <ShieldCheck className="w-4 h-4 text-[#A8E600] shrink-0" />
              <span className="text-[14px] text-white/80 font-normal text-left">No email or phone number required to start</span>
            </div>
            <div className="flex items-center gap-[10px] py-[6px]">
              <Key className="w-4 h-4 text-[#A8E600] shrink-0" />
              <span className="text-[14px] text-white/80 font-normal text-left">You own your keys — Solidus never sees your private key</span>
            </div>
            <div className="flex items-center gap-[10px] py-[6px]">
              <Server className="w-4 h-4 text-[#A8E600] shrink-0" />
              <span className="text-[14px] text-white/80 font-normal text-left">Secured by 1,247 validator nodes on Solidus Network</span>
            </div>
          </div>

          <Link
            href="/onboarding/keygen"
            className="w-full h-12 bg-[#0066FF] hover:bg-[#0055D4] rounded-md font-medium text-[16px] text-white mt-8 transition-colors flex items-center justify-center"
          >
            Create My DID
          </Link>

          <div className="mt-3 text-[12px] text-[#8E8E93]">
            Already have a DID?{' '}
            <button className="text-[#0066FF] hover:underline font-medium">
              Import seed phrase &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
