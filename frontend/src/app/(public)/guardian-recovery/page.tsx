'use client'

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import Link from 'next/link'
import { Key, Eye, EyeOff, Clock, User, CheckCircle, XCircle } from 'lucide-react'

type RecoveryState = 'INITIATE' | 'AWAITING' | 'COMPLETE'

const steps = [
  { id: 'INITIATE', label: 'Request', index: 1 },
  { id: 'AWAITING', label: 'Guardian Approval', index: 2 },
  { id: 'COMPLETE', label: 'Identity Restored', index: 3 }
]

function StepCircles({ currentState }: { currentState: RecoveryState }) {
  const currentIndex = (steps.findIndex(s => s.id === currentState) ?? 0) + 1

  return (
    <div className="flex items-center gap-4 relative">
      <div className="absolute top-[14px] left-[28px] right-[28px] h-[1px] bg-[#2A2A42] z-0" />
      {steps.map((step) => {
        const isCompleted = step.index < currentIndex
        const isActive = step.index === currentIndex
        return (
          <div key={step.id} className="flex flex-col items-center relative z-10 gap-2 w-24">
            <div className={`w-[28px] h-[28px] rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-[#0066FF] text-white font-sans font-bold text-[11px]' : isCompleted ? 'bg-[#34C759] text-white' : 'bg-[#242438] text-[#48484F] font-sans font-medium text-[11px]'}`}>
              {isCompleted ? <CheckCircle className="w-[14px] h-[14px]" /> : step.index}
            </div>
            <span className={`font-sans font-semibold text-[11px] text-center ${isActive ? 'text-[#FFFFFF]' : isCompleted ? 'text-[#8E8E93]' : 'text-[#48484F]'}`}>
              {step.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default function GuardianRecoveryPage() {
  const [currentState, setCurrentState] = useState<RecoveryState>('INITIATE')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    if (currentState === 'AWAITING') {
      const timer = setTimeout(() => setCurrentState('COMPLETE'), 5000)
      return () => clearTimeout(timer)
    }
  }, [currentState])

  const handleInitiate = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentState('AWAITING')
  }

  return (
    <div className="min-h-screen bg-[#0A1628] font-sans text-white flex flex-col selection:bg-[#00D4FF] selection:text-[#0A1628]">
      {/* Recovery Header */}
      <header className="w-full h-[64px] bg-[#0A1628] border-b border-[#2A2A42] px-6 flex items-center justify-between shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logos/solidus_dark.png" alt="Solidus" className="h-6 w-auto" />
        </Link>

        <div className="hidden md:flex flex-1 justify-center">
          <StepCircles currentState={currentState} />
        </div>

        <button className="font-sans font-normal text-[13px] text-[#8E8E93] hover:text-[#FFFFFF] transition-colors">
          Need help? &rarr;
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full flex flex-col items-center pt-20 px-4 pb-12">
        {/* Mobile Step Circles */}
        <div className="md:hidden mb-12 flex justify-center w-full">
          <StepCircles currentState={currentState} />
        </div>

        <div className="w-full max-w-[560px] bg-[#1A1A2E] rounded-[16px] p-8 md:p-10 border border-[#2A2A42] shadow-[0_8px_24px_rgba(0,0,0,0.48)]">

          {currentState === 'INITIATE' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex flex-col">
              <div className="flex justify-center mb-5">
                <Key className="w-12 h-12 text-[#FF9500]" />
              </div>
              <h2 className="font-sans font-bold text-[28px] text-white text-center">Recover Your Identity</h2>
              <p className="font-sans font-normal text-[16px] text-[#8E8E93] text-center leading-[1.65] max-w-[440px] mx-auto mt-3">
                You've lost access to your seed phrase. Your guardians can approve a recovery request to restore your DID with a new key pair.
              </p>

              <form onSubmit={handleInitiate} className="mt-8 flex flex-col gap-5">
                <div className="flex flex-col">
                  <label className="font-sans font-semibold text-[12px] text-[#8E8E93] mb-[6px]">Your DID</label>
                  <input
                    type="text"
                    placeholder="did:solidus:mainnet:..."
                    className="w-full h-[48px] bg-[#242438] border border-[#2A2A42] rounded-[10px] px-4 font-mono text-[14px] text-white placeholder:text-[#48484F] focus:outline-none focus:border-[#0066FF] transition-colors"
                    required
                  />
                  <span className="font-sans font-normal text-[11px] text-[#48484F] mt-1.5">Enter the DID you want to recover.</span>
                </div>

                <div className="flex flex-col relative">
                  <label className="font-sans font-semibold text-[12px] text-[#8E8E93] mb-[6px]">New Passphrase</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new passphrase"
                      className="w-full h-[48px] bg-[#242438] border border-[#2A2A42] rounded-[10px] px-4 pr-11 font-sans text-[14px] text-white placeholder:text-[#48484F] focus:outline-none focus:border-[#0066FF] transition-colors"
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8E93] hover:text-white transition-colors">
                      {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col relative">
                  <label className="font-sans font-semibold text-[12px] text-[#8E8E93] mb-[6px]">Confirm Passphrase</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Confirm new passphrase"
                      className="w-full h-[48px] bg-[#242438] border border-[#2A2A42] rounded-[10px] px-4 pr-11 font-sans text-[14px] text-white placeholder:text-[#48484F] focus:outline-none focus:border-[#0066FF] transition-colors"
                      required
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8E93] hover:text-white transition-colors">
                      {showConfirm ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="w-full h-[52px] mt-2 bg-[#FF9500] hover:brightness-110 text-white font-sans font-bold text-[16px] rounded-[10px] transition-all">
                  Send Recovery Request to Guardians
                </button>
              </form>

              <p className="font-sans font-normal text-[12px] text-[#8E8E93] text-center mt-3 leading-[1.6]">
                Your guardians will receive an encrypted notification. You need 3 of your 5 guardians to approve.
              </p>
            </motion.div>
          )}

          {currentState === 'AWAITING' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex flex-col">
              <h2 className="font-sans font-bold text-[26px] text-white text-center">Waiting for Guardian Approvals</h2>
              <p className="font-sans font-normal text-[14px] text-[#8E8E93] text-center mt-2.5 mb-7">
                3 of 5 guardians must approve to restore your identity.
              </p>

              <div className="flex items-center justify-center gap-2 mb-6">
                <Clock className="w-4 h-4 text-[#FF9500]" />
                <span className="font-mono font-bold text-[14px] text-[#FF9500]">47:23:11</span>
                <span className="font-sans font-normal text-[12px] text-[#8E8E93]">remaining</span>
              </div>

              <div className="w-full flex flex-col items-center mb-6">
                <span className="font-sans font-medium text-[12px] text-[#8E8E93] mb-2">2 / 5 approved</span>
                <div className="w-full h-[6px] bg-[#242438] rounded-full overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '40%' }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                    className="absolute top-0 left-0 bottom-0 bg-[#FF9500] rounded-full"
                  />
                </div>
              </div>

              <div className="border border-[#2A2A42] rounded-[8px] overflow-hidden flex flex-col w-full">
                {[
                  { name: 'Alice', approved: true },
                  { name: 'Bob', approved: true },
                  { name: 'Carol', approved: false },
                  { name: 'David', approved: false },
                  { name: 'Eve', approved: false }
                ].map((guardian, i, arr) => (
                  <div key={guardian.name} className={`flex items-center justify-between p-3 px-4 bg-[#1A1A2E] ${i < arr.length - 1 ? 'border-b border-[#2A2A42]' : ''}`}>
                    <div className="flex items-center gap-2.5">
                      <User className="w-4 h-4 text-[#8E8E93]" />
                      <span className="font-sans font-medium text-[14px] text-white">{guardian.name}</span>
                    </div>
                    {guardian.approved ? (
                      <div className="flex items-center gap-1.5 bg-[rgba(52,199,89,0.1)] px-2.5 py-1 rounded">
                        <CheckCircle className="w-3.5 h-3.5 text-[#34C759]" />
                        <span className="font-sans font-semibold text-[12px] text-[#34C759]">Approved</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 bg-[rgba(255,149,0,0.1)] px-2.5 py-1 rounded">
                        <Clock className="w-3.5 h-3.5 text-[#FF9500]" />
                        <span className="font-sans font-semibold text-[12px] text-[#FF9500]">Pending</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => setCurrentState('INITIATE')}
                className="w-full h-[36px] mt-6 flex items-center justify-center border border-[rgba(255,59,48,0.3)] rounded-[6px] font-sans font-medium text-[13px] text-[#FF3B30] hover:bg-[rgba(255,59,48,0.05)] transition-colors"
              >
                Cancel Request
              </button>
            </motion.div>
          )}

          {currentState === 'COMPLETE' && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="flex flex-col items-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.1, 1] }} transition={{ duration: 0.4, ease: 'easeOut' }}>
                <CheckCircle className="w-16 h-16 text-[#34C759]" />
              </motion.div>

              <h2 className="font-sans font-bold text-[28px] text-[#34C759] text-center mt-5">Identity Restored</h2>

              <p className="font-sans font-normal text-[16px] text-[#8E8E93] text-center leading-[1.65] max-w-[420px] mx-auto mt-3">
                Your DID is now controlled by your new key pair. All active connections and credentials have been preserved.
              </p>

              <p className="font-sans font-normal text-[12px] text-[#48484F] text-center mt-2">
                New key registered at Block #4,821,047.
              </p>

              <Link
                href="/dashboard"
                className="w-full h-[52px] mt-8 bg-[#0066FF] hover:bg-[#0052CC] text-white font-sans font-bold text-[16px] rounded-[10px] transition-colors flex items-center justify-center"
              >
                Go to Dashboard
              </Link>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}
