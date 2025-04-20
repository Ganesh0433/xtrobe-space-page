import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBookOpen, FiCheckCircle, FiStar, FiAward, FiArrowRight, FiZap } from 'react-icons/fi';
import { IoPlanetOutline, IoRocketOutline } from 'react-icons/io5';
import { GiGalaxy, GiBlackHoleBolas, GiSpottedWound } from 'react-icons/gi';
import { RiAliensLine, RiTelescopeLine } from 'react-icons/ri';
import { BsStars } from 'react-icons/bs';

export default function AstronomyDashboard() {
  const [progress, setProgress] = useState({
    completed: 0,
    total: 10,
    topics: {
      solarSystem: { read: false, favorite: false },
      stars: { read: false, favorite: false },
      galaxies: { read: false, favorite: false },
      nebulae: { read: false, favorite: false },
      exoplanets: { read: false, favorite: false },
      blackHoles: { read: false, favorite: false },
      cosmology: { read: false, favorite: false },
      astrobiology: { read: false, favorite: false },
      telescopes: { read: false, favorite: false },
      spaceMissions: { read: false, favorite: false }
    }
  });

  const [activeHologram, setActiveHologram] = useState(null);
  const [showAchievement, setShowAchievement] = useState(false);
  const [achievementText, setAchievementText] = useState('');

  // Topic data with links
  const topics = [
    {
      id: 'solarSystem',
      title: 'Solar System',
      description: 'Explore our planetary neighborhood',
      Icon: IoPlanetOutline,
      color: 'from-blue-500 to-cyan-400',
      gradient: 'bg-gradient-to-br from-blue-500 to-cyan-400',
      link: '/study-modules'
    },
    // ... other topics with their links
  ];

  // Load progress from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedProgress = localStorage.getItem('astronomyProgress');
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      }
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('astronomyProgress', JSON.stringify(progress));
    }
  }, [progress]);

  // Mark topic as read with animation
  const handleTopicClick = (topicId) => {
    setActiveHologram(topicId);
    
    if (!progress.topics[topicId].read) {
      const newProgress = {
        ...progress,
        completed: progress.completed + 1,
        topics: {
          ...progress.topics,
          [topicId]: { ...progress.topics[topicId], read: true }
        }
      };
      setProgress(newProgress);

      if ((progress.completed + 1) % 5 === 0) {
        setAchievementText(`Unlocked: ${progress.completed + 1} topics mastered!`);
        setShowAchievement(true);
        setTimeout(() => setShowAchievement(false), 3000);
      }
    }
  };

  // Toggle favorite
  const toggleFavorite = (topicId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setProgress(prev => ({
      ...prev,
      topics: {
        ...prev.topics,
        [topicId]: { 
          ...prev.topics[topicId],
          favorite: !prev.topics[topicId].favorite 
        }
      }
    }));
  };

  // Calculate progress percentage
  const progressPercentage = Math.round((progress.completed / progress.total) * 100);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 relative overflow-hidden">
      {/* Animated cosmic background */}
      <div className="fixed inset-0 z-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animation: `twinkle ${Math.random() * 5 + 3}s infinite alternate`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center justify-center mb-12"
      >
        <h1 className="text-5xl md:text-6xl font-light tracking-wider mb-4 text-center">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            COSMIC
          </span>{' '}
          <span className="font-medium">KNOWLEDGE HUB</span>
        </h1>
        <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto text-center px-4">
          Navigate the universe of astronomical discoveries
        </p>
      </motion.div>

      {/* Progress Overview */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 relative z-10">
        {/* Main Progress Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="backdrop-blur-lg bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 shadow-lg"
        >
          <div className="relative w-full h-40 mb-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#374151"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="url(#progressGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${progressPercentage}, 100`}
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    {progressPercentage}%
                  </span>
                  <span className="text-xs text-gray-400 mt-1">SYNC COMPLETE</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-300">KNOWLEDGE ACQUISITION</h3>
            <p className="text-gray-400 text-sm">
              {progress.completed} of {progress.total} modules assimilated
            </p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        {[
          {
            icon: <FiBookOpen className="text-cyan-400 text-xl" />,
            title: "Modules Accessed",
            value: progress.completed,
            color: "text-cyan-400"
          },
          {
            icon: <FiStar className="text-yellow-400 text-xl" />,
            title: "Priority Bookmarks",
            value: Object.values(progress.topics).filter(t => t.favorite).length,
            color: "text-yellow-400"
          }
        ].map((stat, index) => (
          <motion.div 
            key={index}
            whileHover={{ y: -5 }}
            className="backdrop-blur-lg bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 shadow-lg"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gray-700/50 mr-4">
                {stat.icon}
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-300">{stat.title}</h3>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Topics Grid */}
      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-2xl font-light tracking-wider text-gray-300 mb-8 flex items-center">
          <span className="w-8 h-px bg-gradient-to-r from-cyan-400 to-blue-500 mr-4"></span>
          EXPLORATION MODULES
          <span className="w-8 h-px bg-gradient-to-r from-blue-500 to-cyan-400 ml-4"></span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {topics.map((topic, index) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              whileTap={{ scale: 0.98 }}
              className={`relative rounded-xl overflow-hidden border border-gray-700/50 cursor-pointer transition-all duration-300 group
                ${progress.topics[topic.id].read ? 'border-l-4 border-cyan-400' : ''}
                ${activeHologram === topic.id ? 'scale-95' : ''}
              `}
            >
              <Link 
                href={topic.link}
                onClick={() => handleTopicClick(topic.id)}
                className="block w-full h-full"
              >
                {/* Holographic effect overlay */}
                <AnimatePresence>
                  {activeHologram === topic.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-cyan-400/10 backdrop-blur-sm z-10"
                    />
                  )}
                </AnimatePresence>

                {/* Card content */}
                <div className="relative z-0 h-full flex flex-col">
                  {/* Gradient header */}
                  <div className={`h-2 ${topic.gradient}`}></div>
                  
                  {/* Holographic icon */}
                  <div className="p-6 pb-0">
                    <div className={`p-4 rounded-lg ${topic.gradient} w-16 h-16 flex items-center justify-center mb-4 shadow-lg`}>
                      <topic.Icon className="text-white text-2xl" />
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-6 pt-0 flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-medium text-white mb-1">{topic.title}</h3>
                        <p className="text-gray-400 text-sm">{topic.description}</p>
                      </div>
                      <button 
                        onClick={(e) => toggleFavorite(topic.id, e)}
                        className={`p-2 rounded-full transition ${
                          progress.topics[topic.id].favorite 
                            ? 'text-yellow-400 bg-yellow-400/10 shadow-inner' 
                            : 'text-gray-500 hover:text-yellow-400 hover:bg-yellow-400/10'
                        }`}
                      >
                        <FiStar className="text-xl" />
                      </button>
                    </div>
                  </div>

                  {/* Card footer */}
                  <div className="p-4 bg-gray-800/50 border-t border-gray-700/50 flex justify-between items-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      topic.id === 'solarSystem' || topic.id === 'telescopes' || topic.id === 'spaceMissions' 
                        ? 'bg-cyan-400/20 text-cyan-400' :
                      topic.id === 'stars' || topic.id === 'galaxies' || topic.id === 'nebulae' || topic.id === 'astrobiology'
                        ? 'bg-purple-400/20 text-purple-400' :
                        'bg-gray-700 text-gray-400'
                    }`}>
                      {topic.id === 'solarSystem' || topic.id === 'telescopes' || topic.id === 'spaceMissions' 
                        ? 'BASIC' :
                      topic.id === 'stars' || topic.id === 'galaxies' || topic.id === 'nebulae' || topic.id === 'astrobiology'
                        ? 'INTERMEDIATE' :
                        'ADVANCED'}
                    </span>
                    <div
                      className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center transition ${
                        progress.topics[topic.id].read
                          ? 'bg-green-400/20 text-green-400 hover:bg-green-400/30'
                          : `${topic.gradient} text-white hover:shadow-lg hover:shadow-${topic.color.split('to-')[1].split('-')[0]}-500/20`
                      }`}
                    >
                      {progress.topics[topic.id].read ? (
                        <>
                          <FiCheckCircle className="mr-2" /> COMPLETED
                        </>
                      ) : (
                        <>
                          ACCESS <FiArrowRight className="ml-2" />
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Holographic glow effect */}
                <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${topic.gradient.replace('bg-gradient-to-br', 'bg-gradient-to-r')} mix-blend-screen`}></div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Achievement Notification */}
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 border border-cyan-400/30 text-white px-6 py-3 rounded-lg shadow-xl flex items-center z-50 backdrop-blur-lg"
            style={{
              boxShadow: '0 0 20px rgba(34, 211, 238, 0.3)'
            }}
          >
            <div className="mr-3 relative">
              <FiAward className="text-cyan-400 text-xl" />
              <div className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-20"></div>
            </div>
            <span className="font-medium">{achievementText}</span>
            <div className="ml-4 h-4 w-px bg-gray-600"></div>
            <button 
              onClick={() => setShowAchievement(false)}
              className="ml-4 text-cyan-400 hover:text-cyan-300"
            >
              DISMISS
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global styles for animations */}
      <style jsx global>{`
        @keyframes twinkle {
          0% { opacity: 0.2; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}