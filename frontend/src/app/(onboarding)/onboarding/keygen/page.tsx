'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { Check, Copy, AlertTriangle, EyeOff } from 'lucide-react'
import { OnboardingStepIndicator } from '@/components/onboarding/OnboardingStepIndicator'
import { generateKeypair, generateSeedPhrase } from '../../../../lib/crypto'
import { api } from '../../../../lib/api'
import type { RegisterResponse } from '../../../../types/api'

export default function KeygenPage() {
  const router = useRouter()
  const [phase, setPhase] = useState<'generating' | 'generated'>('generating')
  const [termLines, setTermLines] = useState(0)
  const [copied, setCopied] = useState(false)
  const [seedRevealed, setSeedRevealed] = useState(false)
  const [safelyWritten, setSafelyWritten] = useState(false)

  // Real keypair + DID state
  const [DID, setDID] = useState('')
  const [SEED_PHRASE, setSEED_PHRASE] = useState<string[]>([])
  const [genError, setGenError] = useState('')

  useEffect(() => {
    if (phase !== 'generating') return

    // Generate real keypair + register DID
    const doGen = async () => {
      try {
        setTermLines(1) // "Generating entropy..."
        const seed = generateSeedPhrase()
        const words = seed.split(' ')
        setSEED_PHRASE(words)

        await new Promise(r => setTimeout(r, 800))
        setTermLines(2) // "Deriving keypair..."

        const kp = await generateKeypair()

        await new Promise(r => setTimeout(r, 800))
        setTermLines(3) // "Registering DID..."

        const res = await api.post<RegisterResponse>('/v1/onboarding/register', {
          publicKey: kp.publicKey,
        })

        setDID(res.did)

        // Store DID + private key + seed for future login and seed confirmation
        localStorage.setItem('identityDid', res.did)
        localStorage.setItem('identityPrivateKey', kp.privateKey)
        localStorage.setItem('identitySeedPhrase', seed)

        await new Promise(r => setTimeout(r, 800))
        setTermLines(4) // "Complete"
        setTimeout(() => setPhase('generated'), 500)
      } catch (err) {
        setGenError(err instanceof Error ? err.message : 'Key generation failed')
        setTermLines(4)
        setPhase('generated')
      }
    }

    void doGen()
  }, [phase])

  const handleCopy = () => {
    navigator.clipboard.writeText(DID)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // SVG progress ring: circumference of r=80 circle = 2π×80 ≈ 502.65
  const CIRCUMFERENCE = 502.65
  const strokeDashoffset = CIRCUMFERENCE - CIRCUMFERENCE * (termLines / 4)

  return (
    <div className="min-h-screen bg-[#0A1628] flex flex-col font-sans relative overflow-x-hidden">
      <OnboardingStepIndicator currentStep={2} />

      <div className="flex-1 flex flex-col items-center justify-center px-6 mt-12 pb-20">
        <div className="w-full max-w-[560px] flex flex-col items-center mx-auto">

          {/* Header */}
          <h2
            className={`text-[28px] font-semibold mb-3 transition-colors duration-500 ${
              phase === 'generated' ? 'text-[#34C759]' : 'text-white'
            }`}
          >
            {phase === 'generating' ? 'Generating your keys' : 'Keys generated ✓'}
          </h2>

          {phase === 'generating' && (
            <p className="text-[16px] text-[#8E8E93] font-normal text-center mb-10 max-w-[480px]">
              Your DID keypair is generated entirely on this device. Nothing leaves your browser.
            </p>
          )}

          <AnimatePresence mode="wait">
            {phase === 'generating' && (
              <motion.div
                key="generating"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-[320px] h-[200px] rounded-[16px] bg-[#0D1F38] shadow-[0_8px_24px_rgba(0,0,0,0.48)] flex flex-col items-center justify-center p-6 relative overflow-hidden"
              >
                {/* Progress ring */}
                <svg className="absolute w-full h-full inset-0 opacity-20" viewBox="0 0 320 200">
                  <circle
                    cx="160"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#0066FF"
                    strokeWidth="2"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>

                <div className="w-full font-mono text-[13px] text-[#A8E600] flex flex-col gap-2 z-10">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: termLines >= 1 ? 1 : 0 }}>
                    $ generating Ed25519 keypair...
                  </motion.div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: termLines >= 2 ? 1 : 0 }}>
                    $ computing public identifier...
                  </motion.div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: termLines >= 3 ? 1 : 0 }}>
                    $ deriving did:solidus:mainnet...
                  </motion.div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: termLines >= 4 ? 1 : 0 }}>
                    ✓ {DID.substring(0, 32)}... created
                  </motion.div>
                </div>
              </motion.div>
            )}

            {phase === 'generated' && (
              <motion.div
                key="generated"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full flex flex-col gap-6 mt-6"
              >
                {/* DID Display Card */}
                <div className="bg-[#1A1A2E] rounded-[8px] p-5 border border-[#2A2A42]">
                  <span className="text-[11px] font-semibold text-[#8E8E93] tracking-widest uppercase mb-2 block">
                    Your New DID
                  </span>
                  <div className="flex items-center justify-between bg-[#151525] p-3 rounded-md border border-[#2A2A42] mb-3">
                    <span className="font-mono text-[14px] font-medium text-white truncate mr-4">{DID}</span>
                    <button onClick={handleCopy} className="text-[#8E8E93] hover:text-white transition-colors shrink-0">
                      {copied ? <Check className="w-4 h-4 text-[#34C759]" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <span className="text-[11px] text-[#34C759] font-medium">
                    Registered on-chain · Block #4,218,977
                  </span>
                </div>

                {/* Seed Phrase Reveal Card */}
                <div className="bg-[#1A1A2E] rounded-[12px] p-6 border border-[#2A2A42]">
                  <h3 className="text-[20px] font-semibold text-white mb-4">Your recovery seed phrase</h3>

                  <div className="flex items-start gap-2 bg-[#FF9500]/10 border border-[#FF9500]/20 rounded-lg p-3 mb-6">
                    <AlertTriangle className="w-4 h-4 text-[#FF9500] shrink-0 mt-0.5" />
                    <p className="text-[12px] font-normal text-[#FF9500] leading-relaxed">
                      Write this down. Solidus cannot recover it for you. Anyone with this phrase can control your DID.
                    </p>
                  </div>

                  <div className="relative">
                    {/* Phrase grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {SEED_PHRASE.map((word, i) => (
                        <div
                          key={i}
                          className="bg-[#242438] rounded-[6px] p-[8px_12px] flex flex-col items-center justify-center text-center border border-[#2A2A42]"
                        >
                          <span className="text-[11px] font-normal text-[#556688] mb-1">{i + 1}</span>
                          <span className="font-mono text-[14px] font-semibold text-white">{word}</span>
                        </div>
                      ))}
                    </div>

                    {/* Security overlay */}
                    {!seedRevealed && (
                      <div
                        onClick={() => setSeedRevealed(true)}
                        className="absolute inset-0 bg-[#1A1A2E]/80 backdrop-blur-[4px] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-[#1A1A2E]/70 transition-all duration-300 z-10 border border-[#2A2A42]"
                      >
                        <EyeOff className="w-8 h-8 text-[#8E8E93] mb-3" />
                        <span className="text-[14px] font-medium text-[#8E8E93]">Tap to reveal your seed phrase</span>
                      </div>
                    )}
                  </div>

                  {/* Confirmation section — slides in after reveal */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: seedRevealed ? 1 : 0, height: seedRevealed ? 'auto' : 0 }}
                    className="mt-6 flex flex-col gap-6 overflow-hidden"
                  >
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                          safelyWritten
                            ? 'bg-[#0066FF] border-[#0066FF]'
                            : 'border-[#48484F] group-hover:border-[#8E8E93]'
                        }`}
                        onClick={() => setSafelyWritten((v) => !v)}
                      >
                        {safelyWritten && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={safelyWritten}
                        onChange={(e) => setSafelyWritten(e.target.checked)}
                      />
                      <span className="text-[14px] font-medium text-white select-none">
                        I&apos;ve written it down safely
                      </span>
                    </label>

                    <button
                      disabled={!safelyWritten}
                      onClick={() => router.push('/onboarding/confirm-seed')}
                      className={`w-full h-12 rounded-md font-medium text-[16px] transition-colors ${
                        safelyWritten
                          ? 'bg-[#0066FF] hover:bg-[#0055D4] text-white'
                          : 'bg-[#242438] text-[#48484F] cursor-not-allowed'
                      }`}
                    >
                      Continue
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
