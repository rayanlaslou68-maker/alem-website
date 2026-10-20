const projects = [
  {
    year: '2024',
    title: 'Regional cold-chain storage rollout',
    summary: 'Deployed climate-controlled storage across three sites to extend shelf life for temperature-sensitive supplies, cutting spoilage losses significantly.'
  },
  {
    year: '2023',
    title: 'Fleet tracking modernization',
    summary: 'Replaced manual manifests with a digital tracking system across the transport fleet, reducing delivery discrepancies and giving partners real-time status.'
  },
  {
    year: '2022',
    title: 'Multi-site inventory consolidation',
    summary: 'Consolidated inventory management across four regional depots into a single system, shortening average fulfillment time.'
  },
  {
    year: '2021',
    title: 'Compliance documentation overhaul',
    summary: 'Rebuilt the documentation pipeline for equipment certificates and maintenance records, moving partner access onto the secure portal.'
  }
];

export default function Projects() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <p className="data-value text-olive-800 text-sm">Track record</p>
      <h1 className="mt-2 font-display text-4xl">Projects &amp; achievements</h1>
      <p className="mt-3 text-ink/70 max-w-2xl">
        A selection of engagements that show how we work. Full operational detail on any
        engagement is available to authorized partners through the Military Portal.
      </p>

      <ol className="mt-12 space-y-0">
        {projects.map((p) => (
          <li key={p.title} className="field-rule py-6 grid md:grid-cols-[100px,1fr] gap-4">
            <span className="data-value text-ink/50">{p.year}</span>
            <div>
              <h2 className="font-display text-xl">{p.title}</h2>
              <p className="mt-1 text-ink/70 text-sm leading-relaxed max-w-2xl">{p.summary}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}