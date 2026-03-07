import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface OrderItem {
  product_id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  subtotal: number;
}

interface Order {
  id: string;
  user_email: string;
  user_name: string;
  status: 'pending' | 'preparing' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
  delivery_name: string;
  delivery_mobile: string;
  delivery_address: string;
  created_at: string;
  updated_at: string;
}

export function History() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user || !supabase) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'preparing':
        return 'Preparing';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mx-auto max-w-2xl px-4 py-8 md:py-12"
      >
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#E53935] border-t-transparent"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mx-auto max-w-2xl px-4 py-8 md:py-12"
      >
        <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-2xl bg-white p-8 shadow-lg">
          <p className="mb-4 text-gray-600">Please sign in to view your order history.</p>
        </div>
      </motion.div>
    );
  }

  if (orders.length === 0) {
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-2xl px-4 py-8 md:py-12"
    >
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Order History</h1>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-white p-6 shadow-lg"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Order ID</p>
                <p className="font-mono text-sm text-gray-600">{order.id}</p>
              </div>
              <div className="text-right">
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-900">Order Date</p>
              <p className="text-sm text-gray-600">
                {new Date(order.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            <div className="mb-4 space-y-2">
              <p className="text-sm font-medium text-gray-900">Items</p>
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-700">{item.product_name} × {item.quantity}</span>
                  <span className="text-gray-900">₹{item.subtotal}</span>
                </div>
              ))}
            </div>

            <div className="mb-4 border-t border-gray-200 pt-4">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-lg font-bold text-[#E53935]">₹{order.total}</span>
              </div>
            </div>

            <div className="mb-4 space-y-1">
              <p className="text-sm font-medium text-gray-900">Delivery Details</p>
              <p className="text-sm text-gray-600">{order.delivery_name}</p>
              <p className="text-sm text-gray-600">{order.delivery_mobile}</p>
              <p className="text-sm text-gray-600">{order.delivery_address}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
