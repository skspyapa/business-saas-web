import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider as OidcProvider, useAuth } from 'react-oidc-context';

/* -------------------------------------------------------------------------- */
/*                                OIDC CONFIG                                 */
/* -------------------------------------------------------------------------- */
const oidcConfig = {
  authority: "http://localhost:8080/realms/business-saas",
  client_id: "frontend-app",
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
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <div className="background-glow"></div>
      <div className="grid-overlay"></div>
      
      {/* Top Navbar with Login/Signup */}
      <nav className="navbar">
        <div className="logo">Sky SaaS Platform</div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            className="btn-text" 
            onClick={() => navigate('/login')}
            style={{ backgroundColor: 'transparent', color: 'var(--text-primary)', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '1rem' }}
          >
            Log In
          </button>
          <button 
            className="btn-primary" 
            onClick={() => navigate('/signup')}
            style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}
          >
            Sign Up
          </button>
        </div>
      </nav>

      <main className="hero">
        <div className="pill">Enterprise-Grade Security</div>
        <h1>The Future of<br/>Business Management</h1>
        <p>
          A highly scalable, multi-tenant ecosystem designed to power your entire product catalog, subscription tiers, and transaction processing.
        </p>
      </main>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                LOGIN PAGE                                  */
/* -------------------------------------------------------------------------- */
function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  
  if (auth.isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="background-glow"></div>
      
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '3rem 2.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Welcome Back</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Sign in to your Sky SaaS account</p>

        {/* Custom React Form Logic */}
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }} onSubmit={(e) => e.preventDefault()}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Email Address</label>
            <input type="email" placeholder="admin@business.com" style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'rgba(0,0,0,0.5)', color: 'white', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Password</label>
            <input type="password" placeholder="••••••••" style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'rgba(0,0,0,0.5)', color: 'white', outline: 'none' }} />
          </div>
          <button className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            Sign In Securely
          </button>
        </form>

        <div style={{ margin: '2rem 0', display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--surface-border)' }}></div>
          <span style={{ padding: '0 1rem', fontSize: '0.9rem' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--surface-border)' }}></div>
        </div>

        <button 
          onClick={() => void auth.signinRedirect()} 
          style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'transparent', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>
          Sign In with Google / SSO
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               SIGNUP PAGE                                  */
/* -------------------------------------------------------------------------- */
function SignupPage() {
  
  return (
    <div className="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="background-glow"></div>
      
      <div className="glass-card" style={{ width: '100%', maxWidth: '450px', padding: '3rem 2.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Create an Account</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Launch your business dashboard today.</p>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }} onSubmit={(e) => e.preventDefault()}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>First Name</label>
              <input type="text" style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'rgba(0,0,0,0.5)', color: 'white', outline: 'none' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Last Name</label>
              <input type="text" style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'rgba(0,0,0,0.5)', color: 'white', outline: 'none' }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Email Address</label>
            <input type="email" style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'rgba(0,0,0,0.5)', color: 'white', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Password</label>
            <input type="password" style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'rgba(0,0,0,0.5)', color: 'white', outline: 'none' }} />
          </div>
          <button className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                DASHBOARD                                   */
/* -------------------------------------------------------------------------- */
function DashboardPage() {
  const auth = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      navigate('/login');
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
          <button className="btn-logout" onClick={() => auth.removeUser()}>Sign Out</button>
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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </BrowserRouter>
    </OidcProvider>
  );
}
