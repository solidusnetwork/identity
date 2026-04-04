import React from 'react'
import { Check } from 'lucide-react'

export type StepStatus = 'completed' | 'active' | 'upcoming'

export interface OnboardingStep {
  id: number
  label: string
  status: StepStatus
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  { id: 1, label: 'Welcome', status: 'upcoming' },
  { id: 2, label: 'Create Keys', status: 'upcoming' },
  { id: 3, label: 'Backup', status: 'upcoming' },
  { id: 4, label: 'Confirm', status: 'upcoming' },
  { id: 5, label: 'Recovery', status: 'upcoming' },
  { id: 6, label: 'Done', status: 'upcoming' },
]

interface OnboardingStepIndicatorProps {
  currentStep: number
}

export function OnboardingStepIndicator({ currentStep }: OnboardingStepIndicatorProps) {
  const steps = ONBOARDING_STEPS.map((step) => ({
    ...step,
    status: (step.id < currentStep ? 'completed' : step.id === currentStep ? 'active' : 'upcoming') as StepStatus,
  }))

  return (
    <div className="w-full max-w-[700px] mx-auto mt-10 px-6">
      <div className="flex items-start justify-between relative">
        {/* Connector line */}
        <div className="absolute top-[15px] left-[32px] right-[32px] h-[2px] bg-[#242438] z-0"></div>

        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center relative z-10 w-16">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-[14px] font-semibold transition-colors
                ${step.status === 'active' ? 'bg-[#0066FF] text-white' : ''}
                ${step.status === 'completed' ? 'bg-[#34C759] text-white' : ''}
                ${step.status === 'upcoming' ? 'bg-[#242438] text-[#8E8E93]' : ''}
              `}
            >
              {step.status === 'completed' ? <Check className="w-4 h-4" /> : step.id}
            </div>
            <span
              className={`text-[12px] whitespace-nowrap mt-2 font-medium text-center
                ${step.status === 'active' ? 'text-[#0066FF]' : 'text-[#8E8E93]'}
              `}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
