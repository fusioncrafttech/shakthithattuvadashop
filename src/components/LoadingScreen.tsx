import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  isLoading: boolean;
}

export function LoadingScreen({ isLoading }: LoadingScreenProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FFF8E1]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        >
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <img 
              src="/ST_Shop.png" 
              alt="Shakthi Thattuvadaset Corner" 
              className="w-124 h-124 md:w-md md:h-md lg:w-lg lg:h-lg object-contain"
            />
          </motion.div>
          <motion.div
            className="h-1 w-24 overflow-hidden rounded-full bg-[#FFD54F]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="h-full w-1/2 rounded-full bg-[#E53935]"
              animate={{ x: ['0%', '100%'] }}
              transition={{ duration: 1.2, repeat: Infinity, repeatType: 'reverse' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
