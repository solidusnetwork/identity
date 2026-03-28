'use client'

import { useState, useEffect, useCallback } from 'react'
import { DashboardTopBar } from '@/components/app/DashboardTopBar'
import {
  Award,
  Share2,
  Bell,
  ShieldAlert,
  BellOff,
  Check,
  Fingerprint,
} from 'lucide-react'
import { api } from '@/lib/api'
import type { NotificationItem } from '@/types/api'

const FILTERS = ['All', 'Unread', 'Credential Offers', 'Sharing Requests', 'Security', 'System']

// Maps API type → icon component + colors
function getIconProps(type: string): {
  icon: React.ElementType
  iconColor: string
  iconBg: string
} {
  switch (type) {
    case 'auth.new_session':
      return { icon: ShieldAlert, iconColor: '#FF3B30', iconBg: 'rgba(255,59,48,0.15)' }
    case 'share.request':
      return { icon: Share2, iconColor: '#00D4FF', iconBg: 'rgba(0,212,255,0.15)' }
    case 'credential.offer':
      return { icon: Award, iconColor: '#0066FF', iconBg: 'rgba(0,102,255,0.15)' }
    case 'credential.offer.accepted':
      return { icon: Check, iconColor: '#A8E600', iconBg: 'rgba(168,230,0,0.15)' }
    case 'credential.expiring':
      return { icon: Bell, iconColor: '#FF9500', iconBg: 'rgba(255,149,0,0.15)' }
    case 'did.registered':
      return { icon: Fingerprint, iconColor: '#A8E600', iconBg: 'rgba(168,230,0,0.15)' }
    case 'auth.login':
    default:
      return { icon: Bell, iconColor: '#8E8E93', iconBg: '#242438' }
  }
}

const GROUPS_ORDER: Array<'TODAY' | 'YESTERDAY' | 'EARLIER'> = ['TODAY', 'YESTERDAY', 'EARLIER']

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await api.get<{ items: NotificationItem[]; unreadCount: number }>('/v1/notifications')
      setNotifications(data.items)
      setUnreadCount(data.unreadCount)
    } catch {
      // keep existing state on error
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const handleMarkAllRead = async () => {
    // Optimistic update
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
    setUnreadCount(0)
    try {
      await api.post('/v1/notifications/read-all')
    } catch {
      // Revert on failure by refetching
      fetchNotifications()
    }
  }

  const handleNotificationClick = async (item: NotificationItem) => {
    if (!item.unread) return
    // Optimistic update
    setNotifications(prev =>
      prev.map(n => (n.id === item.id ? { ...n, unread: false } : n))
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
    try {
      await api.put(`/v1/notifications/${item.id}/read`)
    } catch {
      // Revert on failure
      setNotifications(prev =>
        prev.map(n => (n.id === item.id ? { ...n, unread: true } : n))
      )
      setUnreadCount(prev => prev + 1)
    }
  }

  const filtered = notifications.filter(n => {
    if (activeFilter === 'All') return true
    if (activeFilter === 'Unread') return n.unread
    if (activeFilter === 'Credential Offers') return n.type === 'credential.offer' || n.type === 'credential.offer.accepted'
    if (activeFilter === 'Sharing Requests') return n.type === 'share.request'
    if (activeFilter === 'Security') return n.type === 'auth.new_session' || n.type === 'auth.login'
    if (activeFilter === 'System') return n.type === 'credential.expiring' || n.type === 'did.registered'
    return true
  })

  const grouped = filtered.reduce((acc, curr) => {
    const group = acc[curr.group] ?? []
    acc[curr.group] = [...group, curr]
    return acc
  }, {} as Record<string, NotificationItem[]>)

  const activeGroups = GROUPS_ORDER.filter(g => (grouped[g]?.length ?? 0) > 0)

  return (
    <>
      <DashboardTopBar title="Notifications" />
      <main className="flex-1 p-6 md:p-8">
        <div className="max-w-[1000px] w-full mx-auto">

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between pb-6">
              <div className="flex items-center gap-3">
                <h2 className="font-sans font-bold text-[28px] text-white leading-none">Notifications</h2>
                {unreadCount > 0 && (
                  <div className="bg-[#0066FF] min-w-[18px] h-[18px] rounded-[4px] px-2 py-[3px] flex items-center justify-center">
                    <span className="font-sans font-semibold text-[11px] text-white leading-none tracking-wide whitespace-nowrap">
                      {unreadCount}
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={handleMarkAllRead}
                className="font-sans font-medium text-[13px] text-[#0066FF] hover:text-[#0052CC] transition-colors"
              >
                Mark all read
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-3">
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

          {/* Notifications List */}
          <div className="bg-[#1A1A2E] rounded-[8px] shadow-[0_2px_8px_rgba(0,0,0,0.32)] overflow-hidden">
            {loading ? (
              <div className="py-16 px-6 flex flex-col items-center justify-center text-center">
                <div className="w-8 h-8 border-2 border-[#0066FF] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="font-sans font-normal text-[14px] text-[#8E8E93]">Loading notifications…</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 px-6 flex flex-col items-center justify-center text-center">
                <BellOff className="w-12 h-12 text-[#8E8E93] mb-4" />
                <h3 className="font-sans font-semibold text-[18px] text-white">No notifications</h3>
                <p className="font-sans font-normal text-[14px] text-[#8E8E93] mt-2">
                  You&apos;re all caught up.
                </p>
              </div>
            ) : (
              GROUPS_ORDER.map(group => {
                const groupItems = grouped[group]
                if (!groupItems || groupItems.length === 0) return null

                const lastActiveGroup = activeGroups[activeGroups.length - 1]

                return (
                  <div key={group}>
                    <div className="bg-[#242438] px-5 py-2 font-sans font-semibold text-[11px] text-[#8E8E93] uppercase tracking-wider">
                      {group}
                    </div>
                    {groupItems.map((item, index) => {
                      const { icon: Icon, iconColor, iconBg } = getIconProps(item.type)
                      const isLastItemInLastGroup =
                        index === groupItems.length - 1 && group === lastActiveGroup

                      return (
                        <div
                          key={item.id}
                          onClick={() => handleNotificationClick(item)}
                          className={`flex items-start gap-[14px] p-5 min-h-[64px] transition-colors hover:bg-[#242438]/50 cursor-pointer ${
                            item.unread
                              ? 'border-l-[3px] border-l-[#0066FF] bg-[rgba(0,102,255,0.04)] pl-[17px]'
                              : 'border-l-[3px] border-l-transparent'
                          } ${!isLastItemInLastGroup ? 'border-b border-b-[#2A2A42]' : ''}`}
                        >
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                            style={{ backgroundColor: iconBg }}
                          >
                            <Icon className="w-[18px] h-[18px]" style={{ color: iconColor }} />
                          </div>

                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <h4 className="font-sans font-medium text-[14px] text-white leading-tight">
                              {item.title}
                            </h4>
                            {item.subtitle && (
                              <p className="font-sans font-normal text-[12px] text-[#8E8E93] mt-0.5 leading-snug">
                                {item.subtitle}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-col items-end shrink-0 ml-4">
                            <span className="font-sans font-normal text-[11px] text-[#48484F]">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                            {item.actionUrl && (
                              <a
                                href={item.actionUrl}
                                onClick={e => e.stopPropagation()}
                                className="font-sans font-medium text-[12px] text-[#0066FF] hover:text-[#0052CC] mt-1 transition-colors"
                              >
                                Review →
                              </a>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              })
            )}
          </div>

        </div>
      </main>
    </>
  )
}
