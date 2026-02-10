import { motion } from 'framer-motion';
import { OfferBanner } from '../components/OfferBanner';
import { CategoryScroll } from '../components/CategoryScroll';
import { ProductCard } from '../components/ProductCard';
import { offerBanners } from '../data/offers';
import { categories } from '../data/categories';
import { products } from '../data/products';

const popularProducts = products.filter((p) => p.isPopular);
const todaySpecials = products.filter((p) => p.isTodaySpecial);

export function Home() {
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

      {/* 2. Categories Horizontal Scroll */}
      <section className="mb-10 md:mb-20">
        <h2 className="mb-6 text-xl font-bold text-gray-900 md:text-2xl">Categories</h2>
        <CategoryScroll categories={categories} />
      </section>

      {/* 3. Popular / Featured */}
      <section className="mb-10 md:mb-20">
        <h2 className="mb-6 text-xl font-bold text-gray-900 md:text-2xl">Popular Items</h2>
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
      </section>

      {/* 4. Today Specials */}
      <section className="mb-10 md:mb-20">
        <h2 className="mb-6 text-xl font-bold text-gray-900 md:text-2xl">Today Specials</h2>
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
      </section>
    </motion.div>
  );
}
