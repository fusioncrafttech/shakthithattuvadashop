import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: DashboardIcon },
  { to: '/admin/products', label: 'Products', icon: ProductIcon },
  { to: '/admin/categories', label: 'Categories', icon: CategoryIcon },
  { to: '/admin/banners', label: 'Offer Banners', icon: BannerIcon },
  { to: '/admin/gallery', label: 'Gallery', icon: GalleryIcon },
  { to: '/admin/orders', label: 'Orders', icon: OrderIcon },
  { to: '/admin/users', label: 'Users', icon: UserIcon },
];

function DashboardIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}
function ProductIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}
function CategoryIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  );
}
function BannerIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}
function GalleryIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}
function OrderIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  embedded?: boolean;
}

export function AdminSidebar({ collapsed, onToggle, embedded }: AdminSidebarProps) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed && !embedded ? 72 : embedded ? '100%' : 260 }}
      transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      className={`flex h-full flex-col border-r border-gray-200/80 bg-white shadow-xl ${embedded ? 'w-full' : 'fixed left-0 top-0 z-40 h-screen'}`}
    >
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-100 px-4">
        {(embedded || !collapsed) && (
          <motion.span
            initial={embedded ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            className="truncate text-lg font-bold tracking-tight text-[#E53935]"
          >
            Shakthi Admin
          </motion.span>
        )}
        <button
          type="button"
          onClick={onToggle}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          aria-label={embedded ? 'Close menu' : collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {embedded ? (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              className={`h-5 w-5 transition-transform ${collapsed ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          )}
        </button>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/admin'}
            onClick={embedded ? onToggle : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#E53935] text-white shadow-lg shadow-[#E53935]/25'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10">
              <Icon />
            </span>
            {(embedded || !collapsed) && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-gray-100 p-3">
        <a
          href="/"
          className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </span>
          {(embedded || !collapsed) && <span>Back to Store</span>}
        </a>
      </div>
    </motion.aside>
  );
}
