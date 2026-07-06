import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, OnboardingRoute, PublicRoute } from '@/components/RouteGuards';
import AppShell from '@/components/AppShell';

import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Onboarding from '@/pages/Onboarding';
import Dashboard from '@/pages/Dashboard';
import Scan from '@/pages/Scan';
import Cravings from '@/pages/Cravings';
import History from '@/pages/History';
import NotFound from '@/pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Public auth routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* Onboarding - requires auth, but not completed onboarding */}
      <Route element={<OnboardingRoute />}>
        <Route path="/onboarding" element={<Onboarding />} />
      </Route>

      {/* Protected app routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/cravings" element={<Cravings />} />
          <Route path="/history" element={<History />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
