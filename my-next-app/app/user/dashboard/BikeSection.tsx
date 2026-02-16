// components/BikeSection.tsx
import { useEffect, useState } from "react";
import { fetchAllBikes, Bike } from "../../../lib/actions/bike.action";

export default function BikeSection() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllBikes()
      .then((data) => setBikes(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center py-20">Loading bikes...</p>;

  return (
    <section id="bikes" className="bg-gray-50 py-16 px-6">
      
      {/* TITLE */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Choose Your Perfect Ride
        </h2>
        <p className="text-gray-500 mt-3">
          From nimble scooters for the city to powerful cruisers for the highway
        </p>
      </div>

      {/* BIKE GRID */}
      <div className="max-w-6xl flex flex-wrap  gap-10 pl-20">
        {bikes.map((bike) => (
          <div
            key={bike._id}
            className="w-[320px] rounded-xl overflow-hidden bg-white shadow-md hover:shadow-lg transition relative flex flex-col"
          >
            {/* Image */}
            <div className="relative">
              {bike.imageUrl && (
                <img
                  src={`http://localhost:5000${bike.imageUrl}`}
                  alt={bike.name}
                  className="w-full h-[220px] object-cover"
                />
              )}

              {bike.isAvilable && (
                <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                  Available
                </span>
              )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-grow">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-lg font-semibold">{bike.name}</h3>
                <span className="text-yellow-500 text-sm font-medium">
                  ★ {bike.milage || "4.8"  }
                </span>
              </div>

              <p className="text-xs uppercase text-gray-500 mb-2">
                {bike.engineCC}
              </p>

              <p className="text-sm text-gray-500 mb-4">
                📍 {bike.brand}
              </p>

              <div className="mt-auto flex items-center justify-between">
                <div className="text-xl font-bold text-red-600">
                  ${bike.price || "45"}
                  <span className="text-sm font-normal text-gray-500"> / day</span>
                </div>

                <button className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg">
                  Rent Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
