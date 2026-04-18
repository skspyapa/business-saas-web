import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';

export default function CreateBusinessPage() {
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
        if (res.ok) {
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
          <option value="RETAIL" style={{ color: 'black' }}>Retail</option>
          <option value="SOFTWARE" style={{ color: 'black' }}>Software / SaaS</option>
          <option value="AGENCY" style={{ color: 'black' }}>Agency</option>
        </select>
        
        <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', padding: '1rem' }}>Launch Business</button>
      </form>
    </div>
  );
}
