import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/ui/spinner';
import { Leaf } from 'lucide-react';

function FullScreenLoader() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3">
      <div className="flex h-12 w-12 animate-float items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
        <Leaf size={22} />
      </div>
      <Spinner />
    </div>
  );
}

export function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return <FullScreenLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (!user.onboardingComplete) return <Navigate to="/onboarding" replace />;

  return <Outlet />;
}

export function OnboardingRoute() {
  const { user, loading } = useAuth();

  if (loading) return <FullScreenLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.onboardingComplete) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}

export function PublicRoute() {
  const { user, loading } = useAuth();

  if (loading) return <FullScreenLoader />;
  if (user) {
    return <Navigate to={user.onboardingComplete ? '/dashboard' : '/onboarding'} replace />;
  }

  return <Outlet />;
}
