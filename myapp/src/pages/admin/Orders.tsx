import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchOrders, updateOrderStatus } from '../../lib/admin-data';
import { exportOrdersToCsv, exportOrdersToPdf } from '../../lib/export-orders';
import type { Order, OrderStatus } from '../../types';
import { DataTable, type Column } from '../../components/admin/DataTable';
import { SkeletonTableRows } from '../../components/admin/SkeletonCard';

const statusOptions: OrderStatus[] = ['pending', 'preparing', 'delivered', 'cancelled'];

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) setExportOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const load = () => {
    setLoading(true);
    fetchOrders({
      from: dateFrom || undefined,
      to: dateTo || undefined,
      status: statusFilter || undefined,
    })
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [dateFrom, dateTo, statusFilter]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (detailOrder?.id === orderId) setDetailOrder((d) => (d ? { ...d, status: newStatus } : null));
    } catch (e) {
      console.error(e);
    }
  };

  const columns: Column<Order>[] = [
    {
      key: 'id',
      header: 'Order ID',
      render: (r) => (
        <span className="font-mono text-xs text-gray-700">#{r.id.slice(-8)}</span>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (r) => (
        <div>
          <p className="font-medium">{r.user_name ?? r.user_email ?? r.user_id}</p>
          {r.user_email && (
            <p className="text-xs text-gray-500">{r.user_email}</p>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <select
          value={r.status}
          onChange={(e) => handleStatusChange(r.id, e.target.value as OrderStatus)}
          className={`rounded-xl border-0 px-2.5 py-1 text-xs font-medium focus:ring-2 focus:ring-[#E53935]/30 ${
            r.status === 'pending'
              ? 'bg-amber-100 text-amber-800'
              : r.status === 'preparing'
                ? 'bg-blue-100 text-blue-800'
                : r.status === 'delivered'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600'
          }`}
        >
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      ),
    },
    { key: 'total', header: 'Amount', render: (r) => `₹${r.total}` },
    {
      key: 'created_at',
      header: 'Date',
      render: (r) => new Date(r.created_at).toLocaleString(),
    },
    {
      key: 'action',
      header: '',
      render: (r) => (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={() => setDetailOrder(r)}
          className="rounded-xl bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          View
        </motion.button>
      ),
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Orders</h1>
        <p className="mt-1 text-gray-500">Manage and track orders</p>
      </div>

      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-lg">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#E53935] focus:outline-none focus:ring-2 focus:ring-[#E53935]/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">To</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#E53935] focus:outline-none focus:ring-2 focus:ring-[#E53935]/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#E53935] focus:outline-none focus:ring-2 focus:ring-[#E53935]/20"
          >
            <option value="">All</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={load}
          className="rounded-xl bg-[#E53935] px-4 py-2 text-sm font-semibold text-white"
        >
          Apply
        </motion.button>

        <div className="relative ml-auto" ref={exportRef}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => setExportOpen((o) => !o)}
            disabled={orders.length === 0}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </motion.button>
          <AnimatePresence>
            {exportOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute right-0 top-full z-50 mt-2 min-w-[180px] rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
              >
                <button
                  type="button"
                  onClick={() => {
                    exportOrdersToCsv(orders);
                    setExportOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  <span className="text-green-600">CSV</span>
                  Download as CSV
                </button>
                <button
                  type="button"
                  onClick={() => {
                    exportOrdersToPdf(orders);
                    setExportOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  <span className="text-red-600">PDF</span>
                  Download as PDF
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {loading ? (
        <SkeletonTableRows rows={5} />
      ) : (
        <DataTable
          columns={columns}
          data={orders}
          keyExtractor={(r) => r.id}
          emptyMessage="No orders found"
        />
      )}

      <AnimatePresence>
        {detailOrder && (
          <>
            <div
              className="fixed inset-0 z-[100] bg-black/50"
              onClick={() => setDetailOrder(null)}
              aria-hidden
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed right-0 top-0 z-[101] h-full w-full max-w-md overflow-y-auto border-l border-gray-200 bg-white shadow-2xl"
            >
              <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
                <h2 className="text-lg font-bold text-gray-900">
                  Order #{detailOrder.id.slice(-8)}
                </h2>
                <button
                  type="button"
                  onClick={() => setDetailOrder(null)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4 p-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <select
                    value={detailOrder.status}
                    onChange={(e) =>
                      handleStatusChange(detailOrder.id, e.target.value as OrderStatus)
                    }
                    className="mt-1 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Customer</p>
                  <p className="mt-1 font-medium">{detailOrder.user_name ?? detailOrder.user_email}</p>
                  {detailOrder.delivery_name && (
                    <>
                      <p className="mt-2 text-sm text-gray-500">Delivery</p>
                      <p>{detailOrder.delivery_name}</p>
                      <p>{detailOrder.delivery_mobile}</p>
                      <p className="text-sm">{detailOrder.delivery_address}</p>
                    </>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Items</p>
                  <ul className="mt-2 space-y-2">
                    {detailOrder.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex justify-between rounded-xl bg-gray-50 px-3 py-2 text-sm"
                      >
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <span>₹{item.price * item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border-t border-gray-200 pt-4 text-lg font-bold text-[#E53935]">
                  Total: ₹{detailOrder.total}
                </div>
                <p className="text-xs text-gray-500">
                  {new Date(detailOrder.created_at).toLocaleString()}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
