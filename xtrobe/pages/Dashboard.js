import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '../lib/firebaseConfig';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import moduleData from '../data/modules.json';
import { signOut } from 'firebase/auth';

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/ & /g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({});
  const [lastViewed, setLastViewed] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const modulesWithSlugs = moduleData.modules.map(module => ({
    ...module,
    slug: generateSlug(module.title)
  }));

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, `users/${currentUser.uid}`);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserName(userSnap.data().Name || 'User');
        } else {
          setUserName('User');
        }

        const progressRef = collection(db, `userProgress/${currentUser.uid}/modules`);
        const progressSnap = await getDocs(progressRef);
        const progressData = {};
        progressSnap.forEach((doc) => {
          progressData[doc.id] = doc.data().completedSubmodules || 0;
        });
        setProgress(progressData);

        const metadataRef = doc(db, `userProgress/${currentUser.uid}/metadata`, 'state');
        const metadataSnap = await getDoc(metadataRef);
        if (metadataSnap.exists()) {
          setLastViewed(metadataSnap.data().lastViewed || null);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleModuleClick = (slug) => {
    router.push(`/module/${slug}`, undefined, { shallow: true });
  };

  const handleContinueLearning = () => {
    if (lastViewed) {
      const module = modulesWithSlugs.find(m => m.id === lastViewed.moduleId);
      router.push(`/module/${module.slug}`, undefined, { shallow: true });
    } else {
      router.push(`/module/${modulesWithSlugs[0].slug}`, undefined, { shallow: true });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-cosmic text-ivory font-inter text-xl">
      Loading...
    </div>
  );

  if (!user) return (
    <div className="flex items-center justify-center h-screen bg-cosmic text-ivory font-inter">
      <div className="glass p-6 rounded-2xl shadow-lg">
        <p className="text-lg mb-4">Please log in to view your dashboard</p>
        <button
          onClick={() => router.push('/login')}
          className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple to-cyan text-ivory font-poppins font-semibold hover:shadow-lg transition-all duration-300 animate-orbit"
        >
          Go to Login
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-gradient-to-b from-cosmic to-cosmic-dark text-ivory font-inter overflow-hidden relative">
      <div className="shooting-star" style={{ top: '5%', left: '85%', animationDelay: '0s' }}></div>
      <div className="shooting-star" style={{ top: '15%', left: '90%', animationDelay: '1s' }}></div>
      <div className="shooting-star" style={{ top: '10%', left: '80%', animationDelay: '2s' }}></div>
      <div className="flex h-full">
        <div className={`w-64 glass p-4 fixed h-full overflow-y-auto custom-scrollbar z-30 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:w-72`}>
          <h2 className="text-2xl font-extrabold text-purple font-poppins mb-6 animate-fadeIn">Modules</h2>
          <ul className="space-y-3">
            {modulesWithSlugs.map((m) => (
              <li key={m.id} className="relative">
                <button
                  onClick={() => handleModuleClick(m.slug)}
                  className="block w-full text-left p-3 rounded-lg text-mint glass hover:bg-sidebar-hover hover:shadow-md font-poppins font-medium text-sm transition-all duration-300 animate-fadeIn"
                >
                  {m.title}
                  {progress[m.id] >= m.submodules.length && (
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-yellow-400 text-lg animate-pulse">★</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 p-4 lg:p-8 lg:ml-72 bg-[url('/stars-pattern.png')] bg-opacity-10 bg-repeat flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <button
              className="lg:hidden p-2 rounded-lg bg-purple text-ivory font-poppins font-semibold hover:bg-purple-hover hover:shadow-md transition-all duration-300"
              onClick={toggleSidebar}
            >
              ☰
            </button>
            <div className="flex space-x-3">
              {lastViewed && (
                <button
                  onClick={handleContinueLearning}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple to-cyan text-ivory font-poppins font-semibold hover:shadow-lg transition-all duration-300 animate-orbit"
                >
                  Continue Learning
                </button>
              )}
              <button
                onClick={handleLogout}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple to-cyan text-ivory font-poppins font-semibold hover:shadow-lg transition-all duration-300 animate-orbit"
              >
                Logout
              </button>
            </div>
          </div>
          <div className="glass p-6 rounded-2xl shadow-lg mb-6 max-w-lg mx-auto">
            <h1 className="text-4xl font-extrabold text-purple font-poppins animate-typing">Welcome, {userName}</h1>
            <p className="text-mint text-base mt-2">Explore the cosmos through your learning journey!</p>
          </div>
          <h2 className="text-2xl font-bold text-purple font-poppins mb-4 animate-fadeIn">Your Learning Progress</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
            {modulesWithSlugs.map((module, index) => (
              <div
                key={module.id}
                onClick={() => handleModuleClick(module.slug)}
                className="glass p-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className="text-xl font-bold text-purple font-poppins mb-2 flex items-center">
                  {module.title}
                  {progress[module.id] >= module.submodules.length && (
                    <span className="ml-2 text-yellow-400 text-lg animate-pulse">★</span>
                  )}
                </h3>
                <p className="text-ivory text-sm mb-3 line-clamp-3">{module.description}</p>
                <div className="relative group">
                  <p className="text-mint text-xs font-medium mb-1">
                    {progress[module.id] || 0}/{module.submodules.length} completed
                    <span className="text-cyan ml-1">
                      ({Math.round(((progress[module.id] || 0) / module.submodules.length) * 100)}%)
                    </span>
                  </p>
                  <div className="w-full bg-sidebar rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple to-cyan h-2 rounded-full transition-all duration-500"
                      style={{ width: `${((progress[module.id] || 0) / module.submodules.length) * 100}%` }}
                    ></div>
                  </div>
                  <div className="absolute hidden group-hover:block bg-sidebar text-ivory text-xs rounded py-1 px-2 -top-7 left-1/2 transform -translate-x-1/2">
                    {Math.round(((progress[module.id] || 0) / module.submodules.length) * 100)}% Complete
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}