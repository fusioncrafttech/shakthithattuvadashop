import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

interface AdminNavbarProps {
  sidebarCollapsed: boolean;
  onMenuClick: () => void;
}

export function AdminNavbar({ onMenuClick }: AdminNavbarProps) {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-14 min-h-[3.5rem] shrink-0 items-center justify-between gap-2 border-b border-gray-200/80 bg-white/95 px-3 shadow-sm backdrop-blur-md lg:h-16 lg:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-2 lg:flex-initial">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 active:bg-gray-200 lg:hidden"
          aria-label="Open menu (Dashboard, Products, Categories…)"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="min-w-0 truncate text-sm font-medium text-gray-500 lg:whitespace-normal">
          Shakthi Admin
        </span>
      </div>

      <div className="relative flex shrink-0 items-center gap-2 lg:gap-4">
        <div className="hidden h-8 w-px bg-gray-200 sm:block" />
        <button
          type="button"
          onClick={() => setProfileOpen((o) => !o)}
          className="flex items-center gap-3 rounded-2xl px-3 py-2 transition hover:bg-gray-100"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E53935] text-sm font-bold text-white">
            {(user?.name?.[0] ?? user?.email?.[0] ?? 'A').toUpperCase()}
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold text-gray-900">{user?.name ?? 'Admin'}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <svg
            className={`h-4 w-4 text-gray-500 transition ${profileOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <AnimatePresence>
          {profileOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                aria-hidden
                onClick={() => setProfileOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-gray-200 bg-white py-2 shadow-xl"
              >
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="text-sm font-semibold text-gray-900">{user?.name ?? 'Admin'}</p>
                  <p className="truncate text-xs text-gray-500">{user?.email}</p>
                  <span className="mt-1 inline-block rounded-full bg-[#E53935]/10 px-2 py-0.5 text-xs font-medium text-[#E53935]">
                    {user?.role === 'admin' ? 'Admin' : 'User'}
                  </span>
                </div>
                <a
                  href="/profile"
                  className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Profile
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                    window.location.href = '/';
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
