'use client'

import { useState } from 'react'
import { Copy, Check, QrCode, Download, Share2, X } from 'lucide-react'

export function DIDIdentityCard() {
  const [copied, setCopied] = useState(false)
  const [qrModalOpen, setQrModalOpen] = useState(false)

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <>
      <div
        className="relative w-full max-w-[460px] h-[280px] mx-auto mb-8 rounded-[16px] shadow-[0_0_24px_rgba(0,212,255,0.15),0_8px_32px_rgba(0,0,0,0.48)] overflow-hidden flex flex-col"
        style={{
          background: 'linear-gradient(135deg, #0D1826 0%, #1A1A3E 60%, #0D2040 100%)'
        }}
      >
        {/* Top Border Gradient */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px]"
          style={{ background: 'linear-gradient(90deg, #A8E600, #00D4FF)' }}
        ></div>

        {/* Top bar (Logo & Badge) */}
        <div className="flex items-center justify-between pt-5 px-6 shrink-0">
          <div className="flex items-center gap-2">
            <img src="/logos/solidus_icon.png" alt="Solidus Logo" className="w-[18px] h-auto drop-shadow-md" />
            <span className="font-sans font-medium text-[10px] text-[#8E8E93] uppercase tracking-wide">Solidus Identity</span>
          </div>
          <div className="bg-[#A8E600]/10 border border-[#A8E600]/25 rounded-full px-2.5 py-0.5">
            <span className="font-sans font-medium text-[10px] text-[#A8E600] tracking-wide relative z-10 overflow-hidden before:absolute before:inset-0 before:-translate-x-full hover:before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent">
              SOVEREIGN ID
            </span>
          </div>
        </div>

        {/* Center content (Avatar & Info) */}
        <div className="flex-1 flex items-center px-6">
          <div className="relative">
            <div className="w-[80px] h-[80px] rounded-full bg-[#242438] flex items-center justify-center text-[#8E8E93] text-2xl shadow-[0_0_0_2px_#1A1A3E,0_0_0_3px_#34C759]">
              AC
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#34C759] border-2 border-[#1A1A3E]"></div>
          </div>

          <div className="flex flex-col ml-4">
            <h2 className="font-sans font-bold text-[24px] text-white leading-tight">
              Alex Chen
            </h2>
            <p className="font-sans font-normal text-[11px] text-[#8E8E93] mt-0.5">
              Member since January 2026
            </p>
            <div
              className="flex items-center gap-1.5 mt-2 cursor-pointer group"
              onClick={handleCopy}
              title="Copy full DID"
            >
              <span className="font-mono text-[11px] text-[#8E8E93] group-hover:text-[#A8E600] transition-colors">
                did:solidus:mainnet:5dK3fP7...J6tHgAs
              </span>
              <div className="relative flex items-center justify-center">
                {copied ? (
                  <Check className="w-3 h-3 text-[#34C759]" />
                ) : (
                  <Copy className="w-3 h-3 text-[#48484F] group-hover:text-[#8E8E93] transition-colors" />
                )}
                {copied && (
                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-[#34C759] text-[#0A1628] text-[10px] font-bold px-1.5 py-0.5 rounded shadow-lg whitespace-nowrap animate-in fade-in slide-in-from-bottom-1">
                    Copied!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="px-6 pb-6 pt-4 border-t border-white/5 flex items-center gap-2 shrink-0">
          <Badge bg="#0066FF" text="Email ✓" />
          <Badge bg="#34C759" text="Phone ✓" textColor="#0A1628" />
          <Badge bg="#00D4FF" text="KYC L2 ✓" textColor="#0A1628" />
          <Badge bg="#A8E600" text="Uni ✓" textColor="#0A1628" />
        </div>

        {/* QR Share Button */}
        <div className="absolute right-4 bottom-4 group">
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 whitespace-nowrap bg-[#242438] text-white font-sans text-[12px] px-2 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150 delay-400 pointer-events-none z-10">
            Share your DID via QR
          </div>
          <button
            onClick={() => setQrModalOpen(true)}
            className="w-9 h-9 rounded-lg bg-[#242438] border border-[#2A2A42] flex items-center justify-center transition-all duration-150 ease-out hover:bg-[#0066FF] hover:border-[#0066FF] hover:shadow-[0_0_12px_rgba(0,102,255,0.30)]"
          >
            <QrCode className="w-[18px] h-[18px] text-[#8E8E93] group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>

      {/* QR Modal */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#0A1628]/70 backdrop-blur-md"
            onClick={() => setQrModalOpen(false)}
          ></div>
          <div className="relative w-full max-w-[400px] bg-[#1A1A2E] border border-[#2A2A42] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.48)] flex flex-col p-6 animate-in fade-in zoom-in-95 duration-200 ease-out">

            <div className="flex items-center justify-between mb-6">
              <h3 className="font-sans font-semibold text-[16px] text-white">Your DID</h3>
              <button onClick={() => setQrModalOpen(false)} className="text-[#8E8E93] hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated QR Code Area */}
            <div className="w-[256px] h-[256px] bg-[#242438] rounded-xl mx-auto flex items-center justify-center p-4 border border-[#2A2A42]">
              <div className="w-full h-full bg-white opacity-90 rounded flex flex-wrap gap-1 p-2">
                <div className="w-12 h-12 border-4 border-[#0A1628] absolute top-6 left-6"></div>
                <div className="w-12 h-12 border-4 border-[#0A1628] absolute top-6 right-6"></div>
                <div className="w-12 h-12 border-4 border-[#0A1628] absolute bottom-6 left-6"></div>
                <div className="w-full h-full opacity-30 flex items-center justify-center">
                  <QrCode className="w-24 h-24 text-[#0A1628]" />
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center">
              <div className="bg-[#242438] rounded-lg p-3 w-full flex items-center justify-between border border-[#2A2A42]">
                <span className="font-mono text-[12px] text-[#8E8E93] truncate mr-2">
                  did:solidus:mainnet:5dK3fP7vLm8Qw2xNz9Rb4YcJ6tHgAs
                </span>
                <Copy className="w-4 h-4 text-[#8E8E93] shrink-0 cursor-pointer hover:text-white transition-colors" />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2">
              <button className="h-10 bg-[#242438] hover:bg-[#2A2A42] border border-[#2A2A42] rounded-lg flex items-center justify-center gap-2 transition-colors">
                <Copy className="w-3.5 h-3.5 text-[#8E8E93]" />
                <span className="font-sans font-medium text-[12px] text-white">Copy DID</span>
              </button>
              <button className="h-10 bg-[#242438] hover:bg-[#2A2A42] border border-[#2A2A42] rounded-lg flex items-center justify-center gap-2 transition-colors">
                <Download className="w-3.5 h-3.5 text-[#8E8E93]" />
                <span className="font-sans font-medium text-[12px] text-white">Download</span>
              </button>
              <button className="h-10 bg-[#242438] hover:bg-[#2A2A42] border border-[#2A2A42] rounded-lg flex items-center justify-center gap-2 transition-colors">
                <Share2 className="w-3.5 h-3.5 text-[#8E8E93]" />
                <span className="font-sans font-medium text-[12px] text-white">Share</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}

function Badge({ bg, text, textColor = '#FFFFFF' }: { bg: string; text: string; textColor?: string }) {
  return (
    <div
      className="rounded-full px-2.5 py-0.5"
      style={{ backgroundColor: bg }}
    >
      <span
        className="font-sans font-medium text-[11px]"
        style={{ color: textColor }}
      >
        {text}
      </span>
    </div>
  )
}
