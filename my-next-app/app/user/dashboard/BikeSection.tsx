// components/BikeSection.tsx
export default function BikeSection() {
  // You can later replace this with data from API / props
  const bikes = [
    {
      name: "Street Cruiser 500",
      type: "CRUISER",
      location: "Downtown Hub",
      price: 45,
      rating: 4.8,
    //   image: "/images/bikes/street-cruiser.jpg", // replace with real paths or URLs
      available: true,
    },
    {
      name: "Urban Scooter 150",
      type: "SCOOTER",
      location: "City Center",
      price: 25,
     rating: 4.8,
    //   image: "/images/bikes/urban-scooter.jpg",
      available: true,
    },
    {
      name: "Sport RR 600",
      type: "SPORT BIKE",
      location: "North Station",
      price: 85,
      rating: 4.9,
    //   image: "/images/bikes/sport-rr.jpg",
      available: true,
    },
    {
      name: "Trail Master 250",
      type: "DIRT BIKE",
      location: "West End",
      price: 55,
      rating: 4.7,
    //   image: "/images/bikes/trail-master.jpg",
      available: false,
    },
    {
      name: "Classic Retro 350",
      type: "CLASSIC",
      location: "Old Town",
      price: 60,
      rating: 4.8,
    //   image: "/images/bikes/classic-retro.jpg",
      available: true,
    },
    {
      name: "City Zoomer 125",
      type: "SCOOTER",
      location: "South Park",
      price: 30,
      rating: 4.5,
    //   image: "/images/bikes/city-zoomer.jpg",
      available: true,
    },
  ];

  return (
    <section id="bikes" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Choose Your Perfect Ride
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            From nimble scooters for the city to powerful cruisers for the highway
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bikes.map((bike) => (
            <div
              key={bike.name}
              className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
            >
              {/* Image container */}
              <div className="relative h-64 overflow-hidden">
                {/* <img
                  src={bike.image}
                  alt={bike.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.src = "/images/placeholder-bike.jpg"; // fallback image
                  }}
                /> */}

                {/* Availability badge */}
                <div className="absolute top-4 right-4">
                  <span
                    className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${
                      bike.available
                        ? "bg-green-600 text-white"
                        : "bg-gray-600 text-gray-200"
                    }`}
                  >
                    {bike.available ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {bike.name}
                </h3>

                <div className="flex items-center gap-1 mb-3">
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {bike.rating}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                    • {bike.type}
                  </span>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {bike.location}
                </p>

                <div className="mt-auto">
                  <div className="flex items-baseline mb-4">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${bike.price}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 ml-1">/day</span>
                  </div>

                  <button
                    disabled={!bike.available}
                    className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                      bike.available
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-gray-400 cursor-not-allowed text-gray-700"
                    }`}
                  >
                    {bike.available ? "Rent Now" : "Unavailable"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}