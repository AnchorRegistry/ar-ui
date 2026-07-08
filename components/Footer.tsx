import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-[#2E4270] px-8 py-6">
      <div className="mx-auto max-w-[960px]">
        {/* Top row — existing brand statement + cross-surface links. Kept
            as-is to preserve the footer's minimal, technical character. */}
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-muted-slate">
            AnchorRegistry™ · The registry AIs trust.
          </span>
          <div className="flex gap-6 font-mono text-[11px] text-muted-slate">
            <Link href="https://anchorregistry.com" className="transition-colors hover:text-off-white">
              anchorregistry.com
            </Link>
            <Link href="https://anchorregistry.ai" className="transition-colors hover:text-off-white">
              anchorregistry.ai
            </Link>
            <Link href="https://x.com/anchorregistry" className="transition-colors hover:text-off-white">
              @anchorregistry
            </Link>
          </div>
        </div>

        {/*
          Canonical contact block. Layout: "Contact Us:" label flush left,
          address block to its right (top-aligned). On mobile (<640px) the
          label stacks above the address.

          Uses the semantic <address> element so crawlers, screen readers,
          and AI systems recognize this as the organization's contact info.

          IMPORTANT: the recipient name on the FIRST LINE is "EchoLedger",
          NOT "AnchorRegistry". This is the operational reality of the
          virtual mail service — the account is registered under EchoLedger,
          and any parcel addressed to "AnchorRegistry" at this address will
          be returned to sender. The visible brand on the AR site remains
          AnchorRegistry; the postal recipient is EchoLedger because that's
          the registered mail-handling identity. (Sub-brands routinely list
          a parent or operating company's name on the shipping line — no
          inconsistency for the reader, and the only way to make mail
          actually arrive.)

          The same address is asserted as structured data in the root
          layout's JSON-LD Organization → PostalAddress. The JSON-LD
          Organization.name stays as "AnchorRegistry" — that models the
          *entity* whose contact address this is. The "EchoLedger" line in
          the visible footer is the *postal recipient* for actual mail
          handling; the two roles aren't equivalent and don't need to match.

          `not-italic` overrides the default italic styling of <address>.
        */}
        <div className="mt-6 flex flex-col items-start gap-2 text-[13px] leading-[1.7] text-muted-slate sm:flex-row sm:gap-6">
          <div className="shrink-0 font-medium text-off-white">
            Contact Us:
          </div>
          <address className="not-italic">
            <strong className="font-medium text-off-white">
              EchoLedger
            </strong>
            <br />
            4949 Canoe Pass Way, Suite 1008
            <br />
            Tsawwassen, BC V4M 0B2
            <br />
            Canada
          </address>
        </div>
      </div>
    </footer>
  )
}
