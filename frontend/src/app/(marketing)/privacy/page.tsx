import {
  EyeOff, Lock, XCircle, ShieldCheck, Calendar, User, Fingerprint, MapPin,
  Hash, Sigma, Cpu, ArrowRight
} from 'lucide-react'

// ─── Hero ──────────────────────────────────────────────────────────────────────
function HeroPrivacy() {
  return (
    <section className="w-full bg-white px-6 py-20 lg:py-24 flex flex-col items-center justify-center">
      <h1 className="font-sans font-bold text-[36px] md:text-[48px] text-[#0A1628] text-center leading-[1.2] whitespace-pre-wrap">
        {'You control your data.\nAlways.'}
      </h1>
    </section>
  )
}

// ─── Three Principles ─────────────────────────────────────────────────────────
function ThreePrinciples() {
  return (
    <section className="w-full bg-white px-6 lg:px-[120px] pb-[80px] flex justify-center">
      <div className="w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
        <div className="flex flex-col items-start">
          <EyeOff className="w-12 h-12 text-[#0A1628] mb-6" />
          <h3 className="font-sans font-semibold text-[22px] text-[#0A1628] mb-3">Minimum Disclosure</h3>
          <p className="font-sans font-normal text-[16px] text-[#666666] leading-[1.6]">
            Only the fields you choose leave your wallet. Not the document. Not the metadata. Not the request itself.
          </p>
        </div>
        <div className="flex flex-col items-start">
          <Lock className="w-12 h-12 text-[#0A1628] mb-6" />
          <h3 className="font-sans font-semibold text-[22px] text-[#0A1628] mb-3">ZK Cryptography</h3>
          <p className="font-sans font-normal text-[16px] text-[#666666] leading-[1.6]">
            Zero-knowledge proofs let you prove facts without revealing evidence. Prove you're over 18 without sharing your birthdate.
          </p>
        </div>
        <div className="flex flex-col items-start">
          <XCircle className="w-12 h-12 text-[#0A1628] mb-6" />
          <h3 className="font-sans font-semibold text-[22px] text-[#0A1628] mb-3">No Data Brokers</h3>
          <p className="font-sans font-normal text-[16px] text-[#666666] leading-[1.6]">
            Solidus never sees your credentials. The protocol never stores your presentations. There is no database of your sharing history on our servers.
          </p>
        </div>
      </div>
    </section>
  )
}

// ─── Disclosure Spectrum ───────────────────────────────────────────────────────
function DisclosureSpectrum() {
  return (
    <section className="w-full bg-[#0A1628] px-6 lg:px-[120px] py-[96px] flex flex-col items-center overflow-hidden">
      <div className="w-full max-w-[1200px] flex flex-col items-center">
        <h2 className="font-sans font-bold text-[32px] md:text-[36px] text-white text-center mb-16">
          The Disclosure Spectrum
        </h2>

        <div className="w-full relative mt-4">
          <div className="absolute top-[28px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-[#00D4FF] via-[#A8E600] to-[#FF6B6B] hidden md:block" />

          <div className="hidden md:flex justify-between w-full absolute top-[-16px] px-[10%]">
            <span className="font-sans font-semibold text-[12px] text-[#00D4FF] uppercase tracking-wider bg-[#0A1628] px-2 -ml-2">Share Nothing</span>
            <span className="font-sans font-semibold text-[12px] text-[#FF6B6B] uppercase tracking-wider bg-[#0A1628] px-2 -mr-2">Share Everything</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10">
            {/* Scenario 1 */}
            <div className="flex flex-col items-center">
              <div className="w-[16px] h-[16px] rounded-full bg-[#0A1628] border-4 border-[#00D4FF] mb-8 hidden md:block" />
              <h4 className="font-sans font-semibold text-[18px] text-white mb-6 text-center">"Prove you're human"</h4>
              <div className="w-full max-w-[280px] bg-[#1A1A2E] rounded-xl p-5 border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between bg-white/[0.03] p-3 rounded-lg border border-dashed border-white/10">
                    <div className="flex items-center gap-2">
                      <Fingerprint className="w-4 h-4 text-[#8E8E93]" />
                      <span className="font-sans text-[12px] text-[#8E8E93]">Biometric Anchor</span>
                    </div>
                    <span className="font-sans text-[12px] text-[#48484F] italic">Hidden</span>
                  </div>
                  <div className="flex items-center justify-between bg-[#00D4FF]/10 p-3 rounded-lg border border-[#00D4FF]/30">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#00D4FF]" />
                      <span className="font-sans text-[12px] text-white">Liveness Proof</span>
                    </div>
                    <span className="font-mono text-[12px] text-[#00D4FF]">Valid ✓</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scenario 2 */}
            <div className="flex flex-col items-center">
              <div className="w-[16px] h-[16px] rounded-full bg-[#0A1628] border-4 border-[#A8E600] mb-8 hidden md:block" />
              <h4 className="font-sans font-semibold text-[18px] text-white mb-6 text-center">"Age gate (18+)"</h4>
              <div className="w-full max-w-[280px] bg-[#1A1A2E] rounded-xl p-5 border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between bg-[#A8E600]/10 p-3 rounded-lg border border-[#A8E600]/30">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#A8E600]" />
                      <span className="font-sans text-[12px] text-white">Age check</span>
                    </div>
                    <span className="font-mono text-[12px] text-[#A8E600]">&gt; 18 ✓</span>
                  </div>
                  <div className="flex items-center justify-between bg-white/[0.03] p-3 rounded-lg border border-dashed border-white/10">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-[#8E8E93]" />
                      <span className="font-sans text-[12px] text-[#8E8E93]">Exact DOB</span>
                    </div>
                    <span className="font-sans text-[12px] text-[#48484F] italic">Hidden</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scenario 3 */}
            <div className="flex flex-col items-center">
              <div className="w-[16px] h-[16px] rounded-full bg-[#0A1628] border-4 border-[#FF6B6B] mb-8 hidden md:block" />
              <h4 className="font-sans font-semibold text-[18px] text-white mb-6 text-center">"Full KYC handshake"</h4>
              <div className="w-full max-w-[280px] bg-[#1A1A2E] rounded-xl p-5 border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between bg-white/[0.05] p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#8E8E93]" />
                      <span className="font-sans text-[12px] text-[#8E8E93]">Full Name</span>
                    </div>
                    <span className="font-sans text-[12px] text-white font-medium">Alex Smith</span>
                  </div>
                  <div className="flex items-center justify-between bg-white/[0.05] p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#8E8E93]" />
                      <span className="font-sans text-[12px] text-[#8E8E93]">DOB</span>
                    </div>
                    <span className="font-sans text-[12px] text-white font-medium">1992-08-14</span>
                  </div>
                  <div className="flex items-center justify-between bg-white/[0.05] p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#8E8E93]" />
                      <span className="font-sans text-[12px] text-[#8E8E93]">Country</span>
                    </div>
                    <span className="font-sans text-[12px] text-white font-medium">USA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── GDPR Note ─────────────────────────────────────────────────────────────────
function GDPRNote() {
  return (
    <section className="w-full bg-white px-6 lg:px-[120px] py-[64px] flex justify-center">
      <div className="w-full max-w-[800px]">
        <div className="bg-[#F2F2F7] border-l-[4px] border-[#0066FF] rounded-r-lg p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <p className="font-sans font-medium text-[16px] text-[#0A1628] leading-[1.6]">
            Solidus credentials are designed for eIDAS 2.0 compliance and align with the EU Digital Identity Wallet framework.
          </p>
        </div>
      </div>
    </section>
  )
}

// ─── Cryptographic Proofs Section ─────────────────────────────────────────────
function CryptographicProofsSection() {
  return (
    <section className="w-full bg-[#0A1628] px-6 lg:px-[120px] py-[64px] flex flex-col items-center">
      <div className="w-full max-w-[1200px] flex flex-col">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="font-sans font-bold text-[32px] text-white">The math behind your privacy.</h2>
          <p className="font-sans font-normal text-[16px] text-[#8E8E93] mt-2">No trust-us promises. Peer-reviewed cryptography.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* BBS+ Signatures */}
          <div className="bg-[#1A1A2E] rounded-lg p-[28px] border-t-[2px] border-[#00D4FF] flex flex-col">
            <Sigma className="w-6 h-6 text-[#00D4FF] mb-4" />
            <h3 className="font-sans font-semibold text-[18px] text-white mb-2">BBS+ Signatures</h3>
            <p className="font-sans font-normal text-[14px] text-[#8E8E93] leading-[1.6] mb-6 flex-1">
              Pairing-based signatures over multiple messages. Sign all fields at once; reveal any subset. Derived from the Boneh-Boyen-Shacham signature scheme. Published at Eurocrypt 2004, updated 2020 IETF draft.
            </p>
            <div className="bg-[#242438] rounded-md p-3 mb-6">
              <div className="font-mono text-[12px] text-[#A8E600]">π = Prove(σ, M, D)</div>
              <div className="font-mono text-[12px] text-[#666666] mt-1">// M = all messages, D = disclosed set</div>
            </div>
            <button className="font-sans font-medium text-[12px] text-[#0066FF] hover:underline flex items-center group self-start">
              IETF Draft <ArrowRight className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Pedersen Commitments */}
          <div className="bg-[#1A1A2E] rounded-lg p-[28px] border-t-[2px] border-[#A8E600] flex flex-col">
            <Lock className="w-6 h-6 text-[#A8E600] mb-4" />
            <h3 className="font-sans font-semibold text-[18px] text-white mb-2">Pedersen Commitments</h3>
            <p className="font-sans font-normal text-[14px] text-[#8E8E93] leading-[1.6] mb-6 flex-1">
              Commitments allow proving knowledge of a value without revealing it. Used in Solidus to construct range proofs (e.g., age &gt; 18) without disclosing the date of birth. Computationally binding and perfectly hiding.
            </p>
            <div className="bg-[#242438] rounded-md p-3 mb-6">
              <div className="font-mono text-[12px] text-[#A8E600]">C = g^m · h^r</div>
              <div className="font-mono text-[12px] text-[#666666] mt-1">// r = blinding factor</div>
            </div>
            <button className="font-sans font-medium text-[12px] text-[#0066FF] hover:underline flex items-center group self-start">
              Learn more <ArrowRight className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Ed25519 Key Pairs */}
          <div className="bg-[#1A1A2E] rounded-lg p-[28px] border-t-[2px] border-[#C084FC] flex flex-col">
            <Cpu className="w-6 h-6 text-[#C084FC] mb-4" />
            <h3 className="font-sans font-semibold text-[18px] text-white mb-2">Ed25519 Key Pairs</h3>
            <p className="font-sans font-normal text-[14px] text-[#8E8E93] leading-[1.6] mb-6 flex-1">
              Your identity key uses Curve25519 via the Ed25519 signing algorithm — the same scheme used by Signal, Tor, and SSH. 128-bit security, fast signing (~50μs), and small key size (32 bytes). Keys are generated in a WASM sandbox on your device.
            </p>
            <div className="flex items-center gap-2 mt-auto">
              <div className="bg-[#242438] rounded-lg px-2.5 py-1">
                <span className="font-sans font-medium text-[11px] text-[#8E8E93]">RSA 2048: 256 bytes</span>
              </div>
              <div className="bg-[#242438] rounded-lg px-2.5 py-1">
                <span className="font-sans font-medium text-[11px] text-[#A8E600]">Ed25519: 32 bytes ✓</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center font-sans font-normal text-[14px] text-[#8E8E93]">
          All cryptographic implementations are open-source and independently audited.{' '}
          <button className="text-[#0066FF] hover:underline ml-1 inline-flex items-center">
            View audit reports <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>
      </div>
    </section>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function PrivacyPage() {
  return (
    <div className="w-full flex flex-col">
      <HeroPrivacy />
      <ThreePrinciples />
      <DisclosureSpectrum />
      <GDPRNote />
      <CryptographicProofsSection />
    </div>
  )
}
