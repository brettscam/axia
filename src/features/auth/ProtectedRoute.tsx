import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export function ProtectedRoute() {
  const user = useAuth((s) => s.user);
  const loading = useAuth((s) => s.loading);
  const initialize = useAuth((s) => s.initialize);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = initialize();
    return unsubscribe;
  }, [initialize]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true });
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-parchment">
        <p className="text-fog">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <Outlet />;
}
