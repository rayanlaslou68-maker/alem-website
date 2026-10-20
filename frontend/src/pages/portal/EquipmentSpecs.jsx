import { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';

export default function EquipmentSpecs() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');

  useEffect(() => {
    api
      .get('/equipment/list.php')
      .then((data) => setItems(data.equipment))
      .catch(() => setError('Could not load the equipment list.'));
  }, []);

  const filtered = (items || []).filter((it) =>
    (it.name + ' ' + it.category + ' ' + it.reference_code).toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <p className="data-value text-olive-800 text-sm">Military Portal</p>
      <h1 className="mt-1 font-display text-4xl">Equipment specifications</h1>

      <input
        className="field-input mt-6 max-w-sm"
        placeholder="Search by name, category or reference code"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      {error && <p className="field-error mt-4">{error}</p>}

      {!error && items === null && <p className="mt-8 text-ink/60">Loading…</p>}

      {items !== null && (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="field-rule text-xs uppercase tracking-wide text-ink/50">
                <th className="py-2 pr-4">Reference</th>
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Category</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2">Last updated</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((it) => (
                <tr key={it.id} className="field-rule">
                  <td className="py-3 pr-4 data-value">{it.reference_code}</td>
                  <td className="py-3 pr-4 font-medium">{it.name}</td>
                  <td className="py-3 pr-4">{it.category}</td>
                  <td className="py-3 pr-4">
                    <span className="data-value text-xs px-2 py-0.5 bg-olive-200 text-olive-900">
                      {it.status}
                    </span>
                  </td>
                  <td className="py-3 data-value text-ink/60">{it.updated_at}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-ink/50">
                    No equipment matches that search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}