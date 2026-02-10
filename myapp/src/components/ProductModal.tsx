import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

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
        {/* Image: shorter on mobile so content is visible */}
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
        {/* Content: scrollable with safe area on mobile */}
        <div
          className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-5 sm:pb-5"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <h2 className="text-xl font-bold leading-tight text-gray-900 sm:text-2xl">
            {product.name}
          </h2>
          <p className="mt-2 text-sm leading-snug text-gray-600 sm:text-base">
            {product.description}
          </p>
          <p className="mt-3 text-lg font-bold text-primary sm:text-xl">
            ₹{product.price}
          </p>
          <div className="mt-5 flex flex-col gap-4 sm:mt-6">
            <motion.button
              type="button"
              onClick={handleAddToCart}
              className="w-full rounded-xl bg-primary py-3.5 font-semibold text-white transition-colors hover:bg-primary-dark active:bg-[#B71C1C] touch-manipulation sm:py-4"
              whileTap={{ scale: 0.98 }}
            >
              {added ? 'Added to cart ✓' : 'Add to Cart'}
            </motion.button>
            {added && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-sm font-medium text-green-600"
              >
                Item added. You can add more or close.
              </motion.p>
            )}
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] py-2 text-center text-sm text-gray-500 underline decoration-gray-400 underline-offset-2 touch-manipulation sm:min-h-0 sm:py-0"
            >
              Continue shopping
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
