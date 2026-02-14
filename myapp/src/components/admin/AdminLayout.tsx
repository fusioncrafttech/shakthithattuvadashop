import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminSidebar } from './AdminSidebar';
import { AdminNavbar } from './AdminNavbar';

export function AdminLayout() {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50/80">
      {/* Desktop only: fixed sidebar */}
      <div className="fixed left-0 top-0 z-40 hidden h-screen lg:block">
        <AdminSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((c) => !c)}
        />
      </div>

      {/* Mobile: overlay drawer with full nav (Dashboard, Products, etc.) */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
              aria-hidden
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed left-0 top-0 z-[61] flex h-full w-[min(300px,85vw)] flex-col bg-white shadow-2xl lg:hidden"
              role="dialog"
              aria-label="Admin menu"
            >
              <AdminSidebar
                collapsed={false}
                onToggle={() => setMobileSidebarOpen(false)}
                embedded
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content: full width on mobile, offset on desktop */}
      <div
        className={`flex min-h-screen flex-col transition-[margin] duration-300 ${
          sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]'
        }`}
      >
        <AdminNavbar
          sidebarCollapsed={sidebarCollapsed}
          onMenuClick={() => setMobileSidebarOpen((o) => !o)}
        />
        <main className="min-w-0 flex-1 overflow-auto px-4 pb-8 pt-4 lg:px-8 lg:pt-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mx-auto w-full max-w-7xl"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
