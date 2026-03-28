import { TopNavBar } from '@/components/marketing/TopNavBar'
import { Footer } from '@/components/marketing/Footer'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNavBar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
