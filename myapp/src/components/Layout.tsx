import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { openAuthModal } = useAuth();

  useEffect(() => {
    const state = location.state as { openAuthModal?: boolean; redirectTo?: string } | null;
    if (state?.openAuthModal && state?.redirectTo) {
      openAuthModal(state.redirectTo);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state, openAuthModal, navigate]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-24 md:pb-12">
        <Outlet />
      </main>
      <BottomNav />
    </>
  );
}
