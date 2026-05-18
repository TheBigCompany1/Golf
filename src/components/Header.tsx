
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Flag, LogOut } from 'lucide-react';

interface HeaderProps {
  session: any;
}

export function Header({ session }: HeaderProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo">
          <Flag size={24} />
          <span>GolfTracker</span>
        </Link>

        {session ? (
          <nav className="nav-links">
            <Link to="/" className="nav-link">Dashboard</Link>
            <Link to="/courses" className="nav-link">Courses & Score</Link>
            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', gap: '0.5rem' }}>
              <LogOut size={16} />
              Logout
            </button>
          </nav>
        ) : (
          <nav className="nav-links">
            <Link to="/login" className="btn btn-primary">Login</Link>
          </nav>
        )}
      </div>
    </header>
  );
}
