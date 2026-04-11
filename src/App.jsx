import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from 'react-oidc-context';

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

function SkySaaSAuthLayer() {
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="background-glow"></div>
        <h2 style={{ color: "var(--text-secondary)" }}>Establishing Secure Connection...</h2>
      </div>
    );
  }

  if (auth.error) {
    return (
      <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <h2 style={{ color: "#ff4444" }}>Authentication Error</h2>
        <p style={{ marginTop: "1rem" }}>{auth.error.message}</p>
        <button onClick={() => window.location.reload()} className="btn-primary" style={{ marginTop: "2rem" }}>Retry</button>
      </div>
    );
  }

  // LOGGED IN DASHBOARD
  if (auth.isAuthenticated) {
    return (
      <div className="app-container">
        <div className="background-glow"></div>
        <nav className="navbar">
          <div className="logo">Sky SaaS</div>
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
          <div className="glass-card">
            <div className="metric-title">System Status</div>
            <div className="metric-value" style={{ color: "#00C851" }}>Operational</div>
          </div>
        </main>
      </div>
    );
  }

  // PUBLIC MARKETING LANDING PAGE
  return (
    <div className="app-container">
      <div className="background-glow"></div>
      <div className="grid-overlay"></div>
      
      <nav className="navbar">
        <div className="logo">Sky SaaS Platform</div>
      </nav>

      <main className="hero">
        <div className="pill">Enterprise-Grade Security</div>
        <h1>The Future of<br/>Business Management</h1>
        <p>
          A highly scalable, multi-tenant ecosystem designed to power your entire product catalog, subscription tiers, and transaction processing.
        </p>
        <button 
          className="btn-primary"
          onClick={() => void auth.signinRedirect()}
        >
          Authenticate to Get Started
        </button>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider {...oidcConfig}>
      <SkySaaSAuthLayer />
    </AuthProvider>
  );
}
