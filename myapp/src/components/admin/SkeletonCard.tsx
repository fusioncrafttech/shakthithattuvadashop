import { motion } from 'framer-motion';

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className = '' }: SkeletonCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`rounded-3xl border border-gray-200/80 bg-white p-6 shadow-lg ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="h-10 w-24 animate-pulse rounded-xl bg-gray-200" />
        <div className="h-8 w-8 animate-pulse rounded-lg bg-gray-200" />
      </div>
      <div className="mt-4 h-8 w-3/4 animate-pulse rounded-lg bg-gray-200" />
      <div className="mt-2 h-5 w-1/2 animate-pulse rounded bg-gray-100" />
    </motion.div>
  );
}

export function SkeletonTableRows({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4"
        >
          <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
            <div className="h-3 w-1/4 animate-pulse rounded bg-gray-100" />
          </div>
          <div className="h-8 w-20 animate-pulse rounded-lg bg-gray-200" />
        </div>
      ))}
    </div>
  );
}
