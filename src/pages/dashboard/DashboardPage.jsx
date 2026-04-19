import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';

export default function DashboardPage() {
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

      const authAction = localStorage.getItem('auth_action');
      let userApiPromise;

      if (authAction === 'signup') {
        // Run the Creation Hook
        userApiPromise = fetch("http://localhost:8080/api/v1/users/sync", {
          method: "POST",
          headers: { "Authorization": `Bearer ${auth.user.access_token}` }
        });
      } else {
        // Run the Passive Verification Hook
        userApiPromise = fetch("http://localhost:8080/api/v1/users/me", {
          method: "GET",
          headers: { "Authorization": `Bearer ${auth.user.access_token}` }
        });
      }

      // Cleanup the breadcrumb
      localStorage.removeItem('auth_action');

      // 1. FIRST: Ensure user exists safely
      userApiPromise
        .then(syncRes => {
          if (!syncRes.ok) throw new Error("Failed to process user context. Status: " + syncRes.status);

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
