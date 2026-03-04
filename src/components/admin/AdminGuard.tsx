import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, isLoading } = useAuth();
  const allowed = isAdmin;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#E53935] border-t-transparent" />
          <p className="text-sm font-medium text-gray-600">Checking access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/"
        state={{ openAuthModal: true, redirectTo: '/admin' }}
        replace
      />
    );
  }

  if (!allowed) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4"
      >
        <div className="max-w-md rounded-3xl bg-white p-8 shadow-xl text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
            <svg
              className="h-8 w-8 text-[#E53935]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Access denied</h1>
          <p className="mt-2 text-gray-600">
            You need admin privileges to view this area.
          </p>
          <a
            href="/"
            className="mt-6 inline-block rounded-xl bg-[#E53935] px-6 py-3 font-semibold text-white shadow-lg transition hover:opacity-90 active:scale-[0.98]"
          >
            Back to Home
          </a>
        </div>
      </motion.div>
    );
  }

  return <>{children}</>;
}
