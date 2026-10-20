import { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';

export default function Documents() {
  const [docs, setDocs] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/documents/list.php')
      .then((data) => setDocs(data.documents))
      .catch(() => setError('Could not load documents.'));
  }, []);

  const downloadHref = (id) => `/api/documents/download.php?id=${encodeURIComponent(id)}`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <p className="data-value text-olive-800 text-sm">Military Portal</p>
      <h1 className="mt-1 font-display text-4xl">Documentation</h1>
      <p className="mt-2 text-ink/70 text-sm max-w-2xl">
        Certificates, maintenance records and manifests you're cleared to view. Every download
        is logged against your account.
      </p>

      {error && <p className="field-error mt-6">{error}</p>}
      {!error && docs === null && <p className="mt-8 text-ink/60">Loading…</p>}

      {docs !== null && (
        <ul className="mt-8">
          {docs.map((d) => (
            <li key={d.id} className="field-rule py-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">{d.title}</p>
                <p className="data-value text-xs text-ink/50 mt-0.5">
                  {d.category} · updated {d.updated_at}
                </p>
              </div>
              <a href={downloadHref(d.id)} className="btn-secondary text-sm py-2 px-4">
                Download
              </a>
            </li>
          ))}
          {docs.length === 0 && (
            <li className="py-8 text-center text-ink/50">No documents available to your account yet.</li>
          )}
        </ul>
      )}
    </div>
  );
}