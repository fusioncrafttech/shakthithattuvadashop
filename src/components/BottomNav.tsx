import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

const tabs = [
  { to: '/', label: 'Home', icon: HomeIcon },
  { to: '/history', label: 'History', icon: HistoryIcon },
  { to: '/cart', label: 'Cart', icon: CartIcon },
  { to: '/profile', label: 'Profile', icon: ProfileIcon },
];

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg className="h-6 w-6" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function HistoryIcon({ active }: { active: boolean }) {
  return (
    <svg className="h-6 w-6" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function CartIcon({ active }: { active: boolean }) {
  return (
    <svg className="h-6 w-6" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function ProfileIcon({ active }: { active: boolean }) {
  return (
    <svg className="h-6 w-6" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

export function BottomNav() {
  const location = useLocation();
  const { totalItems } = useCart();

  return (
    <nav
      className="fixed left-0 right-0 z-50 border-t border-gray-100 bg-white/95 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur-md md:hidden"
      style={{
        bottom: 0,
        position: 'fixed',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        transform: 'translateZ(0)',
        WebkitTransform: 'translateZ(0)',
      }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map(({ to, label, icon: Icon }) => {
          const isActive =
            location.pathname === to || (to === '/' && location.pathname === '/') || (to !== '/' && location.pathname.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              className="relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2"
            >
              <span className={`${isActive ? 'text-[#E53935]' : 'text-gray-400'}`}>
                <Icon active={isActive} />
              </span>
              <span className={`text-xs font-medium ${isActive ? 'text-[#E53935]' : 'text-gray-500'}`}>
                {label}
              </span>
              {to === '/cart' && totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute right-1/4 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#E53935] px-1 text-[10px] font-bold text-white"
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </motion.span>
              )}
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute -top-0.5 left-1/2 h-1 w-12 -translate-x-1/2 rounded-b-full bg-[#E53935]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
