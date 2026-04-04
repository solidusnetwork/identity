'use client'

import { DashboardTopBar } from '@/components/app/DashboardTopBar'
import { DIDIdentityCard } from '@/components/app/dashboard/DIDIdentityCard'
import { StatRow } from '@/components/app/dashboard/StatRow'
import { NetworkTrustStrip } from '@/components/app/dashboard/NetworkTrustStrip'
import { QuickActions } from '@/components/app/dashboard/QuickActions'
import { RecentActivityFeed } from '@/components/app/dashboard/RecentActivityFeed'
import { CredentialSnapshotRow } from '@/components/app/dashboard/CredentialSnapshotRow'
import { useAuth } from '../../../lib/auth'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <>
      <DashboardTopBar title="Dashboard" />
      <main className="flex-1 p-6 md:p-8 max-w-[1000px] w-full mx-auto">
        <DIDIdentityCard />
        <StatRow />
        <NetworkTrustStrip />
        <QuickActions />
        <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
          <RecentActivityFeed />
          <div className="overflow-hidden">
            <CredentialSnapshotRow />
          </div>
        </div>
      </main>
    </>
  )
}
