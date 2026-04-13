import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider as OidcProvider, useAuth } from 'react-oidc-context';

/* -------------------------------------------------------------------------- */
/*                                OIDC CONFIG                                 */
/* -------------------------------------------------------------------------- */
const oidcConfig = {
  authority: "http://localhost:8090/realms/business-saas",
  client_id: "business-saas-web-frontend-app",
  redirect_uri: "http://localhost:3000",
  response_type: "code",
  scope: "openid profile email",
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  }
};

/* -------------------------------------------------------------------------- */
/*                          LANDING PAGE (PUBLIC)                             */
/* -------------------------------------------------------------------------- */
function LandingPage() {
  const auth = useAuth();
  const navigate = useNavigate();

  // If already logged in, instantly redirect to dashboard
  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate('/dashboard');
    }
  }, [auth.isAuthenticated, navigate]);

  return (
    <div className="app-container">
      <div className="background-glow"></div>
      <div className="grid-overlay"></div>

      {/* Top Navbar with Keycloak Triggers */}
      <nav className="navbar">
        <div className="logo">Sky SaaS Platform</div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            className="btn-text"
            onClick={() => void auth.signinRedirect()}
            style={{ backgroundColor: 'transparent', color: 'var(--text-primary)', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '1rem' }}
          >
            Log In
          </button>

          <button
            className="btn-primary"
            // We pass prompt: 'create' alongside kc_action to enforce the registration screen directly
            onClick={() => void auth.signinRedirect({ prompt: 'create', extraQueryParams: { kc_action: 'register' } })}
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
          onClick={() => void auth.signinRedirect()}
          style={{ marginTop: '2rem' }}
        >
          Authenticate to Get Started
        </button>
      </main>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                DASHBOARD                                   */
/* -------------------------------------------------------------------------- */
function DashboardPage() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      navigate('/');
    }
  }, [auth.isLoading, auth.isAuthenticated, navigate]);

  if (!auth.isAuthenticated) return null;

  return (
    <div className="app-container">
      <div className="background-glow"></div>
      <nav className="navbar">
        <div className="logo">Sky SaaS Dashboard</div>
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          <span style={{ fontWeight: 600 }}>{auth.user?.profile.given_name || auth.user?.profile.preferred_username}</span>
          <button className="btn-logout" onClick={() => void auth.signoutRedirect()}>Sign Out</button>
        </div>
      </nav>

      <main className="dashboard-grid">
        <div className="glass-card">
          <div className="metric-title">Total Revenue</div>
          <div className="metric-value">$124,500</div>
        </div>
        <div className="glass-card">
          <div className="metric-title">Active Subscriptions</div>
          <div className="metric-value">1,204</div>
        </div>
      </main>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 MAIN APP                                   */
/* -------------------------------------------------------------------------- */
export default function App() {
  return (
    <OidcProvider {...oidcConfig}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </BrowserRouter>
    </OidcProvider>
  );
}
