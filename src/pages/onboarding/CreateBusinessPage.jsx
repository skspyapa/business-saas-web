import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';

export default function CreateBusinessPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [sessionError, setSessionError] = useState(null);

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
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("401");
          }
          throw new Error("Server error occurred while creating workspace.");
        }
        return res.json();
      })
      .then(() => {
        // Success! Redirect to unlocked dashboard
        navigate('/dashboard');
      })
      .catch(err => {
        console.error(err);
        if (err.message === "401") {
          setSessionError("Your secure session has expired. Please log in again to continue.");
        } else {
          setSessionError("An error occurred. Please try again later.");
        }
      });
  };

  return (
    <div className="app-container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="background-glow"></div>
      <form onSubmit={handleCreateBusiness} className="glass-card" style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '1.5rem', zIndex: 10 }}>
        <h2 style={{ textAlign: 'center', margin: 0 }}>Create Your Workspace</h2>
        
        {sessionError && (
          <div style={{ backgroundColor: 'rgba(255, 60, 60, 0.1)', border: '1px solid #ff4444', padding: '1rem', borderRadius: '8px', color: '#ff4444', textAlign: 'center', fontWeight: 'bold' }}>
            {sessionError}
            {sessionError.includes('expired') && (
              <button 
                type="button" 
                onClick={() => void auth.signinRedirect()} 
                style={{ marginTop: '0.8rem', background: '#ff4444', color: 'white', border: 'none', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
                Verify Session
              </button>
            )}
          </div>
        )}
        
        <input name="businessName" placeholder="Company Name" required style={{ padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', border: '1px solid #333', color: 'white', fontSize: '1rem' }} />
        
        <input name="subdomain" placeholder="Subdomain (e.g. yourbrand)" required style={{ padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', border: '1px solid #333', color: 'white', fontSize: '1rem' }} />
        
        <select name="businessType" required style={{ padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', border: '1px solid #333', color: 'white', fontSize: '1rem' }}>
          <option value="RETAIL" style={{ color: 'black' }}>Retail</option>
          <option value="SOFTWARE" style={{ color: 'black' }}>Software / SaaS</option>
          <option value="AGENCY" style={{ color: 'black' }}>Agency</option>
        </select>
        
        <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', padding: '1rem' }}>Launch Business</button>
      </form>
    </div>
  );
}
