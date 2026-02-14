import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getDashboardStats } from '../../lib/admin-data';
import { DataTable, type Column } from '../../components/admin/DataTable';
import { SkeletonCard } from '../../components/admin/SkeletonCard';
import type { Order } from '../../types';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export function AdminDashboard() {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof getDashboardStats>> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const orderColumns: Column<Order>[] = [
    { key: 'id', header: 'Order ID', render: (r) => <span className="font-mono text-xs">#{r.id.slice(-6)}</span> },
    { key: 'user_email', header: 'Customer', render: (r) => r.user_email ?? r.user_id },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'total', header: 'Amount', render: (r) => `₹${r.total}` },
    { key: 'created_at', header: 'Date', render: (r) => new Date(r.created_at).toLocaleDateString() },
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Dashboard</h1>
          <p className="mt-1 text-gray-500">Overview of your store</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <SkeletonCard className="h-64" />
        <SkeletonCard className="h-48" />
      </div>
    );
  }

  const s = stats!;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Dashboard</h1>
        <p className="mt-1 text-gray-500">Overview of Shakthi Thattuvadaset Corner</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={item}>
          <StatCard
            title="Total Revenue"
            value={`₹${s.totalRevenue.toLocaleString()}`}
            sub="Last 7 days"
            icon={<RevenueIcon />}
            accent="primary"
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard
            title="Today's Orders"
            value={String(s.todayOrders)}
            sub="Orders today"
            icon={<OrderIcon />}
            accent="yellow"
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard
            title="Total Products"
            value={String(s.totalProducts)}
            sub="In catalog"
            icon={<ProductIcon />}
            accent="gray"
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard
            title="Low Stock"
            value={String(s.lowStockCount)}
            sub="Need restock"
            icon={<AlertIcon />}
            accent={s.lowStockCount > 0 ? 'danger' : 'gray'}
          />
        </motion.div>
      </div>

      <motion.div variants={item} className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Sales (Last 7 days)</h2>
        <div className="flex h-48 items-end gap-2">
          {s.salesByDay.map((d, i) => {
            const maxTotal = Math.max(1, ...s.salesByDay.map((x) => x.total));
            return (
            <motion.div
              key={d.date ?? i}
              initial={{ height: 0 }}
              animate={{
                height: `${Math.max(8, (d.total / maxTotal) * 100)}%`,
              }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="flex flex-1 flex-col items-center gap-1 rounded-t-xl bg-[#E53935]/10"
            >
              <span className="mt-1 text-xs font-medium text-[#E53935]">
                ₹{d.total}
              </span>
              <div
                className="w-full rounded-t-xl bg-[#E53935]"
                style={{ height: '100%', minHeight: 4 }}
              />
            </motion.div>
            );
          })}
        </div>
        <div className="mt-2 flex justify-between text-xs text-gray-500">
          {s.salesByDay.map((d, i) => (
            <span key={d.date ?? i}>
              {d.date
                ? new Date(d.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                  })
                : d.day}
            </span>
          ))}
        </div>
      </motion.div>

      <motion.div variants={item}>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Orders</h2>
        <DataTable
          columns={orderColumns}
          data={s.recentOrders}
          keyExtractor={(r) => r.id}
          emptyMessage="No orders yet"
        />
      </motion.div>
    </motion.div>
  );
}

function StatCard({
  title,
  value,
  sub,
  icon,
  accent,
}: {
  title: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  accent: 'primary' | 'yellow' | 'gray' | 'danger';
}) {
  const bg =
    accent === 'primary'
      ? 'bg-[#E53935]/10 text-[#E53935]'
      : accent === 'yellow'
        ? 'bg-[#FFD54F]/20 text-amber-700'
        : accent === 'danger'
          ? 'bg-red-100 text-red-700'
          : 'bg-gray-100 text-gray-700';
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-lg transition-shadow hover:shadow-xl"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
          <p className="mt-0.5 text-xs text-gray-400">{sub}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${bg}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

function RevenueIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
function OrderIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );
}
function ProductIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}
function AlertIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

function StatusBadge({ status }: { status: Order['status'] }) {
  const styles: Record<Order['status'], string> = {
    pending: 'bg-amber-100 text-amber-800',
    preparing: 'bg-blue-100 text-blue-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${styles[status]}`}>
      {status}
    </span>
  );
}
