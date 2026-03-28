'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Key, Download, Scan, CheckCircle, RefreshCw, Loader2 } from 'lucide-react'
import { useAuth } from '../../../lib/auth'
import { ApiError } from '../../../lib/api'

export default function LoginPage() {
  const router = useRouter()
  const { loginWithSeed } = useAuth()
  const [loginError, setLoginError] = useState('')

  // State: Seed Phrase
  const [seedPhrase, setSeedPhrase] = useState('')
  const [isInvalid, setIsInvalid] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // State: Overall Auth
  const [isSuccess, setIsSuccess] = useState(false)
  const [isAlreadySignedIn] = useState(false) // Change to true to test the already-signed-in state

  // State: Extension
  const [extensionStatus, setExtensionStatus] = useState<'checking' | 'installed' | 'missing'>('checking')

  // State: QR Code
  const [qrTimeLeft, setQrTimeLeft] = useState(120)
  const qrRadius = 110
  const qrCircumference = 2 * Math.PI * qrRadius

  // Extension mock check
  useEffect(() => {
    const timer = setTimeout(() => {
      setExtensionStatus('installed')
    }, 400)
    return () => clearTimeout(timer)
  }, [])

  // QR Countdown
  useEffect(() => {
    if (qrTimeLeft > 0 && !isSuccess) {
      const interval = setInterval(() => {
        setQrTimeLeft(prev => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [qrTimeLeft, isSuccess])

  // Handle seed phrase blur (clean up whitespace)
  const handleSeedBlur = () => {
    setSeedPhrase(prev => prev.trim().replace(/\s+/g, ' '))
  }

  // Handle submit
  const handleSeedSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    const words = seedPhrase.trim().split(/\s+/).filter(Boolean)

    if (words.length < 24) {
      setIsInvalid(true)
      setTimeout(() => setIsInvalid(false), 300) // Reset for shake re-trigger
      return
    }

    setIsInvalid(false)
    setIsLoading(true)
    setLoginError('')

    try {
      await loginWithSeed(seedPhrase)
      setIsSuccess(true)
      setTimeout(() => router.push('/dashboard'), 800)
    } catch (err) {
      if (err instanceof ApiError) {
        setLoginError(err.detail ?? err.message)
      } else {
        setLoginError('Login failed. Please check your seed phrase and try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Render QR Grid (Mock — 16×16 deterministic pseudorandom grid)
  const renderMockQR = () => {
    const size = 16
    const blocks = []
    for (let i = 0; i < size * size; i++) {
      const isFilled = (Math.sin(i * 123) * 10000) % 1 > 0.5
      blocks.push(
        <div
          key={i}
          className="w-full h-full"
          style={{
            backgroundColor:
              (i % size < 4 && Math.floor(i / size) < 4) ||
              (i % size > size - 5 && Math.floor(i / size) < 4) ||
              (i % size < 4 && Math.floor(i / size) > size - 5)
                ? '#FFFFFF'
                : isFilled ? '#FFFFFF' : 'transparent',
            opacity:
              (i % size === 1 && Math.floor(i / size) === 1) ||
              (i % size === size - 2 && Math.floor(i / size) === 1) ||
              (i % size === 1 && Math.floor(i / size) === size - 2)
                ? 0
                : 1,
          }}
        />
      )
    }
    return (
      <div
        className="w-[160px] h-[160px] grid"
        style={{
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gridTemplateRows: `repeat(${size}, 1fr)`,
        }}
      >
        {blocks}
      </div>
    )
  }

  // Already signed in state
  if (isAlreadySignedIn) {
    return (
      <div className="w-full max-w-[480px] px-4 selection:bg-[#00D4FF] selection:text-[#0A1628]">
        <div className="w-full bg-[#1A1A2E] rounded-[12px] p-[28px] shadow-[0_2px_8px_rgba(0,0,0,0.32)] flex flex-col items-center text-center border border-[#2A2A42]">
          <h2 className="font-semibold text-[28px] text-white">You are already signed in.</h2>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-6 w-full h-[48px] bg-[#0066FF] text-white font-semibold text-[16px] rounded-[6px] transition-colors hover:bg-[#0052CC]"
          >
            Go to Dashboard &rarr;
          </button>
        </div>
      </div>
    )
  }

  // Success state
  if (isSuccess) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 0.5, type: 'spring', bounce: 0.5 }}
        className="flex flex-col items-center"
      >
        <CheckCircle className="w-12 h-12 text-[#34C759]" />
        <h3 className="font-semibold text-[24px] text-white mt-4">Verified</h3>
      </motion.div>
    )
  }

  return (
    <div className="w-full max-w-[480px] px-4 selection:bg-[#00D4FF] selection:text-[#0A1628]">

      {/* Header */}
      <div className="flex flex-col items-center w-full">
        <img src="/logos/solidus_icon.png" alt="Solidus" className="w-12 h-auto mb-3" />
        <div className="font-medium text-[12px] text-[#8E8E93] tracking-[0.04em] mb-8">
          identity.solidus.network
        </div>

        <h2 className="font-semibold text-[28px] text-white mb-2 leading-tight">Welcome back</h2>
        <p className="font-normal text-[14px] text-[#8E8E93] mb-8">
          Sign in with your Solidus DID to continue.
        </p>

        {/* Main Card */}
        <div className="w-full bg-[#1A1A2E] rounded-[12px] p-[28px] shadow-[0_2px_8px_rgba(0,0,0,0.32)] border border-[#242438]">

          {/* Option 1: Seed Phrase */}
          <div className="flex flex-col">
            <h3 className="font-semibold text-[16px] text-white leading-tight">Sign in with seed phrase</h3>
            <p className="font-normal text-[13px] text-[#8E8E93] mt-1 mb-4">
              Enter your 24-word recovery phrase to unlock your DID.
            </p>

            <form onSubmit={handleSeedSubmit}>
              <motion.div
                animate={isInvalid ? { x: [-5, 5, -5, 5, 0] } : {}}
                transition={{ duration: 0.3 }}
              >
                <textarea
                  value={seedPhrase}
                  onChange={(e) => setSeedPhrase(e.target.value)}
                  onBlur={handleSeedBlur}
                  disabled={isLoading}
                  placeholder="word1 word2 word3 ... word24"
                  className={`w-full h-[96px] bg-[#242438] border rounded-[4px] p-3 font-mono text-[13px] text-white placeholder:text-[#48484F] resize-none transition-all outline-none ${
                    isInvalid
                      ? 'border-[#FF3B30] focus:border-[#FF3B30] focus:shadow-[0_0_0_3px_rgba(255,59,48,0.15)]'
                      : 'border-[#2A2A42] focus:border-[#00D4FF] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.15)]'
                  } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
                />
              </motion.div>

              {isInvalid && (
                <p className="font-normal text-[12px] text-[#FF3B30] mt-1.5">
                  Invalid seed phrase. Please check all 24 words are correct and in the right order.
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[48px] bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold text-[14px] rounded-[6px] mt-4 flex items-center justify-center transition-colors disabled:opacity-80"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Key className="w-[16px] h-[16px] mr-2" />
                    Sign In with Seed Phrase
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[#242438]"></div>
            <span className="font-normal text-[12px] text-[#48484F]">OR</span>
            <div className="flex-1 h-px bg-[#242438]"></div>
          </div>

          {/* Option 2: Browser Extension */}
          <div className="relative group">
            <button
              className={`w-full h-[48px] bg-[#242438] hover:bg-[#2A2A42] border border-[#2A2A42] rounded-[6px] flex items-center justify-center transition-colors ${
                extensionStatus === 'checking' ? 'opacity-50 cursor-wait' : ''
              }`}
              onClick={() => {
                if (extensionStatus === 'installed') {
                  setIsSuccess(true)
                  setTimeout(() => router.push('/dashboard'), 800)
                }
              }}
            >
              {extensionStatus === 'installed' && (
                <div className="w-2 h-2 rounded-full bg-[#34C759] mr-3 animate-pulse"></div>
              )}
              {extensionStatus === 'checking' && (
                <Loader2 className="w-4 h-4 text-[#8E8E93] mr-3 animate-spin" />
              )}

              {/* Solidus Extension Icon (mock) */}
              <div className="w-[20px] h-[20px] rounded-[4px] bg-[#0066FF] mr-2 flex items-center justify-center">
                <span className="text-white font-bold text-[10px] leading-none">S</span>
              </div>

              <span className="font-normal text-[14px] text-white">
                {extensionStatus === 'installed'
                  ? 'Solidus Wallet Detected — Click to authenticate'
                  : 'Sign in with Solidus Extension'}
              </span>

              {extensionStatus === 'missing' && (
                <Download className="w-[16px] h-[16px] text-[#8E8E93] ml-auto mr-4" />
              )}
            </button>

            {/* Missing extension tooltip */}
            {extensionStatus === 'missing' && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="bg-[#0A1628] border border-[#2A2A42] text-white font-normal text-[12px] px-3 py-1.5 rounded-[6px] whitespace-nowrap">
                  Get the Solidus browser extension
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[#242438]"></div>
            <span className="font-normal text-[12px] text-[#48484F]">OR</span>
            <div className="flex-1 h-px bg-[#242438]"></div>
          </div>

          {/* Option 3: QR Code */}
          <div className="flex flex-col items-center w-full">
            <div className="flex items-center text-[#0066FF] mb-4">
              <Scan className="w-[16px] h-[16px] mr-2" />
              <span className="font-medium text-[14px]">Scan QR with Solidus Mobile App</span>
            </div>

            <div className="relative flex flex-col items-center">
              {/* SVG Ring wrapper (200×200 QR + 15px padding each side = 230px) */}
              <div className="relative w-[230px] h-[230px] flex items-center justify-center">
                {/* Background ring track + depleting fill */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="115" cy="115" r={qrRadius}
                    fill="none" stroke="#2A2A42" strokeWidth="1"
                  />
                  <circle
                    cx="115" cy="115" r={qrRadius}
                    fill="none" stroke="#0066FF" strokeWidth="2"
                    strokeDasharray={qrCircumference}
                    strokeDashoffset={qrCircumference - (Math.max(qrTimeLeft, 0) / 120) * qrCircumference}
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>

                {/* QR Code Card */}
                <div className="w-[200px] h-[200px] bg-[#242438] rounded-[8px] p-[20px] flex items-center justify-center relative z-10">
                  {qrTimeLeft > 0 ? (
                    renderMockQR()
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <Scan className="w-8 h-8 text-[#48484F] mb-3 opacity-50" />
                      <span className="text-[12px] text-[#8E8E93]">QR Expired</span>
                    </div>
                  )}
                </div>
              </div>

              {/* QR Footer */}
              <div className="mt-4 flex items-center justify-center min-h-[20px]">
                {qrTimeLeft > 0 ? (
                  <p className="font-normal text-[12px] text-[#8E8E93] text-center">
                    Open Solidus Identity on your phone and scan this code.
                    <br />
                    <span className="text-center w-full inline-block mt-1">
                      Expires in {Math.floor(qrTimeLeft / 60)}:{(qrTimeLeft % 60).toString().padStart(2, '0')}
                    </span>
                  </p>
                ) : (
                  <button
                    onClick={() => setQrTimeLeft(120)}
                    className="font-medium text-[12px] text-[#0066FF] hover:text-[#0052CC] flex items-center transition-colors"
                  >
                    <RefreshCw className="w-3 h-3 mr-1.5" />
                    Refresh QR Code
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="font-normal text-[13px] text-[#8E8E93] mt-8 text-center">
          Don&apos;t have a DID?{' '}
          <Link href="/onboarding" className="text-[#0066FF] hover:text-[#0052CC] transition-colors">
            Create yours for free &rarr;
          </Link>
        </p>
        <p className="font-normal text-[12px] text-[#48484F] mt-2 text-center">
          By signing in you agree to the{' '}
          <a href="#" className="text-[#0066FF] hover:text-[#0052CC] transition-colors">Terms</a>
          {' '}and{' '}
          <a href="#" className="text-[#0066FF] hover:text-[#0052CC] transition-colors">Privacy Policy</a>.
        </p>
      </div>
    </div>
  )
}
