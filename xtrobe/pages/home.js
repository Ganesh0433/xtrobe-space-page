import { useState, useRef } from "react";
import Link from "next/link";
import { Rocket, Users, Newspaper, Star, Calendar, MessageSquare } from "lucide-react";

export default function Main() {
  const [showEventsDropdown, setShowEventsDropdown] = useState(false);
  const timerRef = useRef(null);

  // When mouse enters the events container, clear any hide timer and show the dropdown.
  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setShowEventsDropdown(true);
  };

  // When mouse leaves, start a 2-second timer before hiding the dropdown.
  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => {
      setShowEventsDropdown(false);
    }, 200);
  };

  return (
    <div className="bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-gray-900 shadow-lg fixed w-full z-10">
        <h1 className="text-2xl font-bold tracking-wide text-blue-400">Xtrobe</h1>
        <div className="space-x-6 text-gray-300 flex items-center">
          <Link href="/features" className="hover:text-white transition">
            Features
          </Link>
          <Link href="/community" className="hover:text-white transition">
            Community
          </Link>
          <Link href="/latestnews" className="hover:text-white transition">
            News
          </Link>

          {/* Events Dropdown */}
          <div
            className="relative inline-block text-left"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button className="hover:text-white transition inline-flex items-center focus:outline-none">
              Events
              {/* Optional Chevron Icon */}
              <svg
                className="ml-1 w-4 h-4 fill-current"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5.516 7.548l4.484 4.482 4.484-4.482L16 8.532l-6 6-6-6z" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showEventsDropdown && (
              <div className="absolute left-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg transition-opacity duration-300 opacity-100">
                <div className="py-1">
                  <Link
                    href="/rocket"
                    className="block px-4 py-2 hover:bg-gray-700 transition"
                  >
                    Rocket Events
                  </Link>
                  <Link
                    href="/astronomy"
                    className="block px-4 py-2 hover:bg-gray-700 transition"
                  >
                    Astronomy Events
                  </Link>
                  <Link
                    href="/iss"
                    className="block px-4 py-2 hover:bg-gray-700 transition"
                  >
                    Iss
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link href="/login">
            <button className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition">
              Sign In
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center h-screen px-6 bg-gradient-to-b from-gray-900 to-gray-950">
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight leading-tight">
          Explore the Universe with <span className="text-blue-400">Xtrobe</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl">
          Stay updated with the latest space news, track rocket launches, discover astronomy events,
          and connect with space enthusiasts worldwide.
        </p>
        <div className="mt-6 space-x-4">
          <Link href="/register">
            <button className="bg-blue-500 px-6 py-3 rounded-lg text-lg hover:bg-blue-600 transition">
              Get Started
            </button>
          </Link>
          <Link href="/features">
            <button className="bg-gray-800 px-6 py-3 rounded-lg text-lg hover:bg-gray-700 transition">
              Learn More
            </button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-8 text-center">
        <h2 className="text-4xl font-bold mb-10 text-blue-400">What Xtrobe Offers</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Users,
              title: "User Profiles",
              desc: "Customize your space profile and interact with enthusiasts.",
            },
            {
              icon: Newspaper,
              title: "Global Space News",
              desc: "Get real-time updates from NASA, SpaceX, ISRO, and more.",
            },
            {
              icon: Rocket,
              title: "Rocket Launch Events",
              desc: "Track upcoming rocket launches worldwide.",
            },
            {
              icon: Star,
              title: "Astronomy Events",
              desc: "Stay informed about meteor showers, eclipses, and more.",
            },
            {
              icon: MessageSquare,
              title: "Community Hub",
              desc: "Join discussions, share ideas, and explore the cosmos together.",
            },
            {
              icon: Calendar,
              title: "And More...",
              desc: "Constantly expanding features to enhance your space experience.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition flex flex-col items-center"
            >
              <feature.icon className="text-blue-400 w-10 h-10 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16 px-8 bg-gray-900">
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-400">Latest Space News</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: "NASA's Artemis 2 Mission Update", date: "Feb 6, 2025" },
            { title: "SpaceX Starship's Next Flight Test", date: "Feb 10, 2025" },
            { title: "ISRO Gaganyaan Prepares for Launch", date: "Feb 12, 2025" },
          ].map((news, index) => (
            <div key={index} className="p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
              <h3 className="text-lg font-semibold">{news.title}</h3>
              <p className="text-gray-400 text-sm mt-2">{news.date}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/news">
            <button className="text-blue-400 hover:text-blue-300 transition">
              See All News →
            </button>
          </Link>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 bg-blue-500 text-center">
        <h2 className="text-3xl font-bold mb-4">Start Your Space Journey with Xtrobe</h2>
        <p className="text-lg text-white mb-6">
          Join today and be part of the ultimate space exploration community.
        </p>
        <Link href="/register">
          <button className="bg-gray-900 px-6 py-3 rounded-full text-lg hover:bg-gray-700 transition">
            Get Started for Free
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center bg-gray-900 text-gray-400">
        &copy; 2024 Xtrobe. All rights reserved.
      </footer>
    </div>
  );
}
