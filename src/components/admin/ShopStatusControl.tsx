import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

interface ShopStatus {
  id: string;
  is_open: boolean;
  message: string;
  auto_close_thursday: boolean;
  manual_override: boolean;
  updated_at: string;
}

export function ShopStatusControl() {
  const [status, setStatus] = useState<ShopStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState('');
  const { user } = useAuth();

  // Predefined message options
  const openMessages = [
    '🟢 Shop Open – Fresh Thattu Vada Available Today',
    '🟢 Now Open – Serving Hot & Fresh',
    '🟢 Shop Open – Order Your Favorites Now',
    '🟢 Open Today – Delicious Vadas Waiting'
  ];

  const closedMessages = [
    '🔴 Shop Closed Today – Orders will resume tomorrow',
    '🔴 Currently Closed – Will Open Soon',
    '🔴 Closed for Today – See You Tomorrow',
    '🔴 Shop Closed – Thank You for Your Patience'
  ];

  useEffect(() => {
    fetchShopStatus();
  }, []);

  const fetchShopStatus = async () => {
    if (!supabase) return;
    
    try {
      const { data, error } = await supabase
        .from('shop_status')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching shop status:', error);
        return;
      }

      if (data && data.length > 0) {
        setStatus(data[0]);
        setSelectedMessage(data[0].message);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateShopStatus = async (updates: Partial<ShopStatus>) => {
    if (!supabase || !status || !user) return;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('shop_status')
        .update({
          ...updates,
          updated_by: user.id
        })
        .eq('id', status.id);

      if (error) {
        console.error('Error updating shop status:', error);
        return;
      }

      // Refetch status to get latest
      await fetchShopStatus();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setUpdating(false);
    }
  };

  const toggleShopStatus = () => {
    if (!status) return;
    
    const newStatus = !status.is_open;
    const defaultMessage = newStatus 
      ? '🟢 Shop Open – Fresh Thattu Vada Available Today'
      : '🔴 Shop Closed Today – Orders will resume tomorrow';

    updateShopStatus({
      is_open: newStatus,
      message: selectedMessage || defaultMessage
    });
  };

  const updateMessage = () => {
    if (!status) return;
    updateShopStatus({ message: selectedMessage });
  };

  const toggleAutoCloseThursday = () => {
    if (!status) return;
    updateShopStatus({ auto_close_thursday: !status.auto_close_thursday });
  };

  const toggleManualOverride = () => {
    if (!status) return;
    updateShopStatus({ manual_override: !status.manual_override });
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xl">
        <div className="animate-pulse">
          <div className="h-6 w-32 rounded bg-gray-200 mb-4" />
          <div className="space-y-3">
            <div className="h-10 rounded bg-gray-200" />
            <div className="h-20 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="rounded-3xl border border-red-100 bg-red-50 p-6 text-center text-red-600">
        <p>Unable to load shop status</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xl"
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Shop Status Control</h2>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          status.is_open 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {status.is_open ? 'OPEN' : 'CLOSED'}
        </div>
      </div>

      {/* Main Status Toggle */}
      <div className="mb-6">
        <label className="mb-3 block text-sm font-medium text-gray-700">
          Shop Status
        </label>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={toggleShopStatus}
          disabled={updating}
          className={`
            relative w-full rounded-2xl p-4 font-medium transition-all
            ${status.is_open
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25'
              : 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/25'
            }
            ${updating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl">{status.is_open ? '🟢' : '🔴'}</span>
            <span className="text-lg">
              {status.is_open ? 'Shop is Open' : 'Shop is Closed'}
            </span>
          </div>
          {updating && (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/20">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            </div>
          )}
        </motion.button>
      </div>

      {/* Status Message Selector */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Status Message
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={selectedMessage}
            onChange={(e) => setSelectedMessage(e.target.value)}
            className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-[#E53935] focus:outline-none focus:ring-1 focus:ring-[#E53935] bg-white min-h-10"
          >
            <option value="">Select a message...</option>
            {(status?.is_open ? openMessages : closedMessages).map((message) => (
              <option key={message} value={message}>
                {message}
              </option>
            ))}
          </select>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={updateMessage}
            disabled={updating || !selectedMessage.trim()}
            className="rounded-xl bg-[#E53935] px-4 py-2 text-white font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed min-h-10 whitespace-nowrap"
          >
            Update
          </motion.button>
        </div>
      </div>

      {/* Settings */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-gray-200 p-4 gap-3">
          <div>
            <p className="font-medium text-gray-900">Auto-close on Thursdays</p>
            <p className="text-sm text-gray-500">Automatically close shop every Thursday</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleAutoCloseThursday}
            disabled={updating}
            className={`
              relative h-6 w-11 rounded-full transition-colors shrink-0
              ${status.auto_close_thursday ? 'bg-[#E53935]' : 'bg-gray-300'}
            `}
          >
            <motion.div
              animate={{ x: status.auto_close_thursday ? 20 : 2 }}
              className="absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm"
            />
          </motion.button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-gray-200 p-4 gap-3">
          <div>
            <p className="font-medium text-gray-900">Manual Override</p>
            <p className="text-sm text-gray-500">Override automatic Thursday closing</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleManualOverride}
            disabled={updating}
            className={`
              relative h-6 w-11 rounded-full transition-colors shrink-0
              ${status.manual_override ? 'bg-[#E53935]' : 'bg-gray-300'}
            `}
          >
            <motion.div
              animate={{ x: status.manual_override ? 20 : 2 }}
              className="absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm"
            />
          </motion.button>
        </div>
      </div>

      {/* Last Updated */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Last updated: {new Date(status.updated_at).toLocaleString()}
        </p>
      </div>
    </motion.div>
  );
}
