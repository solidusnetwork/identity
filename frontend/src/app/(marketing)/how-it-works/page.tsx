'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Building2, ArrowRight, ShieldCheck, Wallet, ChevronDown } from 'lucide-react'

// ─── Hero ──────────────────────────────────────────────────────────────────────
function HeroHowItWorks() {
  return (
    <section className="w-full bg-white px-6 py-20 lg:py-24 flex flex-col items-center justify-center">
      <h1 className="font-sans font-bold text-[36px] md:text-[48px] text-[#0A1628] text-center leading-[1.2]">
        How Solidus Identity Works
      </h1>
      <p className="font-sans font-normal text-[16px] md:text-[18px] text-[#666666] text-center max-w-[560px] mt-4 leading-[1.6]">
        Self-sovereign identity explained in plain English — no blockchain jargon required.
      </p>
    </section>
  )
}

// ─── Step 1 ────────────────────────────────────────────────────────────────────
function Step1YourDID() {
  const [typedText, setTypedText] = useState('')
  const fullText = 'did:solidus:mainnet:5dK3fP7vLm8Qw2xNz9Rb4YcJ6tHgAs'

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      setTypedText(fullText.substring(0, i))
      i++
      if (i > fullText.length) clearInterval(interval)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="w-full bg-white px-6 lg:px-[120px] py-[96px] flex justify-center">
      <div className="w-full max-w-[1200px] flex flex-col lg:flex-row items-center gap-16 lg:gap-[80px]">
        <div className="w-full lg:w-1/2 flex flex-col">
          <h2 className="font-sans font-semibold text-[32px] md:text-[36px] text-[#0A1628] leading-[1.2]">
            Step 1: Your DID — Your Key
          </h2>
          <p className="font-sans font-normal text-[16px] text-[#666666] mt-4 leading-[1.6]">
            A Decentralized Identifier (DID) is a permanent digital identifier that you actually own. Think of it like a digital social security number, but instead of being issued by a government, it is generated securely on your own device.
          </p>
          <p className="font-sans font-normal text-[16px] text-[#666666] mt-4 leading-[1.6]">
            No company controls your DID. It is tied to a private key that never leaves your phone or computer, meaning it can never be revoked, suspended, or monetized by a third party.
          </p>
        </div>

        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="w-full max-w-[480px] bg-[#0A1628] rounded-xl overflow-hidden shadow-[0_12px_32px_rgba(0,0,0,0.15)] border border-[#E0E0E5]/20">
            <div className="h-10 bg-[#1A1A2E] flex items-center px-4 gap-2 border-b border-white/10">
              <div className="w-3 h-3 rounded-full bg-[#FF6B6B]" />
              <div className="w-3 h-3 rounded-full bg-[#FF9500]" />
              <div className="w-3 h-3 rounded-full bg-[#34C759]" />
              <div className="ml-2 font-mono text-[11px] text-[#8E8E93]">key-generation</div>
            </div>
            <div className="p-6 h-[200px] flex flex-col font-mono text-[13px] text-[#A8E600] leading-[1.6]">
              <div className="text-[#8E8E93]">&gt; solidus-cli generate-identity</div>
              <div className="mt-2 text-white">Generating Ed25519 keypair... <span className="text-[#34C759]">Done</span></div>
              <div className="mt-1 text-white">Anchoring DID document... <span className="text-[#34C759]">Done</span></div>
              <div className="mt-4 text-[#8E8E93]">Your permanent DID:</div>
              <div className="mt-1 break-all flex items-center gap-1">
                {typedText}
                <span className="w-2 h-4 bg-[#A8E600] animate-pulse inline-block" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Step 2 ────────────────────────────────────────────────────────────────────
function Step2IssuersSign() {
  return (
    <section className="w-full bg-[#F2F2F7] px-6 lg:px-[120px] py-[96px] flex justify-center">
      <div className="w-full max-w-[1200px] flex flex-col-reverse lg:flex-row items-center gap-16 lg:gap-[80px]">
        <div className="w-full lg:w-1/2 flex justify-center relative">
          <div className="w-full max-w-[500px] flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 bg-white p-8 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-[#E0E0E5]">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-[#E0E0E5]/50 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-[#0A1628]" />
              </div>
              <div className="text-center">
                <div className="font-sans font-semibold text-[14px] text-[#0A1628]">Issuer</div>
                <div className="font-sans font-medium text-[11px] text-[#666666]">Govt / University</div>
              </div>
            </div>

            <div className="flex flex-col items-center flex-1 px-4 relative">
              <div className="w-full h-px bg-gradient-to-r from-[#E0E0E5] via-[#0066FF] to-[#E0E0E5] hidden md:block relative">
                <ArrowRight className="w-4 h-4 text-[#0066FF] absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-white px-1" />
              </div>
              <ArrowRight className="w-5 h-5 text-[#0066FF] md:hidden rotate-90 my-2" />
              <div className="md:absolute top-[-24px] left-1/2 md:-translate-x-1/2 bg-[#0066FF]/10 text-[#0066FF] px-2 py-1 rounded text-[10px] font-semibold whitespace-nowrap">
                Cryptographic Signature
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-[#0066FF]/10 flex items-center justify-center relative">
                <Wallet className="w-8 h-8 text-[#0066FF]" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow-sm border border-[#E0E0E5] flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#34C759]" />
                </div>
              </div>
              <div className="text-center">
                <div className="font-sans font-semibold text-[14px] text-[#0A1628]">Your Wallet</div>
                <div className="font-sans font-medium text-[11px] text-[#666666]">Locally Stored</div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col">
          <h2 className="font-sans font-semibold text-[32px] md:text-[36px] text-[#0A1628] leading-[1.2]">
            Step 2: Issuers Sign Your Credentials
          </h2>
          <p className="font-sans font-normal text-[16px] text-[#666666] mt-4 leading-[1.6]">
            Once you have a DID, trusted institutions (like a university, employer, or government portal) can issue verifiable credentials to it. They cryptographically sign a bundle of data asserting facts about you.
          </p>
          <p className="font-sans font-normal text-[16px] text-[#666666] mt-4 leading-[1.6]">
            These credentials are then stored securely in your wallet. The most important part? <strong className="text-[#0A1628]">The issuer cannot track when or where you use the credential.</strong> Once it's in your wallet, you are in total control.
          </p>
        </div>
      </div>
    </section>
  )
}

// ─── Interactive Disclosure Demo ───────────────────────────────────────────────
type RevealState = 'Reveal' | 'Derive' | 'Hide'

interface Field {
  id: string
  name: string
  value: string
  predicate: string
  defaultState: RevealState
  isPredicateOnly: boolean
}

function InteractiveDisclosureDemo() {
  const [fields] = useState<Field[]>([
    { id: 'f1', name: 'Full Name', value: 'JOHN A. SMITH', predicate: '', defaultState: 'Reveal', isPredicateOnly: false },
    { id: 'f2', name: 'Date of Birth', value: '1989-04-22', predicate: 'Age > 21 ✓ (ZK proof)', defaultState: 'Derive', isPredicateOnly: true },
    { id: 'f3', name: 'Country', value: 'United States', predicate: '', defaultState: 'Reveal', isPredicateOnly: false },
    { id: 'f4', name: 'Nationality', value: 'US Citizen', predicate: '', defaultState: 'Hide', isPredicateOnly: false },
    { id: 'f5', name: 'Document Number', value: 'A1B2C3D4E5', predicate: '', defaultState: 'Hide', isPredicateOnly: false },
    { id: 'f6', name: 'Document Type', value: 'Passport', predicate: '', defaultState: 'Hide', isPredicateOnly: false },
    { id: 'f7', name: 'Expiry Date', value: '2032-11-05', predicate: '', defaultState: 'Hide', isPredicateOnly: false },
    { id: 'f8', name: 'KYC Level', value: 'Level 2 Verified', predicate: '', defaultState: 'Hide', isPredicateOnly: false }
  ])

  const [fieldStates, setFieldStates] = useState<Record<string, RevealState>>(() => {
    const states: Record<string, RevealState> = {}
    for (const f of fields) states[f.id] = f.defaultState
    return states
  })

  const updateState = (id: string, newState: RevealState) => {
    setFieldStates(prev => ({ ...prev, [id]: newState }))
  }

  const activeCount = Object.values(fieldStates).filter(s => s !== 'Hide').length
  const baseSize = 2.0
  const proofSize = (baseSize + activeCount * 0.1).toFixed(1)
  const genTime = (0.5 + activeCount * 0.05).toFixed(1)

  return (
    <section className="w-full bg-[#0A1628] px-6 lg:px-[120px] py-[80px] flex flex-col items-center">
      <h2 className="font-sans font-bold text-[36px] text-white text-center">
        What does the verifier actually see?
      </h2>

      <div className="w-full max-w-[1200px] flex flex-col lg:flex-row gap-16 lg:gap-[64px] mt-16 items-center">
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="font-sans font-semibold text-[12px] text-[#8E8E93] uppercase tracking-[0.08em] mb-4">
            YOUR CREDENTIAL FIELDS
          </div>
          <div className="flex flex-col gap-2">
            {fields.map(field => {
              const current = fieldStates[field.id] ?? field.defaultState
              return (
                <div key={field.id} className="bg-[#1A1A2E] rounded-lg py-3 px-4 flex items-center justify-between border border-white/5">
                  <span className="font-sans font-normal text-[14px] text-white">{field.name}</span>
                  <div className="flex bg-transparent rounded-md border border-[#48484F]/50 p-0.5">
                    {(['Reveal', 'Derive', 'Hide'] as RevealState[]).map(state => {
                      const isActive = current === state
                      const isDisabled = state === 'Derive' && !field.isPredicateOnly
                      return (
                        <button
                          key={state}
                          disabled={isDisabled}
                          onClick={() => updateState(field.id, state)}
                          className={`px-3 py-1 rounded-[4px] font-sans font-medium text-[11px] transition-colors ${isActive ? 'bg-[#0066FF] text-white' : 'bg-transparent text-[#48484F] hover:text-[#8E8E93]'} ${isDisabled ? 'opacity-30 cursor-not-allowed hover:text-[#48484F]' : ''}`}
                        >
                          {state}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="font-sans font-semibold text-[12px] text-[#8E8E93] uppercase tracking-[0.08em] mb-4">
            WHAT THE VERIFIER RECEIVES
          </div>
          <div className="bg-[#1A1A2E] rounded-lg p-5 border border-white/5 flex flex-col gap-3 min-h-[380px]">
            {fields.map(field => {
              const state = fieldStates[field.id] ?? field.defaultState
              if (state === 'Hide') {
                return (
                  <div key={field.id} className="py-2 flex items-center justify-center border border-dashed border-white/5 rounded">
                    <span className="font-sans font-normal italic text-[12px] text-[#48484F]">··· field hidden ···</span>
                  </div>
                )
              }
              if (state === 'Derive' && field.isPredicateOnly) {
                return (
                  <div key={field.id} className="py-2 flex items-center justify-between bg-white/[0.02] px-3 rounded">
                    <span className="font-sans font-medium text-[11px] text-[#8E8E93]">{field.name}</span>
                    <span className="font-sans font-medium text-[13px] text-[#00D4FF]">{field.predicate}</span>
                  </div>
                )
              }
              return (
                <div key={field.id} className="py-2 flex items-center justify-between bg-white/[0.02] px-3 rounded">
                  <span className="font-sans font-medium text-[11px] text-[#8E8E93]">{field.name}</span>
                  <span className="font-sans font-medium text-[13px] text-white">{field.value}</span>
                </div>
              )
            })}
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <div className="font-sans font-normal text-[12px] text-[#8E8E93]">Proof size: ~{proofSize} KB · Generation time: ~{genTime}s</div>
            <div className="font-sans font-normal text-[12px] text-[#8E8E93] leading-[1.5]">The verifier cannot derive hidden fields from the proof. This is guaranteed by the BBS+ signature scheme.</div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── FAQ Section ───────────────────────────────────────────────────────────────
const faqData = [
  { question: 'What is a DID?', answer: 'A Decentralized Identifier (DID) is a new type of identifier that enables verifiable, decentralized digital identity. Unlike email addresses or usernames controlled by a central provider, a DID is controlled by you using cryptographic keys.' },
  { question: 'Who can revoke my DID?', answer: 'No one. Because your DID is anchored on the decentralized Solidus network and controlled by a private key stored only on your device, there is no central authority with the power to suspend or revoke your account.' },
  { question: 'What happens if I lose my seed phrase?', answer: 'If you lose your device and seed phrase, you can use Social Guardian Recovery. You can elect 3-7 trusted friends or family members who can collectively approve the creation of a new keypair to regain control of your identity, without ever seeing your data.' },
  { question: 'How do ZK proofs work?', answer: 'Zero-Knowledge (ZK) proofs are a cryptographic method allowing you to prove a statement is true without revealing the underlying data. For instance, you can prove you are over 21 without revealing your actual date of birth.' },
  { question: 'Is this like Worldcoin?', answer: 'No. Worldcoin relies on biometric scanning (iris scans) stored by a centralized foundation. Solidus Identity is fundamentally different—we do not scan or store biometrics. We provide infrastructure for any trusted issuer to grant you credentials.' },
  { question: 'Can I use this without cryptocurrency?', answer: 'Yes! Solidus Identity abstracts away the blockchain layer entirely. You do not need to buy, hold, or manage any cryptocurrency to create an identity, receive credentials, or sign into applications.' },
  { question: 'Which countries are supported?', answer: 'Solidus Identity is a global protocol and can be used anywhere. The specific credentials you can acquire (like Government IDs) depend on which issuers operate in your region.' },
  { question: 'How do I add credentials?', answer: 'You can browse the in-app credential marketplace to find issuers, such as Solidus Verify, your university, or your employer. You request a credential from them, prove your identity as required, and they issue it directly to your wallet.' }
]

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="w-full bg-white px-6 lg:px-[120px] py-[96px] flex flex-col items-center">
      <h2 className="font-sans font-bold text-[36px] text-[#0A1628] text-center mb-12">Frequently Asked Questions</h2>
      <div className="w-full max-w-[800px] flex flex-col gap-4">
        {faqData.map((faq, index) => {
          const isOpen = openIndex === index
          return (
            <div key={index} className={`rounded-lg border transition-colors duration-200 overflow-hidden ${isOpen ? 'border-[#0066FF] shadow-[0_2px_8px_rgba(0,102,255,0.12)]' : 'border-[#E0E0E5] bg-white'}`}>
              <button onClick={() => setOpenIndex(isOpen ? null : index)} className="w-full px-6 py-5 flex items-center justify-between bg-white text-left focus:outline-none">
                <span className="font-sans font-semibold text-[16px] text-[#0A1628]">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-[#666666] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2, ease: 'easeInOut' }}>
                    <div className="px-6 pb-5 font-sans font-normal text-[15px] text-[#666666] leading-[1.6]">{faq.answer}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ─── Technical Deep Dive ───────────────────────────────────────────────────────
function TechnicalAccordionItem({ index, openIndex, setOpenIndex, title, children }: { index: number; openIndex: number | null; setOpenIndex: (i: number | null) => void; title: string; children: React.ReactNode }) {
  const isOpen = openIndex === index
  return (
    <div className={`bg-white rounded-lg transition-all duration-200 overflow-hidden ${isOpen ? 'border border-[#0066FF] shadow-[0_2px_8px_rgba(0,102,255,0.12)]' : 'border border-[#E0E0E5]'}`}>
      <button onClick={() => setOpenIndex(isOpen ? null : index)} className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none">
        <span className="font-sans font-semibold text-[15px] text-[#0A1628]">{title}</span>
        <ChevronDown className={`w-4 h-4 text-[#666666] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2, ease: 'easeInOut' }}>
            <div className="px-6 pb-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function TechnicalDeepDiveSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="w-full bg-[#F2F2F7] px-6 lg:px-[120px] py-[64px] flex flex-col items-center">
      <div className="w-full max-w-[800px] flex flex-col items-start mb-8">
        <h2 className="font-sans font-bold text-[32px] text-[#0A1628]">For the technically curious.</h2>
        <p className="font-sans font-normal text-[16px] text-[#666666] mt-2">A deeper look at the cryptography under the hood.</p>
      </div>

      <div className="w-full max-w-[800px] flex flex-col gap-2">
        <TechnicalAccordionItem index={0} openIndex={openIndex} setOpenIndex={setOpenIndex} title="BBS+ Multi-Message Signatures">
          <p className="font-sans font-normal text-[14px] text-[#666666] leading-[1.6] mb-4">
            BBS+ (Boneh-Boyen-Shacham Plus) is a pairing-based signature scheme that allows a signer to simultaneously sign multiple messages (credential fields) with a single signature. The key property: the holder can derive a proof that reveals only a subset of the signed messages, without the verifier being able to link the original signature or the unrevealed fields.
          </p>
          <div className="font-mono text-[12px] text-[#A8E600] bg-[#0A1628] rounded-md p-4 overflow-x-auto whitespace-pre">
{`Sign(sk, [field_1, field_2, ..., field_n]) → σ
Prove(σ, [field_2, field_5]) → π
Verify(pk, π, [field_2, field_5]) → ✓`}
          </div>
        </TechnicalAccordionItem>

        <TechnicalAccordionItem index={1} openIndex={openIndex} setOpenIndex={setOpenIndex} title="How ZK Proofs Work in Practice">
          <p className="font-sans font-normal text-[14px] text-[#666666] leading-[1.6] mb-4">
            A zero-knowledge proof lets a prover convince a verifier that a statement is true without revealing the underlying witness. In Solidus Identity, the 'statement' might be: 'I hold a valid KYC L2 credential from Solidus Verify.' The 'witness' is your credential. The verifier learns only that the statement is true — not your name, document number, or any credential field.
          </p>
          <div className="font-mono text-[12px] text-[#A8E600] bg-[#0A1628] rounded-md p-4 overflow-x-auto whitespace-pre">
            age &gt; 21 (proved without revealing 1989-04-22)
          </div>
        </TechnicalAccordionItem>

        <TechnicalAccordionItem index={2} openIndex={openIndex} setOpenIndex={setOpenIndex} title="Ed25519 Keys and DID:Solidus">
          <p className="font-sans font-normal text-[14px] text-[#666666] leading-[1.6] mb-4">
            Your DID is controlled by an Ed25519 keypair generated on-device in a WASM sandbox. The private key never leaves your device — it is stored in the browser's SubtleCrypto API (encrypted, backed by your passphrase or biometric). The DID document maps your public key to the DID and is anchored on the Solidus blockchain for resolution.
          </p>
          <div className="font-mono text-[12px] text-[#A8E600] bg-[#0A1628] rounded-md p-4 overflow-x-auto whitespace-pre">
{`{
  "@context": "https://www.w3.org/ns/did/v1",
  "id": "did:solidus:mainnet:5dK3...",
  "verificationMethod": [{ "id": "#key-1", "type": "Ed25519VerificationKey2020", ... }]
}`}
          </div>
        </TechnicalAccordionItem>

        <TechnicalAccordionItem index={3} openIndex={openIndex} setOpenIndex={setOpenIndex} title="Credential Registry and Revocation">
          <p className="font-sans font-normal text-[14px] text-[#666666] leading-[1.6] mb-4">
            Credential status is anchored via Merkle tree commitments on the Solidus blockchain. When a credential is issued, its hash is added to the issuer's commitment tree. Revocation removes the leaf; the Merkle root is updated on-chain. Verifiers check the current root to confirm a credential's status in O(log n) time, without querying the issuer directly.
          </p>
          <div className="font-mono text-[12px] text-[#A8E600] bg-[#0A1628] rounded-md p-4 overflow-x-auto whitespace-pre">
            Block #4,817,293 · Issuer: did:solidus:mainnet:issuer:verify
          </div>
        </TechnicalAccordionItem>
      </div>
    </section>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function HowItWorksPage() {
  return (
    <div className="w-full flex flex-col">
      <HeroHowItWorks />
      <Step1YourDID />
      <Step2IssuersSign />
      <InteractiveDisclosureDemo />
      <FAQSection />
      <TechnicalDeepDiveSection />
    </div>
  )
}
