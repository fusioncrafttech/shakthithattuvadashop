import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { fetchCategoryAddons } from '../lib/admin-data';
import type { Product, CategoryAddon } from '../types';

interface CustomizationModalProps {
  product: Product;
  categorySlug: string;
  onClose: () => void;
}

export function CustomizationModal({ product, categorySlug, onClose }: CustomizationModalProps) {
  const { addItem } = useCart();
  const [addons, setAddons] = useState<CategoryAddon[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<CategoryAddon[]>([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  // Special case: 90's Kids Special and Bun Varieties - no customization
  const shouldSkipCustomization = categorySlug === '90s-kid-special' || categorySlug === 'bun';

  useEffect(() => {
    if (shouldSkipCustomization) {
      // This should not happen as we handle this in ProductCard/ProductModal
      // But as a fallback, add directly to cart and close
      addItem(product);
      setAdded(true);
      setTimeout(() => {
        onClose();
      }, 1000);
      return;
    }

    const loadAddons = async () => {
      try {
        const categoryAddons = await fetchCategoryAddons(product.categoryId);
        setAddons(categoryAddons);
      } catch (error) {
        console.error('Failed to load addons:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAddons();
  }, [product.categoryId, shouldSkipCustomization, addItem, product, onClose]);

  const handleAddonToggle = (addon: CategoryAddon) => {
    setSelectedAddons(prev => {
      const isSelected = prev.some(a => a.id === addon.id);
      if (isSelected) {
        return prev.filter(a => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  const calculateTotal = () => {
    const addonTotal = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
    return product.price + addonTotal;
  };

  const handleAddToCart = () => {
    addItem(product, 1, selectedAddons);
    setAdded(true);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  if (shouldSkipCustomization) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          onClick={(e) => e.stopPropagation()}
          className="rounded-2xl bg-white p-6 shadow-2xl"
        >
          <div className="text-center">
            <div className="mb-4 text-2xl">✨</div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              {product.name} added to cart!
            </h3>
            <p className="text-gray-600">No customization needed for this special item.</p>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4"
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-h-[90vh] sm:rounded-3xl"
      >
        {/* Header with image */}
        <div className="relative h-[28vh] min-h-[160px] shrink-0 overflow-hidden bg-gray-100 sm:aspect-4/3 sm:h-auto">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md backdrop-blur-sm touch-manipulation"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div
          className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-5 sm:pb-5"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <h2 className="text-xl font-bold leading-tight text-gray-900 sm:text-2xl">
            {product.name}
          </h2>
          
          <div className="mt-3">
            <p className="text-sm font-medium text-gray-500">Base Price</p>
            <p className="text-lg font-bold text-[#E53935]">₹{product.price}</p>
          </div>

          {/* Customization Section */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900">Customize Your Order</h3>
            <p className="mt-1 text-sm text-gray-600">Select add-ons (multiple allowed)</p>
            
            {loading ? (
              <div className="mt-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-200" />
                ))}
              </div>
            ) : addons.length > 0 ? (
              <div className="mt-4 space-y-3">
                {addons.map((addon) => {
                  const isSelected = selectedAddons.some(a => a.id === addon.id);
                  return (
                    <motion.div
                      key={addon.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAddonToggle(addon)}
                      className={`flex cursor-pointer items-center justify-between rounded-xl border-2 p-3 transition-all ${
                        isSelected
                          ? 'border-[#E53935] bg-[#FFF8E1]'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded border-2 ${
                            isSelected
                              ? 'border-[#E53935] bg-[#E53935]'
                              : 'border-gray-300 bg-white'
                          }`}
                        >
                          {isSelected && (
                            <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className="font-medium text-gray-900">{addon.addonName}</span>
                      </div>
                      <span className="font-semibold text-[#E53935]">+₹{addon.price}</span>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <p className="mt-4 text-center text-gray-500">No add-ons available for this category</p>
            )}
          </div>

          {/* Price Summary */}
          <div className="mt-6 rounded-xl bg-gray-50 p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Base Price</span>
                <span className="font-medium">₹{product.price}</span>
              </div>
              {selectedAddons.length > 0 && (
                <>
                  {selectedAddons.map((addon) => (
                    <div key={addon.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{addon.addonName}</span>
                      <span className="font-medium">+₹{addon.price}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-bold text-[#E53935]">₹{calculateTotal()}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col gap-3 sm:mt-6">
            <motion.button
              type="button"
              onClick={handleAddToCart}
              className="w-full rounded-xl bg-[#E53935] py-3.5 font-semibold text-white transition-colors hover:bg-[#C62828] active:bg-[#B71C1C] touch-manipulation sm:py-4"
              whileTap={{ scale: 0.98 }}
            >
              {added ? 'Added to cart ✓' : `Add to Cart • ₹${calculateTotal()}`}
            </motion.button>
            
            {!added && (
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] py-2 text-center text-sm text-gray-500 underline decoration-gray-400 underline-offset-2 touch-manipulation sm:min-h-0 sm:py-0"
              >
                Continue shopping
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
