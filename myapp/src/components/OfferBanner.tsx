import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { OfferBanner as OfferType } from '../types';
import { useAuth } from '../context/AuthContext';

interface OfferBannerProps {
  offers: OfferType[];
}

export function OfferBanner({ offers }: OfferBannerProps) {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const { isAuthenticated, openAuthModal } = useAuth();

  const handleCtaClick = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      openAuthModal('/checkout');
    }
  };

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % offers.length);
    }, 4000);
    return () => clearInterval(id);
  }, [offers.length]);

  if (!offers.length) return null;

  const current = offers[index];

  return (
    <section className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-[0_8px_32px_rgba(229,57,53,0.2),0_2px_8px_rgba(0,0,0,0.08)] ring-1 ring-white/10">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          className="relative flex min-h-[180px] items-center justify-between overflow-hidden p-6 md:min-h-[240px] md:p-10"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Premium gradient background with depth */}
          <div
            className="absolute inset-0 bg-linear-to-br from-[#B71C1C] via-primary-dark to-[#8B0000]"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-linear-to-r from-primary/95 via-primary-dark/90 to-transparent"
            aria-hidden
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_70%_50%,rgba(255,213,79,0.12)_0%,transparent_50%)]" aria-hidden />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.03)_0%,transparent_40%,rgba(0,0,0,0.06)_100%)]" aria-hidden />

          {/* Content */}
          <div className="relative z-10 max-w-[72%]">
            <span className="mb-2.5 inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#B71C1C] shadow-sm md:mb-3 md:px-3 md:py-1.5 md:text-xs">
              Limited offer
            </span>
            <h2 className="font-display text-2xl font-bold leading-tight tracking-tight text-white drop-shadow-sm md:text-4xl md:leading-[1.15]">
              {current.title}
            </h2>
            <p className="mt-2 text-sm leading-snug text-white/92 md:mt-3 md:text-base md:leading-relaxed">
              {current.subtitle}
            </p>
            {current.cta && (
              <motion.button
                type="button"
                onClick={handleCtaClick}
                className="mt-4 inline-flex items-center rounded-xl border border-white/30 bg-white/95 px-4 py-2.5 text-sm font-semibold text-primary-dark shadow-lg shadow-black/10 backdrop-blur-sm transition hover:bg-white hover:shadow-xl active:scale-[0.98] md:mt-5 md:px-5 md:py-3 md:text-base"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {current.cta}
              </motion.button>
            )}
          </div>

          {/* Image with premium overlay */}
          <div className="absolute right-0 top-0 h-full w-[55%] md:w-[50%]" aria-hidden>
            <div className="absolute inset-0 bg-linear-to-l from-primary-dark/60 to-transparent" />
            <img
              src={current.image}
              alt=""
              className="h-full w-full object-cover object-center opacity-90"
            />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_80%_50%,transparent_0%,rgba(0,0,0,0.15)_100%)]" />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Refined dot indicators */}
      <div className="absolute bottom-4 left-6 flex items-center gap-2 md:bottom-6 md:left-10">
        {offers.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent ${
              i === index
                ? 'h-2 w-6 bg-white shadow-[0_0_12px_rgba(255,255,255,0.5)]'
                : 'h-1.5 w-1.5 bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index ? 'true' : undefined}
          />
        ))}
      </div>
    </section>
  );
}
