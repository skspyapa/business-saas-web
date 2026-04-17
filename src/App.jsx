import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider as OidcProvider, useAuth } from 'react-oidc-context';

import { WebStorageStateStore } from 'oidc-client-ts';

/* -------------------------------------------------------------------------- */
/*                                OIDC CONFIG                                 */
/* -------------------------------------------------------------------------- */
const oidcConfig = {
  authority: "http://localhost:8090/realms/business-saas",
  client_id: "business-saas-web-frontend-app",
  redirect_uri: "http://localhost:3000",
  response_type: "code",
  scope: "openid profile email",
  userStore: new WebStorageStateStore({ store: window.localStorage }), // Crucial for persisting logins across refreshes
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

  // Prevent "flash" of the Landing Page when Keycloak redirects back with the login tokens
  if (auth.isLoading || auth.activeNavigator) {
    return (
      <div className="app-container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="background-glow"></div>
          <h2 style={{ color: "white", zIndex: 10 }}>Authenticating...</h2>
      </div>
    );
  }

  return (
    <div className="app-container animate-fade-in">
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
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      navigate('/');
    }
  }, [auth.isLoading, auth.isAuthenticated, navigate]);

  useEffect(() => {
    if (auth.isAuthenticated && auth.user?.access_token) {
      
      // 1. FIRST: Sync the user into the local database
      fetch("http://localhost:8080/api/v1/users/sync", {
         method: "POST",
         headers: { "Authorization": `Bearer ${auth.user.access_token}` }
      })
      .then(syncRes => {
         if (!syncRes.ok) throw new Error("Failed to sync user. Status: " + syncRes.status);
         
         // 2. SECOND: Now fetch their businesses
         return fetch("http://localhost:8080/api/v1/businesses/my-businesses", {
            headers: { 
               "Authorization": `Bearer ${auth.user.access_token}`,
               "Content-Type": "application/json"
            }
         });
      })
      .then(res => {
         if (!res.ok) throw new Error("Failed to fetch businesses. Status: " + res.status);
         return res.json();
      })
      .then(data => {
          // If it's empty, redirect to create business!
          if (!data.content || data.content.length === 0) {
             navigate('/create-business');
          } else {
             // Unlock Dashboard
             setIsVerifying(false);
          }
      })
      .catch(err => {
          console.error("API Error Sequence:", err);
          // Don't arbitrarily open the dashboard if the API crashes (e.g. CORS error)
          // We redirect to create-business as a safe fallback or stay locked
          navigate('/create-business');
      });
    }
  }, [auth.isAuthenticated, auth.user, navigate]);

  if (!auth.isAuthenticated || isVerifying) {
     return (
       <div className="app-container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
           <h2 style={{ color: "white" }}>Securing your workspace...</h2>
       </div>
     );
  }

  return (
    <div className="app-container animate-fade-in">
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
/*                            CREATE BUSINESS                                 */
/* -------------------------------------------------------------------------- */
function CreateBusinessPage() {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleCreateBusiness = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Call the Spring Boot backend
    fetch("http://localhost:8080/api/v1/businesses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${auth.user?.access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: formData.get("businessName"),
        subdomain: formData.get("subdomain"),
        businessType: formData.get("businessType")
      })
    })
    .then(res => {
      if(res.ok) {
         // Success! Redirect to unlocked dashboard
         navigate('/dashboard');
      }
    })
    .catch(console.error);
  };

  return (
    <div className="app-container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="background-glow"></div>
      <form onSubmit={handleCreateBusiness} className="glass-card" style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '1.5rem', zIndex: 10 }}>
        <h2 style={{ textAlign: 'center', margin: 0 }}>Create Your Workspace</h2>
        
        <input name="businessName" placeholder="Company Name" required style={{ padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', border: '1px solid #333', color: 'white', fontSize: '1rem' }} />
        
        <input name="subdomain" placeholder="Subdomain (e.g. yourbrand)" required style={{ padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', border: '1px solid #333', color: 'white', fontSize: '1rem' }} />
        
        <select name="businessType" required style={{ padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', border: '1px solid #333', color: 'white', fontSize: '1rem' }}>
           <option value="RETAIL" style={{color: 'black'}}>Retail</option>
           <option value="SOFTWARE" style={{color: 'black'}}>Software / SaaS</option>
           <option value="AGENCY" style={{color: 'black'}}>Agency</option>
        </select>
        
        <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', padding: '1rem' }}>Launch Business</button>
      </form>
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
          <Route path="/create-business" element={<CreateBusinessPage />} />
        </Routes>
      </BrowserRouter>
    </OidcProvider>
  );
}
