import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/portal';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [totp, setTotp] = useState('');
  const [needsTotp, setNeedsTotp] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    navigate(from, { replace: true });
    return null;
  }

  async function onSubmit(evt) {
    evt.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(username.trim(), password, totp.trim() || undefined);
      navigate(from, { replace: true });
    } catch (err) {
      if (err.code === 'totp_required') {
        setNeedsTotp(true);
        setError('Enter the 6-digit code from your authenticator app.');
      } else {
        setError('Incorrect username or password.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <p className="data-value text-olive-800 text-sm">Restricted access</p>
      <h1 className="mt-2 font-display text-4xl">Military Portal</h1>
      <p className="mt-3 text-ink/70">
        For verified military personnel and authorized authorities only. Access attempts are
        logged.
      </p>

      <form onSubmit={onSubmit} noValidate className="mt-10 space-y-5">
        <div>
          <label className="field-label" htmlFor="username">Username</label>
          <input
            id="username"
            className="field-input"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={64}
            required
          />
        </div>

        <div>
          <label className="field-label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="field-input"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {needsTotp && (
          <div>
            <label className="field-label" htmlFor="totp">Authentication code</label>
            <input
              id="totp"
              className="field-input"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={totp}
              onChange={(e) => setTotp(e.target.value)}
              maxLength={6}
            />
          </div>
        )}

        {error && <p className="field-error" role="alert">{error}</p>}

        <button type="submit" className="btn-primary w-full justify-center" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}