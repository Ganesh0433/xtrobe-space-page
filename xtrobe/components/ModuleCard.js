import Link from "next/link";
import { motion } from "framer-motion";
import { FaRocket, FaSatellite, FaMeteor, FaStar, FaGalacticRepublic } from 'react-icons/fa';

const iconComponents = {
  rocket: FaRocket,
  satellite: FaSatellite,
  meteor: FaMeteor,
  star: FaStar,
  galaxy: FaGalacticRepublic
};

export default function ModuleCard({ module }) {
  const IconComponent = iconComponents[module.icon] || FaStar;
  
  return (
    <motion.div 
      className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-8 shadow-2xl overflow-hidden border border-slate-700 hover:border-blue-400/30 transition-all"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Cosmic background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-10 left-20 w-2 h-2 rounded-full bg-white animate-pulse"></div>
        <div className="absolute top-1/3 right-16 w-1 h-1 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-3 h-3 rounded-full bg-yellow-300 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      {/* Card content */}
      <div className="relative z-10">
        <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-blue-900/30 backdrop-blur-sm border border-blue-400/20">
          <IconComponent className="text-3xl text-blue-400" />
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-3 bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          {module.title}
        </h3>
        
        <p className="text-slate-300 mb-6 leading-relaxed">
          {module.description}
        </p>
        
        <div className="flex justify-between items-center">
          <span className="text-sm font-mono text-blue-300/80">
            {module.lessons} cosmic lessons
          </span>
          
          <Link 
            href={`/modules/${module.id}`}
            className="group inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg text-white font-medium transition-all shadow-lg hover:shadow-blue-500/30"
          >
            Explore Module
            <svg 
              className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
      
      {/* Constellation connector (only visible in grid) */}
      <div className="absolute -right-6 top-1/2 h-0.5 w-6 bg-blue-400/20 hidden lg:block"></div>
    </motion.div>
  );
}