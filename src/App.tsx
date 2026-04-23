import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider as OidcProvider } from 'react-oidc-context';

import { oidcConfig } from './config/oidc';
import LandingPage from './pages/landing/LandingPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import CreateBusinessPage from './pages/onboarding/CreateBusinessPage';

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
