export default function Footer() {
  return (
    <footer className="border-t border-khaki-300 mt-24">
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-3 text-sm text-ink/70">
        <div>
          <p className="font-display text-lg text-ink">ALEM</p>
          <p className="mt-2 max-w-xs">
            Equipment logistics for defense and government partners: sourcing, transport,
            storage and lifecycle documentation.
          </p>
        </div>
        <div>
          <p className="field-label !mb-2 text-ink">Contact</p>
          <p>operations@alem-logistics.example</p>
          <p>
            Mobile :{' '}
            <a href="tel:+212665877694" className="hover:underline">+212 665 877 694</a>
          </p>
          <p>
            Tél fixe 1 :{' '}
            <a href="tel:+212537691161" className="hover:underline">+212 537 691 161</a>
          </p>
          <p>
            Tél fixe 2 :{' '}
            <a href="tel:+212537691793" className="hover:underline">+212 537 691 793</a>
          </p>
        </div>
        <div>
          <p className="field-label !mb-2 text-ink">Access</p>
          <p>The Military Portal is restricted to verified personnel and authorities.</p>
        </div>
      </div>
      <div className="border-t border-khaki-300 py-4 text-center text-xs text-ink/50">
        © {new Date().getFullYear()} ALEM. All rights reserved.
      </div>
    </footer>
  );
}