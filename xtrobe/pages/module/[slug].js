import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '../../lib/firebaseConfig';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import moduleData from '../../data/modules.json';

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/ & /g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export default function ModuleContent() {
  const router = useRouter();
  const { slug } = router.query;
  const [currentSubmoduleIndex, setCurrentSubmoduleIndex] = useState(0);
  const [completedSubmodules, setCompletedSubmodules] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [moduleProgress, setModuleProgress] = useState({});

  const modulesWithSlugs = moduleData.modules.map(module => ({
    ...module,
    slug: generateSlug(module.title)
  }));

  const module = modulesWithSlugs.find(m => m.slug === slug);
  const maxModules = modulesWithSlugs.length;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const progressRef = collection(db, `userProgress/${currentUser.uid}/modules`);
        const progressSnap = await getDocs(progressRef);
        const progressData = {};
        progressSnap.forEach((doc) => {
          progressData[doc.id] = doc.data().completedSubmodules || 0;
        });
        setModuleProgress(progressData);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (slug && user && module) {
      const fetchProgress = async () => {
        const progressRef = doc(db, `userProgress/${user.uid}/modules`, module.id.toString());
        const docSnap = await getDoc(progressRef);
        if (docSnap.exists()) {
          const completed = docSnap.data().completedSubmodules || 0;
          setCompletedSubmodules(completed);
          setCurrentSubmoduleIndex(Math.min(completed, module?.submodules.length - 1 || 0));
        }
        await setDoc(
          doc(db, `userProgress/${user.uid}/metadata`, 'state'),
          { lastViewed: { moduleId: module.id, submoduleIndex: currentSubmoduleIndex } },
          { merge: true }
        );
      };
      fetchProgress();
    }
  }, [slug, user, module, currentSubmoduleIndex]);

  const handleNext = async () => {
    if (!module || !user) return;
    if (currentSubmoduleIndex < module.submodules.length - 1) {
      const newCompleted = completedSubmodules + 1;
      setCompletedSubmodules(newCompleted);
      setCurrentSubmoduleIndex(currentSubmoduleIndex + 1);
      await setDoc(
        doc(db, `userProgress/${user.uid}/modules`, module.id.toString()),
        { completedSubmodules: newCompleted, lastUpdated: new Date() },
        { merge: true }
      );
      await setDoc(
        doc(db, `userProgress/${user.uid}/metadata`, 'state'),
        { lastViewed: { moduleId: module.id, submoduleIndex: currentSubmoduleIndex + 1 } },
        { merge: true }
      );
    } else if (module.id < maxModules - 1) {
      const newCompleted = completedSubmodules + 1;
      setCompletedSubmodules(newCompleted);
      await setDoc(
        doc(db, `userProgress/${user.uid}/modules`, module.id.toString()),
        { completedSubmodules: newCompleted, lastUpdated: new Date() },
        { merge: true }
      );
      const nextModule = modulesWithSlugs.find(m => m.id === module.id + 1);
      await setDoc(
        doc(db, `userProgress/${user.uid}/metadata`, 'state'),
        { lastViewed: { moduleId: module.id + 1, submoduleIndex: 0 } },
        { merge: true }
      );
      router.push(`/module/${nextModule.slug}`, undefined, { shallow: true });
      setCurrentSubmoduleIndex(0);
      setCompletedSubmodules(0);
    }
  };

  const handleModuleChange = async (moduleSlug) => {
    if (user) {
      const selectedModule = modulesWithSlugs.find(m => m.slug === moduleSlug);
      setCurrentSubmoduleIndex(0);
      setCompletedSubmodules(0);
      await setDoc(
        doc(db, `userProgress/${user.uid}/metadata`, 'state'),
        { lastViewed: { moduleId: selectedModule.id, submoduleIndex: 0 } },
        { merge: true }
      );
      router.push(`/module/${moduleSlug}`, undefined, { shallow: true });
    }
  };

  const handleDashboard = () => {
    router.push('/', undefined, { shallow: true });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) return (
    <div className="text-center text-ivory min-h-screen bg-cosmic flex items-center justify-center font-inter">
      Loading...
    </div>
  );

  if (!user) return (
    <div className="text-center text-ivory min-h-screen bg-cosmic flex items-center justify-center font-inter">
      Please log in to access this content
    </div>
  );

  if (!slug || !module) return (
    <div className="text-center text-ivory min-h-screen bg-cosmic flex items-center justify-center font-inter">
      Module not found
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-cosmic to-cosmic-dark text-ivory font-inter relative overflow-hidden">
      <div className="shooting-star" style={{ top: '10%', left: '90%', animationDelay: '0s' }}></div>
      <div className="shooting-star" style={{ top: '20%', left: '80%', animationDelay: '1s' }}></div>
      <div className="shooting-star" style={{ top: '15%', left: '85%', animationDelay: '2s' }}></div>
      <div className={`w-80 glass p-6 fixed h-full overflow-y-auto custom-scrollbar shadow-xl z-20 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:block`}>
        <h2 className="text-3xl font-extrabold text-purple font-poppins mb-8 animate-fadeIn">Modules</h2>
        <ul className="space-y-4">
          {modulesWithSlugs.map((m) => (
            <li key={m.id} className="relative">
              <button
                onClick={() => handleModuleChange(m.slug)}
                className={`block w-full text-left p-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                  slug === m.slug ? 'bg-purple text-ivory shadow-lg' : 'text-mint glass hover:bg-sidebar-hover'
                } font-poppins font-medium text-sm`}
              >
                {m.title}
                {moduleProgress[m.id] >= m.submodules.length && (
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-yellow-400 text-xl animate-pulse">★</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 p-6 lg:p-16 lg:ml-80 bg-[url('/stars-pattern.png')] bg-opacity-10 bg-repeat">
        <div className="flex justify-between items-center mb-8">
          <button
            className="lg:hidden p-2 rounded-xl bg-purple text-ivory font-poppins font-semibold hover:bg-purple-hover hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            onClick={toggleSidebar}
          >
            ☰
          </button>
          <button
            onClick={handleDashboard}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple to-cyan text-ivory font-poppins font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-orbit"
          >
            Dashboard
          </button>
        </div>
        <h1 className="text-5xl font-extrabold text-purple font-poppins mb-10 animate-fadeIn">{module.title}</h1>
        <div className="glass p-10 rounded-3xl shadow-lg animate-fadeIn">
          <h2 className="text-3xl font-bold text-purple font-poppins mb-6">
            {module.submodules[currentSubmoduleIndex].title}
          </h2>
          <p className="text-ivory leading-relaxed mb-10 text-xl font-normal">
            {module.submodules[currentSubmoduleIndex].content}
          </p>
          <div className="mb-6 relative group">
            <p className="text-mint text-sm font-medium mb-2">
              {completedSubmodules}/{module.submodules.length} submodules completed
              {' '}
              <span className="text-cyan">
                ({Math.round((completedSubmodules / module.submodules.length) * 100)}%)
              </span>
            </p>
            <div className="w-full bg-sidebar rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple to-cyan h-3 rounded-full transition-all duration-500"
                style={{ width: `${(completedSubmodules / module.submodules.length) * 100}%` }}
              ></div>
            </div>
            {/* <div className="absolute hidden group-hover:block bg-sidebar text-ivory text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2">
              {Math.round((completedSubmodules / module.submodules.length) * 100)}% Complete
            </div> */}
          </div>
          <div className="flex items-center justify-end">
            <button
              onClick={handleNext}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 font-poppins animate-orbit ${
                currentSubmoduleIndex >= module.submodules.length - 1 && module.id >= maxModules - 1
                  ? 'bg-gray-600 text-mint cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple to-cyan text-ivory hover:shadow-2xl'
              }`}
              disabled={currentSubmoduleIndex >= module.submodules.length - 1 && module.id >= maxModules - 1}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}