import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, hasAuthParams } from 'react-oidc-context';

export default function LandingPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);

  // If already logged in, instantly redirect to dashboard
  React.useEffect(() => {
    if (auth.isAuthenticated) {
      navigate('/dashboard');
    }
  }, [auth.isAuthenticated, navigate]);

  // Prevent "flash" of the Landing Page ONLY when KEYCLOAK redirects back
  if (hasAuthParams()) {
    return (
      <div className="app-container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="background-glow"></div>
        <h2 style={{ color: "white", zIndex: 10 }}>Authenticating...</h2>
      </div>
    );
  }

  const handleLogin = () => {
    localStorage.setItem('auth_action', 'login');
    setIsExiting(true);
    setTimeout(() => { void auth.signinRedirect(); }, 400);
  };

  const handleSignup = () => {
    localStorage.setItem('auth_action', 'signup');
    setIsExiting(true);
    setTimeout(() => { void auth.signinRedirect({ prompt: 'create', extraQueryParams: { kc_action: 'register' } }); }, 400);
  };

  return (
    <div className={`app-container ${isExiting ? 'animate-fade-out' : 'animate-fade-in'}`}>
      <div className="background-glow"></div>
      <div className="grid-overlay"></div>

      {/* Top Navbar with Keycloak Triggers */}
      <nav className="navbar">
        <div className="logo">Sky SaaS Platform</div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            className="btn-text"
            onClick={handleLogin}
            style={{ backgroundColor: 'transparent', color: 'var(--text-primary)', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '1rem' }}
          >
            Log In
          </button>

          <button
            className="btn-primary"
            onClick={handleSignup}
            style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}
          >
            Sign Up
          </button>
        </div>
      </nav>

      <main className="hero">
        <div className="pill">Enterprise-Grade Security</div>
        <h1>The Future of<br />Business Management</h1>
        <p>
          A highly scalable, multi-tenant ecosystem designed to power your entire product catalog, subscription tiers, and transaction processing.
        </p>
        <button
          className="btn-primary"
          onClick={handleLogin}
          style={{ marginTop: '2rem' }}
        >
          Authenticate to Get Started
        </button>
      </main>
    </div>
  );
}
