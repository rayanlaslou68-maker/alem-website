import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const navLink = ({ isActive }) =>
  `px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
    isActive ? 'border-olive-800 text-ink' : 'border-transparent text-ink/70 hover:text-ink'
  }`;

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="border-b border-khaki-300 bg-paper/95 backdrop-blur sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="ALEM" className="h-10 w-10 object-contain" />
          <span className="font-display text-xl tracking-wide">ALEM</span>
        </Link>
        <nav className="hidden md:flex items-center">
          <NavLink to="/" end className={navLink}>Home</NavLink>
          <NavLink to="/projects" className={navLink}>Projects &amp; Achievements</NavLink>
          <NavLink to="/contact" className={navLink}>Contact</NavLink>
          <NavLink to={user ? '/portal' : '/portal/login'} className={navLink}>
            Military Portal
          </NavLink>
        </nav>
        <Link to={user ? '/portal' : '/portal/login'} className="btn-primary text-sm py-2 px-4">
          {user ? 'Portal' : 'Portal sign in'}
        </Link>
      </div>
    </header>
  );
}