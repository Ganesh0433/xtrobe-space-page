import { useEffect, useState } from "react";
import Navbar from "../components/navbar";

export default function LatestNews() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/scrape")
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setArticles(data.data);
          const uniqueCategories = ["All", ...new Set(data.data.map((article) => article.category))];
          setCategories(uniqueCategories);
        } else {
          console.error(data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching news:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredArticles = articles.filter((article) => selectedCategory === "All" || article.category === selectedCategory).slice(0, -1);

  // Add useEffect to load Twitter widgets script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12 w-full">
  {/* Matching divider line */}
  <div className="flex justify-center mb-6">
    <div className="h-px w-24 bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
  </div>

  {/* Consistent heading style */}
  <h1 className="text-4xl md:text-5xl font-light tracking-wide text-slate-100 mb-3">
    Latest <span className="font-medium text-white">Space</span> <span className="font-medium text-white">News</span>
  </h1>

  {/* Matching subheading style */}
  <p className="text-lg text-slate-300 font-normal max-w-2xl mx-auto">
    Stay updated with the latest events from space agencies and astronomy discoveries
  </p>

  {/* Consistent decorative elements */}
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
          {/* Loading Skeleton */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse rounded-xl shadow-lg overflow-hidden bg-gray-700">
                  <div className="w-full h-48 bg-gray-600"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-600 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-600 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-600 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Article Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article, index) => (
  <div
    key={index}
    className="rounded-xl shadow-lg overflow-hidden bg-gray-800 hover:shadow-xl transition-shadow duration-300"
  >
    <a href={article.link} target="_blank" rel="noopener noreferrer" className="block">
      
      {/* Image Wrapper with Fixed Height */}
      <div className="relative w-full h-48 overflow-hidden bg-gray-700 flex items-center justify-center">
        {article.image && article.image.trim() !== "" ? (
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-300"
            onError={(e) => e.target.style.display = "none"} // Hides broken image
          />
        ) : (
          <span className="text-gray-500 text-sm"></span> // Placeholder text
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 hover:text-blue-400 transition-colors duration-300">
          {article.title}
        </h3>
        <p className="text-gray-400 mb-4">{article.description}</p>
        <div className="flex items-center text-blue-400 hover:text-blue-500 transition-colors duration-300">
          <span className="text-sm font-medium">Read More</span>
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </div>
    </a>
  </div>
))}


              </div>
            </>
          )}
        </div>

        {/* Latest from Space Agencies Section */}
        <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen p-8">
        <div className="text-center my-12 w-full">
  {/* Matching cosmic divider */}
  <div className="flex justify-center mb-6">
    <div className="h-px w-24 bg-gradient-to-r from-transparent via-indigo-400 to-transparent" />
  </div>

  {/* Consistent typography treatment */}
  <h2 className="text-4xl md:text-5xl font-light tracking-wide text-slate-100 mb-3">
    Latest from <span className="font-medium text-white">Space</span> <span className="font-medium text-white">Agencies</span>
  </h2>

  {/* Harmonized description */}
  <p className="text-lg text-slate-300 font-normal max-w-2xl mx-auto">
    Stay updated with the latest news and discoveries from space agencies worldwide
  </p>

  {/* Signature animated indicators */}
  <div className="flex justify-center mt-6 space-x-2">
    {[1, 2, 3].map((i) => (
      <div 
        key={i}
        className="h-1 w-1 rounded-full bg-indigo-400 opacity-50"
        style={{ animation: `pulse 2s infinite ${i * 0.3}s` }}
      />
    ))}
  </div>
</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
            {[
              { name: "NASA", url: "https://twitter.com/NASA?ref_src=twsrc%5Etfw" },
              { name: "ESA", url: "https://twitter.com/ESA?ref_src=twsrc%5Etfw" },
              { name: "ISRO", url: "https://twitter.com/ISRO?ref_src=twsrc%5Etfw" },
              { name: "JAXA", url: "https://twitter.com/JAXA_en?ref_src=twsrc%5Etfw" },
              { name: "SpaceX", url: "https://twitter.com/SpaceX?ref_src=twsrc%5Etfw" },
              { name: "Roscosmos", url: "https://twitter.com/Roscosmos?ref_src=twsrc%5Etfw" },
            ].map((agency) => (
              <div key={agency.name} className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-600">
                <h3 className="text-xl font-semibold text-gray-300 mb-4">{agency.name}</h3>
                <a
                  className="twitter-timeline"
                  href={agency.url}
                  data-height="400"
                  data-chrome="noheader nofooter noborders"
                >
                  <p className="text-white">Tweets by {agency.name}</p>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
