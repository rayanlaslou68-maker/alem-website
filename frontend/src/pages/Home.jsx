import { Link } from 'react-router-dom';

const capabilities = [
  {
    title: 'Sourcing & procurement',
    body: 'We identify, vet and contract manufacturers and suppliers against your specification, with full chain-of-custody records from quote to delivery.'
  },
  {
    title: 'Transport & storage',
    body: 'Climate-controlled warehousing and secured convoy or freight transport, tracked end to end and released only against authorized manifests.'
  },
  {
    title: 'Lifecycle documentation',
    body: 'Specification sheets, maintenance records and compliance certificates, kept current and available to authorized personnel through the portal.'
  }
];

const stats = [
  { label: 'Active engagements', value: '37' },
  { label: 'Countries served', value: '14' }
];

const MAP_EMBED_URL = 'https://www.google.com/maps?q=34.009994,-6.852598&z=16&output=embed';
const MAP_LINK_URL = 'https://maps.app.goo.gl/MfoXSEskjZuVVEK18';

const MA_HOME = 'https://www.marocannuaire.org/';

const directoryLinks = [
  {
    label: 'ANNUAIRE',
    text: "ALEM's listing in the Maroc Annuaire business directory.",
    href: 'https://www.marocannuaire.org/Annuaire/Details_infos.php?id=9589&activite=Promotion%20immobiliere&ville=RABAT%20SALE',
    icon: (
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </>
    )
  },
  {
    label: 'POUR LES ENTREPRISES',
    text: 'Visibility and advertising options for businesses.',
    href: MA_HOME,
    icon: (
      <>
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </>
    )
  },
  {
    label: 'DEMANDE DE DEVIS',
    text: 'Post or browse requests for quotes.',
    href: MA_HOME,
    icon: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </>
    )
  },
  {
    label: 'BLOG',
    text: 'News, guides and articles from the directory.',
    href: 'https://www.marocannuaire.org/blog/blog.php',
    icon: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </>
    )
  },
  {
    label: 'MARKETPLACE B2B MAROC',
    text: 'Browse equipment and services on the B2B marketplace.',
    href: 'https://marocannuaire.org/p/ma.php',
    icon: (
      <>
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </>
    )
  }
];

const delay = (s) => ({ animationDelay: `${s}s` });

export default function Home() {
  return (
    <div className="relative isolate">
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
      />
      <div className="fixed inset-0 -z-10 bg-black/50" />

      <section className="relative border-b border-khaki-300 text-paper overflow-hidden">
        <div className="relative max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-[2fr,1fr] gap-10 items-end">
          <div>
            <img src="/logo.png" alt="ALEM" className="h-20 w-20 object-contain bg-paper rounded-md p-2 mb-6 animate-fade-up" />
            <p className="data-value text-khaki-300 text-sm animate-fade-up" style={delay(0.1)}>
              ALEM / Defense Logistics
            </p>
            <h1 className="mt-3 font-display text-5xl md:text-6xl leading-[0.95] animate-fade-up" style={delay(0.2)}>
              Equipment logistics, planned and documented like a mission depends on it.
            </h1>
            <p className="mt-5 text-paper/80 max-w-xl animate-fade-up" style={delay(0.4)}>
              ALEM plans, sources and delivers equipment logistics for defense and government
              partners, with a secure portal for specifications, documentation and inquiries.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 animate-fade-up" style={delay(0.6)}>
              <Link to="/contact" className="btn-primary bg-khaki-300 text-ink hover:bg-khaki-200">
                Start a conversation
              </Link>
              <Link to="/portal/login" className="btn-secondary border-paper/50 text-paper hover:bg-paper/10">
                Military Portal sign in
              </Link>
            </div>
          </div>
          <dl className="field-rule border-paper/30 pt-4 space-y-3 animate-fade-up" style={delay(0.8)}>
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="text-xs uppercase tracking-wide text-paper/60">{s.label}</dt>
                <dd className="data-value text-3xl">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16 text-paper">
        <h2 className="font-display text-3xl animate-fade-up">What we handle</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-8">
          {capabilities.map((c, i) => (
            <div key={c.title} className="field-rule border-paper/30 pt-4 animate-fade-up" style={delay(0.2 + i * 0.2)}>
              <h3 className="font-display text-xl">{c.title}</h3>
              <p className="mt-2 text-paper/70 text-sm leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-20 text-paper">
        <p className="data-value text-khaki-300 text-sm animate-fade-up">Maroc Annuaire</p>
        <h2 className="mt-2 font-display text-3xl animate-fade-up" style={delay(0.1)}>
          Find ALEM on Maroc Annuaire
        </h2>
        <p className="mt-3 max-w-xl text-paper/70 animate-fade-up" style={delay(0.2)}>
          Explore our directory listing and the B2B marketplace, all in one place.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {directoryLinks.map((l, i) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-[190px] flex-col justify-between rounded-2xl border border-paper/20 bg-paper/10 p-5 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-khaki-300 hover:bg-paper/20 animate-fade-up"
              style={delay(0.3 + i * 0.1)}
            >
              <div className="flex items-start justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-khaki-300 text-ink">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                    aria-hidden="true"
                  >
                    {l.icon}
                  </svg>
                </span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 text-paper/60 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-khaki-300"
                  aria-hidden="true"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </div>
              <div className="mt-6">
                <h3 className="font-display text-lg uppercase leading-tight">{l.label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-paper/70">{l.text}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="bg-khaki-100 border-y border-khaki-300">
        <div className="max-w-6xl mx-auto px-4 py-14 grid md:grid-cols-[2fr,1fr] gap-8 items-center">
          <div>
            <h2 className="font-display text-2xl">Already working with ALEM?</h2>
            <p className="mt-2 text-ink/70 max-w-xl">
              Military personnel and authorized authorities can sign in to the portal for
              equipment specifications, current documentation and a direct inquiry channel.
            </p>
          </div>
          <Link to="/portal/login" className="btn-primary justify-self-start md:justify-self-end">
            Go to the Military Portal
          </Link>
        </div>
      </section>

      <section className="bg-khaki-100 border-b border-khaki-300">
        <div className="max-w-6xl mx-auto px-4 py-14">
          <h2 className="font-display text-2xl">Find us</h2>
          <div className="mt-6 overflow-hidden rounded border border-ink/10">
            <iframe
              title="ALEM location on Google Maps"
              src={MAP_EMBED_URL}
              width="100%"
              height="360"
              style={{ border: 0, display: 'block' }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <a
            href={MAP_LINK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm font-medium underline text-ink"
          >
            Open in Google Maps
          </a>
        </div>
      </section>
    </div>
  );
}