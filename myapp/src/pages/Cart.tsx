import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

export function Cart() {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12"
      >
        <div className="mb-6 rounded-full bg-[#FFF8E1] p-6">
          <svg className="h-16 w-16 text-[#E53935]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h2 className="mb-2 text-xl font-bold text-gray-900">Your cart is empty</h2>
        <p className="mb-6 text-gray-500">Add delicious items from our menu!</p>
        <Link
          to="/shop"
          className="rounded-xl bg-[#E53935] px-6 py-3 font-semibold text-white"
        >
          Browse Shop
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-3xl px-4 py-6 pb-36 md:py-10 md:pb-12"
    >
      <h1 className="mb-6 text-xl font-bold text-gray-900 md:mb-8 md:text-2xl">
        Cart ({totalItems})
      </h1>

      <div className="space-y-4">
        {items.map(({ product, quantity }) => (
          <motion.div
            key={product.id}
            layout
            className="flex gap-3 rounded-2xl bg-white p-3 shadow-lg md:gap-4 md:p-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-20 w-20 shrink-0 rounded-xl object-cover md:h-28 md:w-28"
            />
            <div className="flex min-w-0 flex-1 flex-col">
              <h3 className="truncate text-base font-semibold text-gray-900 md:text-lg">
                {product.name}
              </h3>
              <p className="mt-0.5 text-sm font-semibold text-[#E53935] md:text-base">
                ₹{product.price}
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex items-center rounded-xl border border-gray-200 bg-gray-50">
                  <button
                    type="button"
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-l-xl text-lg text-gray-600 active:bg-gray-200"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="min-w-[2rem] text-center text-sm font-medium">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-r-xl text-lg text-gray-600 active:bg-gray-200"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(product.id)}
                  className="shrink-0 text-sm font-medium text-red-600 active:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sticky Checkout - Mobile: above bottom nav */}
      <div className="fixed bottom-20 left-0 right-0 z-40 border-t border-gray-200 bg-white px-4 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] md:static md:bottom-auto md:mt-10 md:rounded-2xl md:border md:border-gray-100 md:px-6 md:py-6 md:shadow-lg">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs text-gray-500 md:text-sm">Total</p>
            <p className="text-xl font-bold text-[#E53935] md:text-2xl">
              ₹{totalPrice}
            </p>
          </div>
          <Link
            to="/checkout"
            className="shrink-0 rounded-xl bg-[#E53935] px-6 py-3.5 text-center font-semibold text-white shadow-lg active:scale-[0.98] md:px-8"
          >
            Checkout
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
