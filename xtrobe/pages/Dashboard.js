import React, { useState, useEffect } from "react";
import { auth, db } from "../lib/firebaseConfig";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import Link from "next/link";
import { FiBook, FiCalendar, FiUser, FiHome, FiBell, FiSettings, FiLogOut, FiPlus, FiChevronDown, FiSearch } from "react-icons/fi";
import { BsGraphUp, BsLightningFill } from "react-icons/bs";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [studyModules, setStudyModules] = useState([]);
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/login");
        return;
      }

      setUser(currentUser);
      await fetchDashboardData(currentUser.uid);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchDashboardData = async (userId) => {
    try {
      // Fetch study modules
      const modulesQuery = query(
        collection(db, "studyModules"),
        where("userId", "==", userId)
      );
      const modulesSnapshot = await getDocs(modulesQuery);
      setStudyModules(
        modulesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );

      // Fetch events
      const eventsQuery = query(
        collection(db, "events"),
        where("userId", "==", userId)
      );
      const eventsSnapshot = await getDocs(eventsQuery);
      setEvents(
        eventsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );

      // Fetch notifications
      const notifQuery = query(
        collection(db, "notifications"),
        where("userId", "==", userId),
        where("read", "==", false)
      );
      const notifSnapshot = await getDocs(notifQuery);
      setNotifications(
        notifSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await updateDoc(doc(db, "notifications", notificationId), {
        read: true,
      });
      setNotifications(notifications.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error("Error updating notification:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const filteredModules = studyModules.filter(module =>
    module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (module.description && module.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const upcomingEvents = events
    .filter(e => new Date(e.date) > new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const pastEvents = events
    .filter(e => new Date(e.date) <= new Date())
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      {/* Top Navigation Bar */}
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg sticky top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden mr-4 text-gray-400 hover:text-white"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-3xl md:text-3xl font-light tracking-wide text-slate-100 mb-3 text-center w-full">
              Xtrobe
            </h1>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search modules, events..."
                className={`block w-full pl-10 pr-3 py-2 rounded-md ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-100 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* User Profile and Notifications */}
          <div className="flex items-center space-x-4">
            <button className="p-1 rounded-full relative">
              <FiBell className="h-6 w-6 text-gray-400 hover:text-blue-400" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              )}
            </button>

            <div className="relative">
              <button 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0)}
                </div>
                <span className="hidden md:inline">{user?.displayName || user?.email}</span>
                <FiChevronDown className={`transition-transform ${profileDropdownOpen ? 'transform rotate-180' : ''}`} />
              </button>

              {profileDropdownOpen && (
                <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ${darkMode ? 'bg-gray-800' : 'bg-white'} ring-1 ring-black ring-opacity-5`}>
                  <button
                    onClick={() => {
                      setDarkMode(!darkMode);
                      setProfileDropdownOpen(false);
                    }}
                    className={`block px-4 py-2 text-sm w-full text-left ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("profile");
                      setProfileDropdownOpen(false);
                    }}
                    className={`block px-4 py-2 text-sm w-full text-left ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    Profile Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className={`block px-4 py-2 text-sm w-full text-left ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              onClick={() => {
                setActiveTab("overview");
                setMobileMenuOpen(false);
              }}
              className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${activeTab === "overview" ? 'bg-blue-600 text-white' : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <FiHome className="inline mr-2" /> Overview
            </button>
            <button
              onClick={() => {
                setActiveTab("study");
                setMobileMenuOpen(false);
              }}
              className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${activeTab === "study" ? 'bg-blue-600 text-white' : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <FiBook className="inline mr-2" /> Study Modules
            </button>
            <button
              onClick={() => {
                setActiveTab("events");
                setMobileMenuOpen(false);
              }}
              className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${activeTab === "events" ? 'bg-blue-600 text-white' : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <FiCalendar className="inline mr-2" /> Events
            </button>
            <button
              onClick={() => {
                setActiveTab("profile");
                setMobileMenuOpen(false);
              }}
              className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${activeTab === "profile" ? 'bg-blue-600 text-white' : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <FiUser className="inline mr-2" /> Profile
            </button>
          </div>
        </div>
      )}

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Navigation - Desktop */}
          <aside className="hidden md:block w-64">
            <nav className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-4 sticky top-20`}>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition ${activeTab === "overview" ? 'bg-blue-600 text-white' : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <FiHome className="mr-3" /> Overview
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("study")}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition ${activeTab === "study" ? 'bg-blue-600 text-white' : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <FiBook className="mr-3" /> Study Modules
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("events")}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition ${activeTab === "events" ? 'bg-blue-600 text-white' : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <FiCalendar className="mr-3" /> Events & Alerts
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition ${activeTab === "profile" ? 'bg-blue-600 text-white' : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <FiUser className="mr-3" /> Profile Settings
                  </button>
                </li>
                <li className="pt-4 border-t border-gray-700">
                  <button
                    onClick={handleLogout}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <FiLogOut className="mr-3" /> Sign Out
                  </button>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Welcome Banner */}
                <div className={`rounded-xl p-6 ${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-700' : 'bg-gradient-to-r from-blue-50 to-blue-100'}`}>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.displayName || "User"}!</h2>
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <button className="mt-4 md:mt-0 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105">
                      Quick Start
                    </button>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className={`p-5 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Study Modules</p>
                        <p className="text-2xl font-bold mt-1">{studyModules.length}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                        <FiBook className={`h-6 w-6 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="relative pt-1">
                        <div className={`overflow-hidden h-2 text-xs flex rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                          <div
                            style={{ width: `${studyModules.length > 0 ? (studyModules.filter(m => m.completed).length / studyModules.length * 100) : 0}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-400 to-blue-600"
                          ></div>
                        </div>
                      </div>
                      <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {studyModules.filter(m => m.completed).length} of {studyModules.length} completed
                      </p>
                    </div>
                  </div>

                  <div className={`p-5 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Upcoming Events</p>
                        <p className="text-2xl font-bold mt-1">{upcomingEvents.length}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                        <FiCalendar className={`h-6 w-6 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                      </div>
                    </div>
                    <div className="mt-4">
                      {upcomingEvents.length > 0 ? (
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Next: {upcomingEvents[0].title} on {new Date(upcomingEvents[0].date).toLocaleDateString()}
                        </p>
                      ) : (
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No upcoming events</p>
                      )}
                    </div>
                  </div>

                  <div className={`p-5 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Productivity</p>
                        <p className="text-2xl font-bold mt-1">
                          {studyModules.length > 0 ? Math.round(studyModules.reduce((acc, m) => acc + (m.progress || 0), 0) / studyModules.length) : 0}%
                        </p>
                      </div>
                      <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                        <BsGraphUp className={`h-6 w-6 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {studyModules.filter(m => m.progress && m.progress >= 90).length} modules mastered
                      </p>
                    </div>
                  </div>

                  <div className={`p-5 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Streak</p>
                        <p className="text-2xl font-bold mt-1">7 days</p>
                      </div>
                      <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                        <BsLightningFill className={`h-6 w-6 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Keep it up! 3 more days to next milestone
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recent Activity and Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Recent Modules */}
                  <div className={`lg:col-span-2 p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold">Recent Study Modules</h3>
                      <Link href="/modules/new" className="text-sm text-blue-400 hover:text-blue-300">
                        View All
                      </Link>
                    </div>
                    {studyModules.slice(0, 4).length > 0 ? (
                      <div className="space-y-4">
                        {studyModules.slice(0, 4).map((module) => (
                          <div key={module.id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} transition cursor-pointer`}>
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{module.title}</h4>
                                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                  Last accessed: {module.lastAccessed ? new Date(module.lastAccessed).toLocaleString() : "Never"}
                                </p>
                              </div>
                              <div className="flex items-center">
                                <div className="relative w-10 h-10">
                                  <svg className="w-full h-full" viewBox="0 0 36 36">
                                    <path
                                      d="M18 2.0845
                                        a 15.9155 15.9155 0 0 1 0 31.831
                                        a 15.9155 15.9155 0 0 1 0 -31.831"
                                      fill="none"
                                      stroke={darkMode ? '#374151' : '#e5e7eb'}
                                      strokeWidth="3"
                                    />
                                    <path
                                      d="M18 2.0845
                                        a 15.9155 15.9155 0 0 1 0 31.831
                                        a 15.9155 15.9155 0 0 1 0 -31.831"
                                      fill="none"
                                      stroke="#3b82f6"
                                      strokeWidth="3"
                                      strokeDasharray={`${module.progress || 0}, 100`}
                                    />
                                  </svg>
                                  <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                                    {module.progress || 0}%
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={`p-8 text-center rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No recent study activity</p>
                        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                          Start Learning
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <h3 className="text-lg font-semibold mb-6">Quick Actions</h3>
                    <div className="space-y-4">
                      <button className="w-full flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition transform hover:-translate-y-1">
                        <span>Create New Module</span>
                        <FiPlus />
                      </button>
                      <button className="w-full flex items-center justify-between p-4 rounded-lg border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition">
                        <span>Schedule Event</span>
                        <FiCalendar />
                      </button>
                      <button className="w-full flex items-center justify-between p-4 rounded-lg border border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition">
                        <span>Take Assessment</span>
                        <FiBook />
                      </button>
                      <button className="w-full flex items-center justify-between p-4 rounded-lg border border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white transition">
                        <span>View Analytics</span>
                        <BsGraphUp />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Study Modules Tab */}
            {activeTab === "study" && (
              <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Study Modules</h2>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {studyModules.length} modules available
                    </p>
                  </div>
                  <div className="flex space-x-3 mt-4 md:mt-0">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search modules..."
                        className={`pl-10 pr-4 py-2 rounded-md ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-100 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <FiSearch className={`absolute left-3 top-2.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                    <Link href="/modules/new" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition flex items-center">
                      <FiPlus className="mr-2" /> New
                    </Link>
                  </div>
                </div>

                {filteredModules.length === 0 ? (
                  <div className={`p-8 text-center rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <FiBook className={`mx-auto h-12 w-12 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    <h3 className="mt-4 text-lg font-medium">No modules found</h3>
                    <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {searchQuery ? 'Try a different search term' : 'Create your first study module'}
                    </p>
                    <Link href="/modules/new" className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                      Create Module
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredModules.map((module) => (
                      <div
                        key={module.id}
                        className={`rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-105 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}
                      >
                        <div className={`h-2 ${module.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                        <div className="p-5">
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold text-lg mb-2">{module.title}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${module.completed ? 'bg-green-100 text-green-800' : darkMode ? 'bg-gray-600 text-gray-300' : 'bg-blue-100 text-blue-800'}`}>
                              {module.completed ? 'Completed' : 'In Progress'}
                            </span>
                          </div>
                          <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {module.description || 'No description provided'}
                          </p>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="relative w-8 h-8 mr-2">
                                <svg className="w-full h-full" viewBox="0 0 36 36">
                                  <path
                                    d="M18 2.0845
                                      a 15.9155 15.9155 0 0 1 0 31.831
                                      a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke={darkMode ? '#374151' : '#e5e7eb'}
                                    strokeWidth="3"
                                  />
                                  <path
                                    d="M18 2.0845
                                      a 15.9155 15.9155 0 0 1 0 31.831
                                      a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke={module.progress === 100 ? '#10b981' : '#3b82f6'}
                                    strokeWidth="3"
                                    strokeDasharray={`${module.progress || 0}, 100`}
                                  />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold">
                                  {module.progress || 0}%
                                </div>
                              </div>
                              <span className="text-xs">Progress</span>
                            </div>
                            <Link
                              href={`/modules/${module.id}`}
                              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
                            >
                              Open
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Events Tab */}
            {activeTab === "events" && (
              <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Events & Alerts</h2>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {upcomingEvents.length} upcoming, {pastEvents.length} past events
                    </p>
                  </div>
                  <button className="mt-4 md:mt-0 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition flex items-center">
                    <FiPlus className="mr-2" /> New Event
                  </button>
                </div>

                <div className="space-y-8">
                  {/* Upcoming Events */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <FiCalendar className="mr-2" /> Upcoming Events
                    </h3>
                    {upcomingEvents.length === 0 ? (
                      <div className={`p-6 text-center rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No upcoming events scheduled</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {upcomingEvents.map((event) => (
                          <div
                            key={event.id}
                            className={`p-4 rounded-lg border-l-4 border-blue-500 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} transition cursor-pointer`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{event.title}</h4>
                                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                  {new Date(event.date).toLocaleString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                              <span className={`px-2 py-1 text-xs rounded-full ${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                                Upcoming
                              </span>
                            </div>
                            {event.description && (
                              <p className={`text-sm mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {event.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Past Events */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <FiCalendar className="mr-2" /> Past Events
                    </h3>
                    {pastEvents.length === 0 ? (
                      <div className={`p-6 text-center rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No past events recorded</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {pastEvents.map((event) => (
                          <div
                            key={event.id}
                            className={`p-4 rounded-lg border-l-4 border-gray-500 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} transition cursor-pointer opacity-80 hover:opacity-100`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{event.title}</h4>
                                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {new Date(event.date).toLocaleString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                              <span className={`px-2 py-1 text-xs rounded-full ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                                Completed
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Profile Information */}
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Account Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>First Name</label>
                          <input
                            type="text"
                            defaultValue={user?.displayName?.split(' ')[0] || ""}
                            className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Last Name</label>
                          <input
                            type="text"
                            defaultValue={user?.displayName?.split(' ')[1] || ""}
                            className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                          <input
                            type="email"
                            defaultValue={user?.email || ""}
                            disabled
                            className={`w-full px-3 py-2 rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-100 border-gray-300 text-gray-500'} cursor-not-allowed`}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Preferences</h3>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="dark-mode"
                            checked={darkMode}
                            onChange={() => setDarkMode(!darkMode)}
                            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <label htmlFor="dark-mode" className={`ml-2 block text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Dark Mode
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="notifications"
                            defaultChecked
                            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <label htmlFor="notifications" className={`ml-2 block text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Email Notifications
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="weekly-reports"
                            defaultChecked
                            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <label htmlFor="weekly-reports" className={`ml-2 block text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Weekly Progress Reports
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Current Password</label>
                          <input
                            type="password"
                            className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>New Password</label>
                          <input
                            type="password"
                            className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Confirm New Password</label>
                          <input
                            type="password"
                            className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                        Save Changes
                      </button>
                    </div>
                  </div>

                  {/* Profile Card */}
                  <div>
                    <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} sticky top-20`}>
                      <div className="flex flex-col items-center">
                        <div className="relative">
                          <div className="h-24 w-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold mb-4">
                            {user?.displayName?.charAt(0) || user?.email?.charAt(0)}
                          </div>
                          <button className="absolute bottom-3 right-0 h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition">
                            <FiSettings className="h-4 w-4" />
                          </button>
                        </div>
                        <h3 className="text-xl font-semibold mt-2">
                          {user?.displayName || "User"}
                        </h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {user?.email || "No email"}
                        </p>

                        <div className="w-full mt-6 space-y-4">
                          <div>
                            <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Member Since</h4>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : "Unknown"}
                            </p>
                          </div>
                          <div>
                            <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Last Login</h4>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {user?.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleString() : "Unknown"}
                            </p>
                          </div>
                          <div>
                            <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Account Status</h4>
                            <p className="text-sm text-green-500">Active</p>
                          </div>
                        </div>

                        <button
                          onClick={handleLogout}
                          className="mt-6 w-full px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition flex items-center justify-center"
                        >
                          <FiLogOut className="mr-2" /> Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}