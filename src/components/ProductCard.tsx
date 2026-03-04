import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  showBadge?: 'popular' | 'special' | false;
  index?: number;
}

export function ProductCard({ product, showBadge = false, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();

  const badge =
    showBadge === 'popular'
      ? { label: 'Popular', className: 'bg-[#E53935] text-white' }
      : showBadge === 'special'
        ? { label: 'Today Special', className: 'bg-[#FFD54F] text-[#C62828]' }
        : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group flex flex-col overflow-hidden rounded-[20px] bg-white shadow-lg transition-shadow hover:shadow-xl md:rounded-[24px]"
    >
      <Link to={`/shop#${product.id}`} className="block flex-1">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {badge && (
            <span
              className={`absolute left-3 top-3 rounded-lg px-2 py-0.5 text-xs font-semibold ${badge.className}`}
            >
              {badge.label}
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col p-4 md:p-5">
          <h3 className="font-semibold text-gray-900 md:text-lg">{product.name}</h3>
          <p className="mt-0.5 line-clamp-2 text-sm text-gray-500">{product.description}</p>
          <p className="mt-2 text-lg font-bold text-[#E53935]">₹{product.price}</p>
        </div>
      </Link>
      <div className="p-4 pt-0 md:p-5 md:pt-0">
        <motion.button
          onClick={(e) => {
            e.preventDefault();
            addItem(product);
          }}
          className="w-full rounded-xl bg-[#E53935] py-3 font-semibold text-white transition-colors hover:bg-[#C62828]"
          whileTap={{ scale: 0.98 }}
        >
          Add to Cart
        </motion.button>
      </div>
    </motion.article>
  );
}
