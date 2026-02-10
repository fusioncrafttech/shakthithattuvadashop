import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { OfferBanner as OfferType } from '../types';

interface OfferBannerProps {
  offers: OfferType[];
}

export function OfferBanner({ offers }: OfferBannerProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % offers.length);
    }, 4000);
    return () => clearInterval(id);
  }, [offers.length]);

  if (!offers.length) return null;

  const current = offers[index];

  return (
    <section className="relative overflow-hidden rounded-2xl md:rounded-[24px] shadow-xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          className="relative flex min-h-[160px] items-center justify-between overflow-hidden bg-gradient-to-r from-[#E53935] to-[#C62828] p-6 md:min-h-[220px] md:p-10"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
        >
          <div className="relative z-10 max-w-[70%]">
            <span className="mb-1 inline-block rounded-full bg-[#FFD54F] px-3 py-0.5 text-xs font-semibold text-[#C62828]">
              Offer
            </span>
            <h2 className="text-2xl font-bold text-white md:text-4xl">{current.title}</h2>
            <p className="mt-1 text-sm text-white/90 md:text-lg">{current.subtitle}</p>
            {current.cta && (
              <span className="mt-3 inline-block rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#E53935]">
                {current.cta}
              </span>
            )}
          </div>
          <div className="absolute right-0 top-0 h-full w-1/2 opacity-20">
            <img
              src={current.image}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-4 left-6 flex gap-2 md:bottom-6 md:left-10">
        {offers.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all ${
              i === index ? 'w-6 bg-white' : 'w-2 bg-white/50'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
