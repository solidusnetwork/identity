import { ArrowRight, BookOpen, ExternalLink, KeyRound, FileBadge, CheckCircle2, Terminal } from 'lucide-react'

// ─── Hero Developers ──────────────────────────────────────────────────────────
function HeroDevelopers() {
  return (
    <section className="w-full bg-white px-6 lg:px-[120px] py-20 lg:py-24 flex flex-col items-center justify-center">
      <div className="w-full max-w-[1200px] flex flex-col lg:flex-row items-center gap-16">
        <div className="w-full lg:w-1/2 flex flex-col items-start">
          <h1 className="font-sans font-bold text-[36px] md:text-[48px] text-[#0A1628] leading-[1.2]">
            Build identity into anything.
          </h1>
          <p className="font-sans font-normal text-[16px] md:text-[18px] text-[#666666] mt-4 leading-[1.6] max-w-[480px]">
            Integrate passwordless auth, verify credentials via zero-knowledge proofs, or become a verified issuer in minutes.
          </p>
          <div className="flex items-center gap-4 mt-8">
            <button className="h-[44px] bg-[#0066FF] hover:bg-[#0055D4] text-white px-6 rounded-lg font-sans font-semibold text-[14px] transition-colors flex items-center">
              <BookOpen className="w-4 h-4 mr-2" /> View Docs
            </button>
            <button className="h-[44px] bg-white border border-[#E0E0E5] hover:bg-[#F2F2F7] text-[#0A1628] px-6 rounded-lg font-sans font-semibold text-[14px] transition-colors flex items-center">
              <ExternalLink className="w-4 h-4 mr-2" /> GitHub
            </button>
          </div>
        </div>

        <div className="w-full lg:w-1/2">
          <div className="w-full bg-[#0A1628] rounded-xl overflow-hidden shadow-[0_12px_32px_rgba(0,0,0,0.15)] border border-[#E0E0E5]/20">
            <div className="h-10 bg-[#1A1A2E] flex items-center px-4 gap-2 border-b border-white/10">
              <div className="w-3 h-3 rounded-full bg-[#FF6B6B]" />
              <div className="w-3 h-3 rounded-full bg-[#FF9500]" />
              <div className="w-3 h-3 rounded-full bg-[#34C759]" />
              <div className="ml-2 font-mono text-[11px] text-[#8E8E93]">Login.tsx</div>
            </div>
            <div className="p-6 font-mono text-[14px] leading-[1.6] overflow-x-auto">
              <pre>
                <span className="text-[#C084FC]">import</span>{' '}
                <span className="text-white">{'{'}</span>{' '}solidusAuth{' '}
                <span className="text-white">{'}'}</span>{' '}
                <span className="text-[#C084FC]">from</span>{' '}
                <span className="text-[#A8E600]">'@solidus/auth'</span>
                <span className="text-white">;</span>
                {'\n\n'}
                <span className="text-[#00D4FF]">const</span>{' '}
                <span className="text-white">session</span>{' '}
                <span className="text-[#C084FC]">=</span>{' '}
                <span className="text-[#C084FC]">await</span>{' '}
                <span className="text-[#00D4FF]">solidusAuth</span>
                <span className="text-white">.</span>
                <span className="text-[#00D4FF]">request</span>
                <span className="text-white">({'{'}</span>
                {'\n'}
                {'  '}domain
                <span className="text-[#C084FC]">:&nbsp;</span>
                <span className="text-[#A8E600]">'yourapp.com'</span>
                <span className="text-white">,</span>
                {'\n'}
                {'  '}require
                <span className="text-[#C084FC]">:&nbsp;</span>
                <span className="text-white">[</span>
                <span className="text-[#A8E600]">'kyc_l2'</span>
                <span className="text-white">, </span>
                <span className="text-[#A8E600]">'age&gt;18'</span>
                <span className="text-white">]</span>
                {'\n'}
                <span className="text-white">{'}'});</span>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Integration Paths ─────────────────────────────────────────────────────────
function IntegrationPaths() {
  return (
    <section className="w-full bg-white px-6 lg:px-[120px] pb-[80px] flex justify-center">
      <div className="w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-[#E0E0E5] p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-shadow">
          <KeyRound className="w-8 h-8 text-[#0066FF] mb-6" />
          <h3 className="font-sans font-semibold text-[18px] text-[#0A1628] mb-3">Sign in with Solidus</h3>
          <p className="font-sans font-normal text-[14px] text-[#666666] leading-[1.6]">
            For web apps wanting passwordless auth. Drop-in SDKs for React, Vue, and vanilla JS. Get started in under 5 minutes.
          </p>
        </div>
        <div className="bg-white rounded-lg border border-[#E0E0E5] p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-shadow">
          <FileBadge className="w-8 h-8 text-[#0066FF] mb-6" />
          <h3 className="font-sans font-semibold text-[18px] text-[#0A1628] mb-3">Issue Credentials</h3>
          <p className="font-sans font-normal text-[14px] text-[#666666] leading-[1.6]">
            For organizations wanting to issue verifiable credentials to their users. Use the Issuer Node API to mint and deliver directly to wallets.
          </p>
        </div>
        <div className="bg-white rounded-lg border border-[#E0E0E5] p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-shadow">
          <CheckCircle2 className="w-8 h-8 text-[#0066FF] mb-6" />
          <h3 className="font-sans font-semibold text-[18px] text-[#0A1628] mb-3">Verify Credentials</h3>
          <p className="font-sans font-normal text-[14px] text-[#666666] leading-[1.6]">
            For services wanting to verify incoming credentials. Use the Verifier SDK, REST API, and webhook delivery to validate ZK proofs.
          </p>
        </div>
      </div>
    </section>
  )
}

// ─── Issuer Integration Section ────────────────────────────────────────────────
function IssuerIntegrationSection() {
  return (
    <section className="w-full bg-[#F2F2F7] px-6 lg:px-[120px] py-[64px] flex flex-col items-center">
      <div className="w-full max-w-[1200px] flex flex-col">
        <div className="mb-12">
          <h2 className="font-sans font-bold text-[32px] text-[#0A1628]">Become a Verified Issuer.</h2>
          <p className="font-sans font-normal text-[16px] text-[#666666] mt-3 max-w-[600px] leading-[1.6]">
            Issue W3C Verifiable Credentials directly to users' Solidus wallets. From employment records to educational degrees — any credential type is supported.
          </p>
        </div>

        <div className="relative mb-12">
          <div className="hidden md:block absolute top-[28px] left-[16%] right-[16%] h-[1px] border-t border-dashed border-[#E0E0E5] z-0" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {[
              { num: '01', title: 'Register as Issuer', desc: "Apply for a Verified Issuer DID. Provide org details, credential types you'll issue, and your preferred verification method. Takes 2–5 business days." },
              { num: '02', title: 'Define Your Schema', desc: 'Use the Schema Registry to define your credential type\'s fields and data types. Schemas are published on-chain for discoverability.' },
              { num: '03', title: 'Issue via SDK', desc: null }
            ].map((step) => (
              <div key={step.num} className="bg-white border border-[#E0E0E5] rounded-lg p-6 flex flex-col">
                <div className="w-8 h-8 rounded-full bg-[#F2F2F7] border border-[#E0E0E5] flex items-center justify-center mb-4 mx-auto md:mx-0">
                  <span className="font-sans font-semibold text-[11px] text-[#0066FF]">{step.num}</span>
                </div>
                <h3 className="font-sans font-semibold text-[16px] text-[#0A1628] mb-2 text-center md:text-left">{step.title}</h3>
                {step.desc ? (
                  <p className="font-sans font-normal text-[14px] text-[#666666] leading-[1.6] text-center md:text-left">{step.desc}</p>
                ) : (
                  <p className="font-sans font-normal text-[14px] text-[#666666] leading-[1.6] text-center md:text-left">
                    Use <code className="font-mono text-[12px] bg-[#F2F2F7] px-1 rounded text-[#0A1628]">@solidus/issuer-sdk</code> to issue credentials. One API call signs the credential with your issuer DID and delivers it to the user's inbox.
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Code sample */}
        <div className="w-full bg-[#0A1628] rounded-lg p-6 mb-8 relative">
          <div className="absolute top-4 left-4 bg-[#1A1A2E] border border-white/10 px-2 py-0.5 rounded">
            <span className="font-sans font-medium text-[11px] text-[#8E8E93]">issuer.ts</span>
          </div>
          <pre className="font-mono text-[12px] text-[#A8E600] mt-6 overflow-x-auto leading-[1.6]">
            <span className="text-[#C084FC]">import</span>{' '}
            <span className="text-white">{'{'}</span>{' '}SolidusIssuer{' '}
            <span className="text-white">{'}'}</span>{' '}
            <span className="text-[#C084FC]">from</span>{' '}
            <span className="text-[#A8E600]">'@solidus/issuer-sdk'</span>
            <span className="text-white">;{'\n\n'}</span>
            <span className="text-[#00D4FF]">const</span>{' '}
            <span className="text-white">issuer</span>{' '}
            <span className="text-[#C084FC]">=</span>{' '}
            <span className="text-[#C084FC]">new</span>{' '}
            <span className="text-[#00D4FF]">SolidusIssuer</span>
            <span className="text-white">{'({'} apiKey</span>
            <span className="text-[#C084FC]">:&nbsp;</span>
            <span className="text-white">process.env.SOLIDUS_KEY {'}'});\n\n'</span>
            <span className="text-[#C084FC]">await</span>
            <span className="text-white"> issuer.</span>
            <span className="text-[#00D4FF]">issue</span>
            <span className="text-white">{'({'}{'\n'}  recipient</span>
            <span className="text-[#C084FC]">:&nbsp;</span>
            <span className="text-[#A8E600]">'did:solidus:mainnet:5dK3fP7vLm8Qw2xNz9Rb4YcJ6tHgAs'</span>
            <span className="text-white">,{'\n'}  schema</span>
            <span className="text-[#C084FC]">:&nbsp;</span>
            <span className="text-[#A8E600]">'solidus:schema:professional-license:v1'</span>
            <span className="text-white">,{'\n'}  attributes</span>
            <span className="text-[#C084FC]">:&nbsp;</span>
            <span className="text-white">{'{'} name, employer, role, validUntil {'}'},</span>
            <span className="text-white">{'\n'}{'}'});</span>
          </pre>
        </div>

        {/* Schema examples */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-12">
          {[
            { schema: 'solidus:schema:kyc-l2:v1', title: 'KYC Level 2', fields: 'full_name, date_of_birth, nationality, document_type, document_expiry' },
            { schema: 'solidus:schema:professional-license:v1', title: 'Professional License', fields: 'name, employer, role, license_number, valid_until' },
            { schema: 'solidus:schema:education:v1', title: 'Education Degree', fields: 'name, institution, degree, field_of_study, graduation_date' }
          ].map((s) => (
            <div key={s.schema} className="bg-white border border-[#E0E0E5] rounded-lg p-4 flex flex-col">
              <div className="font-mono text-[11px] font-semibold text-[#0066FF] mb-2">{s.schema}</div>
              <h3 className="font-sans font-semibold text-[14px] text-[#0A1628] mb-2">{s.title}</h3>
              <p className="font-sans font-normal text-[12px] text-[#666666] leading-[1.5]">{s.fields}</p>
            </div>
          ))}
        </div>

        <div className="w-full bg-[#0A1628] rounded-lg p-7 lg:px-8 lg:py-7 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="font-sans font-semibold text-[16px] text-white text-center md:text-left m-0">
            Join 47 verified issuers currently on the platform.
          </p>
          <button className="h-[40px] bg-[#0066FF] hover:bg-[#0055D4] text-white px-6 rounded-lg font-sans font-semibold text-[14px] transition-colors flex items-center whitespace-nowrap shrink-0">
            Apply to become a Verified Issuer <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </section>
  )
}

// ─── Code Snippets ─────────────────────────────────────────────────────────────
function CodeSnippets() {
  return (
    <section className="w-full bg-white px-6 lg:px-[120px] py-[64px] flex justify-center">
      <div className="w-full max-w-[1200px] flex flex-col items-center">
        <h2 className="font-sans font-bold text-[32px] text-[#0A1628] mb-8">Verify presentations in your stack.</h2>
        <div className="w-full max-w-[800px] bg-[#0A1628] rounded-xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
          <div className="flex items-center gap-1 bg-[#1A1A2E] px-4 pt-4 border-b border-white/10">
            <button className="px-4 py-2 bg-[#242438] text-white rounded-t-lg font-sans text-[13px] font-medium border-t border-l border-r border-white/10">JavaScript</button>
            <button className="px-4 py-2 text-[#8E8E93] hover:text-white transition-colors rounded-t-lg font-sans text-[13px] font-medium">Python</button>
            <button className="px-4 py-2 text-[#8E8E93] hover:text-white transition-colors rounded-t-lg font-sans text-[13px] font-medium">curl</button>
          </div>
          <div className="p-6 font-mono text-[13px] leading-[1.6] overflow-x-auto text-[#A8E600]">
            <pre>
              <span className="text-[#C084FC]">import</span>{' '}
              <span className="text-white">{'{'}</span>{' '}verifyPresentation{' '}
              <span className="text-white">{'}'}</span>{' '}
              <span className="text-[#C084FC]">from</span>{' '}
              <span className="text-[#A8E600]">'@solidus/auth/server'</span>
              <span className="text-white">;{'\n\n'}</span>
              <span className="text-[#666666]">{'// Receives the presentation from your frontend'}</span>
              {'\n'}
              <span className="text-[#00D4FF]">const</span>{' '}
              <span className="text-[#00D4FF]">handleVerify</span>{' '}
              <span className="text-[#C084FC]">=</span>{' '}
              <span className="text-[#C084FC]">async</span>{' '}
              <span className="text-white">(req, res)</span>{' '}
              <span className="text-[#C084FC]">=&gt;</span>{' '}
              <span className="text-white">{'{'}{'\n'}</span>
              {'  '}
              <span className="text-[#00D4FF]">const</span>{' '}
              <span className="text-white">{'{'} proof, presentation {'}'}</span>{' '}
              <span className="text-[#C084FC]">=</span>{' '}
              <span className="text-white">req.body;{'\n'}{'  '}</span>
              {'\n  '}
              <span className="text-[#00D4FF]">const</span>{' '}
              <span className="text-white">result</span>{' '}
              <span className="text-[#C084FC]">=</span>{' '}
              <span className="text-[#C084FC]">await</span>{' '}
              <span className="text-[#00D4FF]">verifyPresentation</span>
              <span className="text-white">({'{'}{'\n'}</span>
              {'    '}presentation<span className="text-white">,{'\n'}    </span>proof<span className="text-white">,{'\n'}    </span>expectedDomain<span className="text-[#C084FC]">:&nbsp;</span><span className="text-[#A8E600]">'yourapp.com'</span><span className="text-white">,{'\n'}    </span>requiredCredentials<span className="text-[#C084FC]">:&nbsp;</span><span className="text-white">[</span><span className="text-[#A8E600]">'kyc_l2'</span><span className="text-white">]{'\n'}  {'}'});{'\n'}</span>
              {'\n  '}
              <span className="text-[#C084FC]">if</span>{' '}
              <span className="text-white">(!result.isValid)</span>{' '}
              <span className="text-[#C084FC]">return</span>{' '}
              <span className="text-white">res.</span>
              <span className="text-[#00D4FF]">status</span>
              <span className="text-white">(</span>
              <span className="text-[#FF9500]">401</span>
              <span className="text-white">).</span>
              <span className="text-[#00D4FF]">send</span>
              <span className="text-white">(</span>
              <span className="text-[#A8E600]">'Invalid proof'</span>
              <span className="text-white">);{'\n'}</span>
              {'\n  '}
              <span className="text-[#666666]">{'// Create session for user DID'}</span>
              {'\n  '}
              <span className="text-[#00D4FF]">const</span>{' '}
              <span className="text-white">session</span>{' '}
              <span className="text-[#C084FC]">=</span>{' '}
              <span className="text-[#00D4FF]">createSession</span>
              <span className="text-white">(result.did);{'\n'}  </span>
              <span className="text-[#C084FC]">return</span>{' '}
              <span className="text-white">res.</span>
              <span className="text-[#00D4FF]">json</span>
              <span className="text-white">({'{'} session {'}'});{'\n'}{'}'}</span>
              <span className="text-white">;{'\n'}</span>
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Verifier Webhook Section ──────────────────────────────────────────────────
function SequenceRow({ step, startLane, endLane, text, reverse = false }: { step: number; startLane: number; endLane: number; text: string; reverse?: boolean }) {
  const left = Math.min(startLane, endLane) * 25 + 12.5
  const width = Math.abs(endLane - startLane) * 25
  return (
    <div className="w-full flex items-center relative h-[32px]">
      <div className="absolute left-0 font-sans font-medium text-[11px] text-[#8E8E93] w-[24px] text-right pr-2">{step}</div>
      <div className="absolute h-full flex flex-col justify-center" style={{ left: `${left}%`, width: `${width}%` }}>
        <div className="relative w-full flex items-center">
          <div className="w-full h-px bg-[#0A1628]" />
          <div className={`absolute top-1/2 -translate-y-1/2 w-0 h-0 border-y-[4px] border-y-transparent ${reverse ? 'left-0 border-r-[6px] border-r-[#0A1628]' : 'right-0 border-l-[6px] border-l-[#0A1628]'}`} />
        </div>
        <div className="absolute top-[100%] left-1/2 -translate-x-1/2 w-[180%] text-center mt-1">
          <span className="font-sans font-normal text-[13px] text-[#666666] bg-[#F2F2F7] px-2 py-0.5 rounded leading-tight inline-block">{text}</span>
        </div>
      </div>
    </div>
  )
}

function VerifierWebhookSection() {
  return (
    <section className="w-full bg-white px-6 lg:px-[120px] py-[64px] flex flex-col items-center">
      <div className="w-full max-w-[1200px] flex flex-col items-center">
        <div className="text-center mb-12">
          <h2 className="font-sans font-bold text-[32px] text-[#0A1628]">The full Sign in with Solidus flow.</h2>
          <p className="font-sans font-normal text-[16px] text-[#666666] mt-3">5 steps. Zero passwords. Cryptographically verified.</p>
        </div>

        <div className="w-full bg-[#F2F2F7] rounded-xl border border-[#E0E0E5] p-4 sm:p-8 overflow-x-auto">
          <div className="min-w-[800px] flex flex-col relative">
            <div className="grid grid-cols-4 mb-6">
              {['User', 'Browser / App', 'Solidus Identity', 'Your Backend'].map((h) => (
                <div key={h} className="text-center font-sans font-semibold text-[13px] text-[#0A1628]">{h}</div>
              ))}
            </div>
            <div className="absolute top-[32px] bottom-0 left-0 right-0 grid grid-cols-4 pointer-events-none">
              <div className="absolute top-0 bottom-0 left-[12.5%] w-px bg-[#E0E0E5]" />
              <div className="absolute top-0 bottom-0 left-[37.5%] w-px bg-[#E0E0E5]" />
              <div className="absolute top-0 bottom-0 left-[62.5%] w-px bg-[#E0E0E5]" />
              <div className="absolute top-0 bottom-0 left-[87.5%] w-px bg-[#E0E0E5]" />
            </div>
            <div className="flex flex-col gap-6 relative z-10 pt-2">
              <SequenceRow step={1} startLane={0} endLane={1} text="Clicks 'Sign in with Solidus' button" />
              <SequenceRow step={2} startLane={1} endLane={2} text="Opens @solidus/auth modal; sends RP context (domain, credential requirements)" />
              <SequenceRow step={3} startLane={2} endLane={0} text="Shows credential request; user selects fields and approves with biometric" reverse />
              <SequenceRow step={4} startLane={2} endLane={1} text="Returns ZK proof + signed, timestamped presentation" reverse />
              <SequenceRow step={5} startLane={1} endLane={3} text="POSTs proof via webhook" />
              <SequenceRow step={6} startLane={3} endLane={2} text="Calls /v1/verify to validate proof on-chain" reverse />
              <SequenceRow step={7} startLane={3} endLane={1} text="Issues session token" reverse />
            </div>
          </div>
        </div>

        <div className="w-full max-w-[800px] mt-10">
          <div className="w-full bg-[#0A1628] rounded-xl p-6 relative">
            <div className="absolute top-4 left-4 bg-[#1A1A2E] border border-white/10 px-2 py-0.5 rounded">
              <span className="font-sans font-medium text-[11px] text-[#8E8E93]">webhook payload</span>
            </div>
            <pre className="font-mono text-[12px] text-[#A8E600] mt-8 overflow-x-auto leading-[1.6]">
              <span className="text-white">{'{'}{'\n'}</span>
              {'  '}<span className="text-white">"event":</span>{' '}<span className="text-[#A8E600]">"presentation.verified"</span><span className="text-white">,{'\n'}</span>
              {'  '}<span className="text-white">"did":</span>{' '}<span className="text-[#A8E600]">"did:solidus:mainnet:5dK3fP7vLm8Qw2xNz9Rb4YcJ6tHgAs"</span><span className="text-white">,{'\n'}</span>
              {'  '}<span className="text-white">"credentials":</span>{' '}<span className="text-white">[{'{'}</span>{' '}<span className="text-white">"type":</span>{' '}<span className="text-[#A8E600]">"KYC_L2"</span><span className="text-white">,</span>{' '}<span className="text-white">"verified":</span>{' '}<span className="text-[#00D4FF]">true</span>{' '}<span className="text-white">{'}'}],{'\n'}</span>
              {'  '}<span className="text-white">"disclosed":</span>{' '}<span className="text-white">{'{'}</span>{' '}<span className="text-white">"country":</span>{' '}<span className="text-[#A8E600]">"US"</span>{' '}<span className="text-white">{'}'},{'\n'}</span>
              {'  '}<span className="text-white">"proofHash":</span>{' '}<span className="text-[#A8E600]">"0x4f2e8a1b9c3d7e6f..."</span><span className="text-white">,{'\n'}</span>
              {'  '}<span className="text-white">"timestamp":</span>{' '}<span className="text-[#A8E600]">"2026-03-17T14:32:08Z"</span>{'\n'}
              <span className="text-white">{'}'}</span>
            </pre>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <button className="h-[40px] bg-[#0066FF] hover:bg-[#0055D4] text-white px-6 rounded-lg font-sans font-semibold text-[14px] transition-colors flex items-center w-full sm:w-auto justify-center">
            View full API docs <ArrowRight className="w-4 h-4 ml-2" />
          </button>
          <button className="h-[40px] bg-transparent border border-[#E0E0E5] hover:bg-[#F2F2F7] text-[#0A1628] px-6 rounded-lg font-sans font-semibold text-[14px] transition-colors flex items-center w-full sm:w-auto justify-center">
            See SDK reference <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </section>
  )
}

// ─── SDK Reference Summary ─────────────────────────────────────────────────────
const sdks = [
  { package: '@solidus/auth', lang: 'JavaScript', install: 'npm i @solidus/auth', version: 'v2.4.1' },
  { package: '@solidus/jwt', lang: 'Node.js backend', install: 'npm i @solidus/jwt', version: 'v1.8.0' },
  { package: 'solidus-python', lang: 'Python', install: 'pip install solidus', version: 'v1.3.0' },
  { package: 'solidus-go', lang: 'Go', install: 'go get solidus.network/sdk', version: 'v0.9.2' }
]

function SDKReferenceSummary() {
  return (
    <section className="w-full bg-white px-6 lg:px-[120px] pb-[96px] flex flex-col items-center">
      <div className="w-full max-w-[800px] flex flex-col">
        <h3 className="font-sans font-semibold text-[20px] text-[#0A1628] mb-6">SDKs & Libraries</h3>
        <div className="w-full border border-[#E0E0E5] rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-[#F2F2F7] border-b border-[#E0E0E5]">
                  <th className="py-3 px-4 font-sans font-semibold text-[13px] text-[#0A1628] w-[25%]">Package</th>
                  <th className="py-3 px-4 font-sans font-semibold text-[13px] text-[#0A1628] w-[25%]">Language</th>
                  <th className="py-3 px-4 font-sans font-semibold text-[13px] text-[#0A1628] w-[35%]">Install Command</th>
                  <th className="py-3 px-4 font-sans font-semibold text-[13px] text-[#0A1628] w-[15%]">Latest Version</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {sdks.map((sdk, i) => (
                  <tr key={i} className="border-b border-[#E0E0E5] last:border-b-0 hover:bg-[#F2F2F7]/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-[13px] text-[#0066FF] font-medium">{sdk.package}</td>
                    <td className="py-3 px-4 font-sans font-normal text-[14px] text-[#666666]">{sdk.lang}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 bg-[#F2F2F7] px-2 py-1 rounded w-max border border-[#E0E0E5]">
                        <Terminal className="w-3 h-3 text-[#8E8E93]" />
                        <span className="font-mono text-[12px] text-[#0A1628]">{sdk.install}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block bg-[#E0E0E5]/50 px-2 py-0.5 rounded font-mono text-[12px] text-[#666666]">{sdk.version}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function DevelopersPage() {
  return (
    <div className="w-full flex flex-col">
      <HeroDevelopers />
      <IntegrationPaths />
      <IssuerIntegrationSection />
      <CodeSnippets />
      <VerifierWebhookSection />
      <SDKReferenceSummary />
    </div>
  )
}
