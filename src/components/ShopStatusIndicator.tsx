import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface ShopStatus {
  is_open: boolean;
  message: string;
  is_auto_closed: boolean;
}

export function ShopStatusIndicator() {
  const [status, setStatus] = useState<ShopStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    fetchShopStatus();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('shop_status_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shop_status'
        },
        () => {
          fetchShopStatus();
        }
      )
      .subscribe();

    return () => {
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const fetchShopStatus = async () => {
    if (!supabase) return;
    
    try {
      const { data, error } = await supabase.rpc('get_current_shop_status');
      
      if (error) {
        console.error('Error fetching shop status:', error);
        return;
      }

      if (data && data.length > 0) {
        setStatus(data[0]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-2">
        <div className="h-6 w-32 animate-pulse rounded-full bg-gray-200" />
      </div>
    );
  }

  if (!status) {
    return null;
  }

  const isOpen = status.is_open;
  const isAutoClosed = status.is_auto_closed;

  return (
    <div className="flex justify-center py-2">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          scale: isOpen ? [1, 1.05, 1] : [1, 0.95, 1]
        }}
        transition={{ 
          duration: 0.5,
          scale: {
            duration: 2,
            repeat: isOpen ? Infinity : 0,
            repeatType: "reverse"
          }
        }}
        className={`
          relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium
          shadow-lg backdrop-blur-sm transition-all duration-300
          ${isOpen 
            ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 text-green-800' 
            : 'bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-400/30 text-red-800'
          }
        `}
      >
        {/* Glow effect */}
        {isOpen && (
          <motion.div
            className="absolute inset-0 rounded-full bg-green-400/20 blur-md"
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}

        {/* Status text */}
        <span className="relative z-10">
          {status.message.replace('🟢 ', '').replace('🔴 ', '')}
        </span>

        {/* Auto-close indicator */}
        {isAutoClosed && (
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 text-xs opacity-75"
          >
            (Auto)
          </motion.span>
        )}

        {/* Subtle border animation */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent"
          animate={isOpen ? {
            borderColor: ['rgba(34, 197, 94, 0.3)', 'rgba(34, 197, 94, 0.6)', 'rgba(34, 197, 94, 0.3)'],
          } : {
            borderColor: ['rgba(239, 68, 68, 0.3)', 'rgba(239, 68, 68, 0.6)', 'rgba(239, 68, 68, 0.3)'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </div>
  );
}
