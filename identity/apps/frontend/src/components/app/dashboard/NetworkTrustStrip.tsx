import { Server, Activity, Clock } from 'lucide-react'

export function NetworkTrustStrip() {
  return (
    <div className="h-10 bg-[#1A1A2E] rounded-lg px-5 flex items-center justify-between mb-6">

      <div className="flex items-center gap-1.5">
        <Server className="w-3 h-3 text-[#48484F]" />
        <span className="font-sans font-normal text-[11px] text-[#48484F]">
          1,247 validators securing the network
        </span>
      </div>

      <div className="hidden md:flex items-center gap-1.5">
        <Activity className="w-3 h-3 text-[#48484F]" />
        <span className="font-sans font-normal text-[11px] text-[#48484F]">
          48.7M credentials issued
        </span>
      </div>

      <div className="hidden sm:flex items-center gap-1.5">
        <Clock className="w-3 h-3 text-[#48484F]" />
        <span className="font-sans font-normal text-[11px] text-[#48484F]">
          1-2s average verification
        </span>
      </div>

    </div>
  )
}
