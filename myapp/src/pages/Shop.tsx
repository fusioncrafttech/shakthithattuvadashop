import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal';
import { products } from '../data/products';
import { categories } from '../data/categories';
import type { Product } from '../types';

export function Shop() {
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get('category');
  const searchQuery = searchParams.get('q')?.toLowerCase().trim() || '';
  const [activeCategory, setActiveCategory] = useState(categorySlug || 'all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (categorySlug) setActiveCategory(categorySlug);
  }, [categorySlug]);

  const filteredProducts = useMemo(() => {
    let list = products;
    if (activeCategory !== 'all') {
      const cat = categories.find((c) => c.slug === activeCategory);
      if (cat) list = list.filter((p) => p.categoryId === cat.id);
    }
    if (searchQuery) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery) ||
          p.description.toLowerCase().includes(searchQuery)
      );
    }
    return list;
  }, [activeCategory, searchQuery]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10"
    >
      <h1 className="mb-8 text-2xl font-bold text-gray-900 md:text-3xl">
        Shop
        {searchQuery && (
          <span className="ml-2 text-lg font-normal text-gray-500">
            — &quot;{searchParams.get('q')}&quot;
          </span>
        )}
      </h1>

      {/* Category Filter Tabs */}
      <div className="mb-8 flex gap-2 overflow-x-auto scrollbar-hide pb-2 md:flex-wrap">
        {[{ id: 'all', slug: 'all', name: 'All' }, ...categories].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.slug)}
            className={`flex-shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
              activeCategory === cat.slug
                ? 'bg-[#E53935] text-white shadow-lg'
                : 'bg-white text-gray-600 shadow hover:bg-gray-50'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Mobile: 3-column grid, tap product to open modal */}
      <div className="grid grid-cols-3 gap-2 md:hidden">
        {filteredProducts.map((product) => (
          <motion.button
            key={product.id}
            type="button"
            onClick={() => setSelectedProduct(product)}
            className="flex flex-col overflow-hidden rounded-xl bg-white text-left shadow-md transition-shadow active:shadow-lg"
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative aspect-square overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col p-2">
              <span className="line-clamp-2 text-xs font-medium text-gray-900">{product.name}</span>
              <span className="mt-0.5 text-sm font-bold text-[#E53935]">₹{product.price}</span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Desktop: full product cards */}
      <div className="hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <ProductModal
            key={selectedProduct.id}
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>

      {filteredProducts.length === 0 && (
        <p className="py-12 text-center text-gray-500">
          {searchQuery ? 'No products match your search.' : 'No items in this category.'}
        </p>
      )}
    </motion.div>
  );
}
