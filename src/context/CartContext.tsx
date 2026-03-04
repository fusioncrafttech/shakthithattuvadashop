import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Product, CartItem, CategoryAddon } from '../types';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, selectedAddons?: CategoryAddon[]) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  totalItems: number;
  totalPrice: number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((product: Product, quantity = 1, selectedAddons: CategoryAddon[] = []) => {
    const addonTotal = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
    const totalPrice = product.price + addonTotal;
    
    setItems((prev) => {
      const existing = prev.find((i) => 
        i.product.id === product.id && 
        JSON.stringify(i.selectedAddons?.map(a => a.id) || []) === JSON.stringify(selectedAddons.map(a => a.id))
      );
      
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id && 
          JSON.stringify(i.selectedAddons?.map(a => a.id) || []) === JSON.stringify(selectedAddons.map(a => a.id))
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      
      return [...prev, { product, quantity, selectedAddons, totalPrice }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + (i.totalPrice || i.product.price) * i.quantity, 0);

  const clearCart = useCallback(() => setItems([]), []);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        totalItems,
        totalPrice,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
