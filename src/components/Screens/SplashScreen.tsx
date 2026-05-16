import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Rocket } from 'lucide-react'

interface SplashScreenProps {
  onComplete: () => void
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    // Simulate loading assets/data
    const timer = setTimeout(() => {
      onComplete()
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 bg-gray-950 flex flex-col items-center justify-center text-white z-50 overflow-hidden">
      {/* Floating background particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-blue-500 rounded-full opacity-20"
          style={{
            width: Math.random() * 6 + 2 + 'px',
            height: Math.random() * 6 + 2 + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
          }}
          animate={{
            y: [0, -100],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
      
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Rocket size={80} className="text-cyan-400 mb-6" />
        </motion.div>
        
        <h1 className="text-4xl md:text-6xl font-black text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] leading-tight tracking-tighter mb-4">
          <span className="text-4xl md:text-6xl text-purple-400">IELTS</span>
        </h1>
        
        <h2 className="text-xl md:text-2xl text-gray-300 font-bold tracking-widest uppercase mt-2 mb-12 shadow-cyan-500/50 drop-shadow-md">
          Grammar Invasion
        </h2>
        
        <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden relative">
          <motion.div
            className="absolute top-0 left-0 h-full bg-cyan-400"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          />
        </div>
        <p className="mt-4 text-cyan-500/70 text-sm animate-pulse tracking-widest uppercase">Initializing Systems...</p>
      </motion.div>
    </div>
  )
}
