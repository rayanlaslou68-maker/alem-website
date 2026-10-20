import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Client-side gating is a UX convenience only. The backend re-checks the
// session and role on every request — this component never substitutes
// for that check.
export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="py-24 text-center text-ink/60">Checking access…</div>;
  }
  if (!user) {
    return <Navigate to="/portal/login" state={{ from: location }} replace />;
  }
  if (roles && !roles.includes(user.role)) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center">
        <h1 className="text-2xl font-display font-semibold">Access restricted</h1>
        <p className="mt-3 text-ink/70">
          Your account doesn't have clearance for this section. Contact your ALEM liaison
          if you believe this is wrong.
        </p>
      </div>
    );
  }
  return children;
}