import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export function AuthModal() {
  const {
    authModalOpen,
    authModalRedirectPath,
    closeAuthModal,
    login,
    signUp,
  } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setError('');
    setEmail('');
    setPassword('');
    setName('');
    setMode('signin');
    closeAuthModal();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'signin') {
        const result = await login(email, password);
        if (result.success) {
          handleClose();
          if (authModalRedirectPath) navigate(authModalRedirectPath);
        } else {
          setError(result.error ?? 'Sign in failed');
        }
      } else {
        const result = await signUp({ email, password, name });
        if (result.success) {
          handleClose();
          if (authModalRedirectPath) navigate(authModalRedirectPath);
        } else {
          setError(result.error ?? 'Sign up failed');
        }
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {authModalOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop with blur */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            aria-hidden
          />

          {/* Card */}
          <motion.div
            className="relative w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-xl md:p-8"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex gap-2 rounded-xl bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => { setMode('signin'); setError(''); }}
                className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors ${
                  mode === 'signin'
                    ? 'bg-white text-[#E53935] shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(''); }}
                className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors ${
                  mode === 'signup'
                    ? 'bg-white text-[#E53935] shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#E53935] focus:outline-none focus:ring-2 focus:ring-[#E53935]/20"
                    placeholder="Your name"
                    required={mode === 'signup'}
                  />
                </div>
              )}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#E53935] focus:outline-none focus:ring-2 focus:ring-[#E53935]/20"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#E53935] focus:outline-none focus:ring-2 focus:ring-[#E53935]/20"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#E53935] py-3.5 font-semibold text-white disabled:opacity-70"
              >
                {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            </form>

            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              aria-label="Close"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
