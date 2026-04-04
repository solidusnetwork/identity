'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Award, ExternalLink, TrendingUp } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { DashboardTopBar } from '@/components/app/DashboardTopBar'
import { api } from '@/lib/api'
import type { TrustScore } from '@/types/api'

// ─── Gauge constants ──────────────────────────────────────────────────────────
const ARC_LENGTH = 268.08

// ─── Improvement icon map ─────────────────────────────────────────────────────
const IMPROVEMENT_ICONS: Record<string, LucideIcon> = {
  'Professional': Award,
  'Social':       ExternalLink,
  'Financial':    TrendingUp,
  'Identity':     Award,
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  Identity:     '#00D4FF',
  Professional: '#FF9500',
  Social:       '#FF6B6B',
  Financial:    '#C084FC',
}

function CategoryProgressBar({
  label,
  current,
  max,
  delay,
}: {
  label: string
  current: number
  max: number
  delay: number
}) {
  const percentage = (current / max) * 100
  const color = CATEGORY_COLORS[label] ?? '#00D4FF'

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-white">{label}</span>
        <span className="text-[11px] font-normal text-[#8E8E93]">
          {current}/{max}
        </span>
      </div>
      <div className="h-[4px] w-full bg-[#242438] rounded-[8px] overflow-hidden">
        <motion.div
          className="h-full rounded-[8px]"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay }}
        />
      </div>
    </div>
  )
}

function ContributionRow({
  name,
  category,
  points,
  status,
}: {
  name: string
  category: string
  points: number
  status: 'active' | 'missing'
}) {
  return (
    <div className="flex items-center h-[44px] px-[12px] border-b border-[#2A2A42] last:border-0 hover:bg-[#242438]/50 transition-colors">
      <div className="w-[40%] text-[13px] font-medium text-white truncate pr-4">
        {name}
      </div>
      <div className="w-[22%] text-[13px] text-[#8E8E93]">{category}</div>
      <div className="w-[16%]">
        {status === 'active' ? (
          <span className="font-semibold text-[13px] text-white">+{points}</span>
        ) : (
          <span className="font-normal text-[11px] text-[#48484F]">+{points}</span>
        )}
      </div>
      <div className="w-[22%] flex items-center justify-between">
        {status === 'active' ? (
          <span className="bg-[#34C759]/12 text-[#34C759] text-[11px] font-semibold px-[8px] py-[3px] rounded-[4px]">
            Active
          </span>
        ) : (
          <div className="flex items-center justify-between w-full pr-2">
            <span className="bg-[#FF9500]/12 text-[#FF9500] text-[11px] font-semibold px-[8px] py-[3px] rounded-[4px]">
              Not added
            </span>
            <Link
              href="/marketplace"
              className="text-[11px] font-medium text-[#0066FF] hover:underline whitespace-nowrap"
            >
              Add &rarr;
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function ImprovementRow({
  icon: Icon,
  text,
  points,
  isLast = false,
}: {
  icon: LucideIcon
  text: string
  points: number
  isLast?: boolean
}) {
  return (
    <div
      className={`flex items-center justify-between py-[12px] ${
        !isLast ? 'border-b border-[#2A2A42]' : ''
      }`}
    >
      <div className="flex items-center gap-[12px]">
        <Icon className="w-[20px] h-[20px] text-[#FF9500]" />
        <span className="text-[14px] font-medium text-white">{text}</span>
      </div>
      <div className="flex items-center gap-[8px]">
        <span className="bg-[#A8E600]/12 text-[#A8E600] text-[11px] font-bold px-[8px] py-[3px] rounded-[4px]">
          +{points} pts
        </span>
        <Link
          href="/marketplace"
          className="text-[12px] font-medium text-[#0066FF] hover:underline"
        >
          Get &rarr;
        </Link>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TrustScorePage() {
  const [data, setData] = useState<TrustScore | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<TrustScore>('/v1/trust-score')
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  const score = data?.score ?? 0
  const categories = data?.categories
  const catEntries = categories
    ? ([
        { label: 'Identity',     ...categories.Identity,     delay: 0.1 },
        { label: 'Professional', ...categories.Professional, delay: 0.2 },
        { label: 'Social',       ...categories.Social,       delay: 0.3 },
        { label: 'Financial',    ...categories.Financial,    delay: 0.4 },
      ] as const)
    : []

  return (
    <>
      <DashboardTopBar title="Trust Score" />

      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-[800px] mx-auto pb-20">

          {/* Page Header */}
          <div className="flex items-end justify-between pb-[28px]">
            <div className="flex items-baseline gap-2">
              <h2 className="font-bold text-[28px] text-white leading-none">
                Trust Score
              </h2>
              {!loading && (
                <span className="font-bold text-[48px] text-[#34C759] leading-[0.8]">
                  {score}
                </span>
              )}
            </div>
            <button className="text-[13px] font-medium text-[#0066FF] hover:underline mb-1 transition-all">
              How is this calculated? &rarr;
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-48 text-[#8E8E93] text-[14px]">
              Computing trust score…
            </div>
          ) : (
            <div className="flex flex-col gap-6">

              {/* Hero Card — Gauge + Category Bars */}
              <div className="w-full bg-[#1A1A2E] rounded-[8px] p-[28px_32px] shadow-[0_2px_8px_rgba(0,0,0,0.32)] flex gap-[32px] items-center">

                {/* Gauge */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="relative w-[160px] h-[160px] flex items-center justify-center flex-col">
                    <svg
                      className="absolute inset-0 w-[160px] h-[160px]"
                      viewBox="0 0 160 160"
                    >
                      <defs>
                        <linearGradient
                          id="score-gradient"
                          x1="0%"
                          y1="100%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop offset="0%"   stopColor="#00D4FF" />
                          <stop offset="100%" stopColor="#A8E600" />
                        </linearGradient>
                      </defs>
                      <g transform="rotate(150 80 80)">
                        {/* Track arc */}
                        <circle
                          cx="80" cy="80" r="64"
                          fill="transparent"
                          stroke="#242438"
                          strokeWidth="16"
                          strokeLinecap="round"
                          strokeDasharray={`${ARC_LENGTH} 402.12`}
                          strokeDashoffset="0"
                        />
                        {/* Animated score arc */}
                        <motion.circle
                          cx="80" cy="80" r="64"
                          fill="transparent"
                          stroke="url(#score-gradient)"
                          strokeWidth="16"
                          strokeLinecap="round"
                          strokeDasharray={`${ARC_LENGTH} 402.12`}
                          initial={{ strokeDashoffset: ARC_LENGTH }}
                          animate={{ strokeDashoffset: ARC_LENGTH * (1 - score / 100) }}
                          transition={{ duration: 1.2, ease: 'easeOut' }}
                        />
                      </g>
                    </svg>
                    <span className="font-bold text-[36px] text-[#34C759] leading-none z-10 mt-2">
                      {score}
                    </span>
                    <span className="text-[12px] text-[#8E8E93] z-10 mt-1">/100</span>
                  </div>
                  <div className="text-[12px] font-medium text-[#8E8E93] mt-2 text-center">
                    Updated {new Date(data?.updatedAt ?? Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>
                </div>

                {/* Right Side — Label + Progress Bars */}
                <div className="flex-1 flex flex-col gap-[16px]">
                  <div>
                    <h2 className="font-bold text-[20px] text-[#34C759]">
                      {data?.label ?? ''}
                    </h2>
                    <p className="text-[15px] font-normal text-[#8E8E93] leading-[1.6] max-w-[380px] mt-1">
                      {data?.description ?? ''}
                    </p>
                  </div>

                  <div className="flex flex-col gap-[12px] mt-2">
                    {catEntries.map((bar) => (
                      <CategoryProgressBar
                        key={bar.label}
                        label={bar.label}
                        current={bar.current}
                        max={bar.max}
                        delay={bar.delay}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Credential Contributions Table */}
              <div className="w-full bg-[#1A1A2E] rounded-[8px] p-[20px_24px] shadow-[0_2px_8px_rgba(0,0,0,0.32)]">
                <h3 className="font-semibold text-[16px] text-white mb-[16px]">
                  Credential Contributions
                </h3>

                {/* Table header */}
                <div className="flex items-center bg-[#242438] h-[36px] px-[12px] rounded-t-[6px]">
                  <div className="w-[40%] text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider">Credential</div>
                  <div className="w-[22%] text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider">Category</div>
                  <div className="w-[16%] text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider">Points</div>
                  <div className="w-[22%] text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider">Status</div>
                </div>

                <div className="flex flex-col">
                  {(data?.contributions ?? []).map((row) => (
                    <ContributionRow
                      key={row.name}
                      name={row.name}
                      category={row.category}
                      points={row.points}
                      status={row.status}
                    />
                  ))}
                </div>
              </div>

              {/* Improvement Panel */}
              {(data?.improvements ?? []).length > 0 && (
                <div className="w-full bg-[#1A1A2E] rounded-[8px] p-[20px_24px] border-t-2 border-[#FF9500] shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
                  <h3 className="font-semibold text-[16px] text-white mb-[16px]">
                    How to improve your score
                  </h3>

                  <div className="flex flex-col">
                    {(data?.improvements ?? []).map((row, i) => {
                      const Icon = IMPROVEMENT_ICONS[row.category] ?? Award
                      return (
                        <ImprovementRow
                          key={row.name}
                          icon={Icon}
                          text={`Add a ${row.name} credential`}
                          points={row.points}
                          isLast={i === (data?.improvements.length ?? 1) - 1}
                        />
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Score History Chart */}
              <div className="w-full bg-[#1A1A2E] rounded-[8px] p-[20px_24px] shadow-[0_2px_8px_rgba(0,0,0,0.32)]">
                <h3 className="font-semibold text-[16px] text-white mb-[16px]">
                  Score History
                </h3>

                <div className="w-full h-[80px] -ml-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={data?.history ?? []}
                      margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="historyColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%"   stopColor="#0066FF" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#0066FF" stopOpacity={0}   />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#48484F', fontSize: 11 }}
                        dy={10}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#242438',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '12px',
                          color: '#fff',
                        }}
                        itemStyle={{ color: '#00D4FF' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="score"
                        stroke="#0066FF"
                        strokeWidth={1.5}
                        fill="url(#historyColor)"
                        activeDot={{ r: 4, fill: '#0066FF', stroke: '#1A1A2E', strokeWidth: 2 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>
    </>
  )
}
