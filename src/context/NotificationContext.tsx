import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { getDashboardStats, fetchOrders, fetchProducts } from '../lib/admin-data';
import type { Order, Product } from '../types';

export interface Notification {
  id: string;
  type: 'low_stock' | 'new_order';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  data?: any;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  removeNotification: (id: string) => void;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [lastOrderCount, setLastOrderCount] = useState<number>(0);
  const [lastLowStockCount, setLastLowStockCount] = useState<number>(0);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      read: false,
    };
    
    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep max 50 notifications
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const refreshNotifications = useCallback(async () => {
    try {
      const [stats, orders, products] = await Promise.all([
        getDashboardStats(),
        fetchOrders(),
        fetchProducts()
      ]);

      const currentOrderCount = orders.length;
      const currentLowStockCount = stats.lowStockCount;

      // Check for new orders
      if (lastOrderCount > 0 && currentOrderCount > lastOrderCount) {
        const newOrders = orders.slice(0, currentOrderCount - lastOrderCount);
        newOrders.forEach(order => {
          addNotification({
            type: 'new_order',
            title: 'New Order Received',
            message: `Order #${order.id.slice(-6)} from ${order.user_email || order.user_id} - ₹${order.total}`,
            data: order
          });
        });
      }

      // Check for low stock items
      if (currentLowStockCount > lastLowStockCount) {
        const lowStockProducts = products.filter(p => (p.stock ?? 0) > 0 && (p.stock ?? 0) < 10);
        const newLowStockItems = lowStockProducts.filter(p => 
          !notifications.some(n => n.type === 'low_stock' && n.data?.id === p.id)
        );
        
        newLowStockItems.forEach(product => {
          addNotification({
            type: 'low_stock',
            title: 'Low Stock Alert',
            message: `${product.name} is running low on stock (${product.stock} units left)`,
            data: product
          });
        });
      }

      setLastOrderCount(currentOrderCount);
      setLastLowStockCount(currentLowStockCount);

    } catch (error) {
      console.error('Failed to refresh notifications:', error);
    }
  }, [lastOrderCount, lastLowStockCount, notifications, addNotification]);

  // Initial load and periodic refresh
  useEffect(() => {
    refreshNotifications();

    const interval = setInterval(refreshNotifications, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [refreshNotifications]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearNotifications,
      removeNotification,
      refreshNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
