'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { DashboardTopBar } from '@/components/app/DashboardTopBar'
import {
  Briefcase,
  GraduationCap,
  TrendingUp,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Inbox,
  Award,
} from 'lucide-react'
import { api } from '@/lib/api'
import type { OfferItem } from '@/types/api'

type OfferStatus = 'pending' | 'accepted' | 'declined'

// Maps API issuerName to icon + colors. Unknown issuers fall back to generic.
function getIssuerIconProps(issuerName: string): {
  icon: React.ElementType
  iconColor: string
  iconBg: string
} {
  switch (issuerName) {
    case 'Acme Corp':
      return { icon: Briefcase, iconColor: '#FF9500', iconBg: 'rgba(255,149,0,0.12)' }
    case 'State University':
      return { icon: GraduationCap, iconColor: '#A8E600', iconBg: 'rgba(168,230,0,0.12)' }
    case 'FinCert Authority':
      return { icon: TrendingUp, iconColor: '#C084FC', iconBg: 'rgba(192,132,252,0.12)' }
    case 'Solidus KYC':
      return { icon: ShieldCheck, iconColor: '#34C759', iconBg: 'rgba(52,199,89,0.12)' }
    default:
      return { icon: Award, iconColor: '#8E8E93', iconBg: 'rgba(142,142,147,0.15)' }
  }
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

const FILTERS = ['All', 'Pending', 'Accepted', 'Declined']

export default function InboxPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [offers, setOffers] = useState<OfferItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<OfferItem[]>('/v1/inbox')
      .then(data => setOffers(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleAccept = async (id: string) => {
    // Optimistic update
    setOffers(prev => prev.map(o => (o.id === id ? { ...o, status: 'accepted' as OfferStatus } : o)))
    try {
      await api.post(`/v1/inbox/${id}/accept`)
    } catch {
      setOffers(prev => prev.map(o => (o.id === id ? { ...o, status: 'pending' as OfferStatus } : o)))
    }
  }

  const handleDecline = async (id: string) => {
    // Optimistic update
    setOffers(prev => prev.map(o => (o.id === id ? { ...o, status: 'declined' as OfferStatus } : o)))
    try {
      await api.post(`/v1/inbox/${id}/decline`)
    } catch {
      setOffers(prev => prev.map(o => (o.id === id ? { ...o, status: 'pending' as OfferStatus } : o)))
    }
  }

  const handleUndo = async (id: string) => {
    // Optimistic update: move back to pending
    setOffers(prev => prev.map(o => (o.id === id ? { ...o, status: 'pending' as OfferStatus } : o)))
    try {
      await api.post(`/v1/inbox/${id}/accept`)
      setOffers(prev => prev.map(o => (o.id === id ? { ...o, status: 'accepted' as OfferStatus } : o)))
    } catch {
      setOffers(prev => prev.map(o => (o.id === id ? { ...o, status: 'declined' as OfferStatus } : o)))
    }
  }

  const filteredOffers = offers.filter(o => {
    if (activeFilter === 'All') return true
    return o.status === activeFilter.toLowerCase()
  })

  const pendingCount = offers.filter(o => o.status === 'pending').length

  return (
    <>
      <DashboardTopBar title="Credential Inbox" />
      <main className="flex-1 p-6 md:p-8">
        <div className="max-w-[1000px] w-full mx-auto">

          {/* Header */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6">
            <div className="flex items-center gap-4">
              <h2 className="font-sans font-bold text-[28px] text-white leading-none">Credential Inbox</h2>
              {pendingCount > 0 && (
                <div className="bg-[#0066FF] min-w-[18px] h-[18px] rounded-[4px] px-2 py-[3px] flex items-center justify-center">
                  <span className="font-sans font-semibold text-[11px] text-white leading-none tracking-wide whitespace-nowrap">
                    {pendingCount} new
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {FILTERS.map(filter => {
                const isActive = activeFilter === filter
                return (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`font-sans font-semibold text-[12px] px-[14px] py-[5px] rounded-[6px] transition-colors ${
                      isActive
                        ? 'bg-[#0066FF] text-white'
                        : 'bg-[#242438] text-[#8E8E93] border border-[#2A2A42] hover:text-white font-normal'
                    }`}
                  >
                    {filter}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Inbox List */}
          <div className="bg-[#1A1A2E] rounded-[8px] shadow-[0_2px_8px_rgba(0,0,0,0.32)]">
            {loading ? (
              <div className="py-16 px-6 flex flex-col items-center justify-center text-center">
                <div className="w-8 h-8 border-2 border-[#0066FF] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="font-sans font-normal text-[14px] text-[#8E8E93]">Loading offers…</p>
              </div>
            ) : filteredOffers.length === 0 ? (
              <div className="py-16 px-6 flex flex-col items-center justify-center text-center">
                <Inbox className="w-12 h-12 text-[#8E8E93]" />
                <h3 className="font-sans font-semibold text-[18px] text-white mt-4">
                  No {activeFilter !== 'All' ? activeFilter.toLowerCase() : 'pending'} offers
                </h3>
                <p className="font-sans font-normal text-[14px] text-[#8E8E93] mt-1.5">
                  Credential offers from issuers will appear here.
                </p>
                <Link
                  href="/marketplace"
                  className="font-sans font-medium text-[13px] text-[#0066FF] hover:text-[#0052CC] mt-4 transition-colors"
                >
                  Browse Marketplace &rarr;
                </Link>
              </div>
            ) : (
              <div className="flex flex-col">
                {filteredOffers.map((offer, index) => {
                  const { icon: Icon, iconColor, iconBg } = getIssuerIconProps(offer.issuerName)
                  const isPending = offer.status === 'pending'
                  const isLast = index === filteredOffers.length - 1

                  return (
                    <div
                      key={offer.id}
                      className={`flex flex-col md:flex-row items-start gap-4 p-5 md:px-6 transition-all ${
                        !isPending ? 'bg-[rgba(26,26,46,0.6)]' : ''
                      } ${!isLast ? 'border-b border-[#2A2A42]' : ''}`}
                    >
                      {/* Left: Issuer Logo */}
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 border border-[#2A2A42] mt-0.5 ${!isPending ? 'opacity-60 grayscale' : ''}`}
                        style={{ backgroundColor: iconBg }}
                      >
                        <Icon className="w-[22px] h-[22px]" style={{ color: iconColor }} />
                      </div>

                      {/* Center: Content */}
                      <div className={`flex-1 min-w-0 flex flex-col gap-1.5 ${!isPending ? 'opacity-60' : ''}`}>
                        <h3 className="font-sans font-semibold text-[16px] text-white leading-tight">
                          {offer.title}
                        </h3>

                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="font-sans font-normal text-[14px] text-[#8E8E93]">Issued by</span>
                          <span className="font-sans font-medium text-[14px] text-white">{offer.issuerName}</span>
                          <ShieldCheck className="w-3 h-3 text-[#34C759] ml-0.5" />
                          <span className="font-sans font-medium text-[12px] text-[#34C759]">Verified Issuer</span>
                        </div>

                        <div className="font-sans font-normal text-[12px] text-[#48484F] mt-0.5">
                          {offer.expiresAt && <>Expires: {formatDate(offer.expiresAt)} &middot; </>}
                          Received: {formatDate(offer.receivedAt)}
                        </div>

                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {offer.offeredClaims.map(field => (
                            <span
                              key={field}
                              className="font-sans font-medium text-[11px] text-[#8E8E93] bg-[#242438] border border-[#2A2A42] rounded-[4px] px-2 py-0.5"
                            >
                              {field}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-row md:flex-col items-center md:items-end gap-2 shrink-0 mt-4 md:mt-0 w-full md:w-auto justify-end">
                        {isPending ? (
                          <>
                            <button
                              onClick={() => handleAccept(offer.id)}
                              className="bg-[#0066FF] hover:bg-[#0052CC] text-white font-sans font-semibold text-[13px] h-[32px] px-4 rounded-[6px] transition-colors whitespace-nowrap"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleDecline(offer.id)}
                              className="border border-[#2A2A42] hover:bg-[#242438] text-[#8E8E93] hover:text-white font-sans font-normal text-[13px] h-[32px] px-4 rounded-[6px] transition-colors whitespace-nowrap"
                            >
                              Decline
                            </button>
                          </>
                        ) : offer.status === 'accepted' ? (
                          <>
                            <div className="flex items-center gap-1.5 text-[#34C759]">
                              <CheckCircle className="w-4 h-4" />
                              <span className="font-sans font-medium text-[12px]">Accepted</span>
                            </div>
                            <Link
                              href="/my-credentials"
                              className="font-sans font-medium text-[12px] text-[#0066FF] hover:text-[#0052CC] transition-colors"
                            >
                              View Credential &rarr;
                            </Link>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-1.5 text-[#FF3B30]">
                              <XCircle className="w-4 h-4" />
                              <span className="font-sans font-medium text-[12px]">Declined</span>
                            </div>
                            <button
                              onClick={() => handleUndo(offer.id)}
                              className="font-sans font-medium text-[12px] text-[#8E8E93] hover:text-white transition-colors"
                            >
                              Undo
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

        </div>
      </main>
    </>
  )
}
