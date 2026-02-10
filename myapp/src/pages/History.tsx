import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function History() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-2xl px-4 py-8 md:py-12"
    >
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Order History</h1>
      <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-4 rounded-full bg-[#FFF8E1] p-6">
          <svg className="h-12 w-12 text-[#FFD54F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="mb-2 text-center font-medium text-gray-700">No orders yet</p>
        <p className="mb-6 text-center text-sm text-gray-500">Your order history will appear here after you place orders.</p>
        <Link
          to="/shop"
          className="rounded-xl bg-[#E53935] px-6 py-3 font-semibold text-white"
        >
          Start Ordering
        </Link>
      </div>
    </motion.div>
  );
}
