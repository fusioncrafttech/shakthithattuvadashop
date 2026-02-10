import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Category } from '../types';

interface CategoryScrollProps {
  categories: Category[];
}

export function CategoryScroll({ categories }: CategoryScrollProps) {
  return (
    <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 md:flex-wrap md:justify-center md:gap-6 md:overflow-visible">
      {categories.map((cat, i) => (
        <motion.div
          key={cat.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <Link
            to={`/shop?category=${cat.slug}`}
            className="flex flex-shrink-0 flex-col items-center gap-2"
          >
            <div className="group relative h-20 w-20 overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:h-24 md:w-24">
              <img
                src={cat.image}
                alt={cat.name}
                className="h-full w-full object-cover transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <span className="text-center text-sm font-medium text-gray-700">{cat.name}</span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
