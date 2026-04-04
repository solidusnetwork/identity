'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  X, ShieldCheck, Mail, Briefcase, EyeOff, CheckCircle2, Fingerprint,
  Loader2, Wallet, AlertTriangle, ShieldAlert,
} from 'lucide-react'

type FlowState = 'detected' | 'biometric' | 'processing' | 'success'
type EdgeState = 'none' | 'no-did' | 'missing-cred' | 'biometric-fail' | 'unverified-rp'

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function SignInDemoPage() {
  const [isOpen, setIsOpen] = useState(true)
  const [flowState, setFlowState] = useState<FlowState>('detected')
  const [edgeState, setEdgeState] = useState<EdgeState>('none')

  const resetDemo = (edge: EdgeState) => {
    setEdgeState(edge)
    setFlowState(edge === 'biometric-fail' ? 'biometric' : 'detected')
    setIsOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] w-full flex flex-col font-sans relative overflow-x-hidden">

      {/* Fake 3rd Party Nav */}
      <header className="h-16 bg-white border-b border-[#E5E5E5] px-8 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#242438] flex items-center justify-center text-white font-bold text-[14px]">T</div>
          <span className="font-semibold text-[18px] text-[#1A1A2E]">TrustLayer Exchange</span>
        </div>
        <button
          onClick={() => resetDemo('none')}
          className="px-4 py-2 bg-[#1A1A2E] text-white text-[14px] font-medium rounded-[6px] hover:bg-[#2A2A42] transition-colors shadow-sm"
        >
          Sign in with Solidus
        </button>
      </header>

      {/* Fake 3rd Party Hero */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center z-10 pb-32">
        <h1 className="text-[44px] font-bold text-[#1A1A2E] mb-6 max-w-[640px] leading-tight tracking-tight">
          The standard for institutional credential exchange.
        </h1>
        <p className="text-[18px] text-[#666666] max-w-[540px] mb-10 leading-relaxed">
          Access global liquidity pools with automated compliance, zero-knowledge proofs,
          and instantly verifiable credentials.
        </p>
        <button
          onClick={() => resetDemo('none')}
          className="px-8 py-3.5 bg-gradient-to-b from-[#0066FF] to-[#0052CC] text-white text-[16px] font-medium rounded-[8px] hover:opacity-90 transition-opacity shadow-[0_8px_24px_rgba(0,102,255,0.24)] flex items-center gap-2"
        >
          <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-[#0066FF] rounded-full" />
          </div>
          Sign in with Solidus
        </button>
      </main>

      {/* Demo Controls Panel (Fixed at Bottom) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E5E5] p-4 flex items-center justify-center gap-3 z-40 shadow-[0_-4px_24px_rgba(0,0,0,0.05)] overflow-x-auto">
        <span className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-widest mr-2 shrink-0">
          Demo States:
        </span>
        {(['none', 'no-did', 'missing-cred', 'biometric-fail', 'unverified-rp'] as EdgeState[]).map(s => (
          <button
            key={s}
            onClick={() => resetDemo(s)}
            className={`px-3 py-1.5 rounded-[6px] text-[13px] font-medium transition-colors shrink-0 ${
              edgeState === s
                ? 'bg-[#1A1A2E] text-white'
                : 'bg-[#F5F5F5] text-[#666666] hover:bg-[#E5E5E5]'
            }`}
          >
            {s.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Solidus Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-[#0A1628]/72 backdrop-blur-[8px] z-50 flex items-center justify-center p-4"
          >
            <SignInModal
              onClose={() => setIsOpen(false)}
              flowState={flowState}
              setFlowState={setFlowState}
              edgeState={edgeState}
              setEdgeState={setEdgeState}
            />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

// ─── SignInModal ────────────────────────────────────────────────────────────────

interface SignInModalProps {
  onClose: () => void
  flowState: FlowState
  setFlowState: (s: FlowState) => void
  edgeState: EdgeState
  setEdgeState: (s: EdgeState) => void
}

function SignInModal({ onClose, flowState, setFlowState, edgeState, setEdgeState }: SignInModalProps) {

  // Timer logic for simulated progress
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    if (flowState === 'biometric' && edgeState !== 'biometric-fail') {
      timer = setTimeout(() => setFlowState('processing'), 2000)
    } else if (flowState === 'processing') {
      timer = setTimeout(() => setFlowState('success'), 3000)
    }

    return () => clearTimeout(timer)
  }, [flowState, edgeState, setFlowState])

  // Success countdown logic
  const [countdown, setCountdown] = useState(3)
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>
    if (flowState === 'success') {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            onClose()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      setCountdown(3)
    }
    return () => clearInterval(timer)
  }, [flowState, onClose])

  return (
    <motion.div
      initial={{ scale: 0.96, y: 8 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.96, y: 8, opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="w-full max-w-[480px] bg-[#1A1A2E] rounded-[16px] shadow-[0_24px_64px_rgba(0,0,0,0.48)] overflow-hidden flex flex-col text-white relative border border-white/[0.04]"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-[24px_24px_0] shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-[#1A1A2E] rounded-full" />
          </div>
          <span className="font-sans font-semibold text-[15px] text-white">Solidus</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-[4px] text-[#8E8E93] hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col relative min-h-[300px]">
        <AnimatePresence mode="wait">

          {/* STATE 1: DETECTED */}
          {flowState === 'detected' && (
            <motion.div
              key="detected"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col"
            >
              <RelyingPartyContext edgeState={edgeState} />
              {edgeState !== 'no-did' && <CredentialRequest />}
              <ContentAreaDetected edgeState={edgeState} setFlowState={setFlowState} />
            </motion.div>
          )}

          {/* STATE 2: BIOMETRIC */}
          {flowState === 'biometric' && (
            <motion.div
              key="biometric"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col"
            >
              <RelyingPartyContext edgeState={edgeState} />
              <ContentAreaBiometric edgeState={edgeState} setEdgeState={setEdgeState} />
            </motion.div>
          )}

          {/* STATE 3: PROCESSING */}
          {flowState === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col h-full items-center justify-center min-h-[400px]"
            >
              <ContentAreaProcessing />
            </motion.div>
          )}

          {/* STATE 4: SUCCESS */}
          {flowState === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col h-full items-center justify-center min-h-[400px]"
            >
              <ContentAreaSuccess countdown={countdown} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-[12px_24px_20px] mt-auto shrink-0 border-t border-transparent">
        <span className="text-[11px] text-[#8E8E93]">Powered by Solidus Protocol</span>
        <div className="flex items-center gap-3">
          <button className="text-[11px] text-[#0066FF] hover:underline transition-colors">Privacy</button>
          <button className="text-[11px] text-[#0066FF] hover:underline transition-colors">Security</button>
        </div>
      </div>
    </motion.div>
  )
}

// ─── RelyingPartyContext ────────────────────────────────────────────────────────

function RelyingPartyContext({ edgeState }: { edgeState: EdgeState }) {
  const isUnverified = edgeState === 'unverified-rp'

  return (
    <div className="mx-[24px] mt-[16px] bg-white/[0.04] border border-white/[0.06] rounded-[8px] p-[16px_20px]">
      <div className="text-[11px] font-medium text-[#8E8E93] uppercase tracking-wider mb-3">Sign in to</div>
      <div className="flex items-center gap-3 mb-1.5">
        <div className="w-8 h-8 rounded-full bg-[#242438] flex items-center justify-center text-white font-bold text-[14px]">T</div>
        <div className="text-[16px] font-semibold text-white">TrustLayer Exchange</div>
        {isUnverified ? (
          <ShieldAlert className="w-[14px] h-[14px] text-[#FF9500]" />
        ) : (
          <ShieldCheck className="w-[14px] h-[14px] text-[#34C759]" />
        )}
      </div>
      <div className={`text-[12px] ${isUnverified ? 'text-[#FF9500]' : 'text-[#8E8E93]'}`}>
        trustlayer.io · {isUnverified ? 'Unverified partner' : 'Verified partner since Jan 2026'}
      </div>

      {isUnverified && (
        <div className="mt-3 bg-[#FF9500]/10 border border-[#FF9500]/20 rounded-[6px] p-2.5 flex items-start gap-2">
          <AlertTriangle className="w-[14px] h-[14px] text-[#FF9500] shrink-0 mt-0.5" />
          <span className="text-[12px] text-[#FF9500] leading-snug">
            This site has not completed Solidus partner verification. Proceed with caution.
          </span>
        </div>
      )}
    </div>
  )
}

// ─── CredentialRequest ──────────────────────────────────────────────────────────

function CredentialRequest() {
  return (
    <div className="p-[16px_24px_0]">
      <div className="text-[11px] font-medium text-[#8E8E93] uppercase tracking-wider mb-3">Requesting</div>
      <div className="flex flex-col gap-2.5 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-[14px] h-[14px] text-[#8E8E93]" />
            <span className="text-[13px] text-white">KYC Level 2 or higher</span>
          </div>
          <span className="text-[11px] font-medium text-[#8E8E93] uppercase tracking-wider">Required</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-[14px] h-[14px] text-[#8E8E93]" />
            <span className="text-[13px] text-white">Email Verification</span>
          </div>
          <span className="text-[11px] font-medium text-[#8E8E93] uppercase tracking-wider">Required</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-[14px] h-[14px] text-[#8E8E93]" />
            <span className="text-[13px] text-white">Accredited Investor Status</span>
          </div>
          <span className="text-[11px] font-medium text-[#48484F] uppercase tracking-wider">Optional</span>
        </div>
      </div>
      <div className="flex items-start gap-2">
        <EyeOff className="w-[12px] h-[12px] text-[#8E8E93] shrink-0 mt-0.5" />
        <span className="text-[11px] text-[#8E8E93] leading-[1.4]">
          TrustLayer receives only what you approve — no raw documents, no biometric data.
        </span>
      </div>
    </div>
  )
}

// ─── ContentAreaDetected ────────────────────────────────────────────────────────

interface DetectedProps {
  edgeState: EdgeState
  setFlowState: (s: FlowState) => void
}

function ContentAreaDetected({ edgeState, setFlowState }: DetectedProps) {
  if (edgeState === 'no-did') {
    return (
      <div className="p-[16px_24px_24px] flex flex-col items-center text-center mt-4">
        <Wallet className="w-[40px] h-[40px] text-[#8E8E93] mb-4" />
        <h3 className="text-[16px] font-semibold text-white mb-2">No Solidus wallet found</h3>
        <p className="text-[14px] text-[#8E8E93] max-w-[320px] mb-6 leading-relaxed">
          Install the Solidus browser extension or open identity.solidus.network.
        </p>
        <button className="w-full h-[48px] bg-[#0066FF] hover:bg-[#0052CC] rounded-[8px] text-white font-medium text-[15px] mb-3 transition-colors">
          Install Extension
        </button>
        <button className="w-full h-[48px] bg-transparent hover:bg-white/5 border border-white/10 rounded-[8px] text-[#8E8E93] hover:text-white font-medium text-[15px] transition-colors">
          Open identity.solidus.network
        </button>
      </div>
    )
  }

  const isMissing = edgeState === 'missing-cred'

  return (
    <div className="p-[16px_24px_24px] flex flex-col items-center">
      <div className={`w-full rounded-[8px] p-[12px_16px] flex items-center justify-between border mb-4
        ${isMissing ? 'bg-[#FF9500]/[0.08] border-[#FF9500]/20' : 'bg-[#34C759]/[0.08] border-[#34C759]/20'}`}
      >
        <div className="flex items-center gap-3">
          <CheckCircle2 className={`w-[18px] h-[18px] ${isMissing ? 'text-[#FF9500]' : 'text-[#34C759]'}`} />
          <div className="flex flex-col">
            <span className="font-sans font-medium text-[14px] text-white">Alex Chen</span>
            <span className="font-mono text-[11px] text-[#8E8E93]">did:solidus:mainnet:5dK3...gAs</span>
          </div>
        </div>
        <span className={`text-[11px] ${isMissing ? 'text-[#FF9500]' : 'text-[#34C759]'}`}>
          {isMissing ? 'missing credentials ⚠' : 'has required credentials ✓'}
        </span>
      </div>

      {isMissing ? (
        <div className="w-full bg-[#FF9500]/10 border border-[#FF9500]/20 rounded-[8px] p-4 flex flex-col mt-2">
          <div className="flex items-start gap-2 mb-4">
            <AlertTriangle className="w-[14px] h-[14px] text-[#FF9500] shrink-0 mt-0.5" />
            <span className="text-[14px] text-white leading-snug">
              You&apos;re missing KYC Level 2 — required by TrustLayer.
            </span>
          </div>
          <button className="w-full h-10 bg-transparent border border-[#0066FF] hover:bg-[#0066FF]/10 rounded-[6px] text-[#0066FF] font-medium text-[14px] transition-colors">
            Get Verified &rarr;
          </button>
        </div>
      ) : (
        <>
          <div className="text-[12px] text-[#8E8E93] w-full mb-6 text-center">
            2 of 2 required credentials found in your wallet.
          </div>
          <button
            onClick={() => setFlowState('biometric')}
            className="w-full h-[48px] rounded-[8px] bg-gradient-to-br from-[#0066FF] to-[#0052CC] shadow-[0_4px_16px_rgba(0,102,255,0.30)] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mb-2"
          >
            <span className="font-sans font-semibold text-[16px] text-white">Sign In</span>
            <Fingerprint className="w-[18px] h-[18px] text-white" />
          </button>
          <div className="text-[11px] text-[#8E8E93] text-center mb-4">
            Confirm with biometric to complete sign-in
          </div>
          <button className="text-[12px] text-[#0066FF] hover:underline mt-1">
            Use a different account
          </button>
        </>
      )}
    </div>
  )
}

// ─── ContentAreaBiometric ───────────────────────────────────────────────────────

interface BiometricProps {
  edgeState: EdgeState
  setEdgeState: (s: EdgeState) => void
}

function ContentAreaBiometric({ edgeState, setEdgeState }: BiometricProps) {
  const isBioFail = edgeState === 'biometric-fail'

  return (
    <div className="p-[40px_24px_48px] flex flex-col items-center justify-center">
      <motion.div
        animate={isBioFail ? { x: [-6, 6, -6, 6, 0] } : {}}
        transition={{ duration: 0.3 }}
        className="relative flex items-center justify-center mb-6 h-[88px] w-[88px]"
      >
        {/* Pulsing ring */}
        {!isBioFail && (
          <motion.div
            animate={{ scale: [1, 1.12], opacity: [1, 0] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeOut' }}
            className="absolute inset-0 rounded-full border-2 border-[#0066FF]/20"
          />
        )}

        {/* Base circle */}
        <div className={`w-[80px] h-[80px] rounded-full border-2 flex items-center justify-center relative z-10
          ${isBioFail
            ? 'border-[#FF3B30] shadow-[0_0_24px_rgba(255,59,48,0.30)]'
            : 'border-[#0066FF] shadow-[0_0_24px_rgba(0,102,255,0.30)]'
          }`}
        >
          <Fingerprint className={`w-[40px] h-[40px] ${isBioFail ? 'text-[#FF3B30]' : 'text-[#0066FF]'}`} />

          {/* Progress ring */}
          {!isBioFail && (
            <svg
              className="absolute inset-[-2px] w-[80px] h-[80px] -rotate-90 pointer-events-none overflow-visible"
              viewBox="0 0 80 80"
            >
              <motion.circle
                initial={{ strokeDasharray: '0 251' }}
                animate={{ strokeDasharray: '251 251' }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
                cx="40" cy="40" r="39"
                fill="none" stroke="#34C759" strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>
      </motion.div>

      <h3 className={`text-[18px] font-semibold text-center mb-2 ${isBioFail ? 'text-[#FF3B30]' : 'text-white'}`}>
        {isBioFail ? 'Biometric not recognized' : 'Touch fingerprint sensor'}
      </h3>

      <div className="text-[12px] text-center flex flex-col gap-1 h-10">
        {isBioFail ? (
          <>
            <span className="text-[#FF3B30]">Try again or use PIN.</span>
            <button
              className="text-[#0066FF] hover:underline mt-1"
              onClick={() => setEdgeState('none')}
            >
              Try again
            </button>
          </>
        ) : (
          <span className="text-[#8E8E93]">Or use Face ID / device PIN</span>
        )}
      </div>
    </div>
  )
}

// ─── ContentAreaProcessing ──────────────────────────────────────────────────────

function ContentAreaProcessing() {
  return (
    <div className="flex flex-col items-center text-center px-6 w-full">
      <div className="w-[48px] h-[48px] mb-6 relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          className="w-full h-full rounded-full border-[3px] border-transparent border-t-[#0066FF] border-r-[#0066FF]/50 border-b-[#0066FF]/10"
        />
      </div>

      <h3 className="text-[16px] font-semibold text-white mb-2">Signing presentation...</h3>
      <p className="text-[12px] text-[#8E8E93] mb-8 max-w-[280px]">
        Creating a cryptographic proof of your credentials. Typically 1-2 seconds.
      </p>

      <div className="flex flex-col gap-3 w-full max-w-[260px] mb-12">
        <motion.div
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-2"
        >
          <CheckCircle2 className="w-[14px] h-[14px] text-[#34C759]" />
          <span className="text-[12px] text-white">Credential proofs generated</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2 }}
          className="flex items-center gap-2"
        >
          <CheckCircle2 className="w-[14px] h-[14px] text-[#34C759]" />
          <span className="text-[12px] text-white">Presentation signed with your key</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2.0 }}
          className="flex items-center gap-2"
        >
          <Loader2 className="w-[14px] h-[14px] text-[#0066FF] animate-spin" />
          <span className="text-[12px] text-white">Submitting to TrustLayer...</span>
        </motion.div>
      </div>

      <div className="text-[11px] text-[#48484F]">
        Verified by 3-of-5 Solidus validators · 1,247 nodes active
      </div>
    </div>
  )
}

// ─── ContentAreaSuccess ─────────────────────────────────────────────────────────

function ContentAreaSuccess({ countdown }: { countdown: number }) {
  return (
    <div className="flex flex-col items-center text-center px-6 w-full">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ type: 'spring', duration: 0.4 }}
        className="w-[64px] h-[64px] rounded-full bg-[#34C759]/[0.12] border border-[#34C759]/30 flex items-center justify-center mb-6"
      >
        <CheckCircle2 className="w-[32px] h-[32px] text-[#34C759]" />
      </motion.div>

      <h3 className="text-[20px] font-semibold text-white mb-2">Signed in to TrustLayer</h3>
      <p className="text-[12px] text-[#8E8E93] max-w-[320px] mb-8">
        TrustLayer has received your verified credentials. You are now authenticated.
      </p>

      <div className="w-full max-w-[280px] bg-white/[0.04] border border-white/[0.06] rounded-[8px] p-[10px_14px] mb-12">
        <div className="text-[11px] font-medium text-[#8E8E93] mb-3 text-left">Shared with TrustLayer:</div>
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-[12px] h-[12px] text-[#34C759]" />
            <span className="text-[12px] text-white">
              KYC Level 2 <span className="text-[#34C759] ml-1">✓</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-[12px] h-[12px] text-[#34C759]" />
            <span className="text-[12px] text-white">
              Email Verified <span className="text-[#34C759] ml-1">✓</span>
            </span>
          </div>
        </div>
      </div>

      <div className="text-[11px] text-[#8E8E93]">
        This window closes in {countdown}s
      </div>
    </div>
  )
}
