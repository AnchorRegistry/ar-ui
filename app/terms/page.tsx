import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

// ─────────────────────────────────────────────────────────────────────────────
// Terms of Service — Version 1.0
// ─────────────────────────────────────────────────────────────────────────────

const CLAUSES = [
  {
    number: '1',
    title:  'Acceptance of Terms',
    body: [
      'By registering an artifact or otherwise using the AnchorRegistry service, you agree to be bound by these Terms of Service. Checking the acceptance checkbox during registration constitutes a binding, legally enforceable agreement to these terms.',
      'If you do not agree to these terms, do not use the service.',
    ],
  },
  {
    number: '2',
    title:  'The Service',
    body: [
      'AnchorRegistry provides immutable provenance infrastructure. Users register artifact hashes to the Base mainnet blockchain, creating permanent, publicly verifiable records of artifact existence and ownership at a point in time.',
      'AnchorRegistry is an infrastructure provider only. It is not a financial service, investment advisor, broker-dealer, custodian, content guarantor, or legal authority. AnchorRegistry makes no representation regarding the legal validity or enforceability of any registered artifact or agreement.',
    ],
  },
  {
    number: '3',
    title:  'Permanence of Registrations',
    body: [
      'All registrations are permanent and irreversible. Once written to Base mainnet, a registration cannot be modified, deleted, or corrected by AnchorRegistry or any other party.',
      'You assume full and sole responsibility for the accuracy, completeness, and appropriateness of all information submitted at the time of registration. Errors, omissions, or inaccuracies cannot be remediated after submission.',
    ],
  },
  {
    number: '4',
    title:  'Ownership Tokens',
    body: [
      'AnchorRegistry does not store, transmit, or retain ownership tokens. Tokens are generated entirely client-side within your browser and are never sent to AnchorRegistry servers. This is an architectural property of the system, not a policy choice.',
      'Loss of your ownership token cannot be recovered by AnchorRegistry. You are solely responsible for securing and retaining your ownership token. AnchorRegistry provides no recovery mechanism.',
    ],
  },
  {
    number: '5',
    title:  'No Personal Data in Metadata Fields',
    body: [
      'You must not submit sensitive, private, or personal information in any metadata field, including but not limited to: title, author, descriptor, URL, or any other free-text field.',
      'All submitted metadata is permanently and publicly visible on the blockchain. There is no mechanism to remove or obscure this data after submission.',
      'Prohibited data includes, without limitation: government identification numbers, social insurance or social security numbers, financial account details, health or medical information, passwords or credentials, biometric data, and any data subject to HIPAA, GDPR, PIPEDA, or equivalent privacy regulations. You accept full legal responsibility for any such data submitted.',
    ],
  },
  {
    number: '6',
    title:  'Prohibited Uses',
    body: [
      'You may not use AnchorRegistry to create, represent, or facilitate financial instruments, payment systems, stored value systems, money transmission services, or securities of any kind.',
      'You may not register content that is defamatory, fraudulent, obscene, harassing, threatening, or otherwise unlawful, or that infringes the intellectual property rights, privacy rights, or other rights of any third party.',
      'You are responsible for ensuring that all content you register complies with applicable laws and regulations in your jurisdiction.',
    ],
  },
  {
    number: '7',
    title:  'VOID Rights and Enforcement',
    body: [
      'AnchorRegistry reserves the right to disable resolution of any anchor through anchorregistry.ai that violates these Terms of Service. Disabled anchors are marked as VOID in the AnchorRegistry resolution layer.',
      'VOID anchors remain permanently visible and auditable at anchorregistry.com/verify/[ar_id]. The underlying on-chain record is not and cannot be altered. All enforcement decisions are recorded on-chain and are publicly auditable.',
      'Enforcement actions do not constitute deletion, modification, or reversal of the underlying blockchain record.',
    ],
  },
  {
    number: '8',
    title:  'No Warranty',
    body: [
      'THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.',
      'AnchorRegistry does not warrant that the service will be uninterrupted, error-free, or that any particular registration will be successfully processed or confirmed on-chain.',
    ],
  },
  {
    number: '9',
    title:  'Limitation of Liability',
    body: [
      'To the maximum extent permitted by applicable law, AnchorRegistry and DeFiMind Corp, and their respective officers, directors, employees, and agents, shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from or related to your use of, or inability to use, the service.',
      'In no event shall AnchorRegistry\'s total cumulative liability to you exceed the fees paid by you to AnchorRegistry in the twelve (12) months preceding the claim.',
    ],
  },
  {
    number: '10',
    title:  'User Responsibility',
    body: [
      'You are solely responsible for the accuracy, legality, and appropriateness of all artifacts and metadata you register. AnchorRegistry does not review, verify, or endorse any registered content.',
      'You represent and warrant that you have all rights, licenses, and permissions necessary to register the artifacts and metadata you submit, and that doing so does not violate any applicable law or the rights of any third party.',
    ],
  },
  {
    number: '11',
    title:  'Governing Law and Jurisdiction',
    body: [
      'These Terms of Service are governed by and construed in accordance with the laws of the Province of Ontario, Canada, without regard to its conflict of law provisions.',
      'DeFiMind Corp is incorporated under the laws of the Province of British Columbia, Canada. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts of Ontario, Canada.',
    ],
  },
  {
    number: '12',
    title:  'Updates to These Terms',
    body: [
      'AnchorRegistry may update these Terms of Service at any time. Updated terms will be posted at anchorregistry.com/terms with a revised effective date. Continued use of the service following the posting of updated terms constitutes your acceptance of those changes.',
      'Material changes will be announced via anchorregistry.com. It is your responsibility to review these terms periodically.',
    ],
  },
]

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main className="px-4 py-12 sm:px-8">
        <div className="mx-auto max-w-[720px]">

          {/* Header */}
          <div className="mb-10 border-b border-[#2E4270] pb-8">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-slate">
              Legal
            </p>
            <h1 className="mb-4 text-[32px] font-semibold tracking-tight text-off-white">
              Terms of Service
            </h1>
            <div className="space-y-1 font-mono text-[12px] text-muted-slate">
              <div className="flex gap-3">
                <span className="w-28 shrink-0">Version</span>
                <span className="text-off-white">1.0</span>
              </div>
              <div className="flex gap-3">
                <span className="w-28 shrink-0">Effective Date</span>
                <span className="text-off-white">[Launch date]</span>
              </div>
              <div className="flex gap-3">
                <span className="w-28 shrink-0">Last Updated</span>
                <span className="text-off-white">[Launch date]</span>
              </div>
              <div className="flex gap-3">
                <span className="w-28 shrink-0">Issued by</span>
                <span className="text-off-white">DeFiMind Corp</span>
              </div>
            </div>
          </div>

          {/* Clauses */}
          <div className="space-y-8">
            {CLAUSES.map(clause => (
              <section key={clause.number}>
                <h2 className="mb-3 flex items-baseline gap-3 text-[16px] font-semibold text-off-white">
                  <span className="font-mono text-[13px] text-[#F59E0B]">{clause.number}.</span>
                  {clause.title}
                </h2>
                <div className="space-y-3 pl-6">
                  {clause.body.map((para, i) => (
                    <p key={i} className="text-[14px] leading-relaxed text-muted-slate">
                      {para}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-12 border-t border-[#2E4270] pt-8">
            <p className="font-mono text-[11px] text-muted-slate">
              AnchorRegistry™ · <Link href="/" className="text-[#3B82F6] hover:underline">anchorregistry.com</Link> · DeFiMind Corp
            </p>
            <p className="mt-1 font-mono text-[10px] text-muted-slate/60">
              © 2026 DeFiMind Corp. All rights reserved. Patent pending.
            </p>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
