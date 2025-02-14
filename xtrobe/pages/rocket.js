import { useEffect, useState } from "react";
import Navbar from "./components/navbar";
import axios from "axios"; // Use axios for API calls

export default function LaunchEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fallbackImage = "https://via.placeholder.com/150";

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


  const isValidImageUrl = (url) => url && (url.startsWith("http") || url.startsWith("https"));

  // Function to handle the Notify button click
  const handleNotify = async (event) => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/notify", {
        email: "mganeshreddy18@gmail.com", // Replace with the actual user's email
        event_title: event.title,
        launch_time: event.launch_time,
      });

      alert(response.data.message);
    } catch (error) {
      console.error("Error notifying:", error);
      alert("Failed to schedule notification.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-10 px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Upcoming Launch Events</h1>

        {loading && (
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg animate-pulse">
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

        {error && <div className="text-center text-red-500 mt-4"><p>Oops! {error}</p></div>}

        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {!loading && !error && events.length === 0 && <div className="text-center text-gray-400 mt-4">No upcoming events.</div>}

          {events.map((event, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg transition transform hover:scale-105 border border-gray-600">
              <div className="w-full mb-4 flex justify-center">
                <img src={isValidImageUrl(event.image_url) ? event.image_url : fallbackImage} alt={event.title} className="w-32 h-32 object-cover rounded-lg border border-gray-600 shadow-md" />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold">{event.title}</h2>
                <p className="text-gray-400 mt-2">{event.launch_info}</p>
                <p className="text-gray-300 mt-2">{event.location}</p>
                <p className="text-gray-300 mt-2">{event.launch_time}</p>
                <div className="mt-4">
                  <button 
                    className="bg-blue-500 text-white px-4 py-2 rounded-full text-lg hover:bg-blue-400 transition" 
                    onClick={() => handleNotify(event)}
                  >
                    Notify Me
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
