'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  X,
  CheckCircle,
  Fingerprint,
  CheckSquare,
  Square,
  ShieldCheck,
  ZapOff,
  Zap,
} from 'lucide-react'
import jsQR from 'jsqr'
import { api } from '@/lib/api'
import type { QrValidateResult, Credential } from '@/types/api'

type CameraState = 'idle' | 'processing' | 'found'
type SheetState = 'hidden' | 'request' | 'select' | 'approve' | 'success'

export default function QRScannerPage() {
  const router = useRouter()

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number>(0)
  const scanningRef = useRef(true)

  const [flashlightOn, setFlashlightOn] = useState(false)
  const [cameraState, setCameraState] = useState<CameraState>('idle')
  const [sheetState, setSheetState] = useState<SheetState>('hidden')

  // QR validate result
  const [qrResult, setQrResult] = useState<QrValidateResult | null>(null)

  // Credentials for selection
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [selectedCredId, setSelectedCredId] = useState<string | null>(null)

  // ── Camera setup ─────────────────────────────────────────────────────────

  const startScan = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function tick() {
      if (!scanningRef.current || !video || !canvas || !ctx) return
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const code = jsQR(imageData.data, imageData.width, imageData.height)
        if (code) {
          scanningRef.current = false
          cancelAnimationFrame(rafRef.current)
          setCameraState('processing')

          api.post<QrValidateResult>('/v1/qr/validate', { payload: code.data })
            .then((result) => {
              setQrResult(result)
              setCameraState('found')
              setSheetState('request')
            })
            .catch(() => {
              // Invalid QR — resume scanning
              scanningRef.current = true
              setCameraState('idle')
              rafRef.current = requestAnimationFrame(tick)
            })
          return
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [])

  useEffect(() => {
    let mounted = true

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        if (!mounted) { stream.getTracks().forEach((t) => t.stop()); return }
        streamRef.current = stream
        const video = videoRef.current
        if (video) {
          video.srcObject = stream
          video.play().then(startScan).catch(() => {})
        }
      })
      .catch(() => {
        // Camera unavailable — page shows desktop notice or falls back gracefully
      })

    return () => {
      mounted = false
      scanningRef.current = false
      cancelAnimationFrame(rafRef.current)
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [startScan])

  // Fetch user's credentials for selection sheet
  useEffect(() => {
    api.get<Credential[]>('/v1/credentials/').then(setCredentials).catch(() => {})
  }, [])

  // ── Flashlight ────────────────────────────────────────────────────────────

  const toggleFlashlight = async () => {
    const track = streamRef.current?.getVideoTracks()[0]
    if (!track) return
    try {
      await track.applyConstraints({ advanced: [{ torch: !flashlightOn } as MediaTrackConstraintSet] })
      setFlashlightOn((prev) => !prev)
    } catch {
      // torch not supported — just toggle the icon
      setFlashlightOn((prev) => !prev)
    }
  }

  // ── Sharing flow ──────────────────────────────────────────────────────────

  // approve → submit share then success
  useEffect(() => {
    if (sheetState !== 'approve' || !qrResult || !selectedCredId) return

    const cred = credentials.find((c) => c.id === selectedCredId)
    const sharedClaims = cred ? Object.keys(cred.claims) : []

    api.post('/v1/sharing/requests/' + qrResult.requestId + '/respond', {
      action: 'approve',
      credentialId: selectedCredId,
      sharedClaims,
    })
      .then(() => setSheetState('success'))
      .catch(() => setSheetState('select')) // back to select on failure
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheetState])

  const handleDecline = async () => {
    if (qrResult) {
      await api.post('/v1/sharing/requests/' + qrResult.requestId + '/respond', { action: 'deny' }).catch(() => {})
    }
    router.push('/dashboard')
  }

  const sheetOpen = sheetState !== 'hidden'
  const cornerColor =
    cameraState === 'processing' || cameraState === 'found' ? 'border-[#0066FF]' : 'border-white/60'

  const requesterInitials = qrResult
    ? qrResult.requesterName.split(' ').map((w) => w[0] ?? '').join('').slice(0, 2).toUpperCase()
    : '??'

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center overflow-hidden font-sans">
      {/* Hidden video + canvas for QR reading */}
      <video ref={videoRef} className="hidden" playsInline muted />
      <canvas ref={canvasRef} className="hidden" />

      {/* Desktop notice */}
      <div className="hidden md:flex absolute inset-0 items-center justify-center z-[200] bg-black/80 backdrop-blur-sm">
        <div className="bg-[#1A1A2E] border border-[#2A2A42] rounded-xl p-8 max-w-[360px] text-center">
          <ShieldCheck className="w-10 h-10 text-[#0066FF] mx-auto mb-4" />
          <h3 className="font-sans font-semibold text-[20px] text-white mb-2">Use Mobile App</h3>
          <p className="font-sans font-normal text-[14px] text-[#8E8E93] leading-relaxed">
            QR code scanning is optimised for mobile. Open Solidus Identity on your phone to scan.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-6 h-11 w-full bg-[#0066FF] hover:bg-[#0055D4] rounded-lg font-sans font-semibold text-[14px] text-white transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Mobile content */}
      <div className="md:hidden flex flex-col w-full h-full relative">
        {/* Camera feed background */}
        <video
          ref={undefined}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ display: cameraState !== 'found' ? 'block' : 'none' }}
        />

        {/* Top Bar */}
        <div className="absolute top-0 left-0 w-full px-6 pt-12 pb-4 flex justify-between items-center z-10">
          <button
            onClick={() => router.push('/dashboard')}
            className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={toggleFlashlight}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm
              ${flashlightOn ? 'bg-white' : 'bg-black/60 hover:bg-black/80'}
            `}
          >
            {flashlightOn ? (
              <Zap className="w-5 h-5 text-black" />
            ) : (
              <ZapOff className="w-5 h-5 text-white" />
            )}
          </button>
        </div>

        {/* Camera View */}
        <div className="flex-1 flex flex-col items-center justify-center -mt-16 relative">
          <h2
            className="font-sans font-semibold text-[28px] text-white mb-10 text-center relative z-10"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
          >
            Scan QR Code
          </h2>

          <div className="relative w-[280px] h-[280px]">
            <div className={`absolute top-0 left-0 w-12 h-12 border-t-[4px] border-l-[4px] rounded-tl-lg transition-colors duration-300 ${cornerColor}`} />
            <div className={`absolute top-0 right-0 w-12 h-12 border-t-[4px] border-r-[4px] rounded-tr-lg transition-colors duration-300 ${cornerColor}`} />
            <div className={`absolute bottom-0 left-0 w-12 h-12 border-b-[4px] border-l-[4px] rounded-bl-lg transition-colors duration-300 ${cornerColor}`} />
            <div className={`absolute bottom-0 right-0 w-12 h-12 border-b-[4px] border-r-[4px] rounded-br-lg transition-colors duration-300 ${cornerColor}`} />

            {cameraState === 'idle' && (
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#0066FF] shadow-[0_0_12px_rgba(0,102,255,1)] animate-scan-sweep" />
            )}

            {cameraState === 'processing' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm rounded-lg z-20">
                <div className="w-8 h-8 border-[3px] border-[#0066FF] border-t-transparent rounded-full animate-spin mb-4" />
                <span className="font-sans font-semibold text-[15px] text-[#0066FF] drop-shadow-[0_0_8px_rgba(0,102,255,0.4)]">
                  Reading QR code...
                </span>
              </div>
            )}
          </div>

          <p className="font-sans font-normal text-[15px] text-white/70 text-center mt-12 max-w-[280px] leading-relaxed">
            Point your camera at a credential offer or verification request.
          </p>
        </div>

        {/* Dim overlay */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-500 pointer-events-none
            ${sheetOpen ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Bottom Sheet */}
        <div
          className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[640px] h-[65vh] bg-[#1A1A2E] rounded-t-[16px] shadow-[0_-8px_24px_rgba(0,0,0,0.48)] z-50 flex flex-col
            transition-transform duration-300 ease-in-out
            ${sheetOpen ? 'translate-y-0' : 'translate-y-full'}`}
        >
          <div className="w-[40px] h-[4px] bg-[#2A2A42] rounded-full mx-auto mt-3 mb-6 shrink-0" />

          {/* REQUEST */}
          {sheetState === 'request' && qrResult && (
            <div className="flex-1 flex flex-col px-6 overflow-y-auto pb-8">
              <h2 className="font-sans font-semibold text-[20px] text-white text-center mb-6">
                Credential Request
              </h2>

              <div className="flex items-center gap-4 bg-[#242438] p-5 rounded-xl border border-[#2A2A42] mb-8">
                <div className="w-10 h-10 rounded-full bg-[#1A1A2E] border border-[#2A2A42] flex items-center justify-center font-bold text-[14px] text-white shrink-0">
                  {requesterInitials}
                </div>
                <div className="flex flex-col flex-1 overflow-hidden">
                  <h3 className="font-sans font-semibold text-[16px] text-white leading-tight mb-1">
                    {qrResult.requesterName}
                  </h3>
                  <span className="font-mono text-[10px] text-[#8E8E93] truncate">
                    {qrResult.requesterDid.length > 40
                      ? qrResult.requesterDid.slice(0, 20) + '...' + qrResult.requesterDid.slice(-8)
                      : qrResult.requesterDid}
                  </span>
                </div>
                {qrResult.isVerified && <ShieldCheck className="w-5 h-5 text-[#34C759] shrink-0" />}
              </div>

              <span className="font-sans font-medium text-[11px] text-[#8E8E93] uppercase tracking-[0.06em] mb-4 block">
                Requesting:
              </span>

              <div className="flex flex-col gap-3 mb-auto">
                <div className="flex items-center gap-3 bg-[#0A1628] border border-[#2A2A42] p-3 rounded-lg">
                  <span className="w-2 h-2 rounded-full bg-[#FF3B30] shrink-0" />
                  <span className="font-sans font-medium text-[14px] text-white flex-1">
                    {qrResult.requestedType}
                  </span>
                  <span className="bg-[#FF3B30]/20 text-[#FF3B30] text-[10px] font-medium px-2 py-0.5 rounded shrink-0">
                    Required
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-8">
                <button
                  onClick={() => setSheetState('select')}
                  className="w-full h-12 bg-[#0066FF] hover:bg-[#0055D4] rounded-xl font-sans font-semibold text-[15px] text-white transition-colors shadow-[0_2px_8px_rgba(0,102,255,0.3)]"
                >
                  Review &amp; Share
                </button>
                <button
                  onClick={handleDecline}
                  className="w-full h-12 border border-[#2A2A42] hover:bg-[#242438] rounded-xl font-sans font-semibold text-[15px] text-[#8E8E93] hover:text-white transition-colors"
                >
                  Decline
                </button>
              </div>
            </div>
          )}

          {/* SELECT */}
          {sheetState === 'select' && (
            <div className="flex-1 flex flex-col px-6 overflow-y-auto pb-8">
              <h2 className="font-sans font-semibold text-[20px] text-white text-center mb-6">
                Select Credential
              </h2>

              <div className="flex flex-col gap-3 flex-1">
                {credentials.length === 0 ? (
                  <p className="text-[13px] text-[#8E8E93] text-center mt-8">No credentials available</p>
                ) : (
                  credentials.map((cred) => {
                    const credType = cred.type.find((t) => t !== 'VerifiableCredential') ?? cred.type[0] ?? 'Credential'
                    const issuer = cred.issuerDid.replace('did:solidus:', '').split(':')[1] ?? cred.issuerDid
                    const isSelected = selectedCredId === cred.id
                    return (
                      <div
                        key={cred.id}
                        onClick={() => setSelectedCredId(cred.id)}
                        className={`rounded-lg p-4 flex items-center gap-4 cursor-pointer transition-colors duration-200 border-l-[4px]
                          ${isSelected
                            ? 'bg-[#1A2A4A] border-l-[#0066FF] border border-[#2A2A42]'
                            : 'bg-[#242438] border-l-transparent border border-transparent hover:bg-[#2A2A42]'
                          }
                        `}
                      >
                        <div className="shrink-0">
                          {isSelected ? (
                            <CheckSquare className="w-5 h-5 text-[#0066FF]" />
                          ) : (
                            <Square className="w-5 h-5 text-[#48484F]" />
                          )}
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="font-sans font-semibold text-[15px] text-white truncate mb-0.5">
                            {credType}
                          </span>
                          <span className="font-sans font-normal text-[12px] text-[#8E8E93] truncate">
                            {issuer}
                          </span>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              <div className="mt-auto pt-8">
                <button
                  disabled={!selectedCredId}
                  onClick={() => setSheetState('approve')}
                  className={`w-full h-12 rounded-xl font-sans font-semibold text-[15px] transition-colors
                    ${selectedCredId
                      ? 'bg-[#0066FF] hover:bg-[#0055D4] text-white shadow-[0_2px_8px_rgba(0,102,255,0.3)]'
                      : 'bg-[#2A2A42] text-[#8E8E93] cursor-not-allowed'
                    }
                  `}
                >
                  Share Selected
                </button>
              </div>
            </div>
          )}

          {/* APPROVE */}
          {sheetState === 'approve' && (
            <div className="flex-1 flex flex-col items-center justify-center pb-12">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-[#0066FF]/20 rounded-full animate-ping" />
                <div className="w-24 h-24 bg-[#0066FF]/10 rounded-full flex items-center justify-center relative z-10">
                  <Fingerprint className="w-[48px] h-[48px] text-[#0066FF]" />
                </div>
              </div>
              <h2 className="font-sans font-semibold text-[20px] text-white mb-2">
                Confirm with Biometric
              </h2>
              <p className="font-sans font-medium text-[14px] text-[#8E8E93]">
                Waiting for face or fingerprint...
              </p>
            </div>
          )}

          {/* SUCCESS */}
          {sheetState === 'success' && (
            <div className="flex-1 flex flex-col items-center justify-center pb-12 gap-4">
              <CheckCircle className="w-[56px] h-[56px] text-[#34C759] drop-shadow-[0_0_12px_rgba(52,199,89,0.4)]" />
              <h3 className="font-sans font-semibold text-[20px] text-[#34C759]">Shared!</h3>
              <p className="font-sans font-normal text-[13px] text-[#8E8E93] text-center max-w-[240px]">
                Your credential was shared successfully with {qrResult?.requesterName ?? 'the requester'}.
              </p>
              <button
                onClick={() => router.push('/dashboard')}
                className="mt-4 h-11 px-8 bg-[#0066FF] hover:bg-[#0055D4] rounded-xl font-sans font-semibold text-[14px] text-white transition-colors shadow-[0_2px_8px_rgba(0,102,255,0.3)]"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
