'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { Check, X, AlertCircle } from 'lucide-react'
import { OnboardingStepIndicator } from '@/components/onboarding/OnboardingStepIndicator'

// Read the real seed phrase from localStorage (stored during keygen)
function getWordsToVerify(): { num: number; expected: string }[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem('identitySeedPhrase')
  if (!stored) {
    // Fallback to hardcoded for dev/demo
    return [
      { num: 3, expected: 'able' },
      { num: 7, expected: 'absorb' },
      { num: 14, expected: 'accuse' },
      { num: 21, expected: 'action' },
    ]
  }
  const words = stored.split(' ')
  // Pick 4 random positions to verify
  const positions = [3, 7, 14, 21]
  return positions.map(pos => ({
    num: pos,
    expected: words[pos - 1] ?? '',
  }))
}

type WordStatus = 'neutral' | 'correct' | 'incorrect'

interface WordInputProps {
  num: number
  expected: string
  onStatusChange: (num: number, status: WordStatus) => void
}

function WordInput({ num, expected, onStatusChange }: WordInputProps) {
  const [val, setVal] = useState('')
  const [status, setStatus] = useState<WordStatus>('neutral')
  const [shakeKey, setShakeKey] = useState(0)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value.trim().toLowerCase()
    setVal(newVal)
    if (newVal === expected) {
      setStatus('correct')
      onStatusChange(num, 'correct')
    } else {
      setStatus('neutral')
      onStatusChange(num, 'neutral')
    }
  }

  const handleBlur = () => {
    if (val === '') {
      setStatus('neutral')
      onStatusChange(num, 'neutral')
    } else if (val !== expected) {
      setStatus('incorrect')
      setShakeKey((k) => k + 1)
      onStatusChange(num, 'incorrect')
    }
  }

  return (
    <motion.div
      key={shakeKey}
      animate={shakeKey > 0 ? { x: [-8, 8, -8, 8, 0] } : {}}
      transition={{ duration: 0.3 }}
      className={`relative bg-[#242438] rounded-[8px] p-[12px_16px] border transition-colors ${
        status === 'correct'
          ? 'border-[#2A2A42] border-r-2 border-r-[#34C759]'
          : status === 'incorrect'
          ? 'border-[#2A2A42] border-r-2 border-r-[#FF3B30]'
          : 'border-[#2A2A42]'
      }`}
    >
      <label className="text-[11px] font-medium text-[#8E8E93] mb-1 block uppercase tracking-wider">
        Word #{num}
      </label>
      <div className="flex items-center justify-between gap-2">
        <input
          type="text"
          value={val}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="type word..."
          spellCheck={false}
          autoComplete="off"
          className="bg-transparent font-mono text-[14px] font-normal text-white outline-none w-full placeholder:text-[#48484F]"
        />
        {status === 'correct' && <Check className="w-4 h-4 text-[#34C759] shrink-0" />}
        {status === 'incorrect' && <X className="w-4 h-4 text-[#FF3B30] shrink-0" />}
      </div>
    </motion.div>
  )
}

export default function ConfirmSeedPage() {
  const router = useRouter()
  const WORDS_TO_VERIFY = useMemo(() => getWordsToVerify(), [])
  const [statuses, setStatuses] = useState<Record<number, WordStatus>>({
    3: 'neutral',
    7: 'neutral',
    14: 'neutral',
    21: 'neutral',
  })

  const handleStatusChange = (num: number, status: WordStatus) => {
    setStatuses((prev) => ({ ...prev, [num]: status }))
  }

  const correctCount = Object.values(statuses).filter((s) => s === 'correct').length
  const incorrectCount = Object.values(statuses).filter((s) => s === 'incorrect').length
  const allCorrect = correctCount === 4
  const allIncorrect = incorrectCount === 4

  return (
    <div className="min-h-screen bg-[#0A1628] flex flex-col font-sans relative overflow-x-hidden">
      <OnboardingStepIndicator currentStep={4} />

      <div className="flex-1 flex flex-col items-center justify-center px-6 mt-12 pb-20">
        <div className="w-full max-w-[560px] flex flex-col mx-auto">

          {/* Header */}
          <h2 className="text-[28px] font-semibold text-white text-center mb-3">
            Confirm your seed phrase
          </h2>
          <p className="text-[16px] text-[#8E8E93] font-normal text-center mb-10 max-w-[480px] mx-auto">
            Enter the words at the positions below to confirm you&apos;ve saved your phrase correctly.
          </p>

          {/* Input grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {WORDS_TO_VERIFY.map((word) => (
              <WordInput
                key={word.num}
                num={word.num}
                expected={word.expected}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-[10px] mt-8 mb-8">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  i < correctCount
                    ? 'bg-[#34C759]'
                    : i === correctCount
                    ? 'bg-[#0066FF]'
                    : 'bg-[#242438]'
                }`}
              />
            ))}
          </div>

          {/* Confirm button */}
          <button
            disabled={!allCorrect}
            onClick={() => router.push('/onboarding/recovery')}
            className={`w-full h-12 rounded-md font-medium text-[16px] transition-colors ${
              allCorrect
                ? 'bg-[#0066FF] hover:bg-[#0055D4] text-white'
                : 'bg-[#242438] text-[#48484F] cursor-not-allowed'
            }`}
          >
            Confirm
          </button>

          {/* All-wrong help panel */}
          <AnimatePresence>
            {allIncorrect && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-6 bg-[#FF3B30]/[0.08] rounded-[8px] p-4 flex flex-col"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#FF3B30] shrink-0 mt-[2px]" />
                  <p className="text-[14px] text-white/90 leading-relaxed font-normal">
                    Trouble confirming? Your written words may be in a different order. Start over to regenerate a fresh
                    phrase.
                  </p>
                </div>
                <button
                  onClick={() => router.push('/onboarding/keygen')}
                  className="self-start mt-3 ml-8 text-[#FF3B30] text-[14px] font-medium hover:bg-[#FF3B30]/10 px-4 py-2 rounded-md transition-colors"
                >
                  Start Over
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
