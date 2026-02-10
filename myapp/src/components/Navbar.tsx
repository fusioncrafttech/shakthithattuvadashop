import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/shop?q=${encodeURIComponent(q)}`);
    } else {
      navigate('/shop');
    }
    setSearchOpen(false);
    setSearchQuery('');
  };

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  return (
    <>
      <motion.header
        className="sticky top-0 z-50 w-full bg-white/95 shadow-sm backdrop-blur-md"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-20 md:px-6">
          {/* Mobile: Hamburger | Desktop: Logo */}
          <div className="flex w-1/3 items-center md:w-auto">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="flex items-center justify-center rounded-xl p-2.5 text-gray-700 hover:bg-gray-100 md:hidden"
              aria-label="Open menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link to="/" className="hidden md:block">
              <span className="text-xl font-bold tracking-tight text-[#E53935] md:text-2xl">
                Shakthi Thattuvadaset
              </span>
            </Link>
          </div>

          {/* Mobile: Center brand name */}
          <Link to="/" className="flex flex-1 justify-center md:hidden">
            <span className="text-center text-lg font-bold tracking-tight text-[#E53935]">
              Shakthi Thattuvadaset
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map(({ to, label }) => {
              const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
              return (
                <Link
                  key={to}
                  to={to}
                  className={`relative text-sm font-medium transition-colors ${
                    isActive ? 'text-[#E53935]' : 'text-gray-600 hover:text-[#E53935]'
                  }`}
                >
                  {label}
                  {isActive && (
                    <motion.span
                      layoutId="navbar-underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#E53935]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile: Search only | Desktop: Cart + Profile */}
          <div className="flex w-1/3 items-center justify-end gap-2 md:w-auto md:gap-4">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex items-center justify-center rounded-xl p-2.5 text-gray-700 hover:bg-gray-100 md:hidden"
              aria-label="Search products"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <Link
              to="/cart"
              className="relative hidden items-center justify-center rounded-xl bg-[#E53935] p-2.5 text-white transition-transform hover:scale-105 active:scale-95 md:flex"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#FFD54F] text-xs font-bold text-[#C62828]"
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </motion.span>
              )}
            </Link>
            <Link
              to="/profile"
              className="hidden rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-[#E53935] hover:text-[#E53935] md:block"
            >
              Profile
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Mobile drawer - full-height clean panel */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setDrawerOpen(false)}
              aria-hidden
            />
            <motion.aside
              className="fixed left-0 top-0 z-61 flex h-full w-[min(300px,88vw)] flex-col bg-white md:hidden"
              style={{
                paddingTop: 'env(safe-area-inset-top)',
                paddingBottom: 'env(safe-area-inset-bottom)',
                boxShadow: '4px 0 24px rgba(0,0,0,0.12)',
              }}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              aria-modal
              aria-label="Navigation menu"
            >
              <div className="flex h-14 shrink-0 items-center justify-between border-b border-gray-100 px-4">
                <span className="text-sm font-semibold uppercase tracking-wider text-gray-500">Menu</span>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="-mr-1 flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                  aria-label="Close menu"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <nav className="flex flex-1 flex-col overflow-y-auto py-2">
                {navLinks.map(({ to, label }) => {
                  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
                  return (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setDrawerOpen(false)}
                      className={`mx-2 rounded-xl px-4 py-3.5 text-base font-medium transition-colors ${
                        isActive
                          ? 'bg-accent-soft text-primary'
                          : 'text-gray-700 active:bg-gray-50'
                      }`}
                    >
                      {label}
                    </Link>
                  );
                })}
                <div className="my-2 border-t border-gray-100" />
                <Link
                  to="/cart"
                  onClick={() => setDrawerOpen(false)}
                  className="mx-2 flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium text-gray-700 transition-colors active:bg-gray-50"
                >
                  <span>Cart</span>
                  {totalItems > 0 ? (
                    <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-white">
                      {totalItems}
                    </span>
                  ) : null}
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setDrawerOpen(false)}
                  className="mx-2 rounded-xl px-4 py-3.5 text-base font-medium text-gray-700 transition-colors active:bg-gray-50"
                >
                  Profile
                </Link>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Mobile search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-black/40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
            />
            <motion.div
              className="fixed left-0 right-0 top-0 z-[61] bg-white p-4 pt-6 md:hidden"
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-3 focus:border-[#E53935] focus:outline-none focus:ring-2 focus:ring-[#E53935]/20"
                  autoFocus
                />
                <button
                  type="submit"
                  className="rounded-xl bg-[#E53935] px-4 py-3 font-medium text-white"
                >
                  Search
                </button>
              </form>
              <p className="mt-2 text-sm text-gray-500">
                Search and filter products on the Shop page
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
