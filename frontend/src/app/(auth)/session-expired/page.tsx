'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Clock, Fingerprint, CheckCircle } from 'lucide-react'

function SessionExpiredContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [biometricState, setBiometricState] = useState<'idle' | 'prompt' | 'success' | 'failure'>('idle')
  const [failureCount, setFailureCount] = useState(0)
  const [pinValue, setPinValue] = useState('')

  // Auto-prompt biometric 1s after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerBiometric()
    }, 1000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Browser back prevention — redirect to login
  useEffect(() => {
    const handlePopState = () => {
      router.push('/login')
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [router])

  // Auto-redirect on success
  useEffect(() => {
    if (biometricState === 'success') {
      const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard'
      const timer = setTimeout(() => {
        router.push(callbackUrl)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [biometricState, router, searchParams])

  const triggerBiometric = () => {
    setBiometricState('prompt')

    // Mock: attempt 1 = failure (1.5s), attempt 2+ = success (1s)
    const isFirstAttempt = failureCount === 0
    const delay = isFirstAttempt ? 1500 : 1000

    setTimeout(() => {
      if (isFirstAttempt) {
        setBiometricState('failure')
        setFailureCount((prev) => prev + 1)
        // Return to idle after 2s so user can try again
        setTimeout(() => setBiometricState('idle'), 2000)
      } else {
        setBiometricState('success')
      }
    }, delay)
  }

  const handleVerifyClick = () => {
    triggerBiometric()
  }

  const handleStartNewSession = () => {
    router.push('/login')
  }

  return (
    <div className="w-full max-w-[440px] px-4">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <Clock className="w-16 h-16 text-[#FF9500] mb-3" />
        <h2 className="font-sans font-semibold text-[28px] text-white leading-tight">
          Your session has expired
        </h2>
        <p className="font-sans font-normal text-[16px] text-[#8E8E93] mt-3 leading-[1.6] max-w-[360px]">
          For your security, your session automatically expired after 30 minutes of inactivity.
          Re-authenticate to continue where you left off.
        </p>
      </div>

      {/* Action Card */}
      <div className="w-full bg-[#1A1A2E] rounded-[12px] p-7 shadow-[0_2px_8px_rgba(0,0,0,0.32)]">
        <div className="min-h-[160px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {/* IDLE */}
            {biometricState === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col w-full"
              >
                <p className="font-sans font-normal text-[14px] text-[#8E8E93] mb-4 text-center">
                  Your identity data is still here. Just confirm it&apos;s you.
                </p>
                <button
                  onClick={handleVerifyClick}
                  className="w-full h-[48px] bg-[#0066FF] hover:bg-[#0052CC] text-white font-sans font-semibold text-[16px] rounded-[6px] flex items-center justify-center transition-all shadow-[0_4px_16px_rgba(0,102,255,0.35)]"
                >
                  <Fingerprint className="w-5 h-5 mr-2" />
                  Re-authenticate with Biometric
                </button>
              </motion.div>
            )}

            {/* PROMPT */}
            {biometricState === 'prompt' && (
              <motion.div
                key="prompt"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center justify-center w-full"
              >
                <div className="relative w-20 h-20 rounded-full bg-[rgba(0,102,255,0.08)] flex items-center justify-center border-2 border-[rgba(0,102,255,0.40)]">
                  <motion.div
                    animate={{ scale: [1, 1.12, 1], opacity: [1, 0.6, 1] }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'easeOut' }}
                    className="absolute inset-0 rounded-full border-2 border-[rgba(0,102,255,0.40)]"
                  />
                  <Fingerprint className="w-8 h-8 text-[#0066FF] relative z-10" />
                </div>
                <p className="font-sans font-normal text-[12px] text-[#8E8E93] mt-4 text-center">
                  Waiting for biometric confirmation...
                </p>
              </motion.div>
            )}

            {/* FAILURE */}
            {biometricState === 'failure' && (
              <motion.div
                key="failure"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center justify-center w-full"
              >
                <motion.div
                  animate={{ x: [-4, 4, -4, 4, 0] }}
                  transition={{ duration: 0.3 }}
                  className="w-20 h-20 rounded-full bg-[rgba(255,59,48,0.08)] flex items-center justify-center border-2 border-[rgba(255,59,48,0.40)]"
                >
                  <Fingerprint className="w-8 h-8 text-[#FF3B30]" />
                </motion.div>
                <p className="font-sans font-normal text-[12px] text-[#FF3B30] mt-4 text-center">
                  Biometric failed — please try again.
                </p>
                {failureCount >= 3 && (
                  <div className="mt-4 w-full flex flex-col gap-2">
                    <input
                      type="password"
                      inputMode="numeric"
                      maxLength={6}
                      value={pinValue}
                      onChange={(e) => setPinValue(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter PIN"
                      className="w-full h-[44px] bg-[#242438] border border-[#2A2A42] rounded-[6px] px-3 font-mono text-[16px] text-white placeholder:text-[#48484F] focus:outline-none focus:border-[#0066FF] text-center tracking-[0.3em] transition-colors"
                    />
                    <button
                      disabled={pinValue.length < 4}
                      onClick={() => setBiometricState('success')}
                      className="w-full h-[44px] bg-[#0066FF] hover:bg-[#0052CC] disabled:bg-[#2A2A42] disabled:text-[#8E8E93] text-white font-sans font-semibold text-[14px] rounded-[6px] transition-colors"
                    >
                      Confirm PIN
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* SUCCESS */}
            {biometricState === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center justify-center w-full"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.4, type: 'spring', bounce: 0.5 }}
                  className="flex flex-col items-center"
                >
                  <CheckCircle className="w-20 h-20 text-[#34C759]" />
                  <p className="font-sans font-semibold text-[16px] text-[#34C759] mt-3">Verified</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-[#2A2A42]" />
          <span className="font-sans font-normal text-[12px] text-[#48484F]">OR</span>
          <div className="flex-1 h-px bg-[#2A2A42]" />
        </div>

        {/* Start new session */}
        <div className="flex flex-col">
          <button
            onClick={handleStartNewSession}
            className="w-full h-[48px] border border-[#2A2A42] hover:bg-[#242438] text-white font-sans font-normal text-[14px] rounded-[6px] transition-colors"
          >
            Start New Session
          </button>
          <p className="font-sans font-normal text-[12px] text-[#48484F] mt-2 text-center">
            You will be redirected to sign in. Your data will not be lost.
          </p>
        </div>
      </div>

      {/* Footer */}
      <p className="font-sans font-normal text-[12px] text-[#48484F] mt-5 text-center">
        Sessions expire after 30 minutes of inactivity for your security.{' '}
        <a href="#" className="text-[#0066FF] hover:text-[#0052CC] transition-colors">
          Learn more
        </a>
      </p>
    </div>
  )
}

export default function SessionExpiredPage() {
  return (
    <Suspense>
      <SessionExpiredContent />
    </Suspense>
  )
}
