import { useState, useEffect, useCallback } from 'react';
import Navbar from './components/navbar';

const ISS = () => {
  const [issData, setIssData] = useState(null);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [mapView, setMapView] = useState('standard'); // 'standard', 'satellite', 'dark'
  const [crewDetails, setCrewDetails] = useState([]);
  const [orbitCount, setOrbitCount] = useState(0);
  const [isDaytime, setIsDaytime] = useState(true);
  const refreshInterval = 5000; // 5 seconds

  // Enhanced crew data with roles and nationalities
  const fetchCrewDetails = useCallback(async () => {
    try {
      const response = await fetch('https://corquaid.github.io/international-space-station-APIs/JSON/people-in-space.json');
      const data = await response.json();
      setCrewDetails(data.people.filter(person => person.craft === 'ISS'));
    } catch (err) {
      console.error("Couldn't fetch detailed crew data", err);
    }
  }, []);

  const fetchIssData = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch('http://localhost:5000/iss');
      if (!response.ok) {
        throw new Error('Failed to fetch ISS data');
      }
      const data = await response.json();
      setIssData(data);
      setLastUpdated(new Date().toLocaleTimeString());
      setError(null);
      
      // Calculate if ISS is in daylight (simplified)
      const now = new Date();
      const hours = now.getUTCHours();
      setIsDaytime(hours > 6 && hours < 18);
      
      // Increment orbit count (approx every 90 minutes)
      if (issData?.timestamp) {
        const prevTime = new Date(issData.timestamp).getTime();
        const currentTime = new Date(data.timestamp).getTime();
        if (currentTime - prevTime > 80 * 60 * 1000) { // ~90 minutes
          setOrbitCount(prev => prev + 1);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsRefreshing(false);
    }
  }, [issData?.timestamp]);

  // Auto-refresh effect
  useEffect(() => {
    fetchIssData();
    fetchCrewDetails();
    let interval;
    if (autoRefresh) {
      interval = setInterval(fetchIssData, refreshInterval);
    }
    return () => interval && clearInterval(interval);
  }, [fetchIssData, autoRefresh]);

  // Loading Spinner Component
  const Spinner = () => (
    <div className="flex justify-center items-center py-10">
      <div className="w-16 h-16 border-4 border-dashed rounded-full border-blue-500 animate-spin"></div>
    </div>
  );

  // Error State
  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-gray-900 to-black text-white p-6">
          <div className="max-w-md text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">🚨 Connection Lost with ISS</h1>
            <p className="text-gray-400 mb-6">
              We're having trouble establishing contact with the International Space Station. 
              This could be due to a temporary communication blackout or network issues.
            </p>
            <button
              onClick={fetchIssData}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded transition flex items-center gap-2 mx-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Re-establish Connection
            </button>
          </div>
        </div>
      </>
    );
  }

  // Loading State (if no data yet)
  if (!issData) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">Establishing Connection with ISS...</h1>
            <div className="relative">
              <Spinner />
              <p className="mt-4 text-gray-400">
                Synchronizing with the International Space Station's orbit...
              </p>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-blue-500 rounded-full opacity-10 animate-ping"></div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Calculate visibility (simplified)
  const calculateVisibility = (latitude) => {
    if (latitude > 50) return 'Northern Hemisphere';
    if (latitude < -50) return 'Southern Hemisphere';
    return 'Equatorial Region';
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8">
            <div className="flex items-center mb-4 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-white">
                ISS Tracker
              </h1>
              <span className="ml-3 px-2 py-1 text-xs bg-blue-900 rounded-full animate-pulse">
                LIVE
              </span>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
              {lastUpdated && (
                <div className="flex items-center text-sm text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Updated: {lastUpdated}
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={fetchIssData}
                  disabled={isRefreshing}
                  className={`px-4 py-2 rounded-lg ${
                    isRefreshing
                      ? 'bg-blue-500 opacity-70 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } transition flex items-center gap-2 text-sm md:text-base`}
                >
                  {isRefreshing ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 md:h-5 md:w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Refresh
                    </>
                  )}
                </button>
                <button
                  onClick={() => setAutoRefresh((prev) => !prev)}
                  className={`px-4 py-2 text-sm md:text-base rounded-lg flex items-center gap-2 ${
                    autoRefresh ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 hover:bg-gray-600'
                  } transition`}
                >
                  {autoRefresh ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Pause
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Resume
                    </>
                  )}
                </button>
              </div>
            </div>
          </header>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-gray-800/50 backdrop-blur-sm p-3 rounded-lg border border-gray-700">
              <p className="text-xs text-gray-400">ALTITUDE</p>
              <p className="text-xl font-bold">~408 km</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-3 rounded-lg border border-gray-700">
              <p className="text-xs text-gray-400">VELOCITY</p>
              <p className="text-xl font-bold">{issData.speed_km_h} km/h</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-3 rounded-lg border border-gray-700">
              <p className="text-xs text-gray-400">ORBIT COUNT</p>
              <p className="text-xl font-bold">{orbitCount}</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-3 rounded-lg border border-gray-700">
              <p className="text-xs text-gray-400">DAY/NIGHT</p>
              <p className="text-xl font-bold">{isDaytime ? 'Day' : 'Night'}</p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Live Stream */}
              <section className="rounded-xl overflow-hidden shadow-2xl border border-gray-700">
                <div className=" px-4 py-3 flex justify-between items-center">
                  <h2 className="font-semibold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Live ISS Stream
                  </h2>
                  <div className="flex items-center text-xs bg-black/30 px-2 py-1 rounded">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></div>
                    LIVE
                  </div>
                </div>
                <iframe
                  width="100%"
                  height="400"
                  src="https://www.youtube.com/embed/xRPjKQtRXR8?autoplay=1&mute=1"
                  title="Live ISS Stream"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="aspect-video"
                ></iframe>
              </section>

              {/* Map View */}
              <section className="rounded-xl overflow-hidden shadow-2xl border border-gray-700">
                <div className=" px-4 py-3 flex justify-between items-center">
                  <h2 className="font-semibold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Current Position
                  </h2>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => setMapView('standard')} 
                      className={`px-2 py-1 text-xs rounded ${mapView === 'standard' ? 'bg-blue-600' : 'bg-gray-700'}`}
                    >
                      Standard
                    </button>
                    <button 
                      onClick={() => setMapView('satellite')} 
                      className={`px-2 py-1 text-xs rounded ${mapView === 'satellite' ? 'bg-blue-600' : 'bg-gray-700'}`}
                    >
                      Satellite
                    </button>
                    <button 
                      onClick={() => setMapView('dark')} 
                      className={`px-2 py-1 text-xs rounded ${mapView === 'dark' ? 'bg-blue-600' : 'bg-gray-700'}`}
                    >
                      Dark
                    </button>
                  </div>
                </div>
                <div className="aspect-video bg-gray-800 flex items-center justify-center">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://maps.google.com/maps?q=${issData.latitude},${issData.longitude}&z=3&output=embed&t=${mapView}`}
                    frameBorder="0"
                    className="border-0"
                  ></iframe>
                </div>
                <div className="p-4 bg-gray-800/50 border-t border-gray-700">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400">LATITUDE</p>
                      <p className="font-mono">{issData.latitude}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">LONGITUDE</p>
                      <p className="font-mono">{issData.longitude}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">VISIBILITY</p>
                      <p className="font-mono">{calculateVisibility(issData.latitude)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">TIME ZONE</p>
                      <p className="font-mono">UTC</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Crew Section */}
              <section className="rounded-xl overflow-hidden shadow-2xl border border-gray-700">
                <div className=" px-4 py-3">
                  <h2 className="font-semibold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Current Crew ({issData.crew.length})
                  </h2>
                </div>
                <div className="p-4 bg-gray-800/50">
                  {issData.crew.length > 0 ? (
                    <ul className="space-y-3">
                      {issData.crew.map((member, index) => {
                        const crewDetail = crewDetails.find(d => d.name === member) || {};
                        return (
                          <li key={index} className="flex items-center gap-3 p-2 hover:bg-gray-700/50 rounded-lg transition">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                            </div>
                            <div className="flex-grow">
                              <p className="font-medium">{member}</p>
                              {crewDetail.title && (
                                <p className="text-xs text-gray-400">{crewDetail.title} • {crewDetail.nationality || 'Unknown'}</p>
                              )}
                            </div>
                            <div className="flex-shrink-0">
                              <span className="text-xs px-2 py-1 bg-gray-700 rounded-full">
                                {crewDetail.daysInSpace ? `${crewDetail.daysInSpace} days` : 'Active'}
                              </span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <div className="text-center py-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="mt-2 text-gray-400">No crew members currently aboard the ISS</p>
                    </div>
                  )}
                </div>
              </section>

              {/* ISS Facts */}
              <section className="rounded-xl overflow-hidden shadow-2xl border border-gray-700">
                <div className=" px-4 py-3">
                  <h2 className="font-semibold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    ISS Quick Facts
                  </h2>
                </div>
                <div className="p-4 bg-gray-800/50">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-sm">
                        <span className="font-medium">Orbit Height:</span> 408 km above Earth
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-sm">
                        <span className="font-medium">Orbit Speed:</span> 28,000 km/h (completes 16 orbits per day)
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-sm">
                        <span className="font-medium">Size:</span> 109m x 73m (larger than a football field)
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-sm">
                        <span className="font-medium">Launch Date:</span> First module launched in 1998
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-sm">
                        <span className="font-medium">Cost:</span> Over $150 billion (most expensive object ever built)
                      </p>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Next Pass Section */}
              <section className="rounded-xl overflow-hidden shadow-2xl border border-gray-700">
                <div className=" px-4 py-3">
                  <h2 className="font-semibold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Next Visible Pass
                  </h2>
                </div>
                <div className="p-4 bg-gray-800/50">
                  <div className="text-center py-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    <p className="mt-3 text-gray-300">Enter your location to see when the ISS will be visible</p>
                    <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition">
                      Set Location
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Footer */}
          <footer className="text-center text-xs text-gray-500 mt-8 pb-6">
            <p>Data updates every 5 seconds. The ISS completes an orbit around Earth approximately every 90 minutes.</p>
            <p className="mt-1">© {new Date().getFullYear()} ISS Tracker | Not affiliated with NASA or any space agency</p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default ISS;