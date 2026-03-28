'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { Check, Copy, Fingerprint, Key, Link2, Award, WifiOff } from 'lucide-react'
import { OnboardingStepIndicator } from '@/components/onboarding/OnboardingStepIndicator'

export default function OnboardingDonePage() {
  const router = useRouter()
  const [appStatus] = useState<'success' | 'error'>('success')
  const [copied, setCopied] = useState(false)
  const [DID, setDID] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('identityDid')
    if (stored) setDID(stored)
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(DID)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#0A1628] flex flex-col font-sans relative overflow-x-hidden">
      <OnboardingStepIndicator currentStep={6} />

      <div className="flex-1 flex flex-col items-center justify-center px-6 mt-8 pb-20">
        <div className="w-full max-w-[480px] flex flex-col items-center mx-auto">

          {appStatus === 'success' ? (
            <>
              {/* Pulsing fingerprint illustration */}
              <motion.div
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-[120px] h-[120px] rounded-full flex items-center justify-center bg-[radial-gradient(circle,_#A8E600_0%,_#00D4FF_100%)] mt-8 shadow-[0_0_40px_rgba(0,212,255,0.2)] shrink-0"
              >
                <Fingerprint className="w-[64px] h-[64px] text-white" />
              </motion.div>

              <h1 className="text-[36px] font-bold text-white text-center mt-8 leading-[1.15]">
                Your DID is live.
              </h1>
              <p className="text-[16px] text-[#8E8E93] font-normal text-center mt-4 max-w-[420px]">
                You now have a permanent, self-sovereign digital identity secured by the Solidus Network.
              </p>

              {/* DID Summary Card */}
              <div className="w-full bg-[#1A1A2E] rounded-[12px] p-[24px] mt-8 border border-[#2A2A42]">
                <span className="text-[11px] font-semibold text-[#8E8E93] tracking-widest uppercase mb-3 block">
                  Your Solidus DID
                </span>

                <div className="flex items-center justify-between mb-5">
                  <span className="font-mono text-[15px] font-medium text-white truncate mr-4">{DID}</span>
                  <button onClick={handleCopy} className="text-[#8E8E93] hover:text-white transition-colors shrink-0">
                    {copied ? <Check className="w-4 h-4 text-[#34C759]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="h-[1px] w-full bg-[#242438] mb-5" />

                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Key className="w-[18px] h-[18px] text-[#A8E600]" />
                      <span className="text-[14px] text-white font-medium">Keys generated</span>
                    </div>
                    <span className="px-2 py-1 bg-[#34C759]/10 text-[#34C759] text-[11px] font-medium rounded uppercase tracking-wide">
                      On-device
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Link2 className="w-[18px] h-[18px] text-[#0066FF]" />
                      <span className="text-[14px] text-white font-medium">DID registered</span>
                    </div>
                    <span className="px-2 py-1 bg-[#34C759]/10 text-[#34C759] text-[11px] font-medium rounded uppercase tracking-wide">
                      On-chain
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Award className="w-[18px] h-[18px] text-[#00D4FF]" />
                      <span className="text-[14px] text-white font-medium">Credentials</span>
                    </div>
                    <span className="px-2 py-1 bg-[#8E8E93]/10 text-[#8E8E93] text-[11px] font-medium rounded uppercase tracking-wide">
                      0 credentials
                    </span>
                  </div>
                </div>
              </div>

              {/* Animated progress bar — starts at 80%, fills to 100% */}
              <div className="w-full mt-6 h-[4px] rounded-full bg-[#242438] overflow-hidden">
                <motion.div
                  initial={{ width: '80%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="h-full bg-[#0066FF] rounded-full"
                />
              </div>

              {/* CTA */}
              <div className="w-full flex flex-col gap-3 mt-8">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full h-12 bg-[#0066FF] hover:bg-[#0055D4] rounded-md font-medium text-[16px] text-white flex items-center justify-center transition-colors"
                >
                  Enter Your Identity Hub &rarr;
                </button>
              </div>
            </>
          ) : (
            /* Error edge state */
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center mt-12 text-center w-full"
            >
              <div className="w-[80px] h-[80px] rounded-full bg-[#FF3B30]/10 flex items-center justify-center mb-6">
                <WifiOff className="w-[48px] h-[48px] text-[#FF3B30]" />
              </div>
              <h3 className="text-[24px] font-semibold text-white mb-3">Couldn&apos;t register on-chain</h3>
              <p className="text-[16px] text-[#8E8E93] font-normal mb-8 max-w-[380px]">
                Your keys were generated locally. On-chain registration failed.
              </p>

              <button
                onClick={() => router.push('/onboarding/done')}
                className="w-full h-12 bg-[#0066FF] hover:bg-[#0055D4] rounded-md font-medium text-[16px] text-white flex items-center justify-center transition-colors mb-4"
              >
                Retry Registration
              </button>

              <p className="text-[12px] text-[#8E8E93] max-w-[340px] leading-relaxed">
                Your DID is safely stored locally and will sync when connection is restored.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
