    import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../lib/api.js';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [form, setForm] = useState({ subject: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    api
      .get('/inquiries/list.php')
      .then((data) => setInquiries(data.inquiries))
      .catch(() => setLoadError('Could not load your inquiries. Try refreshing.'));
  }, []);

  async function submitInquiry(evt) {
    evt.preventDefault();
    if (form.subject.trim().length < 3 || form.message.trim().length < 10) return;
    setStatus('sending');
    try {
      const data = await api.post('/inquiries/submit.php', { ...form, source: 'portal' });
      setInquiries((list) => [data.inquiry, ...list]);
      setForm({ subject: '', message: '' });
      setStatus('idle');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="data-value text-olive-800 text-sm">Signed in as {user.username} · {user.role}</p>
          <h1 className="mt-1 font-display text-4xl">Military Portal</h1>
        </div>
        <button onClick={logout} className="btn-secondary">Sign out</button>
      </div>

      <div className="mt-10 grid md:grid-cols-2 gap-4">
        <Link to="/portal/equipment" className="field-rule pt-4 block hover:bg-khaki-100/60 transition-colors -mx-2 px-2">
          <h2 className="font-display text-xl">Equipment specifications</h2>
          <p className="mt-1 text-sm text-ink/70">Browse current spec sheets by category and status.</p>
        </Link>
        <Link to="/portal/documents" className="field-rule pt-4 block hover:bg-khaki-100/60 transition-colors -mx-2 px-2">
          <h2 className="font-display text-xl">Documentation</h2>
          <p className="mt-1 text-sm text-ink/70">Certificates, maintenance records and manifests.</p>
        </Link>
      </div>

      <section className="mt-14">
        <h2 className="font-display text-2xl">Inquiries</h2>
        <p className="mt-1 text-ink/70 text-sm">
          Submit a request to your ALEM liaison. All inquiries are logged against your account.
        </p>

        <form onSubmit={submitInquiry} className="mt-6 grid gap-4 max-w-xl">
          <div>
            <label className="field-label" htmlFor="subject">Subject</label>
            <input
              id="subject"
              className="field-input"
              value={form.subject}
              onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
              maxLength={140}
            />
          </div>
          <div>
            <label className="field-label" htmlFor="message">Details</label>
            <textarea
              id="message"
              className="field-input min-h-[120px]"
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              maxLength={2000}
            />
          </div>
          {status === 'error' && <p className="field-error">Couldn't send that. Try again.</p>}
          <button type="submit" className="btn-primary justify-self-start" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Submit inquiry'}
          </button>
        </form>

        <div className="mt-10">
          {loadError && <p className="field-error">{loadError}</p>}
          {!loadError && inquiries.length === 0 && (
            <p className="text-ink/60 text-sm">No inquiries yet. Submitted requests will appear here.</p>
          )}
          <ul className="space-y-0">
            {inquiries.map((i) => (
              <li key={i.id} className="field-rule py-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium">{i.subject}</span>
                  <span className="data-value text-xs text-ink/50">{i.status}</span>
                </div>
                <p className="mt-1 text-sm text-ink/70">{i.message}</p>
                <p className="mt-1 data-value text-xs text-ink/40">{i.created_at}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}