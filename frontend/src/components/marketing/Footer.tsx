import React from 'react'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

export function Footer() {
  return (
    <footer className="w-full bg-[#0A1628] px-6 lg:px-[120px] py-[64px] border-t border-white/10">
      <div className="w-full max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        {/* Column 1 */}
        <div className="flex flex-col">
          <Link href="/" className="flex items-center gap-3 mb-6">
            <img src="/logos/solidus_dark.png" alt="Solidus" className="h-6 w-auto" />
          </Link>
          <p className="font-sans font-normal text-[14px] text-[#8E8E93] max-w-[200px] mb-6 leading-[1.5]">
            The self-sovereign identity protocol for a more private internet.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-[#8E8E93] hover:text-white transition-colors" aria-label="X (Twitter)">
              <ExternalLink className="w-5 h-5" />
            </a>
            <a href="#" className="text-[#8E8E93] hover:text-white transition-colors" aria-label="GitHub">
              <ExternalLink className="w-5 h-5" />
            </a>
            <a href="#" className="text-[#8E8E93] hover:text-white transition-colors" aria-label="LinkedIn">
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-4">
          <h4 className="font-sans font-semibold text-[14px] text-white uppercase tracking-wider mb-2">Product</h4>
          {['How It Works', 'Credentials', 'Privacy', 'Sign In with Solidus'].map((link) => (
            <a key={link} href="#" className="font-sans font-normal text-[14px] text-[#8E8E93] hover:text-white transition-colors">
              {link}
            </a>
          ))}
        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-4">
          <h4 className="font-sans font-semibold text-[14px] text-white uppercase tracking-wider mb-2">Developers</h4>
          {['SDK Docs', 'API Reference', 'GitHub', 'Status'].map((link) => (
            <a key={link} href="#" className="font-sans font-normal text-[14px] text-[#8E8E93] hover:text-white transition-colors">
              {link}
            </a>
          ))}
        </div>

        {/* Column 4 */}
        <div className="flex flex-col gap-4">
          <h4 className="font-sans font-semibold text-[14px] text-white uppercase tracking-wider mb-2">Company</h4>
          {['About', 'Blog', 'Careers', 'Legal', 'Privacy Policy'].map((link) => (
            <a key={link} href="#" className="font-sans font-normal text-[14px] text-[#8E8E93] hover:text-white transition-colors">
              {link}
            </a>
          ))}
        </div>

      </div>
      <div className="w-full max-w-[1200px] mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 font-sans font-normal text-[12px] text-[#8E8E93]">
        <span>© 2026 Solidus Network. All rights reserved.</span>
        <span>Build ID: 89a4cf2</span>
      </div>
    </footer>
  )
}
