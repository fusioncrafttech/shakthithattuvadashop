import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { OfferBanner } from '../components/OfferBanner';
import { CategoryScroll } from '../components/CategoryScroll';
import { ProductCard } from '../components/ProductCard';
import { offerBanners } from '../data/offers';
import { fetchProducts, fetchCategories } from '../lib/admin-data';
import type { Product, Category } from '../types';

export function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchProducts(), fetchCategories()])
      .then(([p, c]) => {
        setProducts(p);
        setCategories(c);
      })
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, []);

  const popularProducts = products.filter((p) => p.isPopular || p.is_featured);
  const todaySpecials = products.filter((p) => p.isTodaySpecial);

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">
        <div className="rounded-2xl bg-red-50 p-4 text-red-700">{error}</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10"
    >
      {/* 1. Offer Banner Slider */}
      <section className="mb-10 md:mb-20">
        <OfferBanner offers={offerBanners} />
      </section>

      {/* 2. Categories Horizontal Scroll - from database */}
      <section className="mb-10 md:mb-20">
        <h2 className="mb-6 text-xl font-bold text-gray-900 md:text-2xl">Categories</h2>
        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-24 w-24 flex-shrink-0 animate-pulse rounded-2xl bg-gray-200" />
            ))}
          </div>
        ) : (
          <CategoryScroll categories={categories} />
        )}
      </section>

      {/* 3. Popular / Featured */}
      <section className="mb-10 md:mb-20">
        <h2 className="mb-6 text-xl font-bold text-gray-900 md:text-2xl">Popular Items</h2>
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-gray-200" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {popularProducts.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                showBadge="popular"
                index={i}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. Today Specials */}
      <section className="mb-10 md:mb-20">
        <h2 className="mb-6 text-xl font-bold text-gray-900 md:text-2xl">Today Specials</h2>
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-gray-200" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {todaySpecials.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                showBadge="special"
                index={i}
              />
            ))}
          </div>
        )}
      </section>
    </motion.div>
  );
}
