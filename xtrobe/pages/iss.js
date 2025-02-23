import { useState, useEffect, useCallback } from 'react';
import Navbar from './components/navbar';

const ISS = () => {
  const [issData, setIssData] = useState(null);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const refreshInterval = 10000; // 10 seconds

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
    } catch (err) {
      setError(err.message);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Auto-refresh effect
  useEffect(() => {
    fetchIssData();
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
          <h1 className="text-3xl md:text-4xl font-bold mb-6">🚨 {error}</h1>
          <button
            onClick={fetchIssData}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded transition"
          >
            Retry
          </button>
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
          <h1 className="text-center text-3xl md:text-4xl font-bold mb-8">Loading ISS Data...</h1>
          <Spinner />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h1 className="text-4xl font-extrabold text-center mb-4 md:mb-0">
              🌌 ISS Location &amp; Crew
            </h1>
            <div className="flex flex-col md:flex-row items-center gap-4">
              {lastUpdated && (
                <p className="text-sm text-gray-400">Last Updated: {lastUpdated}</p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={fetchIssData}
                  disabled={isRefreshing}
                  className={`px-5 py-2 rounded ${
                    isRefreshing
                      ? 'bg-blue-500 opacity-70 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } transition flex items-center gap-2`}
                >
                  {isRefreshing ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
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
                    'Refresh Data'
                  )}
                </button>
                <button
                  onClick={() => setAutoRefresh((prev) => !prev)}
                  className="px-5 py-2 bg-green-600 hover:bg-green-700 rounded transition"
                >
                  {autoRefresh ? 'Pause Auto-Refresh' : 'Resume Auto-Refresh'}
                </button>
              </div>
            </div>
          </header>

          {/* Live ISS Stream */}
          <section className="mb-12">
            <div className="rounded-lg overflow-hidden shadow-2xl border border-blue-500">
              <div className="bg-blue-500 text-black text-xl font-semibold text-center py-2">
                Live ISS Stream
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
              ></iframe>
            </div>
          </section>

          {/* ISS Data Cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Location Card */}
            <div className="p-6 bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
              <h2 className="text-2xl font-bold text-blue-400 mb-4">ISS Location</h2>
              <p className="text-gray-300 mb-2">
                <span className="font-medium">Latitude:</span> {issData.latitude}
              </p>
              <p className="text-gray-300">
                <span className="font-medium">Longitude:</span> {issData.longitude}
              </p>
            </div>

            {/* Speed Card */}
            <div className="p-6 bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
              <h2 className="text-2xl font-bold text-blue-400 mb-4">ISS Speed</h2>
              <p className="text-gray-300">
                <span className="font-medium">Speed:</span> {issData.speed_km_h} km/h
              </p>
            </div>

            {/* Model Card */}
            <div className="p-6 bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
              <h2 className="text-2xl font-bold text-blue-400 mb-4">ISS Model</h2>
              <p className="text-gray-300">
                <span className="font-medium">Model:</span> Zarya / Russian Orbital Segment (ROS)
              </p>
            </div>
          </section>

          {/* Crew Members */}
          <section className="mb-12">
            <div className="p-6 bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
              <h2 className="text-2xl font-bold text-blue-400 mb-4">Crew Members</h2>
              {issData.crew && issData.crew.length > 0 ? (
                <ul className="list-disc pl-6 text-gray-300 space-y-1">
                  {issData.crew.map((member, index) => (
                    <li key={index} className="text-lg">
                      {member}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-300">No crew members on the ISS at the moment.</p>
              )}
            </div>
          </section>

          {/* About the ISS */}
          <section className="p-6 bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
            <h2 className="text-2xl font-bold text-blue-400 mb-6">About the ISS</h2>
            <div className="space-y-6 text-gray-400 leading-relaxed">
              <article>
                <h3 className="text-xl font-semibold text-blue-300 mb-2">1. History</h3>
                <p>
                  The International Space Station is a hallmark of global collaboration and technological innovation. Operating as a microgravity laboratory since 2000, it has expanded our understanding of space and science.
                  <br />
                  <a
                    href="https://www.nasa.gov/mission_pages/station/main/index.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Learn more about its history.
                  </a>
                </p>
              </article>

              <article>
                <h3 className="text-xl font-semibold text-blue-300 mb-2">2. Purpose &amp; Research</h3>
                <p>
                  Designed for scientific research in microgravity, the ISS enables experiments in fluid dynamics, biology, and material sciences, leading to breakthroughs that benefit life on Earth.
                  <br />
                  <a
                    href="https://www.nasa.gov/mission_pages/station/research/index.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Explore its research initiatives.
                  </a>
                </p>
              </article>

              <article>
                <h3 className="text-xl font-semibold text-blue-300 mb-2">3. Construction &amp; Modules</h3>
                <p>
                  Constructed by an international consortium, the ISS is comprised of various modules—each representing a unique contribution from partner nations. Its assembly is an engineering marvel.
                  <br />
                  <a
                    href="https://www.nasa.gov/mission_pages/station/structure/index.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Discover its construction details.
                  </a>
                </p>
              </article>

              <article>
                <h3 className="text-xl font-semibold text-blue-300 mb-2">4. Onboard Systems &amp; Life Support</h3>
                <p>
                  The ISS hosts advanced life support systems—ranging from oxygen generation to water recycling—ensuring the safety and well-being of its crew while supporting cutting-edge research.
                  <br />
                  <a
                    href="https://www.nasa.gov/mission_pages/station/spacewalks/index.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Read about onboard systems.
                  </a>
                </p>
              </article>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default ISS;
