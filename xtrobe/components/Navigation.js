import Link from "next/link";
import { useState, useEffect } from "react";
import { FiMenu, FiX, FiSearch, FiUser, FiMoon, FiSun } from "react-icons/fi";
import { FaRocket, FaStar } from "react-icons/fa";

export default function Navigation({ modules }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeModule, setActiveModule] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <>
      {/* Top Announcement Bar */}
      {/* <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white text-center py-2 px-4 text-sm font-medium">
        🚀 Join our live astronomy webinar this Friday! <Link href="/events" className="underline ml-2 font-semibold">Register now</Link>
      </div> */}

      {/* Main Navigation */}
    
      <nav className="w-full fixed top-0 z-50 bg-white dark:bg-slate-900 shadow-xl py-3 transition-all duration-500">

        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            {/* Logo with animated icon */}
            <Link href="/" className="flex items-center group">
           
              <h1 className="text-3xl md:text-3xl font-light tracking-wide text-black mb-3 text-center w-full">
  Xtrobe
</h1>

            </Link>

            {/* Desktop Navigation */}
            
            <div className="hidden lg:flex items-center space-x-8">
              <div className="relative group">
                <Link 
                  href="/courses" 
                  className="flex items-center text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-amber-400 font-medium transition-colors"
                >
                  Courses
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
                <div className="absolute left-0 mt-2 w-56 rounded-lg shadow-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 -translate-y-2">
                  {modules.map((module) => (
                    <Link 
                      key={module.id} 
                      href={`/modules/${module.id}`}
                      className={`block px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${activeModule === module.id ? 'text-blue-600 dark:text-amber-400 font-semibold' : ''}`}
                      onMouseEnter={() => setActiveModule(module.id)}
                    >
                      {module.title}
                    </Link>
                  ))}
                </div>
              </div>

              <Link href="/telescopes" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-amber-400 font-medium transition-colors">
                Telescope Guides
              </Link>
              <Link href="/community" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-amber-400 font-medium transition-colors">
                Community
              </Link>
              <Link href="/blog" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-amber-400 font-medium transition-colors">
                Blog
              </Link>
            </div>

            {/* Right side controls */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-amber-400 transition-colors"
                aria-label="Search"
              >
                <FiSearch className="w-5 h-5" />
              </button>

         

              <Link 
                href="/account" 
                className="hidden md:flex items-center space-x-1 p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-amber-400 transition-colors"
              >
                <FiUser className="w-5 h-5" />
                <span className="text-sm">Sign In</span>
              </Link>

              <Link 
                href="/pricing" 
                className="hidden md:block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Get Started
              </Link>

              <button 
                className="lg:hidden text-slate-700 dark:text-slate-300 focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {searchOpen && (
            <div className="mt-4 pb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search courses, articles, and more..."
                  className="text-black w-full p-3 pl-10 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-amber-400"
                />
                <FiSearch className="absolute left-3 top-3.5 text-slate-400" />
              </div>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
            <div className="container mx-auto px-6 py-4">
              <div className="space-y-4">
                {modules.map((module) => (
                  <Link 
                    key={module.id} 
                    href={`/modules/${module.id}`}
                    className="block py-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-amber-400 font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {module.title}
                  </Link>
                ))}
                <Link 
                  href="/telescopes" 
                  className="block py-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-amber-400 font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Telescope Guides
                </Link>
                <Link 
                  href="/community" 
                  className="block py-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-amber-400 font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Community
                </Link>
                <Link 
                  href="/blog" 
                  className="block py-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-amber-400 font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Blog
                </Link>
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Link 
                    href="/account" 
                    className="flex items-center space-x-2 py-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-amber-400 font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FiUser className="w-5 h-5" />
                    <span>Account</span>
                  </Link>
                  <Link 
                    href="/pricing" 
                    className="mt-3 inline-block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
      
    </>
        
  );
}