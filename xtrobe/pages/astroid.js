import React from "react";

export default function NasaEyesOnAsteroids() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Section Title */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">NASA Eyes on Asteroids</h2>
        <p className="text-gray-600 mt-2">Explore asteroids and comets in real-time with NASA's interactive 3D visualization.</p>
      </div>

      {/* Embedded NASA Eyes on Asteroids App */}
      <div className="w-full overflow-hidden rounded-lg shadow-lg">
        <iframe
          src="https://eyes.nasa.gov/apps/asteroids/#/home"
          width="100%"
          height="800px"
          className="w-full border-none"
          allowFullScreen
          title="NASA Eyes on Asteroids"
        ></iframe>
      </div>
    </div>
  );
}