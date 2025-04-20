import React, { useState } from "react";

export default function Study() {
  const [activeModule, setActiveModule] = useState("solarSystem");
  const [selectedItem, setSelectedItem] = useState(null);
  const [nightMode, setNightMode] = useState(true);

  // Sample data with placeholder images from NASA
  const solarSystem = {
    title: "Solar System",
    description: "Explore our cosmic neighborhood with its eight planets, dwarf planets, moons, and other celestial objects.",
    items: [
      {
        name: "Mercury",
        type: "Terrestrial Planet",
        diameter: "4,880 km",
        distanceFromSun: "57.9 million km",
        orbitalPeriod: "88 Earth days",
        facts: [
          "Smallest planet in our solar system",
          "No atmosphere to speak of",
          "Surface temperatures range from -173°C to 427°C",
          "Has the most craters in the solar system",
          "Named after the Roman messenger god"
        ],
        image: "./images/mercury.png"
      },
      {
        name: "Venus",
        type: "Terrestrial Planet",
        diameter: "12,104 km",
        distanceFromSun: "108.2 million km",
        orbitalPeriod: "225 Earth days",
        facts: [
          "Hottest planet with surface temperatures over 450°C",
          "Rotates backwards compared to most planets",
          "Atmosphere is 96% carbon dioxide",
          "A day on Venus is longer than its year",
          "Often called Earth's sister planet due to similar size"
        ],
        image:"./images/venus.png"
      },
      {
        name: "Earth",
        type: "Terrestrial Planet",
        diameter: "12,742 km",
        distanceFromSun: "149.6 million km",
        orbitalPeriod: "365.25 days",
        facts: [
          "Only known planet to support life",
          "71% of surface covered by water",
          "Has one natural satellite (the Moon)",
          "Atmosphere is 78% nitrogen, 21% oxygen",
          "Tilted at 23.5° which causes seasons"
        ],
        image: "./images/earth.png"
      },
      {
        name: "Mars",
        type: "Terrestrial Planet",
        diameter: "6,779 km",
        distanceFromSun: "227.9 million km",
        orbitalPeriod: "687 Earth days",
        facts: [
          "Known as the Red Planet due to iron oxide on its surface",
          "Home to the tallest volcano in the solar system (Olympus Mons)",
          "Has two small moons (Phobos and Deimos)",
          "Evidence suggests it once had liquid water",
          "Target for human colonization efforts"
        ],
        image: "./images/mars.png"
      },
      {
        name: "Jupiter",
        type: "Gas Giant",
        diameter: "139,820 km",
        distanceFromSun: "778.5 million km",
        orbitalPeriod: "11.9 Earth years",
        facts: [
          "Largest planet in our solar system",
          "Has at least 79 known moons",
          "Great Red Spot is a storm larger than Earth",
          "Strongest magnetic field of all planets",
          "Could have become a star if it were 80 times more massive"
        ],
        image: "./images/jupiter.png"
      },
      {
        name: "Saturn",
        type: "Gas Giant",
        diameter: "116,460 km",
        distanceFromSun: "1.4 billion km",
        orbitalPeriod: "29.5 Earth years",
        facts: [
          "Known for its spectacular ring system",
          "Least dense planet - would float in water",
          "Has 82 confirmed moons (as of 2021)",
          "Titan (its largest moon) has a thick atmosphere",
          "Wind speeds can reach 1,800 km/h at equator"
        ],
        image: "./images/saturn.png"
      },
      {
        name: "Uranus",
        type: "Ice Giant",
        diameter: "50,724 km",
        distanceFromSun: "2.9 billion km",
        orbitalPeriod: "84 Earth years",
        facts: [
          "Rotates on its side (98° tilt)",
          "Coldest planetary atmosphere in solar system (-224°C)",
          "Has 13 known rings",
          "27 known moons, all named after Shakespeare characters",
          "Discovered in 1781 by William Herschel"
        ],
        image:"./images/uranus.png"
      },
      {
        name: "Neptune",
        type: "Ice Giant",
        diameter: "49,244 km",
        distanceFromSun: "4.5 billion km",
        orbitalPeriod: "165 Earth years",
        facts: [
          "Windiest planet with speeds up to 2,100 km/h",
          "Discovered through mathematical predictions",
          "Has 14 known moons",
          "Great Dark Spot was a massive storm like Jupiter's",
          "Only spacecraft to visit was Voyager 2 in 1989"
        ],
        image:"./images/neptune.png"
      }
    ]
  };

  const stars = {
    title: "Stars",
    description: "Learn about the luminous spheres of plasma held together by gravity that light up our universe.",
    items: [
      {
        name: "Sun",
        type: "G-type main-sequence (G2V)",
        diameter: "1.4 million km",
        distance: "1 AU (149.6 million km)",
        facts: [
          "Contains 99.86% of the mass in the Solar System",
          "Surface temperature about 5,500°C",
          "Core temperature reaches 15 million°C",
          "About 4.6 billion years old",
          "Will become a red giant in about 5 billion years"
        ],
        image: "https://apod.nasa.gov/apod/image/2106/SunSDO_960.jpg"
      },
      {
        name: "Sirius",
        type: "Binary star system (A1V + DA2)",
        diameter: "2.4 million km (Sirius A)",
        distance: "8.6 light-years",
        facts: [
          "Brightest star in Earth's night sky",
          "About twice as massive as the Sun",
          "Sirius B is a white dwarf companion",
          "Visible from almost everywhere on Earth",
          "Part of the Canis Major constellation"
        ],
        image: "https://apod.nasa.gov/apod/image/2103/SiriusHubble_960.jpg"
      },
      {
        name: "Betelgeuse",
        type: "Red supergiant (M1-2Ia)",
        diameter: "~1.3 billion km",
        distance: "~642.5 light-years",
        facts: [
          "One of the largest stars visible to the naked eye",
          "Could go supernova any time in next 100,000 years",
          "Radius would extend past Jupiter if placed at Sun's position",
          "Name comes from Arabic meaning 'hand of Orion'",
          "Surface temperature about 3,500K"
        ],
        image: "https://apod.nasa.gov/apod/image/2002/BetelgeuseHubble_960.jpg"
      },
      {
        name: "Proxima Centauri",
        type: "Red dwarf (M5.5Ve)",
        diameter: "214,000 km",
        distance: "4.24 light-years",
        facts: [
          "Closest known star to the Sun",
          "Part of the Alpha Centauri triple star system",
          "Hosts Proxima Centauri b, an exoplanet in habitable zone",
          "Flare star with dramatic brightness variations",
          "Too faint to see with naked eye"
        ],
        image: "https://apod.nasa.gov/apod/image/1608/ProximaCentauri_eso_960.jpg"
      }
    ]
  };

  const galaxies = {
    title: "Galaxies",
    description: "Discover the vast collections of stars, gas, dust, and dark matter bound together by gravity.",
    items: [
      {
        name: "Milky Way",
        type: "Barred spiral galaxy (SBbc)",
        diameter: "100,000-180,000 light-years",
        distance: "We're inside it!",
        facts: [
          "Contains 100-400 billion stars",
          "Our Solar System is about 27,000 light-years from the center",
          "Takes about 240 million years to complete one rotation",
          "Has a supermassive black hole at its center (Sagittarius A*)",
          "Part of the Local Group of galaxies"
        ],
        image: "https://apod.nasa.gov/apod/image/2105/MilkyWayPan_NASA_960.jpg"
      },
      {
        name: "Andromeda (M31)",
        type: "Spiral galaxy (SA(s)b)",
        diameter: "~220,000 light-years",
        distance: "2.5 million light-years",
        facts: [
          "Closest spiral galaxy to Milky Way",
          "On collision course with Milky Way (in 4.5 billion years)",
          "Contains about 1 trillion stars",
          "Visible to naked eye under dark skies",
          "First identified as a separate galaxy in 1923"
        ],
        image: "https://apod.nasa.gov/apod/image/2101/M31_2020_11_20_4_5_900.jpg"
      },
      {
        name: "Triangulum (M33)",
        type: "Spiral galaxy (SA(s)cd)",
        diameter: "~60,000 light-years",
        distance: "2.73 million light-years",
        facts: [
          "Third largest member of Local Group",
          "May be a satellite of Andromeda Galaxy",
          "Contains about 40 billion stars",
          "Site of vigorous star formation",
          "Contains largest stellar-mass black hole known (M33 X-7)"
        ],
        image: "https://apod.nasa.gov/apod/image/2101/M33-HaLRGB-2020-10_CDK_1000_LL_67pc.jpg"
      },
      {
        name: "Sombrero (M104)",
        type: "Unclassified (between elliptical and spiral)",
        diameter: "~50,000 light-years",
        distance: "29.3 million light-years",
        facts: [
          "Famous for its brilliant white bulge and dust lane",
          "Contains about 100 billion stars",
          "Supermassive black hole at center (1 billion solar masses)",
          "First galaxy discovered to have a redshift",
          "Edge-on orientation makes dust ring prominent"
        ],
        image: "https://apod.nasa.gov/apod/image/2105/M104_CDK1000_67pc_LL_APOD.jpg"
      }
    ]
  };

  const nebulae = {
    title: "Nebulae",
    description: "Explore these interstellar clouds of dust, hydrogen, helium and other ionized gases.",
    items: [
      {
        name: "Orion Nebula (M42)",
        type: "Diffuse nebula",
        diameter: "24 light-years",
        distance: "1,344 light-years",
        facts: [
          "One of the brightest nebulae visible to naked eye",
          "Star-forming region with many protoplanetary disks",
          "Part of the larger Orion Molecular Cloud Complex",
          "Contains the Trapezium cluster of young stars",
          "Has been studied since 1610"
        ],
        image: "https://apod.nasa.gov/apod/image/2101/M42_2020_11_20_4_5_900.jpg"
      },
      {
        name: "Helix Nebula (NGC 7293)",
        type: "Planetary nebula",
        diameter: "2.87 light-years",
        distance: "655 light-years",
        facts: [
          "One of the closest planetary nebulae to Earth",
          "Formed by a dying Sun-like star",
          "Sometimes called the 'Eye of God' nebula",
          "Central star will become a white dwarf",
          "Discovered by Karl Ludwig Harding in 1824"
        ],
        image: "https://apod.nasa.gov/apod/image/2103/NGC7293-HST-Subaru-LL_APOD.jpg"
      },
      {
        name: "Crab Nebula (M1)",
        type: "Supernova remnant",
        diameter: "11 light-years",
        distance: "6,500 light-years",
        facts: [
          "Result of supernova observed in 1054 AD",
          "Contains a pulsar at its center",
          "First astronomical object identified with a historical supernova",
          "Expanding at about 1,500 km/s",
          "Strong source of radio waves and gamma rays"
        ],
        image: "https://apod.nasa.gov/apod/image/2105/M1_HubbleSubaru_960.jpg"
      },
      {
        name: "Pillars of Creation (in M16)",
        type: "Star-forming region",
        diameter: "4-5 light-years",
        distance: "7,000 light-years",
        facts: [
          "Made famous by 1995 Hubble image",
          "Columns of interstellar gas and dust",
          "Being eroded by UV light from nearby stars",
          "New stars are forming within the pillars",
          "Part of the Eagle Nebula"
        ],
        image: "https://apod.nasa.gov/apod/image/2101/M16_Pillars_HubbleOzsga_960.jpg"
      }
    ]
  };

  const exoplanets = {
    title: "Exoplanets",
    description: "Journey to worlds orbiting distant stars beyond our solar system.",
    items: [
      {
        name: "Proxima Centauri b",
        type: "Terrestrial (potentially rocky)",
        diameter: "~1.3 Earth diameters",
        distance: "4.24 light-years",
        facts: [
          "Closest known exoplanet to Earth",
          "Orbits in habitable zone of Proxima Centauri",
          "Year lasts just 11.2 Earth days",
          "May be tidally locked to its star",
          "Potential target for future interstellar missions"
        ],
        image: "https://apod.nasa.gov/apod/image/1608/ProximaCentaurib_eso_960.jpg"
      },
      {
        name: "TRAPPIST-1 System",
        type: "7 terrestrial planets",
        diameter: "0.76-1.13 Earth diameters",
        distance: "39.6 light-years",
        facts: [
          "All 7 planets could have liquid water",
          "Orbit an ultracool red dwarf star",
          "Planets are very close to each other",
          "Tidal locking likely for most planets",
          "Prime targets for atmospheric study"
        ],
        image: "https://apod.nasa.gov/apod/image/1702/TRAPPIST-1_Art_960.jpg"
      },
      {
        name: "HD 189733 b",
        type: "Hot Jupiter",
        diameter: "1.13 Jupiter diameters",
        distance: "63 light-years",
        facts: [
          "First exoplanet with mapped temperature distribution",
          "Atmosphere contains silicate particles (raindrops of glass)",
          "Deep blue color from scattered light",
          "Surface temperature about 1,000°C",
          "Orbits its star every 2.2 days"
        ],
        image: "https://apod.nasa.gov/apod/image/1312/HD189733b_hubble_960.jpg"
      },
      {
        name: "Kepler-186f",
        type: "Terrestrial (Earth-sized)",
        diameter: "1.11 Earth diameters",
        distance: "492 light-years",
        facts: [
          "First Earth-size planet in habitable zone discovered",
          "Orbits a red dwarf star",
          "Receives about 1/3 the stellar energy Earth gets",
          "Possible rocky composition",
          "Year lasts 130 Earth days"
        ],
        image: "https://apod.nasa.gov/apod/image/1404/Kepler186f_Art_960.jpg"
      }
    ]
  };

  const renderModuleContent = () => {
    const data = {
      solarSystem,
      stars,
      galaxies,
      nebulae,
      exoplanets
    }[activeModule];

    if (selectedItem) {
      return (
        <div className={`p-6 rounded-lg shadow-lg ${nightMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
          <button 
            onClick={() => setSelectedItem(null)}
            className={`mb-4 px-4 py-2 rounded-md transition ${nightMode ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
          >
            ← Back to {data.title}
          </button>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <img 
                src={selectedItem.image} 
                alt={selectedItem.name} 
                className="w-full h-auto rounded-lg shadow-md"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "https://apod.nasa.gov/apod/image/2101/placeholder.jpg"
                }}
              />
              <div className={`mt-4 p-3 rounded ${nightMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                <h3 className="font-bold mb-1">Quick Stats</h3>
                <p className="text-sm"><span className="font-semibold">Type:</span> {selectedItem.type}</p>
                <p className="text-sm"><span className="font-semibold">Diameter:</span> {selectedItem.diameter}</p>
                {selectedItem.distanceFromSun && (
                  <p className="text-sm"><span className="font-semibold">Distance from Sun:</span> {selectedItem.distanceFromSun}</p>
                )}
                {selectedItem.distance && (
                  <p className="text-sm"><span className="font-semibold">Distance:</span> {selectedItem.distance}</p>
                )}
                {selectedItem.orbitalPeriod && (
                  <p className="text-sm"><span className="font-semibold">Orbital Period:</span> {selectedItem.orbitalPeriod}</p>
                )}
              </div>
            </div>
            <div className="md:w-2/3">
              <h2 className={`text-3xl font-bold mb-2 ${nightMode ? 'text-white' : 'text-gray-900'}`}>{selectedItem.name}</h2>
              <div className={`mb-6 p-4 rounded-lg ${nightMode ? 'bg-gray-800' : 'bg-blue-50'}`}>
                <h3 className="text-xl font-semibold mb-2">Key Facts:</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {selectedItem.facts.map((fact, index) => (
                    <li key={index} className={nightMode ? 'text-gray-300' : 'text-gray-700'}>{fact}</li>
                  ))}
                </ul>
              </div>
              
              <div className={`mt-4 p-4 rounded-lg ${nightMode ? 'bg-gray-800' : 'bg-blue-50'}`}>
                <h3 className="text-xl font-semibold mb-2">Did You Know?</h3>
                <p className={nightMode ? 'text-gray-300' : 'text-gray-700'}>
                  {getRandomDidYouKnow(selectedItem.name)}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <h2 className={`text-3xl font-bold mb-2 ${nightMode ? 'text-white' : 'text-gray-900'}`}>{data.title}</h2>
        <p className={`mb-6 ${nightMode ? 'text-gray-300' : 'text-gray-700'}`}>{data.description}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.items.map((item, index) => (
            <div 
              key={index}
              onClick={() => setSelectedItem(item)}
              className={`rounded-lg overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer hover:scale-105 transform duration-300 ${nightMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}`}
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = "https://apod.nasa.gov/apod/image/2101/placeholder.jpg"
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className={`text-xl font-bold mb-2 ${nightMode ? 'text-white' : 'text-gray-900'}`}>{item.name}</h3>
                <p className={`text-sm ${nightMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.type}</p>
                <div className="mt-3 flex justify-between text-sm">
                  <span className={`px-2 py-1 rounded ${nightMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                    {item.diameter}
                  </span>
                  {item.distanceFromSun ? (
                    <span className={`px-2 py-1 rounded ${nightMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                      {item.distanceFromSun}
                    </span>
                  ) : (
                    <span className={`px-2 py-1 rounded ${nightMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                      {item.distance}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Random facts for "Did You Know" section
  const getRandomDidYouKnow = (name) => {
    const facts = {
      "Mercury": "Mercury's thin exosphere contains atoms blasted off its surface by solar wind and micrometeoroid impacts.",
      "Venus": "Venus rotates so slowly that its day is longer than its year - 243 Earth days to rotate once, but only 225 Earth days to orbit the Sun.",
      "Earth": "Earth is the only planet not named after a mythological god - its name comes from Old English and Germanic words meaning 'ground'.",
      "Mars": "Mars has the largest dust storms in the solar system, capable of covering the entire planet and lasting for months.",
      "Jupiter": "Jupiter's Great Red Spot is a storm that has been raging for at least 400 years, large enough to swallow Earth.",
      "Saturn": "Saturn's rings are mostly made of water ice particles ranging in size from micrometers to meters.",
      "Uranus": "Uranus was the first planet discovered with a telescope, found by William Herschel in 1781.",
      "Neptune": "Neptune has the strongest winds in the solar system, reaching speeds of 2,100 km/h (1,300 mph).",
      "Sun": "The Sun's core is so dense that photons take between 10,000-170,000 years to travel from the core to the surface.",
      "Sirius": "Sirius appears so bright partly because it's relatively close to Earth at just 8.6 light-years away.",
      "Milky Way": "The Milky Way and Andromeda galaxies are moving toward each other and will collide in about 4.5 billion years.",
      "Orion Nebula": "The Orion Nebula is a stellar nursery where over 700 stars in different stages of formation have been observed."
    };
    
    return facts[name] || "This celestial object has many fascinating features that astronomers continue to study.";
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 ${nightMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="flex flex-col items-center justify-center">
  <h1 className="text-4xl md:text-5xl font-light tracking-wide text-white-900 mb-3 text-center w-full">
    Astronomy <span className="font-medium text-white-600">Study Modules</span>
  </h1>
  
  {/* Subheading with constrained width */}
  <p className="text-lg text-white-700 font-normal max-w-2xl mx-auto text-center w-full px-4">
    Explore the wonders of our universe through interactive learning modules
  </p>
</div>
          {/* <button
            onClick={() => setNightMode(!nightMode)}
            className={`mt-4 md:mt-0 px-4 py-2 rounded-md ${nightMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
          >
            {nightMode ? '☀️ Day Mode' : '🌙 Night Mode'}
          </button> */}
        </div>
        
        <div className="flex flex-wrap gap-3 mb-8">
          {["solarSystem", "stars", "galaxies", "nebulae", "exoplanets"].map((module) => (
            <button
              key={module}
              onClick={() => {
                setActiveModule(module);
                setSelectedItem(null);
              }}
              className={`px-5 py-2.5 rounded-full transition ${activeModule === module 
                ? (nightMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white') 
                : (nightMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')}`}
            >
              {module === "solarSystem" && "Solar System"}
              {module === "stars" && "Stars"}
              {module === "galaxies" && "Galaxies"}
              {module === "nebulae" && "Nebulae"}
              {module === "exoplanets" && "Exoplanets"}
            </button>
          ))}
        </div>
        
        <div className="mb-12">
          {renderModuleContent()}
        </div>
        
        <div className={`p-6 rounded-lg shadow-lg mb-8 ${nightMode ? 'bg-gray-900' : 'bg-blue-50'}`}>
          <h2 className={`text-2xl font-bold mb-4 ${nightMode ? 'text-white' : 'text-gray-900'}`}>Astronomy Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-4 rounded-lg ${nightMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center mb-3">
                <div className={`p-2 rounded-full mr-3 ${nightMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className={`text-xl font-semibold ${nightMode ? 'text-white' : 'text-gray-900'}`}>Orbit Simulator</h3>
              </div>
              <p className={`mb-4 ${nightMode ? 'text-gray-300' : 'text-gray-700'}`}>Visualize planetary orbits and gravitational interactions with this interactive tool.</p>
              <button className={`px-4 py-2 rounded-md transition ${nightMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}>
                Launch Simulator
              </button>
            </div>
            <div className={`p-4 rounded-lg ${nightMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center mb-3">
                <div className={`p-2 rounded-full mr-3 ${nightMode ? 'bg-purple-900' : 'bg-purple-100'}`}>
                  <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <h3 className={`text-xl font-semibold ${nightMode ? 'text-white' : 'text-gray-900'}`}>Telescope Calculator</h3>
              </div>
              <p className={`mb-4 ${nightMode ? 'text-gray-300' : 'text-gray-700'}`}>Calculate magnification, field of view, and other parameters for your telescope setup.</p>
              <button className={`px-4 py-2 rounded-md transition ${nightMode ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-purple-500 hover:bg-purple-600 text-white'}`}>
                Open Calculator
              </button>
            </div>
            <div className={`p-4 rounded-lg ${nightMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center mb-3">
                <div className={`p-2 rounded-full mr-3 ${nightMode ? 'bg-indigo-900' : 'bg-indigo-100'}`}>
                  <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                  </svg>
                </div>
                <h3 className={`text-xl font-semibold ${nightMode ? 'text-white' : 'text-gray-900'}`}>Star Map</h3>
              </div>
              <p className={`mb-4 ${nightMode ? 'text-gray-300' : 'text-gray-700'}`}>Interactive map of the night sky customized for your location and time.</p>
              <button className={`px-4 py-2 rounded-md transition ${nightMode ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-500 hover:bg-indigo-600 text-white'}`}>
                View Star Map
              </button>
            </div>
          </div>
        </div>
        
        <div className={`p-6 rounded-lg ${nightMode ? 'bg-gray-900' : 'bg-blue-50'}`}>
          <h2 className={`text-2xl font-bold mb-4 ${nightMode ? 'text-white' : 'text-gray-900'}`}>Astronomy Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className={`text-lg font-semibold mb-2 ${nightMode ? 'text-white' : 'text-gray-900'}`}>Recommended Books</h3>
              <ul className={`space-y-2 ${nightMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <li>• <span className="font-medium">Cosmos</span> by Carl Sagan</li>
                <li>• <span className="font-medium">A Brief History of Time</span> by Stephen Hawking</li>
                <li>• <span className="font-medium">Astrophysics for People in a Hurry</span> by Neil deGrasse Tyson</li>
                <li>• <span className="font-medium">The Elegant Universe</span> by Brian Greene</li>
              </ul>
            </div>
            <div>
              <h3 className={`text-lg font-semibold mb-2 ${nightMode ? 'text-white' : 'text-gray-900'}`}>Useful Websites</h3>
              <ul className={`space-y-2 ${nightMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <li>• <a href="https://apod.nasa.gov" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">NASA Astronomy Picture of the Day</a></li>
                <li>• <a href="https://stellarium.org" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Stellarium Web Planetarium</a></li>
                <li>• <a href="https://exoplanets.nasa.gov" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">NASA Exoplanet Exploration</a></li>
                <li>• <a href="https://skyandtelescope.org" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Sky & Telescope</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}