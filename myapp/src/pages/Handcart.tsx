import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HandcartSVG } from '../components/HandcartSVG';
import { fetchProducts, fetchCategories } from '../lib/admin-data';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';

const NINETIES_CATEGORY_SLUG = '90s-kid-special';

// Optional: add your poster image to public folder (e.g. public/poster.jpg), then set posterImage to '/poster.jpg'
const posterImage: string | undefined = '/handcartposter.jpg';

export default function Handcart() {
  const { addItem } = useCart();
  const [animationPhase, setAnimationPhase] = useState<'enter' | 'idle' | 'exit'>('enter');
  const [showBanner, setShowBanner] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState<string | null>(null);

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
    setAddedFeedback(product.name);
    setTimeout(() => setAddedFeedback(null), 2000);
  };

  useEffect(() => {
    const t = setTimeout(() => setAnimationPhase('idle'), 3200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!showBanner || products.length > 0) return;
    setLoading(true);
    Promise.all([fetchProducts(), fetchCategories()])
      .then(([allProducts, categories]) => {
        const ninetiesCategory = categories.find((c) => c.slug === NINETIES_CATEGORY_SLUG);
        const categoryId = ninetiesCategory?.id;
        const filtered = categoryId
          ? allProducts.filter((p) => p.categoryId === categoryId)
          : allProducts;
        setProducts(filtered);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [showBanner, products.length]);

  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col overflow-hidden font-sans bg-gradient-to-b from-gray-50 via-white to-orange-50/30">
      {/* Hero + Handcart - no scroll, fits viewport */}
      <section className="flex min-h-0 flex-1 flex-col px-4 pt-4 pb-2 md:px-6 md:pt-6 md:pb-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="shrink-0 text-center"
        >
          <h1 className="font-display text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            Welcome to{' '}
            <span className="text-primary">Shakthi Thattuvada Set Corner</span>
          </h1>
          <p className="mt-2 text-gray-600 md:text-lg">
            Fresh thattuvada & nostalgic bites, delivered with love.
          </p>
          <p className="text-gray-600 mt-2 leading-relaxed">
  உங்கள் 90’s கால Childhood Memories-ஐ மீண்டும் அனுபவிக்க, அந்த காலத்தின் Favourite Snacks & Chocolates இங்கே காத்திருக்கிறது.
</p>
        <h2 className="text-red-600 mt-2 leading-relaxed">Click the handcart to open 90's memories</h2>
        </motion.div>

        {/* Handcart animation container - takes remaining space, cart fits fully */}
        <div className="relative flex min-h-0 flex-1 items-center justify-center">
          <motion.div
            initial={{ x: -120, opacity: 0 }}
            animate={
              animationPhase === 'enter'
                ? { x: 0, opacity: 1 }
                : { x: 0, opacity: 1 }
            }
            transition={{
              duration: 2.8,
              ease: 'easeOut',
            }}
            className="flex h-full w-full max-w-2xl items-center justify-center px-2 sm:px-4"
          >
            <motion.div
              animate={
                animationPhase === 'idle'
                  ? { y: [0, -6, 0] }
                  : {}
              }
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              onClick={() => setShowBanner(true)}
              onKeyDown={(e) => e.key === 'Enter' && setShowBanner(true)}
              role="button"
              tabIndex={0}
              aria-label="Open special offers"
              className="h-full w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 rounded-2xl"
            >
              <HandcartSVG className="h-full w-full" posterImage={posterImage} />
            </motion.div>

            {(animationPhase === 'enter' || animationPhase === 'idle') && (
              <style>{`
                #LeftWheel, #RightWheel {
                  animation: handcart-wheel 2.8s ease-out forwards;
                }
                @keyframes handcart-wheel {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(720deg); }
                }
                #SerialLights circle:nth-child(odd) {
                  animation: handcart-blink-odd 1.4s ease-in-out infinite;
                }
                #SerialLights circle:nth-child(even) {
                  animation: handcart-blink-even 1.4s ease-in-out infinite;
                }
                @keyframes handcart-blink-odd {
                  0%, 100% { opacity: 1; } 50% { opacity: 0.35; }
                }
                @keyframes handcart-blink-even {
                  0%, 100% { opacity: 0.35; } 50% { opacity: 1; }
                }
              `}</style>
            )}
          </motion.div>
        </div>
      </section>

      {/* Banner popup - centered in middle of screen */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowBanner(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Banner header */}
              <div className="shrink-0 border-b border-gray-100 bg-gradient-to-r from-primary/10 to-accent/10 px-6 py-5 text-center">
                <h2 className="font-display text-2xl font-bold text-gray-900">
                  90's Memories
                </h2>
              </div>

              {/* Products grid */}
              <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                ) : products.length === 0 ? (
                  <p className="py-8 text-center text-gray-500">No products available.</p>
                ) : (
                  <>
                    <p className="text-center text-sm text-gray-500 mb-4">Tap an image to add to cart</p>
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 sm:gap-3">
                      {products.map((product, index) => (
                        <motion.button
                          key={product.id}
                          type="button"
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.04 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                          aria-label={`Add ${product.name} to cart`}
                          className="group relative rounded-xl overflow-hidden bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
                        >
                          <div className="aspect-square w-full max-w-[64px] sm:max-w-[72px] mx-auto overflow-hidden">
                            <img
                              src={product.image || ''}
                              alt={product.name}
                              className="h-full w-full object-cover pointer-events-none"
                            />
                          </div>
                          <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] sm:text-xs font-medium py-0.5 px-1 truncate">
                            {product.name}
                          </span>
                          <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30 group-active:bg-black/20">
                            <span className="opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 group-active:opacity-100 transition-all duration-200 flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary shadow-lg">
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </span>
                          </span>
                        </motion.button>
                      ))}
                    </div>
                    {/* Product added to cart toast */}
                    <AnimatePresence>
                      {addedFeedback && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.2 }}
                          className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] rounded-xl bg-green-500 text-white px-4 py-3 shadow-lg flex items-center gap-2"
                        >
                          <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="font-medium text-sm">Product added to cart</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
