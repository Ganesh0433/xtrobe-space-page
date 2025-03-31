import { useEffect, useState } from "react";
import Navbar from "./components/navbar";
import axios from "axios";

export default function LaunchEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/calenderevents");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        setEvents(data.events);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const isValidImageUrl = (url) =>
    url && (url.startsWith("http://") || url.startsWith("https://"));

  const handleNotify = async (event) => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/notify", {
        email: "mganeshreddy18@gmail.com",
        event_title: event.title,
        launch_time: event.launch_time,
      });
      setNotification(response.data.message);
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Error notifying:", error);
      setNotification("Failed to schedule notification.");
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-10 px-4">
        {/* Notification Popup */}
        {notification && (
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
            <div className="bg-black/80 text-white px-6 py-3 rounded-lg backdrop-blur-sm border border-blue-400/30 shadow-lg animate-fade-in">
              {notification}
            </div>
          </div>
        )}

        <div className="text-center mb-12 w-full">
          {/* Celestial divider line - blue version */}
          <div className="flex justify-center mb-6">
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-5xl font-light tracking-wide text-slate-100 mb-3">
            Upcoming <span className="font-medium text-white">Launch</span> <span className="font-medium text-white">Events</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg text-slate-300 font-normal max-w-2xl mx-auto">
            Rocket launches and mission schedules from global space agencies
          </p>

          {/* Decorative elements */}
          <div className="flex justify-center mt-6 space-x-2">
            {[1, 2, 3].map((i) => (
              <div 
                key={i}
                className="h-1 w-1 rounded-full bg-blue-400 opacity-50"
                style={{ animation: `pulse 2s infinite ${i * 0.3}s` }}
              />
            ))}
          </div>
        </div>

        {loading && (
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-800 p-6 rounded-lg shadow-lg animate-pulse"
              >
                <div className="w-full mb-4 flex justify-center">
                  <div className="bg-gray-700 w-32 h-32 rounded-lg"></div>
                </div>
                <div className="text-center">
                  <div className="h-6 bg-gray-700 rounded mt-4 w-3/4 mx-auto"></div>
                  <div className="h-4 bg-gray-700 rounded mt-2 w-5/6 mx-auto"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 mt-4">
            <p>Oops! {error}</p>
          </div>
        )}

        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {!loading && !error && events.length === 0 && (
            <div className="text-center text-gray-400 mt-4">
              No upcoming events.
            </div>
          )}

          {events.map((event, index) => (
            <div
              key={index}
              className="relative bg-gray-800 p-6 rounded-lg shadow-lg transition transform hover:scale-105 border border-gray-600"
            >
              {/* Notify button */}
              <button
                className="absolute top-2 right-2 text-white p-2 rounded-full hover:bg-blue-400 transition"
                onClick={() => handleNotify(event)}
                title="Notify Me"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405C18.79 14.79 19 13.9 19 13V9a7 7 0 10-14 0v4c0 .9.21 1.79.405 2.595L5 17h5m5 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>

              <div className="w-full mb-4 flex justify-center">
                {isValidImageUrl(event.image_url) ? (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-32 h-32 object-cover rounded-lg border border-gray-600 shadow-md"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gray-700 rounded-lg border border-gray-600 shadow-md"></div>
                )}
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold">{event.title}</h2>
                <p className="text-gray-400 mt-2">{event.launch_info}</p>
                <p className="text-gray-300 mt-2">{event.location}</p>
                <p className="text-gray-300 mt-2">{event.launch_time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}