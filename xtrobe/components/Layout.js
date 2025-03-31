// components/Layout.js
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

export default function Layout({ children }) {
  const router = useRouter();
  const isXtrobotPage = router.pathname === '/xtrobot';

  return (
    <div className="relative">
      {children}
      
      {/* Only show button if NOT on xtrobot page */}
      {!isXtrobotPage && (
        <motion.button
          onClick={() => router.push('/xtrobot')}
          className="fixed bottom-8 right-8 z-50 flex h-16 w-16 items-center justify-center rounded-full border-2 border-blue-400 bg-gray-900 shadow-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{
            scale: 1.1,
            backgroundColor: 'rgba(30, 58, 138, 0.8)',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.7)'
          }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="relative">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-blue-500">
              Xb
            </span>
            <motion.div 
              className="absolute inset-0 rounded-full border border-blue-400 opacity-70"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.7, 0, 0.7]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-blue-400 animate-pulse"></div>
          </div>
        </motion.button>
      )}
    </div>
  );
}