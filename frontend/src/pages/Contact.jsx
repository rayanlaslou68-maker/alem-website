import { useState } from 'react';
import { api } from '../lib/api.js';

const initial = { name: '', organization: '', email: '', message: '', company_website: '' };

const MAP_EMBED_URL = 'https://www.google.com/maps?q=34.009994,-6.852598&z=16&output=embed';
const MAP_LINK_URL = 'https://maps.app.goo.gl/MfoXSEskjZuVVEK18';

export default function Contact() {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate() {
    const e = {};
    if (form.name.trim().length < 2) e.name = 'Enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.';
    if (form.message.trim().length < 10) e.message = 'Tell us a little more (at least 10 characters).';
    return e;
  }

  async function onSubmit(evt) {
    evt.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setStatus('sending');
    try {
      await api.post('/inquiries/submit.php', { ...form, source: 'public' });
      setStatus('sent');
      setForm(initial);
    } catch {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-3xl">Message received</h1>
        <p className="mt-3 text-ink/70">
          Thank you — a member of the ALEM team will get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <p className="data-value text-olive-800 text-sm">Get in touch</p>
      <h1 className="mt-2 font-display text-4xl">Contact ALEM</h1>
      <p className="mt-3 text-ink/70">
        For equipment specifications and documentation, sign in to the{' '}
        <span className="font-medium">Military Portal</span> instead. Use this form for general
        business inquiries.
      </p>

      <form onSubmit={onSubmit} noValidate className="mt-10 space-y-5">
        <div>
          <label className="field-label" htmlFor="name">Full name</label>
          <input id="name" className="field-input" value={form.name} onChange={(e) => update('name', e.target.value)} maxLength={80} />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>

        <div>
          <label className="field-label" htmlFor="organization">Organization <span className="text-ink/40">(optional)</span></label>
          <input id="organization" className="field-input" value={form.organization} onChange={(e) => update('organization', e.target.value)} maxLength={120} />
        </div>

        <div>
          <label className="field-label" htmlFor="email">Email</label>
          <input id="email" type="email" className="field-input" value={form.email} onChange={(e) => update('email', e.target.value)} maxLength={120} />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>

        <div>
          <label className="field-label" htmlFor="message">Message</label>
          <textarea id="message" className="field-input min-h-[140px]" value={form.message} onChange={(e) => update('message', e.target.value)} maxLength={2000} />
          {errors.message && <p className="field-error">{errors.message}</p>}
        </div>

        {/* Honeypot: real users never see or fill this in. */}
        <div className="absolute -left-[9999px]" aria-hidden="true">
          <label htmlFor="company_website">Leave this field empty</label>
          <input id="company_website" tabIndex={-1} autoComplete="off" value={form.company_website} onChange={(e) => update('company_website', e.target.value)} />
        </div>

        {status === 'error' && (
          <p className="field-error">Something went wrong sending your message. Please try again.</p>
        )}

        <button type="submit" className="btn-primary" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </button>
      </form>

      <section className="mt-16">
        <h2 className="font-display text-2xl">Our location</h2>
        <div className="mt-4 overflow-hidden rounded border border-ink/10">
          <iframe
            title="ALEM location on Google Maps"
            src={MAP_EMBED_URL}
            width="100%"
            height="320"
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
          className="mt-3 inline-block text-sm font-medium underline"
        >
          Open in Google Maps
        </a>
      </section>
    </div>
  );
}