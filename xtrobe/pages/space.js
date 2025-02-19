import React, { useState } from "react";
import Navbar from "./components/navbar";

export default function Space() {
  const nasaApps = [
    {
      title: "Solar System",
      url: "https://eyes.nasa.gov/apps/solar-system/#/home",
      image: "/images/solar-system.jpg", // Replace with your image path
    },
    {
      title: "Asteroids",
      url: "https://eyes.nasa.gov/apps/asteroids/#/home",
      image: "/images/asteroids.jpg", // Replace with your image path
    },
    {
      title: "Earth",
      url: "https://eyes.nasa.gov/apps/earth/",
      image: "/images/earth.jpg", // Replace with your image path
    },
    {
      title: "Exoplanets",
      url: "https://eyes.nasa.gov/apps/exo/",
      image: "/images/exoplanets.jpg", // Replace with your image path
    },
    {
      title: "Deep Space Network",
      url: "https://eyes.nasa.gov/apps/dsn-now/",
      image: "/images/deep-space-network.jpg", // Replace with your image path
    },
    {
      title: "Mars Rover Network",
      url: "https://eyes.nasa.gov/apps/mrn/",
      image: "/images/mars-rover.jpg", // Replace with your image path
    },
    {
      title: "Mars 2020",
      url: "https://eyes.nasa.gov/apps/mars2020/#/home",
      image: "/images/mars-2020.jpg", // Replace with your image path
    },
  ];

  const [fullScreenUrl, setFullScreenUrl] = useState(null);

  return (
    <>
    <Navbar />
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('/space-bg.jpg')] bg-cover bg-center opacity-40"></div>


 <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-16">
  <h1 className="text-6xl md:text-8xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text animate-pulse leading-none pb-2">
  Exploring Infinite Space



  </h1>
  <p className="text-lg md:text-2xl mt-4 max-w-2xl text-gray-300">
    Explore planets, spacecraft, and galaxies in real-time.
  </p>
</div>




{/* NASA Eyes Iframes Section */}
<section className="relative z-10 max-w-6xl mx-auto py-32 px-6">
  <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-200 mb-6">
    Explore Eyes Applications
  </h2>

  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {nasaApps.map((app, index) => (
      <div
        key={index}
        className="relative group bg-gray-800 rounded-xl shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
        onClick={() => setFullScreenUrl(app.url)}
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center rounded-xl"
          style={{ backgroundImage: `url(${app.image})` }}
        ></div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black opacity-60 rounded-xl"></div>

        {/* Content */}
        <div className="relative z-10 p-4 text-center">
          <h3 className="text-xl font-semibold text-white">{app.title}</h3>
        </div>
      </div>
      
    ))}
  </div>
</section>

      {/* Full-Screen Modal */}
      {fullScreenUrl && (
  <div
    className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50"
    onClick={() => setFullScreenUrl(null)}
  >
    <iframe
      src={fullScreenUrl}
      className="w-[90vw] h-[90vh] rounded-lg shadow-xl border-2 border-gray-700"
      title="NASA Full Screen"
    ></iframe>
    <button
      className="absolute top-4 right-4 text-white bg-transparent hover:bg-gray-800 focus:outline-none rounded-full w-8 h-8 flex items-center justify-center border-2 border-white transition-all duration-300"
      onClick={() => setFullScreenUrl(null)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth="2"
        className="w-5 h-5"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>

)}



    </div>
    </>
  );
}
