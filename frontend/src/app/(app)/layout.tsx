'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AppSidebar } from '@/components/app/AppSidebar'
import { useAuth } from '../../lib/auth'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [isLoading, user, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A1628] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#0A1628] text-white flex">
      <AppSidebar />
      <div className="flex-1 ml-[240px] flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  )
}
