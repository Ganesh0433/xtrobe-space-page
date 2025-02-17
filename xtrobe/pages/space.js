import React from "react";
import { FaGlobe, FaRocket, FaSatellite, FaMeteor } from "react-icons/fa";

export default function Space() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('/space-bg.jpg')] bg-cover bg-center opacity-30"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 animate-pulse">
          NASA Eyes on the Universe
        </h1>
        <p className="text-lg md:text-2xl mt-4 max-w-2xl text-gray-300">
          Explore planets, spacecraft, and galaxies in real-time.
        </p>
        <button className="mt-8 px-6 py-3 text-lg font-semibold bg-blue-500 hover:bg-blue-700 transition-all duration-300 rounded-full shadow-lg">
          Start Exploring
        </button>
      </div>

      {/* Interactive Sections */}
      <section className="relative z-10 max-w-6xl mx-auto py-20 px-6">
        <h2 className="text-3xl md:text-5xl font-bold text-center text-gray-200">
          Discover the Universe
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: <FaGlobe size={40} />, title: "Earth & Beyond", desc: "Explore our home planet and its place in the universe." },
            { icon: <FaRocket size={40} />, title: "Space Missions", desc: "Track real-time spacecraft and missions." },
            { icon: <FaSatellite size={40} />, title: "Satellites", desc: "See how satellites orbit Earth and deep space." },
            { icon: <FaMeteor size={40} />, title: "Asteroids & Comets", desc: "Learn about space rocks and their impact." }
          ].map((item, index) => (
            <div key={index} className="bg-gray-900 p-6 rounded-lg shadow-lg hover:scale-105 transition transform duration-300">
              <div className="text-blue-400 mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="text-gray-400 mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Real-time Data Simulation */}
      <section className="relative z-10 bg-gray-900 py-20 px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white">
          Live Space Tracking
        </h2>
        <p className="text-gray-400 mt-4">
          Real-time updates on spacecraft and celestial bodies.
        </p>
        <div className="mt-8 flex justify-center">
          <div className="bg-black px-8 py-6 rounded-lg shadow-lg text-white border border-gray-700">
            <p className="text-lg">🚀 Spacecraft: <span className="text-blue-400">Voyager 1</span></p>
            <p className="text-lg">🌍 Distance from Earth: <span className="text-blue-400">14.2 Billion Km</span></p>
            <p className="text-lg">🕒 Time Since Launch: <span className="text-blue-400">46 Years</span></p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative z-10 py-20 px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-gray-200">
          Ready to Explore?
        </h2>
        <p className="text-gray-400 mt-4">
          Start your journey through space now.
        </p>
        <button className="mt-6 px-6 py-3 text-lg font-semibold bg-purple-500 hover:bg-purple-700 transition-all duration-300 rounded-full shadow-lg">
          Launch NASA Eyes
        </button>
      </section>
    </div>
  );
}
