import { useEffect, useState } from "react";
import Navbar from "./components/navbar";

export default function Astronomy() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/astronomy")
      .then((response) => response.json())
      .then((data) => {
        setEvents(data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch data");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <>
      <Navbar/>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-10 px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
          🌌 Astronomy Events
        </h1>

        <div className="max-w-4xl mx-auto space-y-6">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-6 p-6 bg-gray-800 rounded-lg shadow-lg animate-pulse"
            >
              <div className="w-20 h-20 bg-gray-700 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-600 rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-gray-600 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </>
    );
  }

  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-10 px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
        🌌 Astronomy Events
      </h1>

      <div className="max-w-4xl mx-auto space-y-6">
        {events.map((event, index) => (
          <div
            key={index}
            className="flex items-center gap-6 p-6 bg-gray-800 rounded-lg shadow-lg transform transition hover:scale-105"
          >
            {event.image && (
              <img
                src={event.image}
                alt={event.image_description}
                className="w-20 h-20 object-cover rounded-lg border border-gray-600"
              />
            )}
            <div>
              <h2 className="text-xl font-semibold">{event.title}</h2>
              <p className="text-gray-400">{event.event_date}</p>
              <p className="mt-2 text-gray-300">{event.description}</p>
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-blue-400 hover:text-blue-300 transition"
              >
                🔗 More Info
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
